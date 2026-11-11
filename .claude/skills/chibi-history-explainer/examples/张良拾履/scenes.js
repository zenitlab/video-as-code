// 张良拾履 · 内容第一部分：桥（文案第 1–5 句，0–25 秒）+ 公用的桥、鞋、走路。其余段落在 scenes2.js
// 演法按 D1 实测：一句字幕里把动作完整演出来；每个动作按「蓄力 → 动作 → 过冲 → 回稳」排帧，表情硬切。

const DECK = 700, D = 205;
const OMX = 800, ZLX = 1180;                       // 桥面高度、小人头直径
const ZL = { robe: '#7fa6b6', robe2: '#58808f' };   // 张良：月白偏青
const OM = { robe: '#8c6a48', robe2: '#664a30' };   // 老头：《史记》说他「衣褐」，褐色粗布

// ---------- 场景：下邳的桥（侧面舞台，夜里，两盏灯笼是光源） ----------
const starsA = (() => { const r = rng(11), a = []; for (let i = 0; i < 70; i++) a.push([r() * W, r() * 480, .8 + r() * 1.6, r() * 6.28]); return a; })();
function lantern(t, x, y, seed) {
  const sw = .05 * Math.sin(t * 1.3 + seed);
  g.save(); g.translate(x, y); g.rotate(sw);
  g.strokeStyle = '#2a211b'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 34); g.stroke();
  g.fillStyle = '#3a2a1e'; g.fillRect(-22, 30, 44, 10); g.fillRect(-22, 106, 44, 10);
  const lg = g.createLinearGradient(-34, 0, 34, 0); lg.addColorStop(0, '#b8402a'); lg.addColorStop(.5, '#f08a4a'); lg.addColorStop(1, '#b8402a');
  g.fillStyle = lg; g.beginPath(); g.ellipse(0, 73, 36, 38, 0, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(120,40,20,.5)'; g.lineWidth = 2; for (const k of [-.5, 0, .5]) { g.beginPath(); g.ellipse(0, 73, 36 * Math.abs(k) + 1, 38, 0, 0, 6.283); g.stroke(); }
  g.fillStyle = '#d9a64e'; g.fillRect(-3, 116, 6, 22);
  g.restore();
  const fl = 1 + .05 * Math.sin(t * 9 + seed) + .03 * Math.sin(t * 23 + seed);
  glow(x + Math.sin(sw) * -73, y + 73, 150 * fl, .9); glow(x, y + 120, 520 * fl, .42);
}
// tod：night 深夜（灯笼亮、月亮）/ predawn 鸡叫前（深蓝、灯笼暗）/ dawn 天亮（粉橙天、太阳从右边地平线冒头）
function bridge(t, tod = 'night') {
  const sk = g.createLinearGradient(0, 0, 0, 760); for (const [c, k] of skyFor(tod)) sk.addColorStop(k, c); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  const starA = tod === 'night' ? 1 : tod === 'predawn' ? .6 : 0;
  if (starA) { for (const [x, y, s, ph] of starsA) { g.globalAlpha = starA * (.25 + .3 * Math.sin(t * 1.4 + ph)); g.fillStyle = '#d8dcea'; g.fillRect(x, y, s, s); } g.globalAlpha = 1; }
  if (tod === 'night') { g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(1330, 165, 44, 0, 6.283); g.fill(); glow(1330, 165, 160, .25); }
  if (tod === 'dawn') { g.fillStyle = '#ffe2a8'; g.beginPath(); g.arc(1500, 560, 70, 0, 6.283); g.fill(); glow(1500, 560, 520, .55); }
  // 远处城墙剪影 + 几点窗火
  g.fillStyle = '#1a1617'; g.fillRect(-200, 560, W + 400, 140);
  for (let x = -200; x < W + 200; x += 70) g.fillRect(x, 540, 40, 24);
  g.fillStyle = '#211b1b'; g.beginPath(); g.moveTo(980, 560); g.lineTo(1040, 500); g.lineTo(1180, 500); g.lineTo(1240, 560); g.fill(); g.fillRect(1020, 500, 180, 12);   // 城楼
  for (const [x, y] of [[300, 610], [690, 600], [1110, 535], [1650, 615]]) { g.fillStyle = 'rgba(255,190,110,.7)'; g.fillRect(x, y, 10, 14); glow(x + 5, y + 7, 30, .35 + .15 * Math.sin(t * 2 + x)); }
  // 柳树（右上，枝条随风摆）
  g.strokeStyle = '#1d2a1e'; g.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const x0 = 1640 + i * 14, len = 220 + (i * 53) % 160, sw = 14 * Math.sin(t * 1.1 + i * .5);
    g.beginPath(); g.moveTo(x0, -20); g.quadraticCurveTo(x0 - 10, len * .5, x0 + sw, len); g.stroke(); }
  g.fillStyle = '#18221a'; g.beginPath(); g.ellipse(1800, -30, 260, 70, 0, 0, 6.283); g.fill();
  // 后栏杆：柱子 + 两道横栏
  const st = (y0, y1) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#7a6656'); gr.addColorStop(1, '#4e4036'); return gr; };
  g.fillStyle = st(612, 660); g.fillRect(-200, 612, W + 400, 12); g.fillRect(-200, 652, W + 400, 10);
  for (let x = -60; x < W + 100; x += 220) { g.fillStyle = st(585, 700); g.fillRect(x - 14, 590, 28, 110); g.fillStyle = '#87715f'; g.beginPath(); g.arc(x, 588, 17, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x - 14, 590, 6, 110); }
  // 灯笼柱
  for (const [x, s] of [[430, 1], [1560, 2]]) { g.fillStyle = '#4a3a2e'; g.fillRect(x - 9, 360, 18, 340); g.fillRect(x - 9, 360, 80, 12); if (tod === 'dawn') { g.save(); g.globalAlpha = .55; lantern(t, x + 60, 372, s); g.restore(); } else lantern(t, x + 60, 372, s); }
  if (tod === 'dawn') { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,170,110,.35)'; g.fillRect(-300, -300, W + 600, H + 600); g.restore(); }
  if (tod === 'predawn') { g.save(); g.fillStyle = 'rgba(30,50,90,.18)'; g.fillRect(-300, -300, W + 600, H + 600); g.restore(); }
  // 桥身：桥面前沿一条石带，左边拱下是水，右边是桥台
  g.fillStyle = '#3e332b'; g.fillRect(-200, 770, 1160, 180); g.fillRect(940, 770, 1200, 230);
  const ag = g.createLinearGradient(0, 780, 0, 960); ag.addColorStop(0, '#07090d'); ag.addColorStop(1, '#14202e');
  g.fillStyle = ag; g.beginPath(); g.ellipse(520, 950, 330, 170, 0, Math.PI, 0); g.fill();   // 拱洞
  g.strokeStyle = '#5a4a3d'; g.lineWidth = 10; g.beginPath(); g.ellipse(520, 950, 335, 175, 0, Math.PI, 0); g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2;   // 石缝
  for (let r = 0; r < 4; r++) for (let x = -200 + (r % 2) * 60; x < W + 200; x += 120) { const y = 800 + r * 50; if (Math.hypot((x - 520) / 340, (y - 950) / 180) < 1.05) continue; g.strokeRect(x, y, 120, 50); }
  const dk = g.createLinearGradient(0, 700, 0, 772); dk.addColorStop(0, '#7b6757'); dk.addColorStop(1, '#4f4136'); g.fillStyle = dk; g.fillRect(-200, 700, W + 400, 72);
  g.fillStyle = '#9a836e'; g.fillRect(-200, 698, W + 400, 5);
  g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 2; for (let x = -100; x < W + 200; x += 150) { g.beginPath(); g.moveTo(x, 705); g.lineTo(x, 770); g.stroke(); }
  // 水（左下）：波纹高光 + 灯笼倒影
  const wg = g.createLinearGradient(0, 940, 0, 1080); wg.addColorStop(0, '#1a2c40'); wg.addColorStop(1, '#0d1824'); g.fillStyle = wg; g.fillRect(-200, 945, 1180, 400);
  for (let i = 0; i < 14; i++) { const y = 965 + i * 9, ph = t * (1.2 + i * .07) + i; g.strokeStyle = `rgba(160,200,230,${.14 - i * .006})`; g.lineWidth = 2; g.beginPath(); for (let x = -100; x < 980; x += 20) { const yy = y + 3 * Math.sin(x * .03 + ph); x === -100 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
  for (let i = 0; i < 6; i++) { const y = 960 + i * 18, w = 60 - i * 6; g.fillStyle = `rgba(255,160,80,${.35 - i * .05})`; g.fillRect(490 + 10 * Math.sin(t * 2.4 + i * 1.7) - w / 2, y, w, 4); }
  // 右下河岸（鞋会掉到这里）+ 草丛 + 卵石
  const bk = g.createLinearGradient(0, 975, 0, 1080); bk.addColorStop(0, '#4a3e2e'); bk.addColorStop(1, '#2a2219'); g.fillStyle = bk;
  g.beginPath(); g.moveTo(880, 1300); g.lineTo(900, 1080); g.quadraticCurveTo(930, 985, 1010, 980); g.lineTo(W + 200, 975); g.lineTo(W + 200, 1300); g.lineTo(900, 1300); g.closePath(); g.fill();
  g.fillStyle = '#6a5a44'; g.fillRect(1000, 977, W, 4);
  const rr = rng(21); for (let i = 0; i < 18; i++) { const x = 960 + rr() * 980, y = 995 + rr() * 70; g.fillStyle = `rgba(${120 + rr() * 40},${105 + rr() * 30},${85 + rr() * 20},.6)`; g.beginPath(); g.ellipse(x, y, 8 + rr() * 10, 4 + rr() * 4, 0, 0, 6.283); g.fill(); }
  for (let i = 0; i < 12; i++) { const x = 940 + i * 85 + (i * 37) % 40, sw = 4 * Math.sin(t * 1.5 + i); g.strokeStyle = '#3d4a2c'; g.lineWidth = 3; for (let j = -2; j <= 2; j++) { g.beginPath(); g.moveTo(x, 985); g.quadraticCurveTo(x + j * 5, 965, x + j * 9 + sw, 950 + Math.abs(j) * 6); g.stroke(); } }
  // 右端石阶（从桥面下到河岸）
  for (let i = 0; i < 5; i++) { const x = 1700 + i * 46, y = 700 + i * 55; g.fillStyle = '#5c4b3e'; g.fillRect(x, y, 400, 55); g.fillStyle = '#8a7462'; g.fillRect(x, y, 400, 4); }
  motes(t, 960, 560, 700, 34, 7);
}

// ---------- 鞋 ----------
function shoe(x, y, rot, s, a = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * 1.8, s * 1.8); g.globalAlpha = a;
  g.fillStyle = '#2a1f17'; g.beginPath(); g.moveTo(-30, 6); g.quadraticCurveTo(-32, -14, -10, -16); g.lineTo(16, -12); g.quadraticCurveTo(38, -10, 35, 6); g.closePath(); g.fill();
  g.fillStyle = '#e6dac4'; g.beginPath(); g.roundRect(-32, 3, 68, 8, 3); g.fill();   // 白布鞋底
  g.fillStyle = '#5a4230'; g.beginPath(); g.ellipse(-14, -7, 9, 5, 0, 0, 6.283); g.fill();   // 鞋口
  g.strokeStyle = 'rgba(255,240,220,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-6, -13); g.quadraticCurveTo(12, -11, 28, -5); g.stroke();
  g.restore();
}
const SHOE0 = 2.08, SHOE1 = 2.92;
function shoePos(t) {
  if (t < SHOE0) return null;
  if (t < SHOE1) { const u = (t - SHOE0) / (SHOE1 - SHOE0); return [OMX + .58 * D + 150 * u, 640 - 560 * u + 900 * u * u, 9.5 * u, 1 + .15 * u]; }
  const k = prog(t, SHOE1, SHOE1 + .2); return [OMX + .58 * D + 150 + 10 * eout(k), 975 - 26 * Math.sin(Math.PI * k), lerp(9.5, 6.283 * 2 - .12, eout(k)), 1.15];
}

