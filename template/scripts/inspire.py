"""灵感检索：在三个作品 / 工具合集里按关键词找案例、提示词和可用 Skill（数据在 <工具目录>/references/风格库/合集/，不联网）。

python3 scripts/inspire.py 知识讲解 KV                 三个库一起搜，关键词全部命中才列出
python3 scripts/inspire.py --lib motion --cat 知识讲解 Transformer
python3 scripts/inspire.py --lib skills --kind explainer 中文
python3 scripts/inspire.py --show motion:2103683057689522564   打印一条的全文（含提示词原文）

库：videos = awesome-opus5-5-videos（703 条 Opus 5.5 作品 + 提示词）
    motion = awesome-ai-motion（1417 个作品，分类：知识讲解 / 产品宣传 / 交互演示 / 短动效 / 叙事短片 / 角色动画 / 音乐与歌词）
    skills = awesome-claude-video-skills（347 个视频类 Skill 仓库）
"""
import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def vendor_dir():
    """先找 <工具目录>/references/风格库/合集（进了 git，任何电脑拉下来就有），再找 <工具目录>/vendor（完整原仓库，不进 git）。
    克隆用法：工程在 <工具目录>/outputs/<项目>/工程/scripts，template 在 <工具目录>/template/scripts，往上找。
    Skill 用法：工程在别的工作区，用环境变量 VIDEO_AS_CODE_HOME 指向 <工具目录>。"""
    roots, d = [], HERE
    if os.environ.get("VIDEO_AS_CODE_HOME"):
        roots.append(os.environ["VIDEO_AS_CODE_HOME"])
    for _ in range(6):
        d = os.path.dirname(d)
        roots.append(d)
    for r in roots:
        for sub in (os.path.join("references", "风格库", "合集"), "vendor"):
            if os.path.isdir(os.path.join(r, sub, "awesome-ai-motion")):
                return os.path.join(r, sub)
    sys.exit("找不到合集数据：<工具目录>/references/风格库/合集/ 不在，或 Skill 用法下没设环境变量 VIDEO_AS_CODE_HOME=<工具目录>")


V = vendor_dir()


def load():
    out = []
    p = os.path.join(V, "awesome-opus5-5-videos", "data", "videos.json")
    if os.path.exists(p):
        for x in json.load(open(p, encoding="utf-8")):
            out.append(dict(lib="videos", id=x["slug"], cat=x.get("category", ""), title=f"@{x.get('author','')}",
                            text=x.get("prompt", "") or "", tags=" ".join(x.get("tech_tags", [])), url=x.get("post_url", ""),
                            file=os.path.join(V, "awesome-opus5-5-videos", "prompts", x["slug"] + ".md")))
    p = os.path.join(V, "awesome-ai-motion", "data", "cases.json")
    if os.path.exists(p):
        for x in json.load(open(p, encoding="utf-8"))["cases"]:
            pr = x.get("prompt") or {}
            out.append(dict(lib="motion", id=x["id"], cat=x.get("category", ""), title=x.get("title", ""),
                            text=" ".join([x.get("summary", ""), x.get("titleEn", ""), x.get("summaryEn", ""), pr.get("text", "") or ""]),
                            tags=f"{(x.get('media') or {}).get('durationSeconds', '')}s 收藏{(x.get('metrics') or {}).get('bookmarks', '')}",
                            url=(x.get("source") or {}).get("url", ""), file=os.path.join(V, "awesome-ai-motion", "cases", x["id"] + ".md"),
                            prompt_file=os.path.join(V, "awesome-ai-motion", "prompts", x["id"] + ".txt")))
    p = os.path.join(V, "awesome-claude-video-skills", "data", "skills.json")
    if os.path.exists(p):
        for x in json.load(open(p, encoding="utf-8"))["skills"]:
            out.append(dict(lib="skills", id=x["repo_full_name"], cat=x.get("kind", ""), title=x["repo_full_name"],
                            text=x.get("description", "") or "", tags=f"★{x.get('stars','')} {x.get('license','')} {x.get('security_grade','')}",
                            url="https://github.com/" + x["repo_full_name"], file=None))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("terms", nargs="*")
    ap.add_argument("--lib", choices=["videos", "motion", "skills"])
    ap.add_argument("--cat", help="motion 的分类 / videos 的 category")
    ap.add_argument("--kind", help="skills 的类型：promo explainer shorts editing general …")
    ap.add_argument("--show", help="lib:id，打印全文")
    ap.add_argument("-n", type=int, default=30)
    a = ap.parse_args()
    rows = load()
    if a.show:
        lib, _, id_ = a.show.partition(":")
        r = next((r for r in rows if r["lib"] == lib and r["id"] == id_), None)
        if not r:
            sys.exit("没有这一条")
        print(f"{r['title']}  {r['url']}\n")
        for f in [r.get("file"), r.get("prompt_file")]:
            if f and os.path.exists(f):
                print(open(f, encoding="utf-8").read())
        if not r.get("file"):
            print(r["text"])
        return
    terms = [t.lower() for t in a.terms]
    hit = []
    for r in rows:
        if a.lib and r["lib"] != a.lib:
            continue
        if a.cat and a.cat.lower() not in r["cat"].lower():
            continue
        if a.kind and (r["lib"] != "skills" or a.kind.lower() != r["cat"].lower()):
            continue
        hay = " ".join([r["cat"], r["title"], r["text"], r["tags"]]).lower()
        if all(t in hay for t in terms):
            hit.append(r)
    print(f"命中 {len(hit)} 条" + (f"，列前 {a.n}" if len(hit) > a.n else ""))
    for r in hit[: a.n]:
        desc = r["text"].replace("\n", " ")[:70]
        print(f"[{r['lib']}:{r['id']}] {r['cat']} · {r['title']} · {r['tags']}\n    {desc}")
    if hit:
        print("\n看全文：python3 scripts/inspire.py --show <lib:id>")


if __name__ == "__main__":
    main()
