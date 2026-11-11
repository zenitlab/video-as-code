// Q 版小人讲解片 · 引擎（和题材无关）
// 手法全部从抖音「韩愈三封求职信」（D1）逐帧实测，见 拆解/同账号另两只/拆解结论.md「三、D1 · 逐帧细拆」。
// 内容文件 scenes.js 提供：DURATION、SCENES = [[起始秒, 场景函数], …]、PAGES（字幕）、overlay(t)、CUES（拟音）。

const W = 1920, H = 1080;
const cv = document.getElementById('c'), m = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const B = mk(), g0 = B.getContext('2d');
const SA = mk(), SB = mk();
let g = g0;
// 字体：macOS 用自带的宋体-简和苹方；Windows、Linux 请装免费的思源宋体（Noto Serif SC），否则退到 SimSun 等，粗细和字形会不一样
const SERIF = '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", "Source Han Serif CN", "Noto Serif CJK SC", "SimSun", serif';
const SANS = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "Noto Sans CJK SC", sans-serif';
const COL = { text: '#f4efe4', blue: '#8fc4ea', red: '#e2493c', ink: '#1a1410', skin: '#ecdfcd', blush: '236,138,132', gold: '255,196,110' };

// ---------- 工具 ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eout = k => 1 - Math.pow(1 - k, 3);
const ein = k => k * k * k;
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eback = k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const at = (t, t0, dur = .3) => eout(prog(t, t0, t0 + dur));
// 弹簧：t0 时刻被拨一下，之后衰减振荡（帽翅、发带、胡子用）
const spring = (t, t0, amp, f = 6, tau = .22) => t < t0 ? 0 : amp * Math.exp(-(t - t0) / tau) * Math.cos(6.283 * f * (t - t0));
// 关键帧插值：keys = [[t, v], …]，段间缓动 ease
function kf(t, keys, ease = eio) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const [t0, a] = keys[i - 1], [t1, b] = keys[i]; const k = (keys[i][2] || ease)((t - t0) / (t1 - t0)); return a + (b - a) * k; }
  return keys[keys.length - 1][1];
}
// 抖：高频小幅抖动（举拳发抖、咳嗽）
const shake = (t, amp, f = 22, seed = 0) => amp * Math.sin(t * f * 6.283 + seed) * Math.sin(t * f * 4.1 + seed * 2);
let curT = 0;

// ---------- 光斑 / 纹理 ----------
const glowSpr = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,232,180,1)'); gr.addColorStop(.2, 'rgba(255,190,105,.7)'); gr.addColorStop(.55, 'rgba(220,120,45,.2)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return c; })();
function glow(x, y, r, a = 1) { if (a <= .004 || r < 1) return; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.min(1, a); g.drawImage(glowSpr, x - r, y - r, 2 * r, 2 * r); g.restore(); }
// 颗粒：D1 全片有细颗粒。做 4 张静态噪点轮换（每 2 帧换一张），比逐帧随机省体积又不显得死
const grains = [0, 1, 2, 3].map(s => { const c = document.createElement('canvas'); c.width = 960; c.height = 540; const x = c.getContext('2d'), d = x.createImageData(960, 540), r = rng(77 + s); for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - .5) * 90; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return c; });
function grain(a = .07) { g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = a; g.drawImage(grains[Math.floor(curT * 15) % 4], 0, 0, W, H); g.restore(); }
function shadow(x, y, w, a = .5) { g.save(); const gr = g.createRadialGradient(x, y, 0, x, y, w); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.translate(x, y); g.scale(1, .2); g.translate(-x, -y); g.beginPath(); g.arc(x, y, w, 0, 6.283); g.fill(); g.restore(); }
// 浮尘 / 萤火：暖光里慢慢飘
function motes(t, cx, cy, rad, n = 30, seed = 7, col = '255,214,150') {
  const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const a0 = r() * 6.283, d = rad * Math.sqrt(r()), sp = .2 + r() * .5, ph = r() * 6.283;
    const x = cx + Math.cos(a0) * d + Math.sin(t * sp + ph) * 30, y = cy + Math.sin(a0) * d * .6 + Math.cos(t * sp * .8 + ph) * 22 - (t * 8 * sp) % 60;
    const al = (.25 + .35 * r()) * (.5 + .5 * Math.sin(t * 2 + ph)); g.fillStyle = `rgba(${col},${al})`; g.beginPath(); g.arc(x, y, 1.6 + 2 * r(), 0, 6.283); g.fill(); }
  g.restore();
}