// ---------- 走路 ----------
// D1 走路：身体一整块上下颠（每步一颠），两只脚交替抬，身体左右轻摆
function walk(o, dist, stride = 80) {
  const ph = dist / stride * Math.PI;
  o.lift = Math.abs(Math.sin(ph)) * D * .07; o.lean = (o.lean || 0) + .05 * Math.sin(ph);
  o.feetL = [0, -Math.max(0, Math.sin(ph)) * .12]; o.feetR = [0, -Math.max(0, -Math.sin(ph)) * .12];
  o.hair = (o.hair || 0) + .15 * Math.sin(ph * 2);
}

// ---------- 老头 ----------
function oldMan(t) {
  const o = { D, who: 'old', ...OM, cane: -1, armL: .3, caneLen: .55, y: DECK, face: { eye: 'close', mouth: 'smile' } };
  const x = kf(t, [[0, -160], [1.2, OMX - 120, k => k], [1.55, OMX, eout]]); o.x = x;
  if (t < 1.55) walk(o, x + 160, 85);
  // 1.6 停下，斜眼看张良，坏笑
  if (t >= 1.6) o.face = { eye: 'smug', mouth: 'smirk', look: [1, 0] };
  // 踢鞋：后仰蓄力 4 帧 → 踢出 3 帧 → 过冲 → 回稳
  o.lean = (o.lean || 0) + kf(t, [[1.85, 0], [1.98, -.26, eout], [2.08, .2, eout], [2.22, -.07], [2.42, 0]]);
  if (t > 1.85 && t < 2.45) { o.sy = kf(t, [[1.85, 1], [1.98, .9, eout], [2.08, 1.1, eout], [2.25, .96], [2.42, 1]]); o.sx = 2 - o.sy; o.lift = D * .12 * Math.sin(Math.PI * prog(t, 2.0, 2.3)); o.armL = kf(t, [[1.85, .3], [1.98, .9], [2.25, .3]]); o.armR = kf(t, [[1.85, .15], [1.98, 1.6], [2.1, 1.2], [2.35, .15]]); }
  if (t > 1.85 && t < 2.45) { const k1 = prog(t, 1.85, 1.98), k2 = prog(t, 1.98, 2.08), k3 = prog(t, 2.12, 2.4); o.feetR = [lerp(lerp(0, -.1, k1), .5, eout(k2)) * (1 - eio(k3)), lerp(0, -.42, eout(k2)) * (1 - eio(k3))]; }
  if (t >= SHOE0 && t < 21.4) o.barefootR = true;
  o.hair = spring(t, 2.08, .5, 5, .25);
  if (t >= 2.1 && t < 2.5) o.face = { eye: 'happy', mouth: 'grin' };
  if (t >= 2.5 && t < 3.35) o.face = { eye: 'smug', mouth: 'smirk', look: [.6, 1] };
  // 3.4 指着桥下
  if (t >= 3.35 && t < 4.2) { o.face = { eye: 'smug', mouth: 'grin', look: [1, .2] }; o.armR = kf(t, [[3.35, .15], [3.47, 1.05, eback]]); }
  if (t >= 4.2 && t < 5.0) { o.face = { eye: 'close', mouth: 'smirk' }; o.armR = kf(t, [[4.2, 1.05], [4.35, .15]]); o.hair = .08 * Math.sin(t * 4); }
  // 第二页：说「孺子　下取履」，三下一跳一指
  if (t >= 5.0 && t < 6.4) {
    o.face = { eye: 'smug', mouth: Math.floor(t * 8) % 2 ? 'O' : 'small', look: [1, .3] };
    o.armR = 1.0;
    for (const h of [5.12, 5.5, 5.88]) { const k = prog(t, h, h + .33); if (k > 0 && k < 1) { o.lift = D * .22 * Math.sin(Math.PI * k); o.sy = k < .15 ? 1 - .1 * Math.sin(k / .15 * Math.PI) : 1 + .06 * Math.sin(Math.PI * k); o.armR = 1.0 + .25 * Math.sin(Math.PI * k); } }
    o.hair = spring(t, 5.12, .4, 5) + spring(t, 5.5, .4, 5) + spring(t, 5.88, .4, 5);
  }
  if (t >= 6.4 && t < 7.3) o.face = { eye: 'smug', mouth: 'smirk', look: [1, 0] };
  if (t >= 7.3 && t < 7.85) { o.face = { eye: 'close', mouth: 'smile' }; o.lean = kf(t, [[7.3, 0], [7.4, .13], [7.5, 0], [7.6, .13], [7.74, 0]]); }
  if (t >= 7.85 && t < 10.0) { o.face = { eye: 'close', mouth: 'smirk' }; o.lean = -.05 + .02 * Math.sin(t * 2); o.hair = .1 * Math.sin(t * 3); }
  // 第三页：哼着小曲，毫不知情 → 咳嗽（「看他太老」）→ 又悠哉
  if (t >= 10.0 && t < 11.6) { o.face = { eye: 'close', mouth: 'smile' }; o.lean = .05 * Math.sin(t * 3.2); o.hair = .15 * Math.sin(t * 3.2); }
  if (t >= 11.6 && t < 12.6) {
    o.face = { eye: 'xx', mouth: 'o' };
    for (const c of [11.7, 12.05]) { const k = prog(t, c, c + .25); if (k > 0 && k < 1) { o.lean = .14 * Math.sin(Math.PI * k); o.sy = 1 - .08 * Math.sin(Math.PI * k); } }
    o.x += shake(t, 3, 14); o.caneDX = shake(t, .04, 9);
  }
  if (t >= 12.6) { o.face = { eye: 'close', mouth: 'smile' }; o.lean = .03 * Math.sin(t * 2.5); }
  if (t >= 13.8) { o.face = { eye: 'smug', mouth: 'grin', look: [1, 0] }; }
  // 第四页：张良捡鞋回来，老头把光脚一伸「履我」
  if (t >= 15) { o.x = OMX; o.face = { eye: 'smug', mouth: 'smirk', look: [1, 0] }; o.lean = .03 * Math.sin(t * 2.4); o.sy = 1; o.lift = 0; o.armR = undefined; }
  if (t >= 16.7 && t < 21.6) { const k = eout(prog(t, 16.7, 16.85)), r = 1 - eio(prog(t, 21.4, 21.6)); o.lean = kf(t, [[16.7, 0], [16.85, -.24, eout], [17.0, -.17]]) * r; o.feetR = [.45 * k * r, (-.38 + .03 * Math.sin(t * 12)) * k * r]; o.face = { eye: 'close', mouth: 'smirk' }; o.armR = .55; o.hair = spring(t, 16.85, .4, 5); }
  // 第五页：穿好鞋，老头哈哈大笑，走了
  if (t >= 21.6 && t < 22.6) { o.face = { eye: 'happy', mouth: 'grin' }; for (const h of [21.65, 21.95, 22.25]) { const k = prog(t, h, h + .28); if (k > 0 && k < 1) { o.lift = D * .1 * Math.sin(Math.PI * k); o.hair = .3 * Math.sin(Math.PI * k); } } }
  if (t >= 22.6) { const x = kf(t, [[22.6, OMX], [25, OMX - 1050, k => k]]); o.x = x; walk(o, OMX - x, 85); o.face = { eye: 'happy', mouth: 'smile' }; }
  if (!o.lift) o.sy = (o.sy || 1) * (1 + .015 * Math.sin(t * 4.2));   // 待机呼吸
  return o;
}
// 手的位置（不计倾斜，够画手里拿的东西）
function handPos(o, side) { const a = side < 0 ? o.armL : o.armR, sy = o.sy || 1; if (a == null) return [o.x + side * .2 * o.D, o.y - (o.lift || 0) - .5 * o.D * sy]; return [o.x + side * (.27 + .44 * Math.sin(a)) * o.D, o.y - (o.lift || 0) + (-.92 + .44 * Math.cos(a)) * o.D * sy]; }

