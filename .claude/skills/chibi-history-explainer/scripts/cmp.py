# 参照片 vs 自己的片子同一时刻逐帧对照（上参照、下自己）。macOS、Windows、Linux 通用。
#   uv run python -I cmp.py 参照片.mp4 自己的.mp4 输出.jpg 时刻1 时刻2 …（6 或 12 个） [--refcrop=784:441:88:3]
# 两边时刻不同时用 "参照秒/自己秒" 的写法，例如 154.5/65.0
import sys, os, subprocess, tempfile, shutil

def label_font():
    """找一个系统自带的英文字体给 drawtext 用，返回转义好的路径（找不到就返回 None，用 ffmpeg 默认字体）"""
    for f in ['/System/Library/Fonts/Supplemental/Arial.ttf', 'C:/Windows/Fonts/arial.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf']:
        if os.path.exists(f):
            return f.replace('\\', '/').replace(':', '\\:')
    return None

def text(label, color):
    f = label_font()
    return f"drawtext={'fontfile=' + f + ':' if f else ''}text='{label}':x=4:y=4:fontsize=16:fontcolor={color}:box=1:boxcolor=black"

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opts = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--'))
if len(args) < 4:
    sys.exit('用法：cmp.py 参照片.mp4 自己的.mp4 输出.jpg 时刻1 时刻2 … [--refcrop=w:h:x:y]')
ref, ours, out, times = args[0], args[1], args[2], args[3:]
crop = f"crop={opts['refcrop']}," if 'refcrop' in opts else ''
tmp = tempfile.mkdtemp()
for i, p in enumerate(times):
    a, _, b = p.partition('/'); b = b or a
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', a, '-i', ref, '-frames:v', '1', '-vf', f"{crop}scale=480:270,{text('ref ' + a, 'yellow')}", os.path.join(tmp, f'o{i}.png')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', b, '-i', ours, '-frames:v', '1', '-vf', f"scale=480:270,{text('ours ' + b, 'cyan')}", os.path.join(tmp, f's{i}.png')], check=True)
n = len(times); cols = min(n, 6); inputs = []
for r in range(0, n, cols):
    for k in 'os':
        for j in range(r, min(r + cols, n)):
            inputs += ['-i', os.path.join(tmp, f'{k}{j}.png')]
rows = 2 * ((n + cols - 1) // cols)
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', f'xstack=inputs={len(inputs) // 2}:grid={cols}x{rows}', out], check=True)
shutil.rmtree(tmp)
print('ok →', out)
