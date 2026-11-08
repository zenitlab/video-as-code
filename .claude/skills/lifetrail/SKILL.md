---
name: lifetrail
description: 给一位主要活动在中国的历史人物做“人生轨迹/生平行迹视频”：从生到死半年一步，在 3D 卫星地形上走一遍一生，标注古今地名，里程碑推镜高亮，分人生阶段配乐，配音旁白与字幕，输出 1080p mp4。触发：“给某某做人生轨迹视频”“生平行迹视频”“半年一步”“在3D地形上走一遍一生”“生平地图动画”。生年在公元前的人物（如孔子）暂不支持，载入后会说明原因。不适用：主要活动在中国以外的人物（如拿破仑、空海）；只要文字年表或生平简介；只要一张静态地图；不需要视频成片的需求。
---

# 人生轨迹视频（lifetrail）

本 skill 自带完整项目模板（`template/`：three.js 引擎、工具、测试、配乐生成器）和两个脚本（`scripts/`）。代码以 skill 为准，不要改模板本身；改动只发生在生成出来的工作目录里。

成片规格：1920×1080@30，H.264 + AAC，响度 −16 LUFS（±1.5），时长按 `person.json` 的 `targets.duration_min`。

## 适用范围

仅限**主要活动在中国**的历史人物。原因：地图、地名注记、时代政权注记和高清地形层都只为中国及周边准备；地图框 `MAP_BOX` 为 72–146°E、16–54°N（`src/journey.js`），框外地点只能画成地图边缘的“图外”代理点。

判定口径：按半年步计，每步取**半年结束时所在地**（`places` 的最后一个）。

- 超过 20% 的半年步停在地图框外 → 不适用。说明原因后停下，不要开工。
- 10%–20% → 提醒用户：这些段落会挤在地图边缘，由用户决定是否继续。
- 低于 10% → 正常进行。已有六人中毛泽东 1/167 步在框外（1949H2 莫斯科），其余为 0；蒋介石到过莫斯科、开罗，但没有一个半年结束在框外。

**暂不支持生年在公元前的人物（如孔子、秦始皇）**，阶段 0 直接说明原因并停下。原因：引擎没有“公元 0 年”，跨公元前 1 年/公元 1 年时虚岁和年号序数会差一年、半年步会多出一个空的“0 年”；HUD、卡片和进度条直接显示“-221”而不是“公元前 221 年”；周岁口径无法表示公元前的生日。要支持，需要：改用天文纪年（公元前 1 年 = 0）并统一换算年龄与年号序数；所有显示处把负年份转成“公元前 N 年”；`age.birth` 允许公元前日期。

阶段 0 时还没有数据，先按公认生平粗估；阶段 2 拿到数据后用下面的命令精算，结果超过阈值仍要停下来：

```
python3 -c "import json,sys;w=sys.argv[1];S=json.load(open(f'data/{w}/steps.json'))['steps'];P=json.load(open(f'data/{w}/places.json'));o=[s['id'] for s in S if not(72<=P[s['places'][-1]]['lon']<=146 and 16<=P[s['places'][-1]]['lat']<=54)];print(len(o),'/',len(S),round(len(o)/len(S),3),o[:20])" <who>
```

框内与否以**底图实际覆盖**为准，而不是“是否在中国境内”：东京（139.8°E）在框内，按真实坐标画；莫斯科、开罗在框外，投到边缘（见 pitfalls“东京落海”）。

## 开工问清单

阶段 0 **一次性问齐**（用一组问题，不要分几轮追问），每题附默认值；用户说“都按默认”就照默认执行。原因：后面的阶段都是自主跑完的，中途再问会让流水线停在半路。

