# 视频 Skill 选择指南

本项目的制作入口仍为 `video-as-code`，统一执行 `AGENTS.md` 的调研、需求确认、声音试听、制作、校验和交付流程。每支新视频先判断需要什么表达，再选制作工具。以下是候选，不是必须套用的风格。

## 选择顺序

1. 明确内容类型：产品介绍、原理科普、新闻解读、情感故事、历史人物地图叙事、Q版历史故事、数字人口播或纯字幕知识片。
2. 明确最需要观众看懂的动作：操作、比较、推演、逐步绘制、角色表演或读字幕。
3. 对照平台、时长、素材和用户偏好选择一个主 Skill。可用其他工具补局部图表、插画或音效，避免多套风格拼在一起。
4. 检查入口文件存在，阅读所选 Skill，并核对运行环境。目录缺失就使用可行的已有路线；用户指定的必要 Skill 缺失时先解决安装，不能假装调用成功。
5. 在 `需求确认.md` 记录主 Skill、辅助工具、适用理由、实际渲染引擎；用匹配的样图或动画样片确认风格。

## 候选及真实入口

下列路径相对于本工具仓库根目录；在别的工作区调用本工具时，按 `<工具目录>` 定位这些入口。

| 内容与需求 | 候选 | 入口 | 注意 |
|---|---|---|---|
| 温馨手绘、白板科普、画笔逐步绘制 | srt-whiteboard-animation | [.claude/skills/srt-whiteboard-animation/SKILL.md](../.claude/skills/srt-whiteboard-animation/SKILL.md) | 适合逐步讲清关系和过程；笔速、信息量、画幅按需求调整，不能让观众一直等图画完 |
| Q版小人演历史、动作喜剧、字幕故事讲解 | chibi-history-explainer | [.claude/skills/chibi-history-explainer/SKILL.md](../.claude/skills/chibi-history-explainer/SKILL.md) | Canvas代码角色表演；默认横屏无旁白，竖屏及声音需适配，见[接入说明](Q版历史讲解接入.md) |
| 历史人物生平、3D地形人生轨迹 | lifetrail | [.claude/skills/lifetrail/SKILL.md](../.claude/skills/lifetrail/SKILL.md) | 主要活动在中国、非公元前出生的人物；上游默认横屏与半年步，战役及竖屏需适配，见[lifetrail接入](lifetrail接入.md) |
| 数字人口播、角色讲解、多风格科普 | lanshu-create-ai-presenter-video | [vendor/lanshu-create-ai-presenter-video/SKILL.md](../vendor/lanshu-create-ai-presenter-video/SKILL.md) | 涉及真人形象时使用已获授权素材；口播不是所有科普的默认路线 |
| 软件产品、功能展示、版本发布 | guizang-product-video-skill / 默认 Remotion | [vendor/guizang-product-video-skill/SKILL.md](../vendor/guizang-product-video-skill/SKILL.md)；[template/](../template/) | 真实界面、操作和作品是重点，避免仅靠插画替代产品证据 |
| 原理推演、动态图表、艺术解说 | huashu-art-motion | [vendor/huashu-art-motion/SKILL.md](../vendor/huashu-art-motion/SKILL.md) | 把机制里的动作演出来，不能只换几张背景图 |
| 多种艺术风格短片 | lemo-opuscar | [vendor/lemo-opuscar/plugin/skills/lemo-opuscar/SKILL.md](../vendor/lemo-opuscar/plugin/skills/lemo-opuscar/SKILL.md) | 根据题材选具体风格，仍要先验证素材与技术条件 |
| 机械结构、技术系统、等距交互插图 | anatomy | [.claude/skills/anatomy/SKILL.md](../.claude/skills/anatomy/SKILL.md) | 局部画面辅助工具，不承担全片配音与交付流程 |
| 无旁白、横屏字幕知识片 | vibe-knowledge-film | [references/风格库/vibe-knowledge/SKILL.md](风格库/vibe-knowledge/SKILL.md) | 该入口面向16:9、无旁白路线；有旁白竖屏不直接套用 |