// ---------- Q 版小人 ----------
// 比例按 D1 门卫近景量（头直径 D）：头底在脚上 1.04D，头顶 2.04D，帽子再高 0.08D；头占身高约 47%。
// 身体：圆角梯形，上宽 0.7D、下宽 0.95D，腰带在身体 55% 高度；脚两团深色，大半被袍子挡住。
// 手：垂着时没有胳膊，两只圆手贴在身体前面（arm = null）；比划时才画袖子（arm = 角度，0 朝下、π/2 水平向外、π 朝上）。
// 整体是刚体：lean 以脚为轴前后倾，rot 以身体中心转（翻跟头），sx/sy 以脚为轴拉伸压扁。
// o: { x, y, D, robe, robe2, who, face:{eye, mouth, brow, look:[x,y]}, armL, armR, fistL, fistR, lean, rot, sx, sy, lift（离地高度）,
//      hair（张良的发带 / 老头的胡子摆动角）, bun（发髻上下弹）, feetL, feetR（抬脚 [dx,dy]）, barefootR（右脚没鞋）, flush（脸红 0..1）, cane }
function chibi(o) {
  const D = o.D, x = o.x, y = o.y - (o.lift || 0);
  if (o.shadow !== false) shadow(o.x, o.y + 2, D * .55 * (1 - .4 * clamp((o.lift || 0) / (D * 1.5))), .5 * (1 - .5 * clamp((o.lift || 0) / (D * 1.5))));
  g.save(); g.translate(x, y); g.rotate(o.lean || 0); g.scale(o.sx || 1, o.sy || 1);
  if (o.rot) { g.translate(0, -D); g.rotate(o.rot); g.translate(0, D); }
  g.scale(D, D);   // 以下全用 D 为单位
  g.lineCap = 'round'; g.lineJoin = 'round';
  // 脚
  const foot = (fx, off, bare, stomp) => { g.fillStyle = bare ? '#e6dccb' : '#231a14'; const big = bare && off[0] > .2 ? 1.4 : stomp ? 1.7 : 1; g.beginPath(); g.ellipse(fx + off[0], -.055 + off[1], .12 * big, .065 * big, 0, 0, 6.283); g.fill(); if (stomp) { g.fillStyle = '#e6dac4'; g.fillRect(fx + off[0] - .2, -.02 + off[1], .4, .04); } };
  foot(-.2, o.feetL || [0, 0], false, o.stompL); foot(.2, o.feetR || [0, 0], o.barefootR, o.stompR);
  // 身体（圆角梯形 + 上暗下亮 + 头的投影）
  const robe = o.robe || '#8b8478', robe2 = o.robe2 || '#6c665c';
  const body = () => { g.beginPath(); g.moveTo(-.27, -1.1); g.lineTo(.27, -1.1); g.quadraticCurveTo(.33, -1.1, .34, -1.02); g.lineTo(.49, -.19); g.quadraticCurveTo(.5, -.11, .43, -.11); g.lineTo(-.43, -.11); g.quadraticCurveTo(-.5, -.11, -.49, -.19); g.lineTo(-.34, -1.02); g.quadraticCurveTo(-.33, -1.1, -.27, -1.1); g.closePath(); };
  const bg_ = g.createLinearGradient(0, -1.1, 0, -.1); bg_.addColorStop(0, robe2); bg_.addColorStop(.45, robe); bg_.addColorStop(1, robe);
  g.fillStyle = bg_; body(); g.fill();
  g.save(); body(); g.clip();
  const hs = g.createRadialGradient(0, -.98, 0, 0, -.98, .5); hs.addColorStop(0, 'rgba(0,0,0,.32)'); hs.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hs; g.fillRect(-.6, -1.2, 1.2, .7);   // 头的投影
  const sd = g.createLinearGradient(-.5, 0, .5, 0); sd.addColorStop(0, 'rgba(0,0,0,.18)'); sd.addColorStop(.35, 'rgba(0,0,0,0)'); sd.addColorStop(.75, 'rgba(255,255,255,.04)'); sd.addColorStop(1, 'rgba(0,0,0,.16)'); g.fillStyle = sd; g.fillRect(-.6, -1.2, 1.2, 1.2);   // 两侧暗
  g.fillStyle = COL.ink; g.fillRect(-.6, -.55, 1.2, .055);   // 腰带
  if (o.buckle) { g.fillStyle = '#d9a94e'; g.fillRect(-.06, -.565, .12, .085); }
  if (o.patch) { g.fillStyle = 'rgba(160,140,110,.85)'; g.fillRect(-.36, -.42, .2, .18); g.fillRect(.14, -.85, .16, .14); g.strokeStyle = 'rgba(60,45,30,.6)'; g.lineWidth = .012; g.setLineDash([.03, .025]); g.strokeRect(-.36, -.42, .2, .18); g.strokeRect(.14, -.85, .16, .14); g.setLineDash([]); }
  g.strokeStyle = 'rgba(245,235,215,.55)'; g.lineWidth = .022; g.beginPath(); g.moveTo(-.18, -.99); g.quadraticCurveTo(0, -.8, .18, -.99); g.stroke();   // 领线（交领示意）
  g.restore();
  // 胡子（老头）：在身体前、头下
  if (o.who === 'old') beard(o.hair || 0, o.face && o.face.mouth, (o.face && o.face.look ? o.face.look[0] : 0) * .03);
  // 手 / 袖
  const arm = (side, a, fist) => {
    const sx = side * .27, sy = -.92;
    if (a == null) { g.fillStyle = COL.skin; g.beginPath(); g.arc(side * .2, -.5, .085, 0, 6.283); g.fill(); return; }
    g.save(); g.translate(sx, sy); g.rotate(-side * a);
    g.fillStyle = robe2; g.beginPath(); g.moveTo(-.12, -.02); g.quadraticCurveTo(0, -.06, .12, -.02); g.lineTo(.13, .36); g.quadraticCurveTo(0, .42, -.13, .36); g.closePath(); g.fill();
    g.fillStyle = robe; g.beginPath(); g.moveTo(-.1, 0); g.lineTo(.09, 0); g.lineTo(.1, .33); g.quadraticCurveTo(0, .38, -.11, .33); g.closePath(); g.fill();
    g.fillStyle = COL.skin; g.beginPath(); g.arc(0, .44, fist ? .1 : .085, 0, 6.283); g.fill();
    if (fist) { g.strokeStyle = 'rgba(120,80,60,.6)'; g.lineWidth = .015; g.beginPath(); g.moveTo(-.05, .42); g.lineTo(.05, .42); g.stroke(); }
    if (o.cane && side === o.cane) { g.translate(0, .44); g.rotate(side * a + (o.lean || 0) * 0); g.strokeStyle = '#6b4a2c'; g.lineWidth = .045; g.beginPath(); g.moveTo(0, -.12); g.lineTo(o.caneDX || 0, o.caneLen || .5); g.stroke(); g.fillStyle = '#7a5634'; g.beginPath(); g.arc(0, -.12, .05, 0, 6.283); g.fill(); }
    g.restore();
  };
  // 头（米白圆 + 脸 + 头饰）
  const hy = -1.47;
  g.save(); g.translate(0, hy);
  if (o.who === 'zl') ribbons(o.hair || 0, o.bun || 0);
  g.fillStyle = COL.skin; g.beginPath(); g.arc(0, 0, .5, 0, 6.283); g.fill();
  const hsh = g.createRadialGradient(-.15, -.2, .1, 0, 0, .55); hsh.addColorStop(0, 'rgba(255,255,255,.08)'); hsh.addColorStop(.7, 'rgba(0,0,0,0)'); hsh.addColorStop(1, 'rgba(90,60,40,.18)'); g.fillStyle = hsh; g.beginPath(); g.arc(0, 0, .5, 0, 6.283); g.fill();
  if (o.flush) { g.fillStyle = `rgba(226,80,60,${.35 * o.flush})`; g.beginPath(); g.arc(0, .05, .5, 0, 6.283); g.fill(); }
  face(o.face || {}, o.who);
  const bx = (o.face && o.face.look ? o.face.look[0] : 0) * .03;   // 胡子跟着嘴偏（嘴的偏移是 look × 0.03）
  g.save(); g.translate(bx, 0);
  if (o.beard === 'black') { g.fillStyle = '#1b1612'; g.beginPath(); g.moveTo(-.42, .05); g.quadraticCurveTo(-.45, .55, 0, .62); g.quadraticCurveTo(.45, .55, .42, .05); g.quadraticCurveTo(.3, .3, .12, .2); g.quadraticCurveTo(0, .28, -.12, .2); g.quadraticCurveTo(-.3, .3, -.42, .05); g.fill(); }
  if (o.beard === 'goatee') { g.fillStyle = '#1b1612'; g.beginPath(); g.moveTo(-.06, .31); g.lineTo(.06, .31); g.lineTo(0, .47); g.closePath(); g.fill(); g.strokeStyle = '#1b1612'; g.lineWidth = .028; g.lineCap = 'round'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * .035, .155); g.quadraticCurveTo(s * .11, .14, s * .16, .19); g.stroke(); } }
  g.restore();
  if (o.who === 'zl') hairZL(o.hair || 0, o.bun || 0);
  else if (o.who === 'old') hairOld(o.bun || 0);
  else if (o.who === 'guard') capWing(o.hair || 0);
  else headgear(o.who, o.hair || 0, o.bun || 0);
  g.restore();
  // 手放最后（举拳时压在脸前面）
  if (o.armBehind) { /* 预留 */ }
  arm(-1, o.armL, o.fistL); arm(1, o.armR, o.fistR);
  g.restore();
}
// 脸：五官换形，头不变；表情硬切
function face(f, who) {
  const lx = (f.look ? f.look[0] : 0) * .06, ly = (f.look ? f.look[1] : 0) * .05;
  const ex = .17, ey = .05 + ly;
  g.strokeStyle = COL.ink; g.fillStyle = COL.ink; g.lineWidth = .036;
  // 腮红
  for (const s of [-1, 1]) { const gr = g.createRadialGradient(s * .29, .19, 0, s * .29, .19, .11); gr.addColorStop(0, `rgba(${COL.blush},.75)`); gr.addColorStop(1, `rgba(${COL.blush},0)`); g.fillStyle = gr; g.beginPath(); g.ellipse(s * .29, .19, .12, .08, 0, 0, 6.283); g.fill(); }
  g.fillStyle = COL.ink;
  const e = f.eye || 'dot';
  for (const s of [-1, 1]) {
    const cx = s * ex + lx, cy = ey;
    g.beginPath();
    if (e === 'dot') { g.arc(cx, cy, .045, 0, 6.283); g.fill(); }
    else if (e === 'wide') { g.fillStyle = '#fff'; g.arc(cx, cy, .085, 0, 6.283); g.fill(); g.lineWidth = .022; g.stroke(); g.fillStyle = COL.ink; g.beginPath(); g.arc(cx + lx * .6, cy + ly * .6, .042, 0, 6.283); g.fill(); g.lineWidth = .036; }
    else if (e === 'xx') { g.moveTo(cx - s * .06, cy - .055); g.lineTo(cx + s * .05, cy); g.lineTo(cx - s * .06, cy + .055); g.stroke(); }
    else if (e === 'happy') { g.arc(cx, cy + .03, .06, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else if (e === 'line') { g.moveTo(cx - .065, cy); g.lineTo(cx + .065, cy); g.stroke(); }
    else if (e === 'close') { g.arc(cx, cy - .02, .06, Math.PI * .15, Math.PI * .85); g.stroke(); }
    else if (e === 'smug') { g.arc(cx + .01, cy + .015, .04, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(cx - .08, cy - .045 + (s > 0 ? .0 : .0)); g.lineTo(cx + .08, cy - .045); g.stroke(); }
    else if (e === 'angry') { g.arc(cx, cy + .02, .045, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(cx - s * .1, cy - .1); g.lineTo(cx + s * .03, cy - .05); g.stroke(); }
    else if (e === 'tight') { g.moveTo(cx - .07, cy - .03); g.lineTo(cx + .07, cy + .02 * s * 0); g.moveTo(cx - .07, cy + .02); g.lineTo(cx + .07, cy + .02); g.stroke(); }
  }
  // 老头的白眉毛
  if (who === 'old') { g.save(); g.fillStyle = '#f3eee4'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * (ex + .02) + lx, ey - .1, .1, .04, s * -.25, 0, 6.283); g.fill(); } g.restore(); }
  // 嘴
  const mo = f.mouth || 'small', mx = lx * .5, my = .21 + ly * .5;
  g.beginPath();
  if (mo === 'small') { g.arc(mx, my, .022, 0, 6.283); g.fill(); }
  else if (mo === 'o') { g.ellipse(mx, my + .01, .04, .05, 0, 0, 6.283); g.fill(); }
  else if (mo === 'O') { g.fillStyle = '#5a2620'; g.ellipse(mx, my + .02, .065, .08, 0, 0, 6.283); g.fill(); g.fillStyle = COL.ink; }
  else if (mo === 'smile') { g.arc(mx, my - .04, .07, Math.PI * .2, Math.PI * .8); g.stroke(); }
  else if (mo === 'smirk') { g.moveTo(mx - .07, my - .005); g.quadraticCurveTo(mx, my + .05, mx + .08, my - .04); g.stroke(); }
  else if (mo === 'grin') { g.fillStyle = '#5a2620'; g.moveTo(mx - .1, my - .02); g.lineTo(mx + .1, my - .02); g.quadraticCurveTo(mx + .09, my + .12, mx, my + .12); g.quadraticCurveTo(mx - .09, my + .12, mx - .1, my - .02); g.fill(); g.fillStyle = '#e07a70'; g.beginPath(); g.ellipse(mx, my + .085, .045, .028, 0, 0, 6.283); g.fill(); g.fillStyle = COL.ink; }
  else if (mo === 'wave') { g.lineWidth = .028; g.moveTo(mx - .09, my); for (let i = 1; i <= 6; i++) g.lineTo(mx - .09 + i * .03, my + (i % 2 ? -.022 : .022)); g.stroke(); g.lineWidth = .036; }
  else if (mo === 'grit') { g.fillStyle = '#fff'; g.roundRect(mx - .09, my - .03, .18, .07, .02); g.fill(); g.lineWidth = .02; g.stroke(); g.beginPath(); g.moveTo(mx - .09, my + .005); g.lineTo(mx + .09, my + .005); for (let i = -1; i <= 1; i++) { g.moveTo(mx + i * .045, my - .03); g.lineTo(mx + i * .045, my + .04); } g.stroke(); g.lineWidth = .036; g.fillStyle = COL.ink; }
  else if (mo === 'flat') { g.moveTo(mx - .06, my); g.lineTo(mx + .06, my); g.stroke(); }
  else if (mo === 'frown') { g.arc(mx, my + .06, .06, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
  else if (mo === 'puff') { g.fillStyle = COL.ink; g.ellipse(mx, my, .03, .035, 0, 0, 6.283); g.fill(); }
}
// 张良：黑发盖住头顶上 1/4（和 D1 官帽同一个剪影位置），顶上发髻 + 一根横簪（横出两边，像小帽翅），脑后两条发带会飘
function hairZL(sw, bun) {
  g.fillStyle = '#1b1612';
  g.beginPath(); g.arc(0, 0, .505, Math.PI * 1.06, Math.PI * 1.94); g.quadraticCurveTo(.3, -.2, 0, -.24); g.quadraticCurveTo(-.3, -.2, -.49, -.12); g.closePath(); g.fill();   // 发际线：中间微微下凹
  g.fillStyle = '#1b1612'; g.beginPath(); g.arc(0, -.6 - bun, .15, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(-.05, -.66 - bun, .05, 0, 6.283); g.fill();
  g.strokeStyle = '#d8c79a'; g.lineWidth = .04; g.beginPath(); g.moveTo(-.27, -.6 - bun + sw * .06); g.lineTo(.27, -.6 - bun - sw * .06); g.stroke();   // 横簪
  g.fillStyle = '#d8c79a'; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * .27, -.6 - bun - s * sw * .06, .035, 0, 6.283); g.fill(); }
}
// 发带：从发髻垂到脑后两侧，露出头边的部分会飘（sw 摆动角）
function ribbons(sw, bun) {
  g.strokeStyle = '#6a8fb5'; g.lineWidth = .065; g.lineCap = 'round';
  for (const s of [-1, 1]) { const a = sw * 1.2; g.beginPath(); g.moveTo(s * .05, -.6 - bun); g.bezierCurveTo(s * .2, -.66 - bun, s * .3, -.55 - bun - a * .25, s * .36, -.42 - bun - a * .45 + .04 * Math.sin(curT * 5 + s)); g.stroke(); }
}
// 其他人的头饰：king 韩王金冠、guan 相国高冠、qin 秦兵铁盔红缨、strong 大力士红头巾、lb 刘邦竹皮冠、smq 司马迁小冠
function blackHair() { g.fillStyle = '#1b1612'; g.beginPath(); g.arc(0, 0, .505, Math.PI * 1.06, Math.PI * 1.94); g.quadraticCurveTo(.3, -.2, 0, -.24); g.quadraticCurveTo(-.3, -.2, -.49, -.12); g.closePath(); g.fill(); }
function headgear(who, sw, bun) {
  if (who === 'king') { blackHair(); g.fillStyle = '#e0b04a'; g.beginPath(); g.moveTo(-.3, -.36); g.lineTo(-.34, -.7 - bun); g.lineTo(-.17, -.52); g.lineTo(0, -.78 - bun); g.lineTo(.17, -.52); g.lineTo(.34, -.7 - bun); g.lineTo(.3, -.36); g.closePath(); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(0, -.46, .05, 0, 6.283); g.fill(); g.strokeStyle = '#f7d98a'; g.lineWidth = .02; g.beginPath(); g.moveTo(-.3, -.38); g.lineTo(.3, -.38); g.stroke(); }
  else if (who === 'guan') { blackHair(); g.fillStyle = '#1b1612'; g.beginPath(); g.roundRect(-.13, -.86 - bun, .26, .44, .05); g.fill(); }
  else if (who === 'qin') { g.fillStyle = '#2b2a2e'; g.beginPath(); g.arc(0, 0, .53, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(.53, -.06); g.lineTo(-.53, -.06); g.closePath(); g.fill(); g.fillStyle = '#45444a'; g.fillRect(-.53, -.12, 1.06, .08); g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.ellipse(-.2, -.35, .12, .05, -.5, 0, 6.283); g.fill(); g.fillStyle = '#b8322a'; g.beginPath(); g.moveTo(0, -.52); g.quadraticCurveTo(.12 + sw * .2, -.75, .05 + sw * .3, -.85 - bun); g.quadraticCurveTo(-.08, -.75, 0, -.52); g.fill(); }
  else if (who === 'xy') { g.fillStyle = '#2b2a2e'; g.beginPath(); g.arc(0, 0, .53, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(.53, -.06); g.lineTo(-.53, -.06); g.closePath(); g.fill(); g.fillStyle = '#d9a64e'; g.fillRect(-.53, -.12, 1.06, .08); g.beginPath(); g.moveTo(-.08, -.5); g.lineTo(0, -.66); g.lineTo(.08, -.5); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(0, -.62); g.quadraticCurveTo(.3 + sw * .3, -.95, .5 + sw * .4, -.8 - bun); g.quadraticCurveTo(.2, -.75, 0, -.62); g.fill(); }
  else if (who === 'fx') { blackHair(); g.fillStyle = '#1b1612'; g.beginPath(); g.arc(.05, -.56 - bun, .13, 0, 6.283); g.fill(); g.strokeStyle = '#8a7a5a'; g.lineWidth = .05; g.beginPath(); g.moveTo(-.1, -.5 - bun); g.lineTo(.18, -.56 - bun); g.stroke(); g.strokeStyle = '#1b1612'; g.lineWidth = .035; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * .3, -.22); g.quadraticCurveTo(s * .42 + sw * .05, -.02, s * .36, .12); g.stroke(); } }
  else if (who === 'granny') { g.fillStyle = '#e8e2d6'; g.beginPath(); g.arc(0, 0, .505, Math.PI * 1.06, Math.PI * 1.94); g.quadraticCurveTo(.3, -.2, 0, -.24); g.quadraticCurveTo(-.3, -.2, -.49, -.12); g.closePath(); g.fill(); g.beginPath(); g.arc(0, -.56 - bun, .14, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(120,110,100,.5)'; g.lineWidth = .012; for (const s of [-.2, 0, .2]) { g.beginPath(); g.moveTo(s, -.46); g.quadraticCurveTo(s * 1.3, -.32, s * 1.6, -.2); g.stroke(); } }
  else if (who === 'bun') { blackHair(); g.fillStyle = '#1b1612'; g.beginPath(); g.arc(0, -.58 - bun, .12, 0, 6.283); g.fill(); g.strokeStyle = '#c9a56a'; g.lineWidth = .03; g.beginPath(); g.moveTo(-.12, -.56 - bun); g.lineTo(.12, -.56 - bun); g.stroke(); }
  else if (who === 'strong') { g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(-.15, -.32, .12, .05, -.5, 0, 6.283); g.fill(); g.fillStyle = '#b8322a'; g.fillRect(-.5, -.3, 1.0, .1); g.beginPath(); g.moveTo(.45, -.27); g.lineTo(.62 + sw * .1, -.2); g.lineTo(.58 + sw * .15, -.05); g.closePath(); g.fill(); }
  else if (who === 'lb') { blackHair(); g.fillStyle = '#8a6a3a'; g.beginPath(); g.roundRect(-.1, -.92 - bun, .2, .5, .04); g.fill(); g.fillStyle = '#6a4e28'; g.fillRect(-.12, -.5, .24, .07); }
  else if (who === 'smq') { blackHair(); g.fillStyle = '#1b1612'; g.beginPath(); g.roundRect(-.11, -.72 - bun, .22, .26, .04); g.fill(); g.strokeStyle = '#d8c79a'; g.lineWidth = .03; g.beginPath(); g.moveTo(-.2, -.6 - bun); g.lineTo(.2, -.6 - bun); g.stroke(); }
}
// 老头：秃顶发亮，两鬓白发团，顶上一个小白髻
function hairOld(bun) {
  g.fillStyle = '#f3eee4';
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * .45, -.06, .09, .17, s * .25, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(s * .4, -.22, .07, .08, 0, 0, 6.283); g.fill(); }
  g.beginPath(); g.arc(0, -.52 - bun, .1, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-.15, -.3, .1, .05, -.5, 0, 6.283); g.fill();   // 秃顶高光
}
// 老头的长白胡子：从下巴挂到胸前，跟着动作摆（sw），说话时嘴会在胡子上开合
function beard(sw, mouth, bx = 0) {
  g.save(); g.translate(bx, -1.23); g.rotate(clamp(sw, -1, 1) * .12);
  g.fillStyle = '#f3eee4'; g.beginPath(); g.moveTo(-.3, -.12); g.quadraticCurveTo(-.32, .25, -.05, .55); g.lineTo(0, .62); g.lineTo(.05, .55); g.quadraticCurveTo(.32, .25, .3, -.12); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(160,150,135,.6)'; g.lineWidth = .016; for (const s of [-.12, 0, .12]) { g.beginPath(); g.moveTo(s, .05); g.quadraticCurveTo(s * 1.3, .3, s * .4, .5); g.stroke(); }
  g.restore();
}
// 官帽 + 两根帽翅（D1 门卫样式，备用）
function capWing(w) {
  g.fillStyle = '#16120f'; g.beginPath(); g.moveTo(-.48, -.22); g.quadraticCurveTo(-.45, -.62, 0, -.6); g.quadraticCurveTo(.45, -.62, .48, -.22); g.closePath(); g.fill();
  g.lineWidth = .07; g.strokeStyle = '#16120f';
  for (const s of [-1, 1]) { const a = w * s; g.save(); g.translate(s * .4, -.3); g.rotate(-s * (.08 + w)); g.beginPath(); g.moveTo(0, 0); g.lineTo(s * .45, 0); g.stroke(); g.beginPath(); g.arc(s * .45, 0, .06, 0, 6.283); g.fill(); g.restore(); }
}

// ---------- 漫画符号 ----------
// 弹出字 / 符号：1.4 倍弹出 → 落定，ttl 后淡出
function pop(t, t0, str, x, y, size, o = {}) {
  const ttl = o.ttl ?? 1.2; if (t < t0 || t > t0 + ttl + .2) return;
  const k = prog(t, t0, t0 + .18), out = prog(t, t0 + ttl, t0 + ttl + .2), sc = (o.noPop ? 1 : (k < 1 ? lerp(.3, 1.25, eout(k)) : 1 + .25 * Math.exp(-(t - t0 - .18) / .06))) ;
  g.save(); g.translate(x, y + (o.rise ? -(t - t0) * o.rise : 0)); g.rotate(o.rot || 0); g.scale(sc, sc); g.globalAlpha = (1 - out) * (o.alpha ?? 1);
  g.font = `${o.weight || 900} ${size}px ${o.font || SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (o.stroke !== false) { g.lineWidth = size * .12; g.strokeStyle = 'rgba(20,14,10,.8)'; g.strokeText(str, 0, 0); }
  g.fillStyle = o.col || COL.text; g.fillText(str, 0, 0); g.restore();
}
// 怒气符号（四瓣青筋）
function vein(t, t0, x, y, s, tOut = 1e9) {
  if (t < t0 || t > tOut + .15) return; const k = eback(prog(t, t0, t0 + .15)), pul = 1 + .12 * Math.sin((t - t0) * 18), a = 1 - prog(t, tOut, tOut + .15);
  g.save(); g.translate(x, y); g.scale(s * k * pul, s * k * pul); g.globalAlpha = a; g.strokeStyle = '#e2493c'; g.lineWidth = .18; g.lineCap = 'round';
  for (let i = 0; i < 4; i++) { g.save(); g.rotate(i * Math.PI / 2 + .78); g.beginPath(); g.moveTo(.18, .5); g.quadraticCurveTo(.2, .2, .5, .18); g.stroke(); g.restore(); }
  g.restore();
}
// 冒烟（生气）：头顶两侧往上飘的小灰团
function steam(t, t0, t1, x, y, s) {
  if (t < t0 || t > t1 + .8) return; g.save();
  for (let i = 0; i < 6; i++) { const ph = ((t - t0) * 1.6 + i / 6) % 1, born = t0 + (i / 6) / 1.6; if (t < born || (t > t1 && t - (t - t0 - ph / 1.6) > t1 + .8)) continue;
    const side = i % 2 ? 1 : -1, xx = x + side * s * (.3 + ph * .5), yy = y - ph * s * 1.1, r = s * (.12 + ph * .18);
    g.globalAlpha = .7 * Math.sin(ph * Math.PI) * (t > t1 ? 1 - prog(t, t1, t1 + .6) : 1); g.fillStyle = '#d8d2c6'; g.beginPath(); g.arc(xx, yy, r, 0, 6.283); g.arc(xx + r * .7, yy + r * .2, r * .75, 0, 6.283); g.fill(); }
  g.restore();
}
// 扬尘：落地 / 弹开时脚边一圈小灰点
function dust(t, t0, x, y, s, n = 8, seed = 3) {
  const k = prog(t, t0, t0 + .5); if (k <= 0 || k >= 1) return; const r = rng(seed); g.save();
  for (let i = 0; i < n; i++) { const dir = (i / (n - 1) - .5) * 2.6, d = s * (.4 + r() * .6) * eout(k); g.globalAlpha = .65 * (1 - k); g.fillStyle = '#cfc6b6';
    g.beginPath(); g.arc(x + Math.sin(dir) * d * 1.4, y - Math.abs(Math.cos(dir)) * d * .35 - k * s * .15, s * (.05 + .05 * r()) * (1 + k), 0, 6.283); g.fill(); }
  g.restore();
}
// 白色椭圆残影（D1 闪身后脚下那一圈）
function ring(t, t0, cx, cy, rx, ry, dur = .7, w = 3) {
  const k = prog(t, t0, t0 + dur); if (k <= 0 || k >= 1) return; const e = eout(k);
  g.save(); g.strokeStyle = `rgba(240,232,218,${.75 * (1 - k)})`; g.lineWidth = w; g.beginPath(); g.ellipse(cx, cy, rx * (.5 + .5 * e), ry * (.5 + .5 * e), 0, 0, 6.283); g.stroke(); g.restore();
}
// 速度线
function speedLines(t, t0, t1, x, y, dir, len, n = 5, seed = 2) {
  if (t < t0 || t > t1) return; const k = prog(t, t0, t1), r = rng(seed); g.save(); g.strokeStyle = 'rgba(240,232,218,.6)'; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < n; i++) { const yy = y + (r() - .5) * len * .6, l = len * (.4 + .6 * r()); g.globalAlpha = Math.sin(k * Math.PI); g.beginPath(); g.moveTo(x - dir * l * .2, yy); g.lineTo(x - dir * l, yy); g.stroke(); }
  g.restore();
}
// 汗滴
function sweat(t, t0, x, y, s, dur = 1) {
  const k = prog(t, t0, t0 + dur); if (k <= 0 || k >= 1) return;
  g.save(); g.translate(x, y + k * s * .5); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 3) * Math.min(1, k * 8);
  g.fillStyle = '#a9d4ef'; g.beginPath(); g.moveTo(0, -.25); g.quadraticCurveTo(.16, 0, .12, .1); g.arc(0, .08, .12, 0, Math.PI); g.quadraticCurveTo(-.16, 0, 0, -.25); g.fill();
  g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(-.04, .06, .03, 0, 6.283); g.fill(); g.restore();
}
// 呼气（泄气）：嘴边吐出一团云往旁边飘散
function puffCloud(t, t0, x, y, s, dir = 1) {
  const k = prog(t, t0, t0 + .9); if (k <= 0 || k >= 1) return; g.save(); g.globalAlpha = .8 * (1 - k); g.fillStyle = '#e8e2d6';
  const cx = x + dir * s * (.2 + k * 1.0), cy = y - k * s * .2, r = s * (.15 + .25 * eout(k));
  g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.arc(cx + dir * r * .8, cy - r * .3, r * .7, 0, 6.283); g.arc(cx - dir * r * .6, cy + r * .2, r * .6, 0, 6.283); g.fill(); g.restore();
}
// 音符
function notes(t, t0, t1, x, y, s) {
  if (t < t0 || t > t1 + .6) return; g.save(); g.fillStyle = '#efe6d2'; g.font = `700 ${s}px ${SANS}`; g.textAlign = 'center';
  for (let i = 0; i < 3; i++) { const ph = ((t - t0) * .7 + i / 3) % 1; g.globalAlpha = Math.sin(ph * Math.PI) * (1 - prog(t, t1, t1 + .6)); g.fillText(i % 2 ? '♪' : '♫', x + i * s * .5 + Math.sin((t + i) * 3) * 8, y - ph * s * 2); }
  g.restore();
}
// 网页式小标签（D1「闪身步」那种，左边一条竖线 + 小字）
function tag(t, t0, t1, x, y, str, size = 30) {
  const a = at(t, t0, .25) * (1 - prog(t, t1, t1 + .25)); if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.font = `600 ${size}px ${SERIF}`; const w = g.measureText(str).width;
  g.fillStyle = 'rgba(18,14,12,.72)'; g.beginPath(); g.roundRect(x - 14, y - size * .85, w + 34, size * 1.5, 4); g.fill();
  g.fillStyle = 'rgba(232,200,140,.9)'; g.fillRect(x - 14, y - size * .85, 4, size * 1.5);
  g.fillStyle = '#efe6d4'; g.textBaseline = 'middle'; g.fillText(str, x + 4, y - size * .1); g.restore();
}
// 原文卷轴：竖幅，从上往下展开；原文竖排（〔〕里的字标红），底下一行小字出处
function scrollV(t, t0, t1, x, y, w, h, text, src) {
  if (t < t0) return; const k = eout(prog(t, t0, t0 + .35)), out = prog(t, t1, t1 + .3); if (out >= 1) return;
  g.save(); g.globalAlpha = 1 - out; g.translate(x, y + Math.sin((t - t0) * 1.6) * 3);
  const hh = h * k;
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-w / 2 + 10, 12, w, hh);
  const pg = g.createLinearGradient(0, 0, 0, h); pg.addColorStop(0, '#efe3c6'); pg.addColorStop(1, '#ddcca6'); g.fillStyle = pg; g.fillRect(-w / 2, 0, w, hh);
  g.strokeStyle = 'rgba(120,90,50,.45)'; g.lineWidth = 2; g.strokeRect(-w / 2 + 10, 10, w - 20, Math.max(0, hh - 20));
  g.fillStyle = '#5a3b22'; g.fillRect(-w / 2 - 12, -10, w + 24, 16); g.fillRect(-w / 2 - 12, hh - 6, w + 24, 16);   // 上下轴
  g.save(); g.beginPath(); g.rect(-w / 2, 0, w, hh); g.clip();
  const size = w * .34; let yy = 28 + size * .6, red = false;
  g.font = `900 ${size}px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const ch of text) { if (ch === '〔') { red = true; continue; } if (ch === '〕') { red = false; continue; } if (ch === '　') { yy += size * .45; continue; } g.fillStyle = red ? '#b8322a' : '#2a1d14'; g.fillText(ch, 0, yy); yy += size * 1.1; }
  if (src) { g.font = `500 ${w * .12}px ${SANS}`; g.fillStyle = 'rgba(70,50,30,.75)'; g.fillText(src, 0, h - 34); }
  g.restore(); g.restore();
}

// ---------- 字幕（D1 版式：左上粗宋，2–3 行，逐字模糊出字，浅蓝 / 红关键词 + 同色细下划线） ----------
// 换算：D1 内容区 784×441 → 1920×1080 是 ×2.45。复盘重量（zoom_sub.png）：一行 12 字宽 340px → 每字 28px → 字号约 68；左边距 27 → 66；首行中心 63 → 154；行距 47 → 115。
const TX = 66, TY = 150, TS = 68, LH = 112;
function parse(s) { const out = []; s.split(/(【[^】]+】|〔[^〕]+〕)/).forEach(p => { if (!p) return; if (p[0] === '【') out.push([p.slice(1, -1), 1]); else if (p[0] === '〔') out.push([p.slice(1, -1), 2]); else out.push([p, 0]); }); return out; }
function typeLine(str, x, y, size, t0, t, tOut, t1) {
  if (t < t0 - .01) return; const out = prog(t, tOut, tOut + .25); if (out >= 1) return;
  const parts = parse(str); g.save(); g.font = `900 ${size}px ${SERIF}`; g.textBaseline = 'middle';
  let cx = x, i = 0, base = t0, j = 0; const lines = [];
  for (const [s, key] of parts) {
    const x0 = cx;
    for (const ch of s) {
      if (ch === '|') { base = t1; j = 0; continue; }
      const w = g.measureText(ch).width, ta = base + j * .04; j++;
      const k = prog(t, ta, ta + .28), e = eout(k);
      if (k > 0) {
        const blur = (1 - e) * 9 + out * 10; g.filter = blur > .3 ? `blur(${blur.toFixed(1)}px)` : 'none'; g.globalAlpha = e * (1 - out);
        let sc = 1 + .15 * (1 - e);
        if (key === 2) { const kp = prog(t, ta + .2, ta + .45); sc *= 1 + .22 * Math.sin(kp * Math.PI); }   // 红词：落定后再鼓一下
        g.save(); g.translate(cx + w / 2, y); g.scale(sc, sc);
        g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 10; g.shadowOffsetY = 2;
        g.fillStyle = key === 1 ? COL.blue : key === 2 ? COL.red : COL.text; g.fillText(ch, -w / 2, 0);
        if (key === 2) { const kp = prog(t, ta + .2, ta + .6); if (kp > 0 && kp < 1) { g.shadowColor = `rgba(255,70,50,${.9 * Math.sin(kp * Math.PI)})`; g.shadowBlur = 26; g.fillText(ch, -w / 2, 0); } }
        g.restore();
      }
      cx += w; i++;
    }
    if (key) lines.push([x0, cx, key, base + j * .04 + .1]);
  }
  g.filter = out > 0 ? `blur(${(out * 10).toFixed(1)}px)` : 'none';
  for (const [a, bx, key, tl] of lines) {
    const k = eout(prog(t, tl, tl + .3)); if (k <= 0) continue; const col = key === 1 ? '143,196,234' : '226,73,60';
    const gr = g.createLinearGradient(a, 0, bx, 0); gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(.12, `rgba(${col},.95)`); gr.addColorStop(.88, `rgba(${col},.95)`); gr.addColorStop(1, `rgba(${col},0)`);
    g.globalAlpha = 1 - out; g.fillStyle = gr; g.fillRect(a, y + size * .6, (bx - a) * k, 5);
  }
  g.restore();
}
// PAGES = [[起, 止, [[字, 出现时刻], …]], …]
function pages(t, PAGES) {
  for (const [s, e, lines] of PAGES) { if (t < s - .1 || t > e + .3) continue;
    // 字幕背后一团深色柔光压底（D1 有）
    const a = at(t, s, .3) * (1 - prog(t, e, e + .25)); const sg = g.createRadialGradient(TX + 360, TY + 40, 0, TX + 360, TY + 40, 560); sg.addColorStop(0, `rgba(8,6,6,${.45 * a})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
    lines.forEach(([str, t0, t1], i) => typeLine(str, TX, TY + i * LH, TS, t0, t, e, t1)); }
}
function footnote(s) { g.save(); g.font = `400 22px ${SANS}`; g.fillStyle = 'rgba(170,160,145,.55)'; g.textAlign = 'right'; g.fillText(s, W - 50, H - 30); g.restore(); }

// ---------- 合成：场景叠化 + 字幕 + 颗粒 + 暗角 ----------
const XF = .4;   // D1 最常用：推近 + 0.4 秒叠化
// D1：每页镜头都在慢推。这里给每个场景整体加一层从头到尾约 3% 的推近（叠在场景自己的镜头上）
const PUSH = .03;
function drawScene(t, fn, ctx, s0 = 0, s1 = 1e9) { const prev = g; g = ctx; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, W, H); const z = 1 + PUSH * eio(prog(t, s0, s1)); g.translate(W / 2, H * .55); g.scale(z, z); g.translate(-W / 2, -H * .55); fn(t); g.restore(); g = prev; }
// 镜头：场景函数里调 camera(cx, cy, z, dx, dy)，以 (cx, cy) 为中心缩放 z，再平移
function camera(cx, cy, z, dx = 0, dy = 0) { g.translate(W / 2 + dx, H / 2 + dy); g.scale(z, z); g.translate(-cx, -cy); }
const sceneEnd = i => i + 1 < SCENES.length ? SCENES[i + 1][0] : DURATION;
function render(t) {
  curT = t;
  let i = SCENES.length - 1; while (i > 0 && t < SCENES[i][0] - XF) i--;
  const [s0, fn] = SCENES[i];
  drawScene(t, fn, SA.getContext('2d'), s0, sceneEnd(i));
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const k = i > 0 ? prog(t, s0 - XF, s0) : 1;
  if (k < 1) { drawScene(t, SCENES[i - 1][1], SB.getContext('2d'), SCENES[i - 1][0], sceneEnd(i - 1)); g.drawImage(SB, 0, 0); g.globalAlpha = eio(k); }
  g.drawImage(SA, 0, 0); g.globalAlpha = 1;
  grain(.08);
  const v = g.createRadialGradient(W / 2, H * .55, H * .4, W / 2, H * .55, H * 1.05); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  overlay(t);
  g.restore();
  m.setTransform(1, 0, 0, 1, 0, 0); m.drawImage(B, 0, 0);
}