1. **适用范围确认**：生年在公元前 → 不适用，说明后停止；否则给出粗估的框外半年占比，10%–20% 时请用户决定是否继续。
2. **措辞立场**（政治敏感或有争议的人物必问）：默认采用中国大陆通行的史学表述；涉及政权正统性的纪年（例如 1949H2 起是否还显示民国纪年）也在此定。原因：蒋介石一片的立场与纪年都是起飞时由人定的，代理不应自行判断。
3. **年龄口径**：默认古人用虚岁（需知农历出生年），近人用周岁（需要准确生日 `YYYY-MM-DD`，按半年中点 4/1、10/1 计算）。原因：年份差≠年龄，生日在年末的人会差一岁甚至显示 −1 岁。
4. **纪年显示规则**：默认“朝代 · 年号X年”，同一半年内改元取占多数月份的年号；特殊写法（天宝称“载”、龙凤与至正并列、某年起不显示）列出来请确认。
5. **声线**：edge-tts 中文男声只有三个，已用过的组合：
   - `zh-CN-YunyangNeural`：毛泽东 −6%/−2Hz（庄重）、蒋介石 −6%/−3Hz、诸葛亮 −16%/−6Hz（放慢的云扬，用户单独选定）
   - `zh-CN-YunxiNeural`：苏轼 −6%/−1Hz、李白 −4%/+0Hz（明快）
   - `zh-CN-YunjianNeural`：朱元璋 −8%/−5Hz（低沉）

   提供试听：`python3 -m edge_tts --voice zh-CN-YunyangNeural --rate=-6% --pitch=-2Hz --text "半年一步，我们重走他的路。" --write-media /tmp/voice_a.mp3`，每个候选各出一段让用户选。本机还没装 edge-tts 时，阶段 0 按上面的文字描述选定声线；阶段 1 后生成样音存档（`docs/evidence/voice-<who>.mp3`），不为此打断用户，选定的声线照用；用户要换，在阶段 8 验收时提出，换后重跑 `tools/tts.py` 及之后的阶段。
6. **目标时长**：默认按人生长度和里程碑数给区间，已有成片 7–17 分钟（苏轼 7–10、毛泽东 9–13、诸葛亮 13–17）。写入 `targets.duration_min`。
7. **引文繁简**：默认简体。原因：第一批卡片保留繁体原文，混排显得别扭（D12）；简体化只改字形，不改字词。
8. **是否授权删除逐帧中间产物**：每部约 10–16 GB 的 `out/<who>/frames/`，成片通过检查后才删。默认不删，只报告占用。
9. **地图审图提醒**：若要在中国大陆公开发布，含地图的视频可能需要送审取得审图号；片中不画国界、省界，片尾注明“地图仅示意地形与行迹”。另外卫星影像（EOX Sentinel-2 cloudless）为 CC BY-NC-SA 4.0，商用需另购授权。只提醒，不替用户判断。
10. **是否授权安装缺失依赖**：默认授权。阶段 1 环境检查列出的缺失项（ffmpeg、npm 包、numpy/scipy/Pillow、edge-tts、Chromium 等）直接安装，不再单独询问。研究、核查代理仍然不得装包。

此时还没有项目目录：回答先留在对话里；阶段 1 建好目录后，立即写入 `docs/runs/<日期>-<who>.md` 的“开工决定”一节；阶段 2 由研究代理按任务书的 `{开工决定}` 填进 `person.json`（声线、年龄口径、纪年、时长）。

## 流程

| 阶段 | 做什么 | 通过标准 | 失败时怎么办 |
|---|---|---|---|
| 0 开工问清单 | 一次问齐上节十项 | 用户已回答或接受默认 | 框外 >20% 或生年在公元前：说明后停止 |
| 1 建目录 | `new_project.sh`：复制模板、npm install、环境检查、地形缓存、git init；建运行记录写入开工决定 | 末行“项目已生成”，`check_env.py` 显示“环境就绪”（页面能否加载要到阶段 4 有时间轴后用 smoke 验证） | 第 10 项已授权：按缺失清单补装；未授权：列出缺失项后停下，等用户自行安装；中断后重跑同一命令会续做 |
| 2 史料研究 | 研究子代理按 `references/research-brief.md` 产出 `person/steps/places.json` | 数据测试选中 ≥7 项（test_data 5 + test_person 2，其中基线比对 1 项跳过；有锚点测试时更多），全过；框外占比复算 ≤10%；需要的高清层已补 | 测试不过退回代理；选中 0 项（pytest 退出码 5）说明缺 `person.json`；框外 >20% 停止，10%–20% 请人定夺 |
| 3 独立核查 | 另派代理按 `references/factcheck-brief.md` 逐个里程碑核对 | 0 个“错误”；存疑进 `contested`；修正已同步到数据（旁白在阶段 4 按 contested 写） | 立场措辞问题或重大事实争议：暂停请人定夺 |
| 4 旁白与时间轴 | 写 `script.json` → TTS → `build_timeline` | `pytest -k "<who> and not music"` 全过（详略比、不重叠、配音哈希、时长区间）；`node tools/smoke.mjs <who>` 0 报错、整帧非空白；配乐那一项要到阶段 5 才能过 | 占比超 40% 就删概述旁白；时长超区间就增删旁白，不改常量 |
| 5 配乐 | 写 `music/<who>_stages.json` → 合成 → 指标报告 | `silent boundaries: none`、`nan False`、`peak` < 1.0；每段 dBFS 与各段中位数相差 ≤6 dB（已有六部最大偏差 3.9 dB）；`pytest -k <who>` 全过 | 调 mood/root；情绪种类不足 4 种时补 |
| 6 定点审片 | 片名、每章节卡、每里程碑、片尾回放、尾卡各一张静帧，按缺陷清单逐张审 | 清单逐项通过 | 先修再进下一阶段；修后对相同时间点重出静帧 |
| 7 全片渲染 | 后台 `render_all.sh`，完成后 `check_outputs --require` | 开始前 `df -h .` 剩余 ≥20 GB；1920×1080@30、h264+aac、时长与时间轴一致且在区间内、−16±1.5 LUFS、抽样无黑帧 | 空间不够先清理或换盘；看 `out/<who>/render_*.log`；改了东西就整部重渲 |
| 8 交付 | 拼板、运行记录、经验笔记，交给人验收 | — | — |

