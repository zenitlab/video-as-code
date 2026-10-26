# 风格库

从 8 个外部项目拷来的风格、画法、方法文档和作品合集。用得到的部分都在本目录和 `template/` 里，跟着仓库走；完整的原始仓库另存在 `<工具目录>/vendor/`（不进 git，没有也不影响使用）。第 2 步出风格样片时从这里挑；第 6 步写画法时直接改用这里的代码。

## 一、花叔 huashu-art-motion · 8 种讲解语法（可直接在 Remotion 里用）

代码在 `template/public/vendor/huashu/`，用 `src/components/HuashuClip.tsx` 挂进任意场景：

```tsx
import { HuashuClip } from "../components/HuashuClip";
<HuashuClip spec={spec} t={t - 本段起点} />   // spec 同 public/vendor/huashu/examples/*.json，竖屏写 width 1080、height 1920
```

| grammar | 是什么 | 语法卡 | 例子 |
|---|---|---|---|
| `t1_3b1b` | 3Blue1Brown：黑底、公式书写、概念直接变形成下一个 | `huashu/动画语法/t1_3b1b.md` | `template/public/vendor/huashu/examples/t1_3b1b.json` |
| `t2_keynote_ui` | 发布会界面：截图推近、高亮框、数字 | `huashu/动画语法/t2_keynote_ui.md` | `template/public/vendor/huashu/examples/t2_keynote_ui.json` |
| `t3_finance_chart` | 财经图表：柱/折线逐个长出、标注倍数 | `huashu/动画语法/t3_finance_chart.md` | `template/public/vendor/huashu/examples/t3_finance_chart.json` |
| `y1_kurzgesagt` | Kurzgesagt：扁平圆形角色、节点连线 | `huashu/动画语法/y1_kurzgesagt.md` | `template/public/vendor/huashu/examples/y1_kurzgesagt.json` |
| `y2_vox` | Vox：纸面拼贴、放大标注 | `huashu/动画语法/y2_vox.md` | `template/public/vendor/huashu/examples/y2_vox.json` |
| `y3_whiteboard` | 白板：手绘线条、逐条要点 | `huashu/动画语法/y3_whiteboard.md` | `template/public/vendor/huashu/examples/y3_whiteboard.json` |
| `y4_storytime` | 讲故事：自备角色帧（需要角色素材） | `huashu/动画语法/y4_storytime.md` | `template/public/vendor/huashu/examples/y4_storytime.json` |
| `y5_kinetic_type` | 动态大字：关键词砸入、编号 | `huashu/动画语法/y5_kinetic_type.md` | `template/public/vendor/huashu/examples/y5_kinetic_type.json` |

7 种已在竖屏 Remotion 里实测出图（y4 要自备角色帧）。色板 `theme`：paper / poster / ink / navy / bauhaus / snow / wood / chalk，见 `huashu/色板.md`。

方法文档：`huashu/镜头语言.md`（推、横移、拉远什么时候用）、`huashu/05-节奏与配乐.md`、`huashu/09-视频动画语法.md`（片段契约）、`huashu/镜头表模板.md`。35 种艺术风格配方卡在 `huashu/风格配方/`（洞穴壁画、埃及、梵高、克里姆特、包豪斯、浮世绘、8-bit、蒸汽波、新海诚……），场景代码在 `huashu-scenes/scenes/`（引擎 `engine.js`、转场 `transitions.js`、段落表 `eras.js` 一并拷在 `huashu-scenes/`）。

## 二、Lemo-Opuscar · 59 种影片风格

每种风格一个目录 `lemo/<slug>/`：`STYLE.md`（风格不变量，可直接当提示词）、`style.json`、`poster.jpg`（样帧）、`demo/`（整片源码：`main.js` / `film.js` / `engine` 是 Canvas 2D 或 three.js 的 `render(ctx, t)`，可改写成本工具分镜的 `draw(g, t)`）。导演方法见 `lemo/DIRECTOR.md`、`lemo/TECHNIQUE.md`。

