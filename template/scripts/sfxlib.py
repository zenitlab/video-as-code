"""外部项目音效接进本工具：全部返回 audiolib 用的 48k 立体声 float32，直接 mix.place(...)。

    from sfxlib import ui, fx, pluck, DUCK
    mix.place(ui("click"), t)                 # 归藏 11 种界面音：click click-alt pop toggle typing ding-dong success error resolve whoosh sweep
    mix.place(fx("whoosh", d=.4), t)          # lemo 程序化音效：click clack crash whoosh creak thump step ding pop quindar rumble ignite roar heartbeat
    mix.place(pluck("guqin", "D3", 3), t)     # lemo 拨弦物理建模：guqin pipa guitar harp kalimba musicbox …（见 vendor/lemo_INSTRUMENTS.md）
    DUCK["ding-dong"]                         # 归藏按音效类型的音乐压低预设 (dB, hold 秒, release 秒)

来源（原样拷在 scripts/vendor/）：op7418/guizang-product-video-skill make_sfx.py / mix_audio.py，lemomo-ai/lemo-opuscar core/audio/sfx.py / pluck.py。
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "vendor"))
import make_sfx as _gz  # noqa: E402
import lemo_sfx as _lm  # noqa: E402

UI_KINDS = ["click", "click-alt", "pop", "toggle", "typing", "ding-dong", "success", "error", "resolve", "whoosh", "sweep"]
FX_KINDS = ["click", "clack", "crash", "whoosh", "creak", "thump", "step", "ding", "pop", "quindar", "rumble", "ignite", "roar", "heartbeat"]

# 归藏 mix_audio.py 的 DUCK_PRESETS：音效响起时音乐压低多少 dB、保持多久、多久恢复
from mix_audio import DUCK_PRESETS as DUCK  # noqa: E402


def _st(m, gain=1.0):
    m = np.asarray(m, dtype=np.float32) * gain
    return np.stack([m, m], axis=1)


_cache = {}


def ui(kind, gain=1.0):
    """归藏的 11 种原创界面音（48 kHz，原实现逐采样合成，结果缓存）。"""
    if kind not in UI_KINDS:
        raise ValueError(f"ui 音效只有 {UI_KINDS}")
    if kind not in _cache:
        _cache[kind] = np.frombuffer(_gz.sound(kind).tobytes(), dtype="<i2").astype(np.float32) / 32767
    return _st(_cache[kind], gain)


def fx(kind, gain=1.0, **kw):
    """lemo 的程序化音效，参数照原函数（如 whoosh(d=.35, v=1.0)、thump(v, f=70)）。"""
    if kind not in FX_KINDS:
        raise ValueError(f"fx 音效只有 {FX_KINDS}")
    return _st(getattr(_lm, kind)(**kw), gain)


def _lp():
    """拨弦要 numba（pip3 install --user numba），用到时才加载，界面音和程序化音效不需要它。"""
    import lemo_pluck
    return lemo_pluck


def pluck(preset, pitch, dur=None, gain=1.0, **kw):
    """lemo 的拨弦 / 模态乐器单音（需要 numba）。"""
    return _st(_lp().pluck(preset, pitch, dur, **kw), gain)


def strum(preset, pitches, dur, gain=1.0, **kw):
    return _st(_lp().strum(preset, pitches, dur, **kw), gain)


if __name__ == "__main__":
    # 试听：把所有音效依次排进 out/sfx-audition.wav
    from scipy.io import wavfile
    clips = [ui(k) for k in UI_KINDS] + [fx(k) if k not in ("rumble",) else fx(k, d=1.2) for k in FX_KINDS if k != "roar"] + [fx("roar", d=1.0)]
    try:
        clips += [pluck("guqin", "D3", 2.5), pluck("kalimba", "A4", 1.5)]
    except ImportError as e:
        print(f"跳过拨弦：{e}")
    gap = np.zeros((int(0.35 * 48000), 2), np.float32)
    out = np.concatenate([np.concatenate([c, gap]) for c in clips])
    out = out / (np.abs(out).max() + 1e-9) * 0.9
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out")
    os.makedirs(root, exist_ok=True)
    wavfile.write(os.path.join(root, "sfx-audition.wav"), 48000, out)
    print(f"{len(clips)} 个音效 → out/sfx-audition.wav")
