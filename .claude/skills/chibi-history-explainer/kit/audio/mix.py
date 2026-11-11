# 拟音 + 临时配乐（原创合成，拨弦五声音阶，约 112 BPM）→ out/mix.wav
# 用法：uv run --with numpy --with scipy python -I audio/mix.py out/cues.json out/mix.wav [配乐文件]
# 拟音名写成 smp:文件名@起点:时长（文件在 audio/samples/）就用真实录音片段（冯谖片的笑声，2026-11-10 用户定：合成笑声不像，改用 Commons 上 CC BY / 公有领域的录音）
# 给了配乐文件（用户 2026-11-09 定：用 C 片 BGM audio/C片bgm.m4a）就用它铺底，不给就用下面的合成临时曲。
# 音效跟动作走（D1 实测：冲刺嗖、起跳上滑、落地闷响），配乐只铺底，不卡拍。
import sys, json, wave, subprocess, os, numpy as np
from scipy.signal import lfilter
SR = 44100
cfg = json.load(open(sys.argv[1])); DUR = cfg['dur'] + .5
rng = np.random.default_rng(3)
def env(n, a=.005, r=.1):
    t = np.arange(n) / SR; e = np.minimum(1, t / a) * np.exp(-t / r); return e
def noise(n): return rng.standard_normal(n)
def lp(x, k):   # 一阶低通，k 越小越闷
    y = np.empty_like(x); acc = 0.
    for i, v in enumerate(x): acc += k * (v - acc); y[i] = acc
    return y
def sweep(f0, f1, dur, shape=np.sin):
    n = int(dur * SR); f = np.geomspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR; return shape(ph)
SMP = {}
def sample(spec):   # smp:文件@起点:时长
    f, rest = spec[4:].split('@'); st, du = map(float, rest.split(':'))
    key = (f, st, du)
    if key not in SMP:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(st), '-t', str(du), '-i', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'samples', f), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
        x = np.frombuffer(raw, np.float32).astype(np.float64); n = len(x)
        fade = np.minimum(1, np.arange(n) / (SR * .03)) * np.minimum(1, (n - np.arange(n)) / (SR * .35))
        SMP[key] = x * fade / (np.abs(x).max() + 1e-9)
    return SMP[key]
