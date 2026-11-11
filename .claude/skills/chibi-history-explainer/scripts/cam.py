# 镜头漂移：同一场景里每隔 0.5 秒和起始帧比，估计整体缩放和平移（对数极坐标 + 相位相关的简化版：只用背景区）
import sys, subprocess, numpy as np
def frames(src, t0, dur):
    raw = subprocess.run(['ffmpeg','-v','error','-ss',str(t0),'-t',str(dur),'-i',src,'-vf','fps=2,crop=784:441:88:3,scale=392:220,format=gray','-f','rawvideo','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.uint8).reshape(-1,220,392).astype(np.float32)
def shift(a, b):
    A, B = np.fft.fft2(a - a.mean()), np.fft.fft2(b - b.mean()); R = A * np.conj(B); R /= np.abs(R) + 1e-6
    r = np.fft.ifft2(R).real; y, x = np.unravel_index(r.argmax(), r.shape)
    if y > 110: y -= 220
    if x > 196: x -= 392
    return x, y
def scale(a, b):  # 搜索缩放：把 b 按比例缩放后和 a 比误差
    best = (1, 1e9)
    for s in np.linspace(.95, 1.05, 41):
        h, w = a.shape; ys = ((np.arange(h) - h/2) / s + h/2).astype(int).clip(0, h-1); xs = ((np.arange(w) - w/2) / s + w/2).astype(int).clip(0, w-1)
        e = np.abs(a - b[np.ix_(ys, xs)])[40:-20, 60:-20].mean()
        if e < best[1]: best = (s, e)
    return best[0]
for src, t0, dur in [(sys.argv[1], float(sys.argv[2]), float(sys.argv[3]))]:
    F = frames(src, t0, dur)
    for i in range(0, len(F), 2): print(f'{t0 + i/2:6.1f}s  平移 {shift(F[i], F[0])}  缩放 {scale(F[0], F[i]):.3f}')