**只在以下情况打断用户**（完整清单，其余问题自己修，修完记入运行记录）：
1. 阶段 0：开工问清单。第 10 项不授权时：阶段 1 列出缺失项后停下，等用户自行安装。
2. 阶段 2：复算的框外占比 >10%（>20% 直接停止并说明；10%–20% 请人定夺是否继续）。
3. 阶段 3：立场措辞问题；或某个里程碑存在重大事实争议（两说都有分量、选哪一说会改变叙事）。
4. 阶段 8：交付验收。

以下命令都在项目根目录运行（阶段 1 除外），`<who>` 是拼音小写键（`[a-z0-9_]+`）。主会话不要 `cd` 进新目录再派代理：子代理一律从当前已受信任的 cwd 派发（`subagent_type: general-purpose`），任务书和命令都写绝对路径。

### 阶段 1 建目录

```
zsh ~/.claude/skills/lifetrail/scripts/new_project.sh ./<who>-trajectory
```

默认目录 `./<who>-trajectory/`，位于当前已受信任的 cwd 之下（子代理要在这里干活，见 pitfalls）。建好后立即写 `docs/runs/<日期>-<who>.md`，先填“开工决定”。首次运行会准备共享地形缓存 `~/.cache/lifetrail/terrain/`（有种子就复制，否则下载生成约 30–60 分钟），项目里的 `assets/terrain` 是指向它的符号链接。单独补跑地形：`zsh ~/.claude/skills/lifetrail/scripts/setup_terrain.sh <dir>`。环境复查：`python3 tools/check_env.py`。此时还没有人物数据和时间轴，页面能否加载留到阶段 4 用 `node tools/smoke.mjs <who>` 验证。

### 阶段 2 史料研究

1. 把 `references/research-brief.md` 填好变量，存为 `data/briefs/<who>.md`（任务书落盘，代理中断重启时可以重读）。
2. 从当前已受信任的 cwd 派一个 `general-purpose` 子代理，任务书里写绝对路径。
3. 代理交付前自测（此时还没有旁白，只跑数据与配置测试，应选中 ≥7 项：test_data 5 + test_person 2，其中基线比对 1 项跳过；有锚点测试时更多。选中 0 项、退出码 5 说明 `person.json` 不存在。`tests -k "<who> and not music"` 要到阶段 4、全量 `tests -k <who>` 要到阶段 5 才能过）：

```
python3 -m pytest -q tests/test_data.py tests/test_person.py -k <who>
```

4. 有纪年特例（`era_overrides` 覆盖规则、`birth_override` 出生覆盖、年号并列等）时，主线程写 `tests/test_<who>_anchors.py`：用 conftest 的 `ages(who)` 为 2–3 个关键半年步写断言（如 `assert ages('sushi')['1079H2'] == ['虚岁 44', '北宋 · 元丰二年']`），之后的自测命令加上这个文件。原因：新项目没有基线快照，纪年改错不会有测试变红。
5. 主线程复跑一遍上面的测试和“适用范围”里的框外占比命令（>10% 按上面的打断清单处理），再跑下一节的高清层检查，然后提交。

### 阶段 2 之后：补高清地形层

共享高清层（z10 卫星图，范围以 `scripts/setup_terrain.sh` 的 `LAYER_TABLE` 为准）：