// ---------- 张良 ----------
function zhang(t) {
  const o = { D, who: 'zl', ...ZL, x: ZLX, y: DECK, face: { eye: 'dot', mouth: 'smile', look: [.8, .4] } };
  o.sy = 1 + .015 * Math.sin(t * 3.6 + 1);
  o.hair = .1 * Math.sin(t * 2.2);
  if (t >= 1.0) o.face = { eye: 'dot', mouth: 'small', look: [-1, 0] };
  // 鞋飞出：头顶冒「!」，原地一蹦，眼睛跟着鞋走
  if (t >= 2.1) {
    const k = prog(t, 2.12, 2.42); o.lift = D * .3 * Math.sin(Math.PI * k); if (k > 0 && k < 1) { o.sy = 1 + .12 * Math.sin(Math.PI * k); o.sx = 1 - .06 * Math.sin(Math.PI * k); }
    const sp = shoePos(Math.min(t, 3.4)); const hx = o.x, hy = DECK - 1.5 * D;
    let lx = (sp[0] - hx) / 300, ly = (sp[1] - hy) / 300; const n = Math.max(1, Math.hypot(lx, ly)); lx /= n; ly /= n;
    o.face = { eye: 'wide', mouth: t < SHOE1 ? 'o' : 'O', look: [lx, ly] };
    o.hair = spring(t, 2.12, .7, 5, .3); o.bun = spring(t, 2.12, .08, 6, .2);
  }
  if (t >= 3.45) o.face = { eye: 'wide', mouth: 'o', look: [-1, 0] };
  if (t >= 4.3) o.face = { eye: 'line', mouth: 'flat', look: [-1, 0] };
  // 第二页：无语 → 指自己「我？」
  if (t >= 6.45 && t < 7.4) { o.face = { eye: 'wide', mouth: 'o', look: [-1, 0] }; o.armL = kf(t, [[6.45, .15], [6.57, -1.05, eback]]); o.rot = kf(t, [[6.45, 0], [6.6, .12, eback]]); o.bun = spring(t, 6.5, .05, 6); }
  if (t >= 7.4 && t < 8.6) { o.face = { eye: 'line', mouth: 'wave', look: [-1, 0] }; }
  if (t >= 8.6 && t < 10.0) { o.face = { eye: t < 9.3 ? 'line' : 'angry', mouth: 'flat', look: [-1, 0] }; o.flush = .35 * prog(t, 9.3, 10); }
  // 第三页：火冒三丈 → 举拳（后仰蓄力 → 挥起 → 过冲）→ 发抖 → 慢慢放下 → 泄气
  if (t >= 10.0 && t < 12.7) {
    o.face = { eye: 'angry', mouth: 'grit', look: [-1, 0] }; o.flush = lerp(.35, .85, prog(t, 10, 10.4));
    o.lean = kf(t, [[10.25, 0], [10.42, -.13, eout], [10.6, .05, eout], [10.8, -.06]]);
    o.sy = kf(t, [[10.25, 1], [10.42, .93], [10.6, 1.07], [10.8, 1]]);
    o.armR = kf(t, [[10.42, .15], [10.6, 2.8, eback]]) + (t > 10.7 ? shake(t, .05, 18) : 0); o.fistR = true;
    if (t > 10.7) o.x += shake(t, 2.5, 20, 1);
    o.hair = spring(t, 10.45, .9, 4, .4) + .2; o.bun = spring(t, 10.5, .1, 6, .2);
  }
  if (t >= 12.7 && t < 13.6) {
    o.armR = kf(t, [[12.7, 2.8], [13.15, .15]]); o.fistR = t < 13.0; o.flush = .85 * (1 - prog(t, 12.7, 13.3));
    o.face = t < 13.0 ? { eye: 'angry', mouth: 'grit', look: [-1, 0] } : { eye: 'line', mouth: 'wave' };
    o.sy = kf(t, [[13.0, 1], [13.18, .88, eout], [13.6, .97]]); o.lean = kf(t, [[13.0, 0], [13.2, .06]]);
    o.hair = -.3 * prog(t, 13.0, 13.3);
  }
  if (t >= 13.6 && t < 15) { o.face = { eye: 'line', mouth: 'flat' }; o.sy = .97; o.lean = .07; o.hair = -.3; const x = kf(t, [[13.6, ZLX], [15, ZLX + 300, k => k]]); o.x = x; walk(o, x - ZLX, 70); }
  // 第四页：举着鞋跑回来，喘
  if (t >= 15 && t < 20) { o.flush = 0; o.rot = 0; o.armR = undefined; o.fistR = false; o.sy = 1 + .015 * Math.sin(t * 3.6); o.lean = 0; o.hair = .1 * Math.sin(t * 2.2);
    const x = kf(t, [[15, 1700], [16.0, 1250, eout]]); o.x = x; if (t < 16) { walk(o, 1700 - x, 75); o.lean += .1; }
    o.armL = t < 16.0 ? 2.6 : kf(t, [[16.0, 2.6], [16.15, 1.3, eback]]);
    o.face = t < 16.2 ? { eye: 'xx', mouth: 'o' } : t < 16.9 ? { eye: 'dot', mouth: 'smile', look: [-1, 0] } : t < 17.6 ? { eye: 'wide', mouth: 'o', look: [-1, .5] } : { eye: 'line', mouth: 'wave', look: [-1, .3] };
    if (t >= 18.6) o.flush = .3; }
  // 第五页：走过去跪下，给老头穿上；老头笑着走了，张良还跪着发愣
  if (t >= 20) { o.flush = 0; o.rot = 0; o.armR = undefined; o.fistR = false; o.lean = 0; o.hair = .1 * Math.sin(t * 2.2);
    const x = kf(t, [[20, 1250], [20.55, 1110, eio]]); o.x = x; if (t < 20.55) walk(o, 1250 - x, 70);
    const kk = prog(t, 20.55, 20.8); o.sy = t < 20.55 ? 1 : kf(t, [[20.55, 1], [20.68, .66, eout], [20.85, .74]]); o.lean = .14 * eout(kk);
    o.armL = t < 21.4 ? kf(t, [[20.0, 1.3], [20.6, 1.0]]) : kf(t, [[21.4, 1.0], [21.6, .15]]);
    o.face = t < 21.6 ? { eye: 'close', mouth: 'flat' } : t < 24 ? { eye: 'wide', mouth: 'o', look: [-1, 0] } : { eye: 'line', mouth: 'small', look: [-1, 0] };
    if (t > 24.3) { o.face = { eye: 'line', mouth: 'smile' }; } }
  return o;
}

