"""按平台界面遮挡检查截图：把 out/stills/ 的截图裁成手机上实际看到的样子，拼成 out/platform-<平台>.jpg。

node scripts/stills.mjs --scenes --comp PromoXHS && python3 scripts/platform_check.py xhs
node scripts/stills.mjs --scenes --comp PromoWX  && python3 scripts/platform_check.py wx

小红书在长屏手机上左右各裁约 100px（直接裁掉）；顶部、底部、右侧按钮区压暗（还看得见，但会被界面挡住）。
遮挡位置见 references/平台规范.md 第一节；平台改版后按用户的手机截图更新 ZONES。
"""
import glob
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1080×1920 坐标：side 左右裁掉的宽度，top / bottom 顶部、底部遮挡边界，right 右侧按钮宽度（从 right_from 往下）
ZONES = {
    "douyin": dict(side=0, top=230, bottom=1440, right=160, right_from=860),
    "xhs": dict(side=99, top=230, bottom=1560, right=0, right_from=0),
    "wx": dict(side=0, top=170, bottom=1500, right=150, right_from=860),
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ZONES:
        sys.exit(f"用法：python3 scripts/platform_check.py {{{'|'.join(ZONES)}}}")
    p = sys.argv[1]
    z = ZONES[p]
    files = sorted(glob.glob(os.path.join(ROOT, "out", "stills", "*.jpg")))
    if not files:
        sys.exit("out/stills/ 里没有截图：先跑 node scripts/stills.mjs --scenes --comp PromoXHS（或 PromoWX）")
    tiles = []
    for f in files:
        im = Image.open(f).convert("RGBA")
        w, h = im.size
        k = w / 1080
        im = im.crop((int(z["side"] * k), 0, w - int(z["side"] * k), h))
        cw = im.size[0]
        ov = Image.new("RGBA", im.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(ov)
        d.rectangle([0, 0, cw, z["top"] * k], fill=(0, 0, 0, 150))
        d.rectangle([0, z["bottom"] * k, cw, h], fill=(0, 0, 0, 170))
        if z["right"]:
            d.rectangle([cw - z["right"] * k, z["right_from"] * k, cw, z["bottom"] * k], fill=(0, 0, 0, 120))
        tile = Image.alpha_composite(im, ov).convert("RGB")
        ImageDraw.Draw(tile).text((8, 8), os.path.basename(f)[:-4] + "s", fill=(255, 220, 0))
        tiles.append(tile)
    cols = 6
    tw, th = tiles[0].size
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + 8), rows * (th + 8)), "white")
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % cols) * (tw + 8), (i // cols) * (th + 8)))
    out = os.path.join(ROOT, "out", f"platform-{p}.jpg")
    sheet.save(out, quality=85)
    print(f"{out}  {len(tiles)} 张；逐张看标题、数字、来源、字幕有没有被裁掉或压在暗区里")


if __name__ == "__main__":
    main()
