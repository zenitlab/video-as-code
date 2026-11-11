---
name: chibi-history-explainer
description: |
  做「Q 版小人 · 历史故事讲解片」时调用：抖音上那种暗褐底、暖光灯笼、大头 Q 版小人（头占身高一半、有腮红、表情会变、帽翅发带会弹）把史书里的故事一个动作一个动作演出来的短片（3–4 分钟，无配音，字幕当旁白，左上粗宋大字 + 浅蓝 / 红下划线，按阅读速度走，动作配拟音）。全部画面用 canvas 代码画。覆盖：从零逐帧拆参照片（造型比例、表情、动作帧数、转场、字幕、拟音）、选题和带前因后果的文案、15 秒样片、全片、复盘、改稿加字幕（时间重映射）、封面三方向、发布文案；可复用引擎（部件拼装小人 + 10 种头饰 + 表情库、漫画符号、计数器、原文卷轴、思考气泡、道具飞屏、合成拟音）、30 多个场景和道具、完整例片《张良拾履》和 15 秒空白模板。Triggers: Q版小人、Q版历史、大头小人、史记故事动画、韩愈三封信、张良拾履、人物故事讲解片、表情包小人演历史、拟音动画、蓄力过冲。
  不适用：深夜蓝黑俯视地图的制度史解谜（用 mini-city-explainer）、剪影 + 文献卡的社会史揭露（用 silhouette-stage-explainer）、暗底剪影哲学片（用 silhouette-explainer）、金线辉光史诗人物传、歌词 MV 卡点、口播剪辑。
---
# Q 版小人 · 历史故事讲解片

来源：逐帧拆抖音「韩愈三封求职信」（D1），学它的造型、动作和版式，做出 250 秒的《张良拾履》（2026-11-09/10，文案和画面原创）。做的时候看过样片、提过三轮修改（配乐、补后半生计策、补前因后果和修胡子），认可成片，选定封面 A。第二条用这个 skill 开工的是 195 秒的《冯谖弹剑》（2026-11-10，代码在 `examples/冯谖/`）：两组 ×1×2×3、满堂门客和百姓夹道的群戏、分屏、狡兔三窟剖面图。

## 先读哪份
| 要做的事 | 读 |
|---|---|
| 开一条新片子，走完整流程 | `references/workflow.md` |
| 定造型、表情、构图、字幕，检查像不像 | `references/style-rules.md` |
| 给某句字幕找动作、找场景和道具函数 | `references/actions.md` |
| 出了怪问题（人小、幅度弱、字幕压人、胡子歪、封面接缝） | `references/pitfalls.md` |
| 看完整例子（47 句文案、复盘数字） | `references/case-张良拾履.md`，代码在 `examples/张良拾履/` |

## 核心规则（概览类问题读到这里就够）
1. **一句字幕把动作完整演出来**：「挡了三回」就真挡三回，右上 ×1 ×2 ×3 跟着接触出。
2. **每个动作「蓄力 → 动作 → 过冲 → 回稳」**，蓄力和回稳比动作长；身体整块倾斜、拉伸、压扁，不弯腰；帽翅 / 发带 / 胡子晚一拍弹；表情一帧硬切。
3. **人要大**：脚踩画面下 10%，人占画面高一半。动作幅度照原片数值，不凭感觉。
4. **小人从不静止**（呼吸、走路颠、配件晃），镜头一直慢推（引擎给每个场景自动加 3% 慢推，`PUSH`）。目标：静止帧约 1%；帧差中位数 D1 是 0.81，两条成片 0.61–0.69，差在每句的整身大动作少。
5. **字幕**：左上粗宋 68px（1080p），一屏 2–3 行，浅蓝信息词 / 红结论词 + 同色下划线，逐字模糊出字；不卡拍。句中全角空格、句末无标点。
6. **拟音跟动作，BGM 不卡拍**。
7. **每件事有前因后果**，人物片按一生比例分篇幅；原话挂卷轴写出处。
8. **改完放大截图看**：三行字幕会压人头和气泡，道具在暗底上会看不见。
9. 每学一种新风格都从零拆原片，只带分析方法和工具。