| 风格 | 中文名 | 类别 | 一句话 |
|---|---|---|---|
| [`archive-lighttable`](lemo/archive-lighttable/STYLE.md) | 档案灯台 | 实证影像 | 电报说最长飞了 57 秒；放大镜下，莱特兄弟的底片和档案说是 59 秒。 |
| [`art-deco`](lemo/art-deco/STYLE.md) | 装饰艺术 | 图形与排版 | 1930 年的大饭店，门童赶在午夜前把一封信送上顶楼。 |
| [`ascii-crt`](lemo/ascii-crt/STYLE.md) | ASCII / CRT 终端 | 图形与排版 | 月球基地的 AI 沉睡 40 年后被唤醒，用字符画出“家”来回复。 |
| [`backrooms`](lemo/backrooms/STYLE.md) | 后室 / 新怪谈 | 电影与时代 | 新夜班员工拍下入职第一晚：无尽的黄色办公空间，和墙上的员工守则。 |
| [`blueprint`](lemo/blueprint/STYLE.md) | 蓝图 / 工程制图 | 图形与排版 | 发明家的蓝图自己画出一台接云机器，修订云线变成了真的雨云。 |
| [`brick-toy`](lemo/brick-toy/STYLE.md) | 积木玩具 | 材质与 3D | 积木宇航员用零件拼出火箭，飞向积木月亮。 |
| [`briefing-board`](lemo/briefing-board/STYLE.md) | 工程简报板 | 实证影像 | 一条河要架桥，四种桥型在一面简报墙上逐个受检，拍板的是桥下要过的船。 |
| [`caption-news`](lemo/caption-news/STYLE.md) | 字幕新闻 | 剪辑与纪实 | 美国一年死掉 130 万箱蜜蜂，总数却涨了 6%：静音也能看懂的新闻。 |
| [`cel-anime-80s`](lemo/cel-anime-80s/STYLE.md) | 80 年代赛璐璐动画 | 卡通与动画 | 快递少女骑车穿过雨后霓虹都市，赶在黎明发射前送到一盘磁带。 |
| [`city-symphony`](lemo/city-symphony/STYLE.md) | 延时交响 | 剪辑与纪实 | 纽约的一天：延时光河、踩着十六分音符的网格，1899 年和今天并排。 |
| [`countdown`](lemo/countdown/STYLE.md) | 实时倒计时分屏 | 剪辑与纪实 | 阿尔忒弥斯二号发射的最后一分钟，一秒不剪：格子从 1 开到 9，点火合成 1。 |
| [`crayon-book`](lemo/crayon-book/STYLE.md) | 蜡笔儿童绘本 | 手绘与绘画 | 月亮失眠了，小女孩爬上屋顶给它唱摇篮曲。 |
| [`dark-keynote`](lemo/dark-keynote/STYLE.md) | 暗色科技发布 | 信息与发布 | 虚构 app Tidy 的发布片：被埋掉的光标一键把几百个窗口归位。 |
| [`data-physical`](lemo/data-physical/STYLE.md) | 数据实物化 | 实证影像 | 十二年风电和太阳能装机叠成实物，绕表盘升成两条螺旋，2021 年太阳能反超。 |
| [`dataviz`](lemo/dataviz/STYLE.md) | 数据叙事 | 信息与发布 | 一百年的夏季气温，图表本身就是故事。 |
| [`engraving`](lemo/engraving/STYLE.md) | 铜版画 | 印刷与版画 | 一张博物志图版自己刻出来：雕刀推开铜版，蜜蜂一线线成形，最后手工水彩上色。 |
| [`game-show`](lemo/game-show/STYLE.md) | 综艺节奏扁平 | 游戏 | 把 AI 发展史做成一局节奏游戏，模型踩着拍登场，最后发成绩单。 |
| [`glass-product`](lemo/glass-product/STYLE.md) | 玻璃质感产品 | 材质与 3D | 虚构玻璃耳机 Aura 的开箱与特写。 |
| [`halftone-dossier`](lemo/halftone-dossier/STYLE.md) | 复古半调案卷 | 印刷与版画 | 橘猫胖橘被立案审查：测试重力、凌晨跑酷，最后无罪释放。 |
| [`hd-2d`](lemo/hd-2d/STYLE.md) | HD-2D | 游戏 | 灯塔熄灭，孙女提着最后一簇火穿过夜林、爬上风暴悬崖。 |
| [`hologram-hud`](lemo/hologram-hud/STYLE.md) | 科幻全息界面 | 信息与发布 | 电助力车被扫描成全息线框，目标框依次锁定电池、电机、刹车。 |
| [`impasto`](lemo/impasto/STYLE.md) | 油画厚涂 | 手绘与绘画 | 灰色雨中广场，第一把红伞撑开，圆舞曲把整个广场刷上颜色。 |
| [`ink-wash`](lemo/ink-wash/STYLE.md) | 中国水墨 | 手绘与绘画 | 侠客踏水过江，一剑断流。 |
| [`iso-infographic`](lemo/iso-infographic/STYLE.md) | 等距信息图 | 信息与发布 | 一杯咖啡从种植园到你手里的旅程。 |
| [`kino-montage`](lemo/kino-montage/STYLE.md) | 构成主义蒙太奇 | 剪辑与纪实 | 帝国大厦的小册子写着建造者，工地实拍和老照片给出答案：每天 2,500 人。 |
| [`lidar-survey`](lemo/lidar-survey/STYLE.md) | 点云测绘 | 实证影像 | 激光点云剥掉一片森林的树冠，露出当年农田的石墙：3.4 公里。 |
| [`living-screencast`](lemo/living-screencast/STYLE.md) | 活体实机录屏 | 信息与发布 | 像素小人 Clawd 搬进 Claude 应用，一镜到底演示 Plan 模式和自检。 |
| [`lowpoly-island`](lemo/lowpoly-island/STYLE.md) | 低多边形等距 | 材质与 3D | 空海里一格格长出小岛和村庄，每放一块响一个音符，直到星空。 |
| [`microgame`](lemo/microgame/STYLE.md) | 微游戏快闪 | 游戏 | 见习宇航员闯五秒训练营，越来越快，Boss 关亲手降落回地球。 |
| [`microscope`](lemo/microscope/STYLE.md) | 显微叙事 | 实证影像 | 一镜从肝组织玻片推到单个细胞核，两个圆逐像素数出 2.4 倍的蓝。 |
| [`midcentury-toon`](lemo/midcentury-toon/STYLE.md) | 50s 扁平卡通 | 卡通与动画 | 用 50 年代教育片的口吻，三步教你装好一台扫地机。 |
| [`news-package`](lemo/news-package/STYLE.md) | 电视新闻包装 | 剪辑与纪实 | 一周四条 AI 新闻，一整套电视台包装：串联单、标题条、翻牌价格表、规格卡。 |
| [`newsreel`](lemo/newsreel/STYLE.md) | 1920s 新闻影片 | 剪辑与纪实 | 1926 年报纸说查尔斯顿会跳坏膝盖，福特工人野餐会上的孩子照跳不误。 |
| [`one-line`](lemo/one-line/STYLE.md) | 一笔画 | 手绘与绘画 | 一根不离纸的线画完一个人的一生，再把笔交给孩子。 |
| [`paper-lantern`](lemo/paper-lantern/STYLE.md) | 纸雕灯影 | 东方传统 | 一枚月饼讲中秋的团圆与思念，纸雕灯箱层层透光。 |
| [`paper-popup`](lemo/paper-popup/STYLE.md) | 纸片立体书 | 材质与 3D | 立体书在书桌上打开，小精灵 Pip 在纸片世界冒险，最后跳出书外。 |
| [`papercut-red`](lemo/papercut-red/STYLE.md) | 红色窗花剪纸 | 东方传统 | 除夕年兽进村，小女孩剪出的大窗花照亮全村，把它吓跑。 |
| [`pictogram-motion`](lemo/pictogram-motion/STYLE.md) | 象形运动图形 | 图形与排版 | 2026 亚运会 43 个大项，几何象形人卡着节拍快闪。 |
| [`pixel-rpg`](lemo/pixel-rpg/STYLE.md) | 16-bit 像素 RPG | 游戏 | 勇士在最终 Boss 门前存档，存档画面闪回一路冒险。 |
| [`risograph`](lemo/risograph/STYLE.md) | Risograph 孔版印刷 | 印刷与版画 | 周日早晨骑车穿过城市：面包店、公园、河边，每到一处加一版油墨，最后三版套印。 |
| [`rubber-hose`](lemo/rubber-hose/STYLE.md) | 1930s 橡皮管卡通 | 卡通与动画 | 一只咖啡杯满厨房追一块逃跑的方糖。 |
| [`satellite-briefing`](lemo/satellite-briefing/STYLE.md) | 卫星简报 | 实证影像 | 卫星照着地图去找咸海，找到的是沙漠；只有筑了坝的那一块回来了。 |
| [`scifi-toon`](lemo/scifi-toon/STYLE.md) | 科幻情景喜剧卡通 | 卡通与动画 | 厌世天才开传送门只想买杯咖啡，却穿过越来越离谱的平行宇宙。 |
| [`shadow-puppet`](lemo/shadow-puppet/STYLE.md) | 皮影戏 | 东方传统 | 十日炙烤大地，后羿张弓射日。 |
| [`silent-film`](lemo/silent-film/STYLE.md) | 1920s 默片 | 电影与时代 | 面包店学徒追一个滚走的面包，最后掰成两半分给饿肚子的小女孩。 |
| [`silkscreen-poster`](lemo/silkscreen-poster/STYLE.md) | 丝印旅行海报 | 印刷与版画 | 三条步道各一张丝印海报，一色一刮印出来，再沿山脊一镜到底从正午爬到黄昏。 |
| [`spy-titles`](lemo/spy-titles/STYLE.md) | 60s 间谍片头 | 图形与排版 | 虚构 1964 年间谍片的片头：追一把被偷的钥匙，几何碎片最后拼成片名。 |
| [`stained-glass`](lemo/stained-glass/STYLE.md) | 彩色玻璃窗 | 图形与排版 | 阳光从清晨移到黄昏，照到哪一格花窗，哪一格的故事就动起来。 |
| [`swiss-motion`](lemo/swiss-motion/STYLE.md) | 瑞士动态排版 | 图形与排版 | 一张音乐会海报按瑞士设计的五条规则自己排版，第五条是只打破一条。 |
| [`teardown`](lemo/teardown/STYLE.md) | 产品拆解 | 实证影像 | 开源键盘的一半在一次环绕中逐层拆开，看到主控再合拢，标上真实尺寸。 |
| [`telestrator`](lemo/telestrator/STYLE.md) | 体育战术板 | 剪辑与纪实 | 半场 0–3，费内巴切 12 分钟连进三球：冻住画面、画线、分屏、射门图。 |
| [`tilt-shift`](lemo/tilt-shift/STYLE.md) | 移轴微缩 | 材质与 3D | 玩具城的早高峰，一切都像模型。 |
| [`ukiyoe`](lemo/ukiyoe/STYLE.md) | 浮世绘 | 东方传统 | 旅人走向远山，每个镜头都是一幅版画；巨浪是高潮，结尾是远山与整幅画轴拉远。 |
| [`urban-sketch`](lemo/urban-sketch/STYLE.md) | 钢笔淡彩 | 手绘与绘画 | 公园只是一张钢笔速写，风把草帽吹到哪里，哪里才有颜色。 |
| [`visual-investigation`](lemo/visual-investigation/STYLE.md) | 视觉调查 | 剪辑与纪实 | 新闻片、照片、证词和调查报告排上同一条时间轴，五路来源指向一处。 |
| [`watercolor`](lemo/watercolor/STYLE.md) | 水彩笔刷 | 手绘与绘画 | 跟着降雨从澳洲红色腹地一路画到绿色海岸，一镜到底。 |
| [`white-model`](lemo/white-model/STYLE.md) | 白模投影 | 实证影像 | 投影机把数据一层层刷上鹿特丹白模：从 1940 年的空洞到今天的塔楼。 |
| [`whiteboard`](lemo/whiteboard/STYLE.md) | 白板讲解 | 手绘与绘画 | 手机怎么知道你在哪：GPS、原子钟，和相对论每天多出的 38 微秒。 |
| [`woodcut`](lemo/woodcut/STYLE.md) | 木刻版画 | 印刷与版画 | 村子用一整个冬天铸一口钟，钟声第一次响起，雪停了。 |

