# lifetrail

一个 [Claude Code](https://claude.com/claude-code) skill：给一位**主要活动在中国**的历史人物做一部“人生轨迹”视频。

- 从出生到去世半年一步，在 3D 卫星地形上走一遍一生，标注古今地名；
- 里程碑处推镜头、高亮并出卡片（附引文和出处），每个人生阶段前插章节卡；
- 旁白驱动时间轴（edge-tts 配音、字幕烧录），按人生阶段配不同情绪的程序合成配乐；
- 输出 1920×1080 @30 fps、H.264 + AAC、−16 LUFS 的 mp4。

流程分 8 个阶段：开工问清单 → 建项目 → 史料研究 → 独立核查 → 旁白与时间轴 → 配乐 → 定点审片 → 全片渲染 → 交付。只在开工和交付两处需要人参与。详见 [SKILL.md](SKILL.md)。

## 适用范围

- 只适用于主要活动在中国的人物：地图范围为东经 72–146°、北纬 16–54°。半年步中有超过 20% 落在范围外的人物不适用，10%–20% 之间会先提醒。
- 暂不支持生年在公元前的人物（如孔子、秦始皇），原因见 SKILL.md 的“适用范围”一节。

## 安装

```bash
git clone https://github.com/luwill/lifetrail ~/.claude/skills/lifetrail
```

然后在 Claude Code 里说“给某某做一部人生轨迹视频”即可触发。

运行环境需要：

| 类别 | 依赖 |
|---|---|
| 命令行 | Node.js、Python 3、ffmpeg / ffprobe、curl、git、zsh |
| Python 包 | numpy、scipy、Pillow、edge-tts、pytest |
| 浏览器 | Playwright 的 Chromium（`npx playwright install chromium`，也可以用环境变量 `LIFETRAIL_CHROME` 指定路径） |

新建项目时 `scripts/new_project.sh` 会做环境检查，一次列出所有缺失项。

### 地形缓存

第一次运行时会下载高程和卫星影像，生成共享地形缓存 `~/.cache/lifetrail/terrain/`，大约需要 30–60 分钟，之后所有项目共用。如果手上已有生成好的地形目录，设置 `LIFETRAIL_TERRAIN_SEED=<目录>` 即可直接复制，跳过下载。

## 目录

```
SKILL.md              流程总纲、开工问清单、审片缺陷清单
references/           数据规范、史料研究与独立核查任务书、旁白写法、踩坑清单
scripts/              new_project.sh（从模板建项目）、setup_terrain.sh（地形缓存）
template/             项目模板：three.js 渲染引擎、工具链、测试、配乐生成器
```

## 数据与许可

- **代码**：MIT，见 [LICENSE](LICENSE)。
- **运行时下载的数据**各有许可，与本仓库代码无关：
  - 卫星影像：[EOxCloudless](https://cloudless.eox.at) by EOX IT Services GmbH（含经修改的 Copernicus Sentinel 2022 数据），**CC BY-NC-SA 4.0，商业使用需向 EOX 购买授权**；
  - 高程：[AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)（Mapzen Terrarium 格式，按其来源要求署名）；
  - 配音：edge-tts 调用的是微软在线语音服务，使用时请遵守其条款。
- **`template/data/common/` 中的河湖数据**：取自 [Natural Earth](https://www.naturalearthdata.com/)，属公有领域。
- **成片片尾**：自动注明影像与高程来源，并声明“地图仅示意地形与行迹，不表示任何行政或国家界线”。引擎刻意不画国界和省界。在中国大陆公开发布含地图的视频，可能需要送审取得审图号，请自行判断。

## 说明

- `references/pitfalls.md` 中的出处（如“首批 D9”“笔记一”）指向开发这个 skill 的原项目的内部运行记录，没有随本仓库发布。
- 一次 A/B 评测（以粟裕为例，同一模型、同一需求，分别从零制作和使用本 skill 制作，匿名评审）的结论是：使用 skill 时，史实可靠性、地图合规和画面完成度明显更好，token 用量约为从零制作的 1.5 倍。这次评测只有一个样本，结论仅供参考。