`vendor/` 是本地参考源码目录，当前仓库的 `.gitignore` 排除了它。新克隆或换电脑时，表中某些入口可能不存在，需要重新检查；不要把“文档里列出”误写成“已经安装并可用”。

## 选题举例

- **胎儿细胞与妈妈**：情感与科学并重，用户已确认温馨手绘，因此选白板主路线，配轻推近和细胞示意；医学图避免密集解剖细节，动物实验与人体观察分别表达。
- **DeepSeek 与 Claude 的机制差异**：若重点是原理比较，优先评估动态图解；若重点是软件使用效果，优先真实操作和作品展示。不能仅凭出现AI关键词就决定手绘。
- **市场大跌原因或热点解读**：数据、时间线、因果关系需要清楚，优先图表、原始资料及调查叙事；情绪包装不能替代事实核实。
- **苏轼、李白等人物的一生**：优先评估 lifetrail 的地形、时间轴与引文卡片；《四渡赤水》等战役改用事件节点与双方行动模型，杭州＋DeepSeek需用城市及公司事件模型，不硬套半年人生轨迹。
- **完璧归赵、张良拾履、冯谖弹剑**：有具体小动作、重复与反差的故事，优先评估 chibi-history-explainer；先核史料和因果，再设计角色动作、表情及拟音。需要地理关系时用地图，不把Q版人物当作地图引擎。
- **儿童故事**：优先角色连续性和故事表演；白板可用于娓娓道来的绘本，但不默认每张图都从零慢慢画满。

## 规则与工程边界

- 用户的明确要求优先；本项目统一流程负责需求、审阅、声音、事实和交付，外部 Skill 承担适合它的制作部分。
- 默认画幅、画风和笔速可以按本次需求调整；已明确确认的决定不重复询问。用户要求审阅或试听的节点必须保留。
- 改版与系列视频沿用已经确认的路线，不能因为新装了某个 Skill 就擅自换风格。
- 每个新项目从 `template/` 建工程；外部工具需要的输入、标注、轨迹、音频、环境和输出都放到该项目 `工程/`，不要往安装目录写成片或密钥。运行环境可以在工程中建立，必要时复制工具源码到工程保留版本与许可证。
- 记录真正使用的渲染引擎。Remotion、白板渲染器等各走适合的运行检查，同时都要检查事实、字幕、音画、响度、输出规格和平台遮挡。检查不适用或失败时如实记录，不能宣称全部通过。
- 保留第三方 LICENSE，使用或分发外部代码前遵守各自许可证；不要把所有工具笼统视为同一种授权。

## 本次白板 Skill 安装

- 来源：[geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation)
- 来源分支：`main`，安装日期：2026-11-05。
- 安装目录：`.claude/skills/srt-whiteboard-animation/`，项目级，未安装到全局。
- 保留上游 `SKILL.md`、脚本、资源、例子和 `LICENSE`；项目适配规则写在本指南与 `AGENTS.md`，不改上游原文。
- 运行依赖在实际制作时检查；本次安装不创建虚拟环境、不生成视频、不调用付费接口。
- 本地入口可供后续制作读取；自动发现是否需要重载会话取决于使用的AI工具。

## lifetrail 安装

- 来源：[luwill/lifetrail](https://github.com/luwill/lifetrail)，main 分支，项目级安装于 `.claude/skills/lifetrail/`。
- 保留完整源码与 MIT LICENSE；上游版本、适用边界、工程路径、声音及多平台适配见 [接入说明](lifetrail接入.md)。
- 未安装运行依赖或下载地形；后续按选题检查。安装不代表已用此引擎制作原有四渡赤水视频。

## chibi-history-explainer 安装

- 来源：[Yiyu5331/chibi-history-explainer](https://github.com/Yiyu5331/chibi-history-explainer)，main 分支，项目级安装于 `.claude/skills/chibi-history-explainer/`。
- 保留引擎、脚本、例片、录音及各自授权说明；固定版本、工程路径、横竖屏与声音适配见 [Q版历史讲解接入说明](Q版历史讲解接入.md)。
- 安装不代表已经运行完整渲染；不自动生成新片，也不改动已确认的其他视频。