适合科技 / 知识讲解的：whiteboard、dataviz、iso-infographic、dark-keynote、living-screencast、hologram-hud、blueprint、briefing-board、teardown、data-physical、swiss-motion、ascii-crt、satellite-briefing、lidar-survey、pictogram-motion、microscope、news-package、caption-news。

## 三、岚叔 lanshu · 12 种讲解风格（9 种画风 + 3 种讲法）

来源：cclank/lanshu-create-ai-presenter-video 的 `explainer/`，原样拷在 `lanshu/`。同一个题目 KV Cache 用 12 种风格各做了一支示范片，对比图见 `lanshu/gallery/nine-styles-kv-cache.jpg`、`lanshu/gallery/three-narrative-styles-kv-cache.jpg`，第 2 步出样片时可以直接拿这两张图给用户看。

**注意：原项目只有横屏 16:9（1920×1080），用 HTML + GSAP 写、HyperFrames 渲染。** 本工具做竖屏时不能直接套用：选中某种风格后，照它的 `kits/<key>/kit.css`（配色、字体、字号）和 `kits/<key>/kit.js`（组件和动作），按 1080×1920 重新排版，改写成分镜的 `draw(g, t)` + `ov(t)` 或 Remotion 组件。示范片源码在 `examples/kv-cache/<key>/index.html`，动作写法看它。

