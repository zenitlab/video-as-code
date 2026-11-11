# Q版小人 · 历史故事讲解片 skill

让Claude用代码一帧帧画出Q版小人演历史故事的讲解片：暗褐色底，暖光灯笼，大头Q版小人（头占身高一半，有腮红，表情会变，帽翅、发带、胡子会弹），把史书里的故事一个动作一个动作演出来。没有配音，字幕当旁白，动作配拟音，一条3到4分钟。

用这个skill做过的片子：

- 《张良拾履》，250秒：《史记·留侯世家》里张良在桥上替老人捡鞋，到后来辅佐刘邦。
- 《冯谖弹剑》（狡兔三窟），195秒：《战国策》里孟尝君门客冯谖弹剑要待遇、焚券买义、替主人营造三窟。这条是装好skill以后直接做的。

所有画面都是canvas代码画的，不用AI生图，也不用AI视频。

## 里面有什么

| 位置 | 内容 |
|---|---|
| `SKILL.md` | 入口：9条核心规则、开工步骤、该读哪份文档 |
| `references/workflow.md` | 完整流程：拆参照片、选题和文案、15秒样片、全片、复盘、改稿、封面 |
| `references/style-rules.md` | 风格规则：小人比例、构图、表情、字幕、拟音 |
| `references/actions.md` | 动作库和场景、道具函数 |
| `references/pitfalls.md` | 踩过的坑：人太小、动作幅度弱、字幕压人头、胡子歪 |
| `references/case-张良拾履.md` | 完整例子：47句文案、复盘数字 |
| `examples/冯谖/` | 《冯谖弹剑》全片代码、封面、文案、复盘：群戏、分屏、地下剖面 |
| `kit/` | 小人引擎（部件拼装、多种头饰、表情库、漫画符号）、道具、拟音合成和7段录音音效、渲染脚本、15秒空白模板、造型测试页 |
| `examples/张良拾履/` | 《张良拾履》全片代码、封面、文案、复盘 |
| `scripts/` | 一键新建工程、动态统计、字幕和换场测量、逐帧图、和参照片对照 |

## 需要准备

macOS、Windows、Linux都能用。

- 支持skill的AI编程工具，例如Claude Code
- Node.js 18以上，以及本机安装的Google Chrome
- ffmpeg 7.x（需要支持`-fps_mode`），并且能在命令行里直接运行`ffmpeg`
- [uv](https://docs.astral.sh/uv/)，用来跑Python测量和拟音脚本
- **Windows和Linux还要装思源宋体**（Noto Serif SC，免费），字幕才是粗宋。macOS自带宋体，不用装。没装的话会退到系统里的其他宋体，字形和粗细会不一样。

Windows上装这些最省事的办法是用winget（在PowerShell里运行）：

```powershell
winget install OpenJS.NodeJS.LTS
winget install Google.Chrome
winget install Gyan.FFmpeg
winget install astral-sh.uv
```

装完关掉PowerShell再重新打开，新装的命令才能用。思源宋体可以从Google Fonts下载Noto Serif SC，解压后选中全部字体文件，右键「为所有用户安装」。

## 安装

把整个文件夹放进skill目录。

macOS、Linux：

```bash
git clone https://github.com/yiyu5331/chibi-history-explainer.git ~/.claude/skills/chibi-history-explainer
```

Windows（PowerShell）：

```powershell
git clone https://github.com/yiyu5331/chibi-history-explainer.git "$HOME\.claude\skills\chibi-history-explainer"
```

## 用法

直接跟Claude说一句，比如：

> 用Q版小人做一条讲「完璧归赵」的片子

Claude会带着你走：选题 → 写带前因后果的文案（你确认）→ 15秒样片（你看）→ 全片 → 和参照片复盘 → 封面和发布文案。

也可以手动开工，三个系统的命令一样（Windows把路径里的`~`换成`$HOME`）：

```bash
node ~/.claude/skills/chibi-history-explainer/scripts/new_project.mjs 我的片子             # 15秒空白模板
node ~/.claude/skills/chibi-history-explainer/scripts/new_project.mjs 我的片子 --example   # 用《张良拾履》当底子
node ~/.claude/skills/chibi-history-explainer/scripts/new_project.mjs 我的片子 --example=冯谖   # 用《冯谖弹剑》当底子
cd 我的片子
npm install                                   # 第一次：装渲染用的playwright-core
node render.mjs stills 1,3.5,9                # 出截图
node render.mjs video --out=成片 --crf=22      # 出无声视频 out/成片.mp4 和拟音表 out/cues.json
uv run -q --with numpy --with scipy python -I audio/mix.py out/cues.json out/mix.wav 你的配乐.m4a   # 合成拟音和配乐
```

最后用ffmpeg把无声视频和`out/mix.wav`合在一起，命令在`SKILL.md`的「开工」一节。

## 配乐和版权

- **这个skill不带任何音乐。**卡通音效是代码合成的；笑声、欢呼、翻纸、柴火用的是下面列出的录音。不给配乐时，`mix.py`会用一段合成的临时拨弦曲。
- 请用你有权使用的音乐：剪映或平台曲库、Suno等生成的音乐，或者自己的作品。
- 史实请自己再核一遍。例片的出处写在`examples/张良拾履/CLAUDE.md`的待办里。
- 抖音、B站都要求标注AI生成内容，发布时记得勾选。

## 录音音效的授权

`kit/audio/samples/`里的7段录音来自Wikimedia Commons，**不在MIT许可范围内**，各自保留原来的协议：

| 文件 | 原名 | 作者 | 协议 |
|---|---|---|---|
| crowd_laugh.wav | 72843 lonemonk approx-800-laughter-only-1.wav | lonemonk（freesound.org） | CC BY 3.0 |
| crowd_laugh_clap.wav | 72844 lonemonk approx-800-laughter-and-clapter-1.wav | lonemonk（freesound.org） | CC BY 3.0 |
| snort_giggle.ogg | Short male snorts and giggles.ogg | pfranzen | CC BY 3.0 |
| small_group_laugh.ogg | Small group laughter.ogg | Ch0cchi | CC BY 3.0 |
| burst_laugh.ogg | Bursting out laughing.ogg | ezwa | 公有领域 |
| paper.ogg | Book paper pages assorted.ogg | stephan（pdsounds.org） | 公有领域 |
| fire_mix.ogg | Bones breaking wood fire ice crackling.ogg | stephan（pdsounds.org） | 公有领域 |

你的片子里用到了CC BY 3.0的录音，发布时要在简介里署名，例如：「音效：lonemonk、pfranzen、Ch0cchi（CC BY 3.0，Wikimedia Commons，已剪辑）」。

## 致谢

造型、动作和版式学自抖音「韩愈三封求职信」。本skill里的文案、画面和代码都是重新制作的，没有使用原片的素材。

## 许可

代码和文档用MIT许可，见`LICENSE`。`kit/audio/samples/`里的录音按上面各自的协议。
