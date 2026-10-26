"""旁白发音检查：写完稿、生成前查一遍；生成后把转写里读错的地方收进词典，下一支片子自动避开。

python3 scripts/pron.py                 生成前：逐句查词典里读错过的词、多音字、英文符号、数字连读
python3 scripts/pron.py --after         生成后：对比 audio-src/vo/report.json 的转写和稿子，列出读错的片段
python3 scripts/pron.py --add 粘成一团 --heard 蔫成一团 --fix 改成「连成一团」
                                        把一次读错记进词典（工程和工具 template 里的 pronunciation.json 都写）
python3 scripts/pron.py --say 描。 描画。  加一条读法替换：字幕照旧显示「描」，声音读「描画」

词典是 scripts/pronunciation.json：
  replace     写法 → 读法。vo 生成时自动套用到没写 say 的句子，字幕不变
  avoid       读错过的词（听成什么、怎么改），命中就提示
  polyphones  多音字最容易读错的那个音（需要 pip install pypinyin）
"""
import argparse
import difflib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LEX = os.path.join(HERE, "pronunciation.json")


def tool_lexicon():
    """克隆用法时，工具 template 里的词典（所有项目共享的那份）。找不到返回 None。"""
    d = ROOT
    for _ in range(6):
        d = os.path.dirname(d)
        p = os.path.join(d, "template", "scripts", "pronunciation.json")
        if os.path.isfile(p) and os.path.abspath(p) != os.path.abspath(LEX):
            return p
    return None


def load():
    """工程词典 + 工具词典合并（工具那份是历史积累，工程那份是本片新加的）。"""
    lex = {"replace": {}, "avoid": [], "polyphones": {}}
    for p in [tool_lexicon(), LEX]:
        if not p or not os.path.isfile(p):
            continue
        d = json.load(open(p, encoding="utf-8"))
        lex["replace"].update({k: v for k, v in d.get("replace", {}).items() if not k.startswith("_")})
        seen = {a["word"] for a in lex["avoid"]}
        lex["avoid"] += [a for a in d.get("avoid", []) if a["word"] not in seen]
        lex["polyphones"].update({k: v for k, v in d.get("polyphones", {}).items() if not k.startswith("_")})
    return lex


def spoken(text, lex=None):
    """读给 TTS 的写法：套用 replace（vo 在句子没写 say 时调用）。"""
    lex = lex or load()
    for k in sorted(lex["replace"], key=len, reverse=True):
        text = text.replace(k, lex["replace"][k])
    return text


def lines():
    tm = json.load(open(os.path.join(ROOT, "src", "timing.json"), encoding="utf-8"))
    v = tm.get("voice") or {}
    return v.get("lines", []), v.get("keywords", [])


def check_line(ln, keywords, lex, py):
    marked = ln.get("say") or spoken(ln["text"], lex)
    pinned = set()  # [[字|拼音]] 标注过读音的字，不再报多音字
    for m in re.finditer(r"\[\[([^|\]]+)\|[^\]]+\]\]", marked):
        start = len(re.sub(r"\[\[([^|\]]+)\|[^\]]+\]\]", r"\1", marked[: m.start()]))
        pinned.update(range(start, start + len(m.group(1))))
    say = re.sub(r"\[\[停\d+ms\]\]", "", re.sub(r"\[\[([^|\]]+)\|[^\]]+\]\]", r"\1", marked))
    out = []
    for a in lex["avoid"]:
        if a["word"] in say:
            out.append((a.get("level", "fail"), f"「{a['word']}」以前被听成「{a['heard']}」（{a.get('src', '')}）→ {a['fix']}"))
    if "_" in say:
        out.append(("fail", "有下划线，TTS 会读成「下划线」或停顿：写成空格或中文"))
    for m in re.finditer(r"[×#%+/=<>&@~^|]", say):
        out.append(("warn", f"符号「{m.group()}」读法不定：写成中文（乘、号、百分之、加、斜杠……）"))
    for m in re.finditer(r"\b[a-z]+[A-Z][A-Za-z]*\b", say):
        out.append(("warn", f"「{m.group()}」驼峰词容易被拆读或连读：拆开写，或在 say 里注明读法"))
    for m in re.finditer(r"\d[\d.]*\s*(?=[一已以])", say):
        out.append(("warn", f"「{say[m.start():m.end() + 1]}」数字后紧跟「一 / 已 / 以」会被连成小数或听成别的数"))
    eng = set(re.findall(r"[A-Za-z][A-Za-z0-9.\-]{2,}", say)) - {"AI"}
    for w in sorted(eng):
        if not any(w.lower() in k.lower() for k in keywords):
            out.append(("warn", f"英文「{w}」没在 voice.keywords 里：品牌名、人名要列进去，少读一个才会判 CHECK_WORD"))
    if py and lex["polyphones"]:
        from pypinyin import Style, pinyin

        reads = pinyin(say, style=Style.TONE, heteronym=False, errors=lambda x: [[c] for c in x])
        for ch, rule in lex["polyphones"].items():
            for m in re.finditer(rule.get("ctx", re.escape(ch)), say):
                i = say.index(ch, m.start())
                if i in pinned:
                    continue
                if i < len(reads) and (not rule["bad"] or reads[i][0] == rule["bad"]):  # bad 为空 = 没标拼音就提醒
                    out.append(("warn", f"多音字「{ch}」在「{m.group()}」里" + (f"可能读成 {rule['bad']}" if rule["bad"] else "没标拼音") + f"：{rule['when']} → {rule['fix']}"))
    return marked, out