def S(name):
    if name.startswith('smp:'): return sample(name)
    if name == 'step': n = int(.12 * SR); return lp(noise(n), .08) * env(n, .002, .025) * 1.6
    if name == 'tock': n = int(.15 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 900 * t) + .5 * np.sin(2 * np.pi * 1450 * t)) * env(n, .001, .03) * .5
    if name == 'whoosh': n = int(.32 * SR); t = np.arange(n) / SR; x = noise(n); e = np.sin(np.pi * t / t[-1]) ** 2; return (lp(x, .25) - lp(x, .03)) * e * 1.4
    if name == 'pop': n = int(.12 * SR); return sweep(500, 1400, .12) * env(n, .002, .05) * .6
    if name == 'fall': n = int(.7 * SR); return sweep(1600, 380, .7) * np.linspace(.5, .15, n) * .35
    if name == 'thud': n = int(.35 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 30)) * t) * env(n, .002, .12) + lp(noise(n), .1) * env(n, .001, .03)) * 1.1
    if name == 'blip': n = int(.18 * SR); return sweep(320, 180, .18) * env(n, .005, .08) * .5
    if name == 'hop': n = int(.22 * SR); return sweep(260, 620, .22) * env(n, .005, .1) * .45
    if name == 'paper': n = int(.4 * SR); x = noise(n) * (rng.random(n) < .3); return (x - lp(x, .3)) * env(n, .02, .15) * .5
    if name == 'anger': n = int(.25 * SR); t = np.arange(n) / SR; return np.sign(np.sin(2 * np.pi * 220 * t)) * np.sin(2 * np.pi * 7 * t) * env(n, .003, .1) * .18 + sweep(900, 1800, .25) * env(n, .002, .06) * .3
    if name == 'rumble': n = int(2.0 * SR); t = np.arange(n) / SR; return lp(noise(n), .02) * (1 + .6 * np.sin(2 * np.pi * 18 * t)) * np.minimum(1, t / .2) * np.minimum(1, (t[-1] - t) / .3) * 1.2
    if name == 'cough': n = int(.22 * SR); x = lp(noise(n), .35); t = np.arange(n) / SR; return x * env(n, .004, .06) * (1 + np.sin(2 * np.pi * 140 * t)) * .7
    if name == 'deflate': n = int(.9 * SR); x = noise(n); return (lp(x, .2) - lp(x, .02)) * np.linspace(1, 0, n) ** 1.5 * .9 + sweep(500, 150, .9) * np.linspace(.3, 0, n)
    if name == 'sword':   # 弹剑「铮——嗡」：不协和泛音 + 拍频 + 指甲一弹的脆响
        n = int(1.6 * SR); t = np.arange(n) / SR; s_ = np.zeros(n)
        for r, a, tau in [(1, 1, .9), (2.76, .6, .5), (5.4, .4, .28), (8.93, .25, .15), (13.3, .12, .08)]:
            f = 760 * r; s_ += a * (np.sin(2 * np.pi * f * t) + .6 * np.sin(2 * np.pi * f * 1.003 * t)) * np.exp(-t / tau)
        return (s_ / 2.5 + noise(n) * np.exp(-t / .004) * .6) * np.minimum(1, t / .002) * .8
    # 卡通音效（2026-11-10 用户说旧的噪声拟音像「气音」，改成有音高的）
    if name == 'step2':   # 木头脚步「嗒」，左右脚音高随机二选一
        n = int(.09 * SR); t = np.arange(n) / SR; f = 520 if rng.random() < .5 else 440
        return (np.sin(2 * np.pi * f * t * (1 + .3 * np.exp(-t * 60))) + .4 * np.sin(2 * np.pi * f * 2.3 * t)) * env(n, .001, .018) * .8 + lp(noise(n), .3) * env(n, .0005, .002) * .3
    if name == 'whoosh2':   # 「咻」：音调下滑 + 一点风
        n = int(.28 * SR); t = np.arange(n) / SR; e = np.sin(np.pi * t / t[-1]) ** 1.5; x = noise(n)
        return (sweep(1400, 380, .28) * .6 + (lp(x, .35) - lp(x, .12)) * .25) * e
    if name == 'deflate2':   # 滑哨往下「啾——」
        n = int(.8 * SR); t = np.arange(n) / SR; f = np.geomspace(900, 180, n) * (1 + .03 * np.sin(2 * np.pi * 9 * t)); ph = 2 * np.pi * np.cumsum(f) / SR
        return (np.sin(ph) + .2 * np.sin(2 * ph)) * np.minimum(1, t / .02) * np.minimum(1, (t[-1] - t) / .1) * .6
    if name == 'drum':   # 低音鼓滚奏（代替气声轰响）
        dur = 1.8; n = int(dur * SR); out = np.zeros(n); tt = 0; k = 0
        while tt < dur - .15:
            m = int(.18 * SR); t = np.arange(m) / SR; hit = np.sin(2 * np.pi * (70 + 50 * np.exp(-t * 40)) * t) * env(m, .001, .09) * (.6 + .4 * rng.random())
            j = int(tt * SR); out[j:j + m] += hit[:max(0, n - j)]; tt += .07 + .02 * np.sin(k); k += 1
        return out * np.minimum(1, np.arange(n) / (SR * .3)) * .9
    if name == 'anger2':   # 冒青筋「咚」+ 往上蹦
        n = int(.3 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * (110 + 80 * np.exp(-t * 30)) * t) * env(n, .001, .1) * .9 + sweep(500, 1300, .3) * env(n, .002, .05) * .4
    if name == 'cough2':
        n = int(.35 * SR); t = np.arange(n) / SR; src = noise(n) * np.exp(-t / .05)
        def bp(x, f, q): w = 2 * np.pi * f / SR; a = np.sin(w) / (2 * q); return lfilter([a / (1 + a), 0, -a / (1 + a)], [1, -2 * np.cos(w) / (1 + a), (1 - a) / (1 + a)], x)
        return (bp(src, 500, 4) + .6 * bp(src, 1700, 6) + .3 * bp(src, 2500, 8)) * np.minimum(1, t / .005) * 1.5
    if name == 'knock2':
        n = int(.25 * SR); t = np.arange(n) / SR; s_ = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in [(180, 1, .06), (420, .6, .04), (980, .3, .02)])
        return (s_ + noise(n) * np.exp(-t / .003) * .5) / 1.4
    if name == 'twang': n = int(.6 * SR); t = np.arange(n) / SR; f = 330 * (1 + .02 * np.exp(-t * 20)); ph = 2 * np.pi * np.cumsum(f) / SR; return (np.sin(ph) + .5 * np.sin(2 * ph) + .25 * np.sin(3 * ph)) * np.exp(-t / .22) * .5
    if name == 'knock': n = int(.12 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 180 * t) + .4 * lp(noise(n), .2)) * env(n, .001, .03) * 1.2
    if name == 'laugh': n = int(.9 * SR); t = np.arange(n) / SR; return lp(noise(n), .15) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 7 * t))) * np.minimum(1, t / .05) * np.exp(-t / .5) * .9
    raise KeyError(name)
