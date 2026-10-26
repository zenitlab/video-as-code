/**
 * 花叔 huashu-art-motion 的 8 种讲解语法（public/vendor/huashu，原样拷入，MIT）接进 Remotion。
 * 用法：<HuashuClip spec={spec} t={t - 本段起点} />，spec 与原项目 clip.json 同格式（见 public/vendor/huashu/examples/*.json、
 * references/09-视频动画语法.md「片段契约」）。grammar 可选：t1_3b1b / t2_keynote_ui / t3_finance_chart / y1_kurzgesagt /
 * y2_vox / y3_whiteboard / y4_storytime / y5_kinetic_type。竖屏写 width 1080、height 1920。
 * 画面只由 t 决定（原库保证确定性），所以渲染、预览、截图结果一致。
 * 图片路径（cue.image、cue.frames、data.image）写成 public 下的相对路径，例如 "img/foo.png"。
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Cue = { at: number; kind: string; text?: string; sub?: string; data?: any; image?: string; frames?: string[]; fps?: number; loop?: boolean; i?: number };
export type HuashuSpec = {
  grammar: string;
  duration: number;
  fps?: number;
  width?: number;
  height?: number;
  theme?: any;
  finish?: any;
  safe?: { top?: number; bottom?: number; left?: number; right?: number; fill?: string };
  alpha?: boolean;
  data?: any;
  cues: Cue[];
};

const BASE = staticFile("vendor/huashu");
// 与原 clip.html 的加载顺序一致
const LIBS = ["fonts", "util", "paint", "palettes", "kit", "motion", "camera", "diagram", "typo", "chart", "ui", "collage", "media", "toon", "finish"];
const W_ = window as any;

const loadScript = (src: string) =>
  new Promise<void>((res, rej) => {
    if (document.querySelector(`script[data-hs="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.dataset.hs = src;
    s.onload = () => res();
    s.onerror = () => rej(new Error(`加载失败 ${src}`));
    document.head.appendChild(s);
  });

let libsReady: Promise<void> | null = null;
const loadLibs = () =>
  (libsReady ??= (async () => {
    W_.CLIPS = W_.CLIPS || {};
    for (const l of LIBS) {
      await loadScript(`${BASE}/lib/${l}.js`);
      // fonts.js 里的字体路径相对原 engine 目录，改成 public 下的绝对路径
      if (l === "fonts") W_.FONT_FACES = W_.FONT_FACES.map((f: any) => ({ ...f, url: `${BASE}/${f.url}` }));
    }
    // clip.js 给语法文件用的小工具（CLIP.lt / p / fit / sub / text），照原实现写
    const U = W_.U;
    W_.CLIP = {
      lt: (t: number, at: number, fps: number) => t - at + 1 / fps,
      p: (t: number, at: number, dur: number, fps: number) => U.clamp((t - at + 1 / fps) / dur),
      fit: (iw: number, ih: number, bx: number, by: number, bw: number, bh: number) => {
        const s = Math.min(bw / iw, bh / ih), w = iw * s, h = ih * s;
        return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h, s };
      },
      sub: (r: number[], box: any) => ({ x: box.x + r[0] * box.w, y: box.y + r[1] * box.h, w: r[2] * box.w, h: r[3] * box.h }),
      text: (cue: any, ...fb: any[]) => (cue && (cue.text ?? cue.data?.text)) ?? fb.find((v) => v != null) ?? "",
    };
    for (const f of W_.FONT_FACES) {
      const ff = new FontFace(f.family, `url(${f.url})`, f.desc || {});
      await ff.load();
      document.fonts.add(ff);
    }
    await document.fonts.ready;
    await U.loadCmaps();
  })());

const loadImg = (u: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error(`图片加载失败 ${u}`));
    im.src = /^(data:|https?:|\/)/.test(u) ? u : staticFile(u);
  });

/** 按原 clip.js 的 boot 逻辑搭 ctx（色板、质感层、cue 排序与过滤、safe 内容框、素材取帧） */
async function buildCtx(spec: HuashuSpec) {
  await loadLibs();
  await loadScript(`${BASE}/clips/${spec.grammar}.js`);
  const G = W_.CLIPS[spec.grammar];
  if (!G?.draw) throw new Error(`没有这个语法：${spec.grammar}`);
  const { U, PAL, FINISH, MD } = W_;
  const W = spec.width || 1920, H = spec.height || 1080, FPS = spec.fps || 30;
  const pal = G.legacyTheme && G.legacyTheme(spec.theme) ? null : PAL.resolve(spec.theme);
  const fin = FINISH.resolve(spec.finish);
  const urls = new Set<string>();
  for (const q of spec.cues || []) {
    if (q.image) urls.add(q.image);
    q.frames?.forEach((f) => urls.add(f));
  }
  if (spec.data?.image) urls.add(spec.data.image);
  const chr = spec.data?.character;
  if (chr && typeof chr === "object" && chr.frames) Object.values(chr.frames).forEach((f) => urls.add(f as string));
  const IMG: Record<string, HTMLImageElement> = {};
  await Promise.all([...urls].map(async (u) => (IMG[u] = await loadImg(u))));
  const cues = (spec.cues || [])
    .map((q, i) => ({ ...q, i, at: +q.at || 0 }))
    .sort((a, b) => a.at - b.at || a.i - b.i)
    .filter((q) => q.at <= spec.duration + 1e-9);
  for (const q of cues)
    if (q.kind === "number") {
      const cap = q.text ?? q.sub ?? q.data?.text;
      if (cap != null) {
        q.text = cap;
        q.sub = cap;
      }
    }
  const safe = { top: 0, bottom: 0, left: 0, right: 0, ...(spec.safe || {}) };
  const box = { x: safe.left, y: safe.top, w: W - safe.left - safe.right, h: H - safe.top - safe.bottom };
  const C = W_.CLIP;
  const ctx = {
    spec, data: spec.data || {}, theme: spec.theme || {}, pal, cues, W, H, FPS, u: Math.min(W, H) / 1080, portrait: H > W, alpha: !!spec.alpha, IMG, dur: spec.duration, safe, box,
    of: (...kinds: string[]) => cues.filter((q) => kinds.includes(q.kind)),
    lt: (t: number, at: number) => C.lt(t, at, FPS),
    p: (t: number, at: number, d: number) => C.p(t, at, d, FPS),
    still: (q: any) => q && (q.image ? IMG[q.image] : q.frames ? IMG[q.frames[0]] : null),
    frame: (q: any, t: number) => (!q ? null : q.frames ? MD.frameAt(q.frames.map((f: string) => IMG[f]), t - q.at, q.fps || 30, !!q.loop) : q.image ? IMG[q.image] : null),
  };
  U.setStage(W, H);
  if (G.init) G.init(ctx);
  const band = safe.fill && !spec.alpha
    ? (c: CanvasRenderingContext2D) => {
        c.fillStyle = safe.fill!;
        if (safe.top) c.fillRect(0, 0, W, safe.top);
        if (safe.bottom) c.fillRect(0, H - safe.bottom, W, safe.bottom);
        if (safe.left) c.fillRect(0, 0, safe.left, H);
        if (safe.right) c.fillRect(W - safe.right, 0, safe.right, H);
      }
    : null;
  return (c: CanvasRenderingContext2D, t: number) => {
    U.setStage(W, H); // 同一合成里有不同尺寸的片段时，每帧前切回本片段的画布尺寸
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, W, H);
    c.save();
    G.draw(c, Math.max(0, Math.min(t, spec.duration)), ctx);
    c.restore();
    if (fin && !spec.alpha) FINISH.apply(c, t, fin, W, H, FPS);
    if (band) band(c);
  };
}

export const HuashuClip: React.FC<{ spec: HuashuSpec; t: number; style?: React.CSSProperties }> = ({ spec, t, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [draw, setDraw] = useState<((c: CanvasRenderingContext2D, t: number) => void) | null>(null);
  const [handle] = useState(() => delayRender(`huashu ${spec.grammar}`, { timeoutInMilliseconds: 120000 }));
  const key = JSON.stringify(spec);
  useEffect(() => {
    let live = true;
    buildCtx(spec)
      .then((d) => {
        if (!live) return;
        setDraw(() => d);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d");
    if (c && draw) draw(c, t);
  }, [draw, t]);
  const W = spec.width || 1920, H = spec.height || 1080;
  return <canvas ref={ref} width={W} height={H} style={{ width: W, height: H, ...style }} />;
};