def lint(quiet_ok=False):
    lex = load()
    ls, kw = lines()
    try:
        import site

        sys.path.append(site.getusersitepackages())  # python3 -I 时也能找到 pip install --user 装的 pypinyin
        import pypinyin  # noqa: F401

        py = True
    except ImportError:
        py = False
        print("（没装 pypinyin，跳过多音字检查：pip install pypinyin==0.53.0）")
    fails = warns = 0
    for ln in ls:
        say, out = check_line(ln, kw, lex, py)
        if not out:
            continue
        print(f"\n{ln['id']}  {ln['text']}" + (f"\n      读作：{say}" if say != ln["text"] else ""))
        for lvl, msg in out:
            print(f"  {'FAIL' if lvl == 'fail' else 'warn'}  {msg}")
            fails += lvl == "fail"
            warns += lvl != "fail"
    print(f"\n发音检查：{len(ls)} 句，{fails} 处 FAIL，{warns} 处提醒" + ("" if fails else "（FAIL 要改稿或写 say；提醒逐条看，确认没问题可以不改）"))
    return fails


def after():
    """生成后：逐句对比转写和稿子，列出对不上的片段，方便收进词典。"""
    sys.path.insert(0, HERE)
    from elevenlabs import norm

    rep = os.path.join(ROOT, "audio-src", "vo", "report.json")
    if not os.path.exists(rep):
        sys.exit("还没有 audio-src/vo/report.json：先跑 python3 scripts/elevenlabs.py vo")
    lex = load()
    by = {l["id"]: l for l in lines()[0]}
    found = 0
    for r in json.load(open(rep, encoding="utf-8"))["lines"]:
        ln = by.get(r["id"])
        if not ln or ln.get("heardOk"):
            continue
        want = norm(ln.get("expect") or ln.get("say") or spoken(ln["text"], lex))
        got = norm(r.get("heard", ""))
        sm = difflib.SequenceMatcher(None, want, got)
        diffs = [(want[i1:i2], got[j1:j2]) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
        diffs = [(a, b) for a, b in diffs if a and len(a) <= 6]
        if diffs:
            found += 1
            print(f"{r['id']:6s} " + "  ".join(f"「{a}」→「{b or '（没读）'}」" for a, b in diffs))
    if found:
        print("\n逐条亲耳听一下：真读错的用 --add 记进词典（同音字、转写误差不用记）；改稿或写 say 后重跑 vo --only <id>")
    else:
        print("转写和稿子逐字一致")


def save_to(path, fn):
    d = json.load(open(path, encoding="utf-8")) if os.path.isfile(path) else {"replace": {}, "avoid": [], "polyphones": {}}
    fn(d)
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("已写入", os.path.relpath(path, os.getcwd()))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--after", action="store_true")
    ap.add_argument("--add", help="读错的词（稿子里的写法）")
    ap.add_argument("--heard", help="听成了什么")
    ap.add_argument("--fix", default="换说法", help="怎么改")
    ap.add_argument("--src", default=os.path.basename(os.path.dirname(ROOT)), help="哪支片子踩到的")
    ap.add_argument("--say", nargs=2, metavar=("写法", "读法"))
    a = ap.parse_args()
    targets = [LEX] + ([tool_lexicon()] if tool_lexicon() else [])
    if a.add:
        if not a.heard:
            sys.exit("--add 要配 --heard（听成了什么）")
        entry = {"word": a.add, "heard": a.heard, "fix": a.fix, "src": a.src}

        def add(d):
            d.setdefault("avoid", [])
            d["avoid"] = [x for x in d["avoid"] if x["word"] != a.add] + [entry]

        for p in targets:
            save_to(p, add)
    elif a.say:
        for p in targets:
            save_to(p, lambda d: d.setdefault("replace", {}).__setitem__(a.say[0], a.say[1]))
    elif a.after:
        after()
    else:
        sys.exit(1 if lint() else 0)


if __name__ == "__main__":
    main()