| key | 名称 | 画面 | 适合 |
|---|---|---|---|
| `v1-editorial` | 留白 | 暖白纸、墨色、一抹朱红，大留白、翻页 | 严肃、高级感、商业与产品 |
| `v2-signal` | 信号 | 暗色仪表盘、荧光绿，标签解码出现、数据包在线上走、故障切 | AI、基础设施、网络、系统类 |
| `v3-notebook` | 手帐 | 方格纸上真笔逐字书写、便利贴、橡皮擦 | 一步步推导、学习笔记、教学 |
| `v4-paper` | 立体书 | 牛皮纸立体书，纸片折起、软阴影、视差 | 有温度的故事、流程、大众话题 |
| `v5-comic` | 波普漫画 | 半调网点漫画、贴纸拍入、爆炸字 | 快节奏短视频、观点、辟谣 |
| `v6-cinematic` | 一镜到底 | Three.js 3D 影棚一镜到底、瓷质道具、辉光 | 旗舰内容、发布、宏观概念 |
| `v7-drafting` | 图纸与注脚 | 黑色工程图纸、引线、注脚、卡拉 OK 式大字 | 面向从业者的技术深挖 |
| `v8-chalkboard` | 黑板报 | 木框黑板、粉笔现写、板擦、粉笔脑图复习 | 课堂感、入门、便于记忆 |
| `v9-clay` | 黏土小城 | 等距黏土小城，比喻 + 真实术语标签 | 用比喻讲给外行 |
| `v10-reasoning` | 推演 | 墨蓝画布，图形和公式一步步搭出来 | 原理、算法、数学（讲法：问题 → 搭图 → 规律 → 结论与代价） |
| `v11-casefile` | 案卷 | 软木证据板、线索、结案章 | 故障复盘、为什么会这样（讲法：异常 → 取证 → 查明 → 修复 → 结案） |
| `v12-sitcom` | 小剧场 | 生活场景里的角色、账单、排队 | 讲给小白（讲法：角色遇到误区 → 实物对照找到原因 → 新做法 → 比喻对上术语） |