N = int(DUR * SR); fx = np.zeros(N)
for t0, name, vol in cfg['cues']:
    s = S(name) * vol; i = int(t0 * SR); fx[i:i + len(s)] += s[:max(0, N - i)]
# ---- 临时配乐：拨弦（Karplus-Strong）五声音阶 + 低音 + 木鱼，112 BPM ----
BPM = 112; beat = 60 / BPM
def pluck(f, dur, bright=.5):
    n = int(dur * SR); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % p]; buf[i % p] = .996 * .5 * (buf[i % p] + buf[(i + 1) % p]) * (1 - bright * .002) + 0
    return out * env(n, .001, dur * .5)
scale = [293.66, 329.63, 369.99, 440.0, 493.88]   # D 宫五声
def note(d, o=0): return scale[d % 5] * 2 ** (d // 5 + o)
mel = [0, 2, 4, 3, 2, None, 1, 2, 4, 5, 4, 3, 2, None, 3, 2,
       0, 2, 3, 4, 5, 4, None, 3, 2, 1, 0, 1, 2, None, 0, None]   # 一拍一个八分音符位置（半拍）
bgm = np.zeros(N); cache = {}
def put(sig, t, vol):
    i = int(t * SR); j = min(N, i + len(sig)); bgm[i:j] += sig[:j - i] * vol
t = .2; k = 0
while t < DUR:
    d = mel[k % len(mel)]
    if d is not None:
        key = (d, 0)
        if key not in cache: cache[key] = pluck(note(d), .9)
        put(cache[key], t, .22)
    if k % 4 == 0:   # 低音每两拍
        root = [0, -2, -1, -3][(k // 16) % 4]
        kb = ('b', root)
        if kb not in cache: cache[kb] = pluck(note(root, -2), 1.6, 0)
        put(cache[kb], t, .3)
    if k % 2 == 0:   # 木鱼每拍，轻
        n = int(.08 * SR); tt = np.arange(n) / SR; put(np.sin(2 * np.pi * 1250 * tt) * env(n, .001, .015), t + (beat / 2 if k % 4 == 2 else 0) * 0, .12)
    t += beat / 2; k += 1
bgm = lp(bgm, .5)
if len(sys.argv) > 3:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[3], '-t', str(DUR), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    b = np.frombuffer(raw, np.float32).astype(np.float64); bgm = np.zeros(N); bgm[:min(N, len(b))] = b[:N]
    bgm = bgm / (np.sqrt(np.mean(bgm[:min(N, len(b))] ** 2)) + 1e-9) * .13   # 配乐压到拟音下面一点
fade = np.minimum(1, np.arange(N) / (SR * .05)) * np.minimum(1, (N - np.arange(N)) / (SR * 2.5))
mix = bgm * (1 if len(sys.argv) > 3 else .55) * fade + fx * .8
mix = np.tanh(mix * 1.2) / np.tanh(1.2) * .9
pcm = (np.clip(mix, -1, 1) * 32000).astype(np.int16)
with wave.open(sys.argv[2], 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('mix ok', DUR, 's, peak', np.abs(mix).max().round(2))