| 层 | 范围 | 默认加载 |
|---|---|---|
| `zhuge_hi` | 102–118°E, 26–36°N | 是 |
| `hi_north` | 108–122.5°E, 34–41.5°N | 是 |
| `hi_east` | 118–123°E, 26–34°N | 是 |
| `hi_south` | 105–122.5°E, 18–26°N | 是 |
| `hi_japan` | 135.5–141.5°E, 34–38.5°N | 否，`extra_levels: [["hi_japan", 0]]` |

判定：地图框内、四块默认层之外的地点，凡是**里程碑地点**或**有 ≥4 个半年步停留**（作为半年终点），就要补层。下面的命令按 `LAYER_TABLE` 列出这些地点：

```
python3 -c "import json,re,os,sys,collections as C;w=sys.argv[1];T=open(os.path.expanduser('~/.claude/skills/lifetrail/scripts/setup_terrain.sh')).read();H=[list(map(float,r.split()[1:5])) for r in re.search(r\"LAYER_TABLE='(.*?)'\",T,re.S)[1].splitlines() if r.split()[0] in('zhuge_hi','hi_north','hi_east','hi_south')];S=json.load(open(f'data/{w}/steps.json'))['steps'];P=json.load(open(f'data/{w}/places.json'));n=C.Counter(s['places'][-1] for s in S);ms={s['milestone'].get('place',s['places'][-1]) for s in S if s.get('milestone')};inbox=lambda p:72<=p['lon']<=146 and 16<=p['lat']<=54;cov=lambda p:any(a<=p['lon']<=b and c<=p['lat']<=d for a,b,c,d in H);o=sorted(k for k in set(n)|ms if inbox(P[k]) and not cov(P[k]) and (k in ms or n[k]>=4));[print(k,P[k]['name'],P[k]['lon'],P[k]['lat'],'里程碑' if k in ms else '',n[k]) for k in o];print(len(o),'places outside shared hi-res layers')" <who>
```

（已有六人的结果：诸葛亮泸水、李白碎叶、蒋介石东京各 1 处，蒋介石为此加载了 `hi_japan`。）落在 `hi_japan` 内的只需加 `extra_levels`；其余按 `references/schema.md` 的“需要新的高清地形层时”，用这些地点的外包范围（四周各留约 1°）生成一层，写进 `person.json` 的 `extra_levels`。原因：层外只剩 z9/z7 底图，里程碑近景会明显发糊。

### 阶段 3 独立核查

另派一个**没参与研究**的代理，用填好的 `references/factcheck-brief.md`，产出 `docs/evidence/factcheck-<who>.md`。核查代理不改数据；主线程按“需要修改”清单逐条修，每条都同步数据（event/subtitle/contested）、旁白、卡片三处（此时还没有旁白，就在阶段 4 按修正后的数据和 contested 写），修完复跑数据测试。修正后只复核**改动过的里程碑**（可派同一核查代理或新代理只看这几条），不必整份重核。

### 阶段 4 旁白与时间轴

按 `references/narration.md` 写 `narration/<who>/script.json`，然后：

```
python3 tools/tts.py <who>            # 按“文本+声线”哈希增量合成；--force 全部重合成
python3 tools/build_timeline.py <who> # → src/<who>/timeline.json，打印总时长
python3 -m pytest -q tests -k "<who> and not music" -m "not env"
```

`test_music_covers_film_by_stage` 需要阶段 5 的 `music/<who>_stages.json`，所以这里排除；阶段 5 之后跑全量 `-k <who>`。

### 阶段 5 配乐

写 `music/<who>_stages.json`：键是 `steps.json` 的每个 stage id，外加 `title`、`outro`；值为 `{"mood", "root", "mode", "why"}`。`score.py` 读 `mood`（必须在 `BPM` 表内：pastoral、contemplative、aspire、tension、march、epic、elegy、triumph、grand、wander、joyful、battle、serene、title、outro）、`root`（主音 MIDI 号；已有六部人生阶段用 52–62，片头片尾 50–57；`title` 的 root 也决定章节锣钟和里程碑钟声的音高）、`mode`（gong/shang/jue/zhi/yu）；`why` 给人看。`title`、`outro` 的 mood 就写 `title`、`outro`；人生阶段至少 4 种不同情绪，依据各阶段的 `mood_hint`。例（苏轼）：

