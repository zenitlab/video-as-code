#!/bin/zsh
# 准备共享地形缓存 ~/.cache/lifetrail/terrain：
#   设置了 LIFETRAIL_TERRAIN_SEED（指向已有的地形目录）就复制成品层；否则下载生成（约 30–60 分钟）
#   一层只有存在完成标记 <层>.ok 才算完整；复制先写临时文件再 mv，生成失败会清掉半成品。
# 用法：zsh setup_terrain.sh <项目目录>    （项目内 tools/ 提供 fetch_dem/fetch_imagery/make_texture）
set -euo pipefail
PROJ=${1:?usage: setup_terrain.sh <project-dir>}
PROJ=${PROJ:A}
CACHE=${LIFETRAIL_TERRAIN_CACHE:-$HOME/.cache/lifetrail/terrain}
SEED=${LIFETRAIL_TERRAIN_SEED:-}

# 唯一的层清单：名称 经度0 经度1 纬度0 纬度1 缩放级 贴图宽 网格宽
LAYER_TABLE='world 35 178 -8 70 5 2400 600
china 70 138 15 55 7 6144 1536
east 97 124 17.5 42.5 9 6144 1536
zhuge_hi 102 118 26 36 10 10240 2048
hi_north 108 122.5 34 41.5 10 8600 1860
hi_east 118 123 26 34 10 3300 660
hi_south 105 122.5 18 26 10 11600 2300
hi_japan 135.5 141.5 34 38.5 10 3600 720'
EXTS=(.json _h.bin _tex.jpg)

mkdir -p "$CACHE" "$PROJ/assets"
have() { [[ -f "$CACHE/$1.ok" && -f "$CACHE/$1.json" && -f "$CACHE/$1_h.bin" && -f "$CACHE/$1_tex.jpg" ]] }
seed_has() { local e; for e in $EXTS; do [[ -f "$SEED/$1$e" ]] || return 1; done }

seed_layer() {
  local L=$1 e
  for e in $EXTS; do
    cp "$SEED/$L$e" "$CACHE/.$L.tmp" && mv "$CACHE/.$L.tmp" "$CACHE/$L$e"
  done
  touch "$CACHE/$L.ok"
  echo "seeded $L"
}

check_py() {
  local m miss=()
  for m in numpy scipy PIL; do python3 -c "import $m" 2>/dev/null || miss+=($m); done
  if (( ${#miss} )); then echo "缺少 Python 包（生成地形需要）：${miss[*]}" >&2; return 1; fi
}

gen_layer() {   # 名称 经度0 经度1 纬度0 纬度1 缩放级 贴图宽 网格宽
  local L=$1
  echo "no seed for $L${SEED:+ at $SEED} — generating (≈ several minutes; set LIFETRAIL_TERRAIN_SEED to reuse an existing terrain dir)"
  check_py || exit 1
  if ( cd "$PROJ" && python3 tools/fetch_dem.py $L $2 $3 $4 $5 $6 $7 && python3 tools/fetch_imagery.py $L $6 \
       && python3 tools/make_texture.py $L $8 --sat ); then
    touch "$CACHE/$L.ok"; echo "generated $L"
  else
    local e; for e in $EXTS; do rm -f "$CACHE/$L$e"; done
    echo "地形层 $L 生成失败，已清除半成品（瓦片缓存保留）；处理上面的错误后重新运行即可续传。" >&2
    exit 1
  fi
}

if [[ -e "$PROJ/assets/terrain" && ! -L "$PROJ/assets/terrain" ]]; then
  echo "已有真实地形目录，保留不链接"
  echo "真实地形目录模式：只检查，不生成"
  RMISS=()
  for ROW in "${(@f)LAYER_TABLE}"; do
    F=(${=ROW}); for e in $EXTS; do [[ -f "$PROJ/assets/terrain/$F[1]$e" ]] || { RMISS+=("$F[1]$e"); }; done
  done
  if (( ${#RMISS} )); then echo "真实地形目录缺少：${RMISS[*]}" >&2; exit 1; fi
  echo "terrain ready: $PROJ/assets/terrain (real dir)"; exit 0
else
  ln -sfn "$CACHE" "$PROJ/assets/terrain"
fi

for ROW in "${(@f)LAYER_TABLE}"; do
  F=(${=ROW})
  have $F[1] && continue
  if seed_has $F[1]; then seed_layer $F[1]; else gen_layer "${F[@]}"; fi
done
echo "terrain ready: $CACHE"