选风格看 `lanshu/STYLES.md`（含给用户看的风格菜单原文）；组件接口看 `lanshu/KITS.md`；坑看 `lanshu/GOTCHAS.md`；写稿和讲解方法看 `lanshu/方法文档/styled-explainer.md`。程序化音效 `lanshu/core/sfxlib.py`，部分风格另有专属音效（如 `kits/v3-notebook/notebook_sfx.py`、`kits/v2-signal/sfx_signal.py`）。

运行时依赖（原项目从网上加载，本工具改写时要换成本地或去掉）：GSAP 3.14.2、three.js r181（V6、V9 用）、Google Fonts 子集。

## 四、其他

- `ClaudeAnimationBase_ANIMATION_GUIDE.md`：手绘角色动画的节奏规则（一次只让观众看懂一件事、看懂后停一下）、31 种情绪、笔刷擦除转场。引擎在 `template/public/vendor/cab/`（p5.js + p5.brush），自审渲染脚本 `template/scripts/vendor/cab_render.mjs`（`--sheet` / `--strip` / `--crop-at`）。

- 归藏 product video skill：`template/scripts/vendor/` 里的 `make_sfx.py`（11 种界面音）、`mix_audio.py`（按音效类型压低音乐）、`sfx_landmarks.py`（测音效起音点）、`check_delivery.py`（交付检查）。在 mix.py 里用 `scripts/sfxlib.py` 调。

