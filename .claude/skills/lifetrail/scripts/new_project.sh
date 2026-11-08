#!/bin/zsh
# 从模板生成工作目录：复制模板 → npm install → 环境检查 → 地形缓存 → git init
# 中断后重新运行同一条命令即可继续（目录非空但没有 .git 且含模板文件时视为未完成的项目）。
# 用法：zsh new_project.sh <目标目录>
set -euo pipefail
DEST=${1:?usage: new_project.sh <dest-dir>}
SKILL=${0:A:h:h}
if [[ -e "$DEST" && -n "$(ls -A "$DEST" 2>/dev/null)" ]]; then
  if [[ -f "$DEST/.lifetrail_incomplete" ]]; then
    echo "继续未完成的项目：$DEST"
  else
    echo "目标目录非空：$DEST"; exit 1
  fi
fi
mkdir -p "$DEST" && DEST=${DEST:A}
touch "$DEST/.lifetrail_incomplete"   # 完成标记：最后一次 git 提交成功后才删除
trap '(( ZSH_SUBSHELL == 0 )) && echo "生成中断：$DEST 已保留。处理上面的错误后重新运行同一条命令即可继续。" >&2' ZERR
cp -R "$SKILL/template/." "$DEST/"
find "$DEST" \( -name __pycache__ -o -name .pytest_cache \) -prune -exec rm -rf {} +   # 只清理 DEST 内的缓存
( cd "$DEST" && npm install --no-audit --no-fund )
( cd "$DEST" && python3 tools/check_env.py --skip-terrain ) || echo "环境未就绪（警告）：按上面的缺失项处理；缺少地形种子时需要 numpy/scipy/PIL 才能生成地形"
zsh "$SKILL/scripts/setup_terrain.sh" "$DEST"
( cd "$DEST" && python3 tools/check_env.py ) || echo "环境未就绪：按上面的缺失项处理后再继续"
(
  cd "$DEST"
  git init -q
  git add -A
  if git rev-parse -q --verify HEAD >/dev/null && git diff --cached --quiet; then
    echo "初始提交已存在"   # 上次在删除标记前中断
  elif [[ -z "$(git config user.email || true)" || -z "$(git config user.name || true)" ]]; then
    echo "未配置 git user.name/user.email：用 lifetrail <lifetrail@localhost> 提交"
    git -c user.name=lifetrail -c user.email=lifetrail@localhost commit -qm "chore: start from lifetrail template"
  else
    git commit -qm "chore: start from lifetrail template"
  fi
)
rm -f "$DEST/.lifetrail_incomplete"
echo "项目已生成：$DEST"