## 开工
```bash
node <skill>/scripts/new_project.mjs <新文件夹>                 # 15 秒空白模板（门口挡三回 + 书房想）
node <skill>/scripts/new_project.mjs <新文件夹> bgm.m4a         # 顺便放好配乐
node <skill>/scripts/new_project.mjs <新文件夹> --example       # 张良拾履全片当底子
node <skill>/scripts/new_project.mjs <新文件夹> --example=冯谖  # 冯谖弹剑全片当底子（群戏、分屏、剖面图）
cd <新文件夹> && npm install                                     # 第一次：装渲染用的 playwright-core
```
`<skill>` 是本 skill 所在的文件夹（例如 `~/.claude/skills/chibi-history-explainer`）。
然后：
1. 改 `scenes.js`：`DURATION`、`SCENES`（[起点秒, 场景函数]）、`PAGES`（字幕）、`overlay`、`CUES`（拟音）。造型先在 `test.html` 调。
2. `node render.mjs stills 1,5,9` 出截图和总览 `stills/sheet.jpg`。
3. `node render.mjs video --out=名字 --crf=22` 出无声片和 `out/cues.json`；
   `uv run -q --with numpy --with scipy python -I audio/mix.py out/cues.json out/mix.wav audio/bgm.m4a` 合拟音 + 配乐（不给配乐就用合成的临时拨弦曲）；
   `ffmpeg -i out/名字.mp4 -i out/mix.wav -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 160k -shortest out/成片.mp4`。
4. 对照：`scripts/motion.py`（动态统计）、`scripts/cmp.py`（和原片同类手法并排）、`scripts/sheet.py`（15fps 逐帧），都用 `uv run --with numpy python -I` 跑。

渲染要 playwright-core 和本机 Chrome：`render.mjs` 先找环境变量 `PW_PKG` 指向的 package.json，再找工程自己的 node_modules；都没有就提示运行 `npm install`。ffmpeg 要 7.x（支持 `-fps_mode`），并能在命令行直接运行。macOS、Windows、Linux 都能用；Windows 和 Linux 要装思源宋体（Noto Serif SC），字幕才是粗宋。

## 文件
- `kit/engine.js`：小人 `chibi()`、表情、头饰、胡子、漫画符号、卷轴、标签、字幕、合成（叠化 + 颗粒 + 暗角）。
- `kit/props.js`：计数器、气泡、光芒、金星、钱、铁锤、车马、通缉令、公鸡、竹简、远山、黄石、室内、柱、匾、黑旗、帐篷、沙盘、香炉、画像、天色。
- `kit/common.js`：`P`、`walk`、`kneel`、`handPos`、`camStd`、`breathe`、`HEAD`、`strike`、`remap`。
- `kit/template/`：空白模板（`index.html` + `scenes.js`）。`kit/test.html` + `test_chars.js`：造型表情测试页。
- `kit/audio/mix.py`：14 种合成拟音 + 配乐混音。
- `examples/冯谖/`：全片代码（`scenes.js` 公用部件和开头、`scenes_b.js` 5–20 页、`scenes_c.js` 21–37 页、`timeline.js` 全片时间轴）、文案、复盘。
- `examples/张良拾履/`：全片代码（`scenes.js` 桥、`scenes_mid.js` 计策原场景、`scenes_mid2.js` 改稿后的时间重映射、`scenes2.js` 其余段落和全片时间轴）、封面 `cover/`、文案、复盘。
- `scripts/`：`new_project.mjs` 开工；`motion.py`、`subs.py`、`subphase.py`、`scenes.py`、`cam.py` 测量；`sheet.py`、`cmp.py` 逐帧和对照。

## 默认约定（可按自己的习惯改）
- 先给方案和文案，用户确认再画；涉及画面的改动先出截图，用户同意再渲全片。
- 字幕：句中全角空格、句末无标点。用户润色过的字幕，不改每句的字数。
- 上传版 1080p30、H.264，控制在 100MB 以内。画面全部用代码画，不用 AI 生图。
- 配乐：skill 不带任何音乐。别人的音乐只能练习用，发布前提醒用户换成有授权的音乐，并勾选「AI 辅助生成」。
- `kit/audio/samples/` 里的录音大多是 CC BY 3.0，用到哪个就在发布简介里署名，见 `kit/audio/samples/来源和授权.md`。
