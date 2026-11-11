# 逐帧图。macOS、Windows、Linux 通用。
#   uv run python -I sheet.py 视频 起 时长 fps 行数 输出.jpg [列数] [裁剪 w:h:x:y]
# 例：sheet.py 参照片.mp4 2.6 5.4 5 6 开头.jpg 5 784:448:88:0   （抖音录屏左右有灰边，裁掉）
import sys, os, subprocess

def label_font():
    for f in ['/System/Library/Fonts/Supplemental/Arial.ttf', 'C:/Windows/Fonts/arial.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf']:
        if os.path.exists(f):
            return f.replace('\\', '/').replace(':', '\\:')
    return None

if len(sys.argv) < 7:
    sys.exit('用法：sheet.py 视频 起 时长 fps 行数 输出.jpg [列数] [裁剪 w:h:x:y]')
v, start, dur, fps, rows, out = sys.argv[1:7]
cols = sys.argv[7] if len(sys.argv) > 7 else '5'
crop = f'crop={sys.argv[8]},' if len(sys.argv) > 8 else ''
f = label_font()
draw = f"drawtext={'fontfile=' + f + ':' if f else ''}text='%{{pts\\:flt}}':x=2:y=2:fontsize=13:fontcolor=yellow:box=1:boxcolor=black"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', start, '-t', dur, '-i', v,
                '-vf', f'fps={fps},{crop}scale=392:-2,{draw},tile={cols}x{rows}', '-frames:v', '1', out], check=True)
print('注意：时间标签是从「起」算的相对秒数，绝对时间 = 起 + 标签')