let camShake = 0;
function s1(t) {
  // 镜头：第一页慢推；鞋落地一震；第二页末推近张良；第三页咳嗽时摇向老头再回来，泄气后拉开
  // 构图按 D1：脚踩在画面下 10%，人占画面高约一半；鞋掉下去时镜头跟着下摇
  const z = kf(t, [[0, 1.2], [2.2, 1.22], [2.85, 1.12], [3.4, 1.12], [3.95, 1.24], [8.6, 1.26], [9.8, 1.42], [13.4, 1.42], [15, 1.26], [20, 1.26], [21.3, 1.4], [24.3, 1.42], [25.2, 1.9]]);
  const cx = kf(t, [[0, 990], [2.2, 990], [2.85, 1000], [3.4, 1000], [3.95, 990], [8.6, 990], [9.8, 1080], [11.55, 1080], [11.95, 880], [12.55, 880], [12.95, 1100], [13.4, 1100], [15, 1120], [16, 1060], [20, 1060], [21.3, 980], [24.3, 1000], [25.2, 1110]]);
  const cy = kf(t, [[0, 350], [2.25, 350], [2.85, 690], [3.4, 690], [3.95, 350], [8.6, 350], [9.8, 380], [13.4, 380], [15, 350], [20, 350], [21.3, 400], [24.3, 400], [25.2, 470]]);
  const sh = t > SHOE1 && t < SHOE1 + .15 ? 6 * Math.sin((t - SHOE1) * 90) * (1 - (t - SHOE1) / .15) : 0;
  g.save(); camera(cx, cy, z, 0, sh);
  bridge(t);
  const om = oldMan(t), zl = zhang(t);
  chibi(om); chibi(zl);
  // 老头走路时的「♪」、踢鞋的速度线
  notes(t, .1, 1.5, om.x + 90, DECK - 400, 46);
  speedLines(t, 2.0, 2.2, om.x + 150, DECK - 80, -1, 140, 5, 3);
  for (const [dt, al] of [[.09, .18], [.06, .28], [.03, .4]]) { if (t - dt > SHOE0 && t < SHOE1) { const q = shoePos(t - dt); shoe(q[0], q[1], q[2], q[3], al); } }
  const sp = t < 15 ? shoePos(t) : null; if (sp) shoe(sp[0], sp[1], sp[2], sp[3]);
  if (t >= 15 && t < 21.4) { const h = handPos(zl, -1), f = [om.x + .62 * D, DECK - .5 * D]; const k = eio(prog(t, 20.8, 21.35)); shoe(lerp(h[0], f[0], k), lerp(h[1], f[1], k) - 10, lerp(-.3, -.15, k), .9); }
  sparkles2(t, 21.38, om.x + .62 * D, DECK - .5 * D);
  const lx = OMX + .58 * D + 155; dust(t, SHOE1, lx, 982, 150, 9, 5); ring(t, SHOE1, lx, 985, 120, 18, .6, 3);
  // 张良：「!」「…」「?」、怒气、冒烟、汗、呼气
  const hx = zl.x, hy = DECK - (zl.lift || 0) - 2.25 * D;
  pop(t, 2.12, '!', hx + 20, hy - 30, 110, { ttl: .9 });
  pop(t, 4.35, '…', hx + 100, hy + 10, 90, { ttl: 1.3, stroke: false });
  sweat(t, 5.6, hx + 95, hy + 120, 70, 1.2);
  pop(t, 6.6, '?', hx + 40, hy - 30, 110, { ttl: .9 });
  vein(t, 10.12, hx + 95, hy + 50, 52, 12.85);
  steam(t, 10.2, 12.7, hx, hy + 40, 120);
  puffCloud(t, 13.0, hx + 40, DECK - 1.2 * D, 120, 1);
  sweat(t, 13.2, hx - 90, hy + 110, 70, 1.1);
  // 老头：「哼」「咳」
  const ox = om.x, oy = DECK - 2.25 * D;
  pop(t, 8.0, '哼', ox + 150, oy + 30, 64, { ttl: .9, rot: -.15 });
  notes(t, 10.2, 11.4, ox + 80, oy - 20, 46);
  pop(t, 11.72, '咳', ox - 130, oy + 50, 66, { ttl: .45, rot: -.2 });
  pop(t, 12.07, '咳', ox - 110, oy - 10, 76, { ttl: .5, rot: .15 });
  // 15–25：喘气、「!」「…」、青筋、「哈哈」「?」
  sweat(t, 15.3, hx + 90, hy + 110, 70, .8); sweat(t, 15.7, hx - 90, hy + 120, 60, .8);
  pop(t, 16.9, '!', hx + 20, hy - 30, 110, { ttl: .7 });
  pop(t, 18.2, '…', hx + 100, hy + 10, 90, { ttl: 1.2, stroke: false });
  vein(t, 18.6, hx + 95, hy + 50, 46, 19.8);
  pop(t, 21.7, '哈哈', ox + 30, oy - 20, 70, { ttl: 1.0, rot: -.1 });
  pop(t, 23.2, '?', hx + 40, DECK - 1.9 * D, 110, { ttl: .9 });
  notes(t, 22.7, 25, om.x + 60, oy - 20, 46);
  g.restore();
}
// 鞋穿上那一下：一圈小亮点
function sparkles2(t, t0, x, y) { const k = prog(t, t0, t0 + .6); if (k <= 0 || k >= 1) return; for (let i = 0; i < 8; i++) { const a = i * .785, d = 30 + 60 * eout(k); glow(x + Math.cos(a) * d, y + Math.sin(a) * d * .6, 22, (1 - k) * .9); } ring(t, t0, x, y, 90, 20, .6, 3); }
