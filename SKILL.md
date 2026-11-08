---
name: video-as-code
description: 为产品、网站、App、开源项目、AI模型、课程、科普选题、故事或历史人物地图叙事制作视频；按内容、受众、风格与动效需求选择适合的制作Skill，统筹调研、需求确认、风格样片、素材、旁白配乐、制作、校验和多平台导出。用户说「做宣传片」「做产品介绍」「做科普视频」「做手绘讲解」「做人生轨迹视频」「做历史地图视频」「给这个题材做个视频」，或要求promo video、explainer、product trailer时使用。
---

# 产品宣传视频制作器

完整的工作规范在本文件同目录的 `AGENTS.md`。开始任何工作之前，先用读文件工具把它从头到尾读一遍，然后严格照它执行；各阶段的详细方法在同目录的 `references/` 里，按 AGENTS.md 的指引按需读取。

每次新制作先阅读 `references/视频Skill选择.md`，按内容、受众、风格与动效需求选择主要制作 Skill；本入口负责统筹，不固定只用 Remotion 或白板。当前项目已安装白板工具 `.claude/skills/srt-whiteboard-animation/SKILL.md` 和历史人物地图工具 `.claude/skills/lifetrail/SKILL.md`；地图路线先读 `references/lifetrail接入.md`。用户已确认的风格、声音和制作路线在改版时继续沿用。

作为 Skill 被调用时，路径这样对应（AGENTS.md 的「两种用法与路径约定」一节有完整说明）：

- `<工具目录>` 是本 `SKILL.md` 所在的目录，`template/`、`references/` 都在这里。
- `<输出目录>` 是当前工作区根目录下的 `宣传片/`，所有项目文件都写到这里，不要写进 `<工具目录>`。

第一步永远是需求问询：没有和用户确认需求之前，不要开始制作。