```json
{"title": {"mood": "title", "root": 55, "mode": "gong", "why": "片头：锣与编钟"},
 "st1": {"mood": "pastoral", "root": 62, "mode": "gong", "why": "眉山少年：古筝与竹笛，田园的温暖明亮"},
 "st4": {"mood": "contemplative", "root": 57, "mode": "yu", "why": "乌台与黄州：古琴与箫，低谷中的内省"},
 "outro": {"mood": "outro", "root": 55, "mode": "gong", "why": "片尾：二胡收束"}}
```

```
python3 music/score.py <who>          # → out/<who>/music.wav，约 1 分钟
python3 tools/audio_report.py <who>   # 分阶段 dBFS/频谱质心/起音密度，边界静音检查，out/<who>/spectrogram.png
```

报告存档：`python3 tools/audio_report.py <who> | tee docs/evidence/audio-<who>.md`。逐项核对：末尾 `silent boundaries: none`、`nan False`、`peak` < 1.0；表中每段 `dBFS` 与各段中位数相差 ≤6 dB。然后跑 `python3 -m pytest -q tests -k <who> -m "not env"` 全量。听感无法自检，列入“未验证”。

### 阶段 6 定点审片

从 `src/<who>/timeline.json` 取时间点：片名 `title.t0+2`；每章节卡取 `chapters[]` 的中点；每个里程碑取 `steps[].ms.t0+1.5`（卡片已完全滑入）；远途里程碑（`ms.travel` 为真）再加 `ms.t1-0.5`（走完定格，看整段路线是否框进画面）；带 `after` 的步再加 `after.t0+after.move`（讲完后续行程的落点）；片尾回放取 `outro` 中点；尾卡 `end.t0+2`。

```
ts=$(python3 -c "import json,sys;tl=json.load(open(sys.argv[1]));t=[tl['title']['t0']+2]+[(c['t0']+c['t1'])/2 for c in tl['chapters']]+[x for s in tl['steps'] if 'ms' in s for x in [s['ms']['t0']+1.5]+([s['ms']['t1']-0.5] if s['ms']['travel'] else [])+([s['after']['t0']+s['after']['move']] if 'after' in s else [])]+[(tl['outro']['t0']+tl['outro']['t1'])/2,tl['end']['t0']+2];print(' '.join(f'{x:.2f}' for x in sorted(t)))" src/<who>/timeline.json)
node render.mjs <who> still ${=ts}    # zsh 必须写 ${=ts}，否则整串成一个参数 → NaN
```

静帧在 `out/<who>/still_<t>.jpg`。逐张用 Read 看原图（注记压叠要看原尺寸）；再按时间数值排序（不能按字典序，`still_104` 会排在 `still_17` 前面）拼一张总览：

```
python3 -c "import glob,os,sys;d=f'out/{sys.argv[1]}';f=sorted(glob.glob(d+'/still_*.jpg'),key=lambda p:float(os.path.basename(p)[6:-4]));open(d+'/stills.txt','w').write(''.join(f\"file '{os.path.abspath(p)}'\n\" for p in f))" <who>
N=$(wc -l < out/<who>/stills.txt | tr -d ' '); ffmpeg -v error -y -f concat -safe 0 -i out/<who>/stills.txt -vf "scale=480:270,tile=4x$(( (N+3)/4 ))" -frames:v 1 docs/evidence/stills/stills_<who>.jpg
```

新一轮审片前把上一轮静帧移到 `out/<who>/stills_r<N>/`，否则拼板会混入旧图。全部通过后跑冒烟：`node tools/smoke.mjs <who>`（0 报错、整帧非空白；阶段 4 已跑过一次，审片修改后再跑）。

### 阶段 7 全片渲染

先 `df -h .`，剩余 ≥20 GB 才开始（逐帧 JPG 每部 10–16 GB）。`render_all.sh` 在**开始时**取提交号（工作区有改动标 `-dirty`），**总装完成后**才写入 `out/<who>/render_commit.txt`；所以**渲染前先提交**，并且该文件不存在就说明这次渲染没跑完。用 Bash 的 `run_in_background` 启动（不要用 `&`），约 5–20 分钟，等完成通知，不要中途杀：

```
zsh tools/render_all.sh <who>         # 重建时间轴 → 配乐 → 4 进程逐帧 → 混音 → 总装 <name>_人生轨迹.mp4
python3 tools/check_outputs.py --require
zsh tools/contact_sheet.sh <who>      # 每 30 s 一帧 → docs/evidence/stills/sheet_<who>.jpg，打印 sha256 与渲染提交
```