- 灵感检索：`python3 scripts/inspire.py 知识讲解 KV` 在三个合集里搜作品、提示词原文和视频类 Skill。合集数据在 `合集/`：awesome-opus5-5-videos（703 条作品 + 提示词）、awesome-ai-motion（1417 个作品，不含封面图）、awesome-claude-video-skills（347 个 Skill）。Skill 用法下先设环境变量 `VIDEO_AS_CODE_HOME=<工具目录>`。

## 五、第二轮补齐（上一轮漏掉、本工具能用的部分）

| 内容 | 位置 | 用途 |
|---|---|---|
| 归藏的方法文档 12 篇 | `guizang/*.md` | `direction.md`（从产品气质推导手法、反重复）、`story-and-copy.md`（分镜文案）、`visual-vocabulary.md`（视觉词汇）、`component-pipeline.md`（挂真实 React 组件代替截图）、`audio-and-qa.md`、`review.md`（联系表 + 转场条带审片）、`cover.md`（封面）、`case-study.md` |
| 归藏 fx-lab 4 种特效 | `guizang/fx-lab/`（warp 流线场、glyph-field 字符场、orbit 环绕、settle 落定） | 纯时间函数，可直接改写进分镜 `draw(g, t)`；README 里写了每种从产品哪里取参数、什么时候不用 |
| 归藏配乐合成示例 | `guizang/score-example-keys.py`、`score-example-cinematic.py` | 代码写原创配乐的两个起点 |
| 归藏新闻讲解扩展 | `template/scripts/vendor/guizang_news/` | 文字简报 → 配音、按实测时长排时间轴、垫乐、混音的一整套脚本，做「AI 早报」这类资讯片时参考 |
| 花叔参考片拆解工具 | `template/scripts/vendor/huashu_analyze/`（`breakdown.py` 等 5 个） | 把一支参考视频拆成接触表、逐帧差、节拍网格、转场接触表、运动热图：用户给参考片时先跑它 |
| 花叔片段渲染与版面审计 | `template/scripts/vendor/huashu_render.py`、`huashu_audit_clip.py` | 不进 Remotion 时单独渲一段 HuashuClip；`--audit` 查文字出界、字太小、叠字 |
| 花叔 8 种语法的示范片 | `huashu-scenes/demos/` | 每种讲解语法一支完整示范，写 spec 时照着抄 |
| 花叔参考片复刻 | `huashu-scenes/reference_films/`（SpaceX 四版、Rick & Morty） | 讲解员式（y6）、白板笔顺的完整参考实现 |
| Lemo 公共库 | `lemo/core/`（`lib.js` 确定性工具、`post/crt.js` CRT 录像带后期、`three/post.js` 3D 景深辉光后期、`fonts/`、`assets/polyhaven` 3D 贴图道具） | Lemo 各风格 demo 依赖它们，改写 Lemo 风格时一起参照 |
| Lemo 读字时长自检 | `template/scripts/vendor/lemo_readcheck.mjs` | 页面暴露 `TEXTS(t)` 后量每段字在屏上停够没有（中文 4.5 字/秒），对应 AGENTS.md「节奏：底线」 |
| Lemo 字幕导出、采样乐器 | `template/scripts/vendor/lemo_srt.py`、`lemo_sampler.py` | 出 SRT；真乐器采样（要 soundfile、soxr 和采样包） |
| Lemo 自定义风格流程 | `lemo/MY-STYLES.md`、`lemo/AGENTS.md` | 把一种风格改成自己的、保存复用 |
| 视频 Skill 导航全文 | `合集/awesome-claude-video-skills/README.zh-CN.md` | 347 个仓库的分类说明、16 个实测排名 |