拼板逐格看：无黑帧、无空白地形。`check_outputs` 通过且用户在阶段 0 授权后，才删 `out/<who>/frames/`。

## 审片缺陷清单

阶段 6 每张静帧逐项过（设计文档 2.1 原文）：

- 地点标记是否落在正确的陆地或水域上（与卫星底图对照）
- 地名注记是否互相压叠，是否压住 HUD、卡片或字幕
- 里程碑卡片是否遮住当前地点
- 轨迹线是否出现无端点的异常长线，远途镜头是否把整段路线框进画面
- 左上角的年份、纪年、年龄是否与卡片一致
- 章节卡、片头、片尾文字是否完整、无溢出
- 片尾回放的光带是否出现

运行记录里由审片抓到过的，一并检查：

- 出生步的纪年与年龄（苏轼曾显示“景祐四年·虚岁 2”，应为景祐三年·虚岁 1）；周岁人物出生步不能出现 −1 岁
- 改元当年和政权更替处的纪年与地图政权注记是否同步出现（“蜀汉”注记曾晚于卡片）
- 远途卡片显示“起点 → 事件地”，体现的是事件地而不是半年终点（“广州 → 奉化溪口”漏了莫斯科）；起点与事件地 <50 km 时只显示停留地点
- 星标是否压住左上年号块
- 卡片副标题、引文与旁白是否说同一件事（“十五年”与“十六年”、“一住十年”与“至移三霜”）
- 镜头所在的地方与这一刻的旁白是否在说同一件事（粟裕淮海：镜头停碾庄，旁白先讲济南）
- 图外行程（如赴莫斯科）：镜头是否拉远到能看见去向，画面边缘是否出现“图外 · 距北京约 N 公里”标注
- 近景里是否还有看不出两端的旧轨迹长线（旧轨迹在近景应明显变暗）
- 图外地点是否画在正确方向的边缘，并标“图外 · 距北京约 N 公里”；框内的境外地点（东京）是否按真实坐标落在陆地上
- 片头第一章节卡期间镜头有没有先猛推再拉回
- 渐变/光带“看不见”时先量数据（点数、数值范围、颜色空间），不要只调参数

## 交付物

1. **成片**：项目根目录 `<name>_人生轨迹.mp4`（`<name>` 取 `person.json` 的 `name`）。
2. **证据**：`docs/evidence/factcheck-<who>.md`、`audio-<who>.md`、`stills/stills_<who>.jpg`、`stills/sheet_<who>.jpg`，以及 `check_outputs --require` 的输出。
3. **运行记录** `docs/runs/<日期>-<who>.md`，模板：

```
# <人物> 人生轨迹视频
- 渲染提交：<out/<who>/render_commit.txt>；成片 sha256：<contact_sheet 打印的前 12 位>
## 开工决定
（阶段 0 十项的回答；阶段 1 建目录后立即写）
## 做了什么
（各阶段结果：步数、里程碑数、核查 通过/存疑/错误 数及修正、非里程碑旁白占比、时长、LUFS；每条附证据文件）
## 未验证
（至少：配乐与配音听感；未逐帧通看全片；没读到原书的史料；只定位到县城的地点；地图合规；措辞立场）
## 验收时间点（给人看的具体时间戳与应看到什么）
| # | 位置（文件 + mm:ss） | 做什么 | 应看到什么 |
（最有风险的排前面：立场措辞段落、有争议的里程碑、图外地点、纪年特例、章节切换处的配乐）
```

4. **经验笔记**：用 extract-approach skill 记下本次新踩的坑和可复用规则；新的通用坑同时补进本 skill 的 `references/pitfalls.md`（格式不变，注明出处）。

## 参考文件

- `references/schema.md` —— 数据规范（steps/places/person.json、新建高清地形层）；写或审数据前读，阶段 2 随任务书一起交给研究代理。
- `references/research-brief.md` —— 史料研究代理任务书模板；阶段 2 派代理前填变量。
- `references/factcheck-brief.md` —— 独立核查代理任务书模板与分诊、同步、升级规则；阶段 3 用。
- `references/narration.md` —— `script.json` 的段落类型、详略标准、节奏与措辞；阶段 4 写旁白前读，阶段 3 修事实时也要读“三处同步”。
- `references/pitfalls.md` —— 踩坑清单（规则 —— 原因）；开工前通读一遍，遇到异常现象时先在这里查。
