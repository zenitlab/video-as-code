// 冯谖弹剑 · 内容第一部分：公用部件 + 第 1–4 页（0–18.5 秒）。其余在 scenes_b.js（5–20 页）、scenes_c.js（21–37 页），时间轴在 timeline.js
// 演法照 D1 实测：一句字幕把动作演完；蓄力 → 动作 → 过冲 → 回稳；表情硬切；动作配拟音。

const FX = { who: 'fx', robe: '#8a8070', robe2: '#6a6252', patch: true };          // 冯谖：旧灰袍打补丁
const MC = { who: 'guan', robe: '#6a3a7a', robe2: '#4a2858', beard: 'goatee', buckle: 1 };   // 孟尝君：紫袍金扣
const GUEST = [['#3f6a8a', '#2c4c66'], ['#8a5a3a', '#664028'], ['#4a7a5a', '#345a40'], ['#7a4a4a', '#5a3434'], ['#6a6a7a', '#4c4c5a'], ['#8a7a4a', '#665a34']];

// ---------- 新道具 ----------
// 长剑（长铗）：剑鞘斜挂，弹的时候剑身上出几道颤线
function changjia(x, y, ang, s = 1, vib = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.fillStyle = '#4a3020'; g.beginPath(); g.roundRect(-8, 0, 16, 230, 6); g.fill(); g.fillStyle = '#c9a56a'; g.fillRect(-9, 220, 18, 12); g.fillRect(-9, 0, 18, 8);
  g.fillStyle = '#d9a64e'; g.fillRect(-26, -10, 52, 10); g.fillStyle = '#3a2416'; g.fillRect(-6, -60, 12, 52); g.fillStyle = '#d9a64e'; g.beginPath(); g.arc(0, -64, 9, 0, 6.283); g.fill();
  if (vib > 0) { g.strokeStyle = `rgba(255,236,190,${.8 * vib})`; g.lineWidth = 3; for (const d of [-22, 22, -36, 36]) { g.beginPath(); for (let i = 0; i <= 10; i++) { const yy = 20 + i * 20; const xx = d + Math.sin(i * 1.4 + curT * 40) * 5 * vib; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } }
  g.restore();
}
// 大柱子（倚着的那根）
function bigPillar(x, y0, y1, w = 90) { const gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, '#4a140e'); gr.addColorStop(.35, '#9a2e20'); gr.addColorStop(1, '#3a100a'); g.fillStyle = gr; g.fillRect(x - w / 2, y0, w, y1 - y0); g.fillStyle = '#d9a64e'; g.fillRect(x - w / 2 - 10, y1 - 26, w + 20, 26); g.fillRect(x - w / 2 - 6, y0, w + 12, 18); }
// 一排长案 + 坐着吃饭聊天的门客（远小近大）。seed 定颜色，laugh 0..1 一起笑
function guestRow(t, y, D0, n, x0, x1, seed, laugh = 0) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + .5) / n) + (r() - .5) * 20, c = GUEST[Math.floor(r() * GUEST.length)], ph = r() * 6.28, kind = r();
    const o = { x, y, D: D0, who: kind < .5 ? 'bun' : 'guan', robe: c[0], robe2: c[1], sy: .8, shadow: false, face: { eye: 'dot', mouth: 'small', look: [(r() - .5) * 2, 0] } };
    if (kind < .35) { o.armR = .8 + .9 * Math.max(0, Math.sin(t * 5 + ph)); o.lean = .06 * Math.sin(t * 5 + ph); o.face = { eye: 'happy', mouth: Math.sin(t * 5 + ph) > 0 ? 'o' : 'small' }; }   // 吃
    else if (kind < .7) { o.face = { eye: 'dot', mouth: Math.floor(t * 6 + ph) % 2 ? 'O' : 'smile', look: [Math.sin(ph) > 0 ? 1 : -1, 0] }; o.lean = .1 * Math.sin(t * 3 + ph); o.lift = D0 * .04 * Math.max(0, Math.sin(t * 4 + ph)); o.armL = Math.sin(t * 2 + ph) > .3 ? 1.3 + .3 * Math.sin(t * 7) : undefined; }   // 聊
    if (laugh > 0) { o.face = { eye: 'happy', mouth: 'grin' }; o.lift = D0 * .08 * Math.abs(Math.sin(t * 12 + ph)) * laugh; o.lean = .08 * Math.sin(t * 9 + ph) * laugh; }
    chibi(o);
  }
  g.fillStyle = '#4a2418'; g.fillRect(x0 - 20, y - D0 * .55, x1 - x0 + 40, D0 * .14); g.fillStyle = '#6a3424'; g.fillRect(x0 - 20, y - D0 * .55, x1 - x0 + 40, D0 * .03);   // 长案
  for (let i = 0; i < n; i += 2) { const x = lerp(x0, x1, (i + .5) / n); g.fillStyle = '#e8e0d0'; g.beginPath(); g.ellipse(x + D0 * .2, y - D0 * .56, D0 * .14, D0 * .05, 0, 0, 6.283); g.fill(); }   // 碗
}
function hall(t) {
  room(t, '#2e2018', DECK, 960, 1.1);
  g.fillStyle = '#3a1a12'; g.fillRect(-300, 60, W + 600, 60); g.fillStyle = '#d9a64e'; g.fillRect(-300, 116, W + 600, 6);
  for (const x of [120, 700, 1220]) pillar(x, 122, 620, 44);
  for (const x of [400, 960, 1500]) { const fl = 1 + .05 * Math.sin(t * 8 + x); g.fillStyle = '#f0a050'; g.beginPath(); g.ellipse(x, 230, 24, 30, 0, 0, 6.283); g.fill(); glow(x, 230, 120 * fl, .8); glow(x, 260, 380, .25); }
}

// ---------- 第 1 页：三千门客，角落里一人倚柱弹剑（0–4.6） ----------
const PLUCK = [2.1, 2.75, 3.4];
function sHall1(T) {
  const t = T;
  camStd(t, [[0, 1.0, 960, 540], [1.5, 1.05, 940, 540], [2.4, 1.55, 1480, 560, ], [4.6, 1.6, 1480, 560]].map(k => [k[0], k[1], k[2], k[3]]));
  hall(T);
  guestRow(T, 560, 70, 10, 180, 1280, 3); guestRow(T, 680, 88, 8, 140, 1240, 7); guestRow(T, 820, 110, 6, 80, 1180, 11);
  bigPillar(1700, -100, DECK, 110);
  const fx = P({ ...FX, x: 1560, face: { eye: 'line', mouth: 'flat', look: [-1, 0] }, lean: .1, armR: .7 });
  for (const h of PLUCK) { const k = prog(t, h, h + .25); if (k > 0 && k < 1) { fx.armR = .7 + .35 * Math.sin(Math.PI * k); fx.face = { eye: 'close', mouth: 'o' }; } }
  chibi(breathe(fx, T));
  const vib = Math.max(...PLUCK.map(h => t > h ? Math.exp(-(t - h) * 4) : 0));
  changjia(1500, 650, -.5, .9, vib);
  notes(T, 2.1, 4.6, 1560, DECK - 2.6 * D, 50);
}
// ---------- 第 2 页：穷得活不下去，来敲孟尝君的门（4.6–9.5） ----------
function sPoor(T) {
  const t = T - 4.6;
  camStd(t, [[0, 1.45, 820, 620], [1.6, 1.5, 820, 620], [2.6, 1.3, 1100, 600], [4.9, 1.36, 1160, 600]]);
  const sk = g.createLinearGradient(0, 0, 0, 900); sk.addColorStop(0, '#0e1220'); sk.addColorStop(1, '#2a2024'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1300);
  g.fillStyle = '#1a1617'; g.fillRect(-300, 520, W + 600, 340); for (let x = -300; x < W + 300; x += 70) g.fillRect(x, 500, 40, 24);
  g.fillStyle = '#2e2620'; g.fillRect(-300, DECK, W + 600, 500);
  // 孟尝君府的大门（门钉、门环、匾）
  const dx = 1500, dw = 480, dh = 560, op = eout(prog(t, 3.9, 4.6));
  glow(dx, DECK - 250, 400 * op, .7 * op);
  g.fillStyle = '#1a1210'; g.fillRect(dx - dw / 2, DECK - dh, dw, dh);
  for (const s of [-1, 1]) { const w2 = dw / 2 * (1 - .8 * op); const gx = s < 0 ? dx - dw / 2 : dx + dw / 2 - w2; const gr = g.createLinearGradient(gx, 0, gx + w2, 0); gr.addColorStop(0, '#6a1a12'); gr.addColorStop(1, '#9a2a1e'); g.fillStyle = gr; g.fillRect(gx, DECK - dh, w2, dh); for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) { const xx = gx + (c + .5) * w2 / 3; g.fillStyle = '#e0b04a'; g.beginPath(); g.arc(xx, DECK - dh + 70 + r * 100, 8 * (1 - .5 * op), 0, 6.283); g.fill(); } }
  g.fillStyle = '#d9a64e'; g.fillRect(dx - dw / 2 - 30, DECK - dh - 30, dw + 60, 30); g.fillRect(dx - 110, DECK - dh - 110, 220, 70); g.fillStyle = '#3a1a10'; g.font = `900 46px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('孟尝君府', dx, DECK - dh - 74);
  // 冯谖：瘦、打补丁、抱着肚子发抖 → 走到门口敲门 → 门开，光照到脸上
  const x = t < 1.6 ? 700 : kf(t, [[1.6, 700], [2.8, 1180, eout]]);
  const fx = P({ ...FX, x, face: { eye: 'line', mouth: 'wave' }, sx: .92 });
  if (t < 1.6) { fx.x += shake(T, 2, 10); fx.armL = fx.armR = undefined; }
  else if (t < 2.8) { walk(fx, x - 700, 70); fx.face = { eye: 'dot', mouth: 'small', look: [1, 0] }; }
  else if (t < 3.9) { fx.face = { eye: 'dot', mouth: 'small', look: [1, 0] }; for (const h of [3.0, 3.35]) { const k = prog(t, h, h + .2); if (k > 0 && k < 1) { fx.armR = 1.5 + .2 * Math.sin(Math.PI * k); fx.lean = .06 * Math.sin(Math.PI * k); } } if (!fx.armR) fx.armR = 1.4; }
  else { fx.face = { eye: 'wide', mouth: 'o', look: [1, 0] }; fx.armR = undefined; }
  chibi(breathe(fx, T));
  const [hx, hy] = HEAD(fx);
  if (t < 1.6) { pop(T, 4.9, '咕~', hx + 140, DECK - 1.1 * D, 54, { ttl: 1.3, stroke: false, font: SANS, weight: 600 }); for (const s of [-1, 1]) { g.strokeStyle = 'rgba(220,215,205,.6)'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 5; i++) g.lineTo(x + s * (.6 * D + 6 * (i % 2)), DECK - 1.3 * D + i * 14); g.stroke(); } }
  pop(T, 7.6, '咚咚', hx + 160, hy + 40, 60, { ttl: .9 });
  tag(T, 4.8, 6.4, 520, 440, '冯谖');
}
// ---------- 第 3–4 页：问爱好、问本事，都说没有（9.5–18.5） ----------
function sAsk(T) {
  const t = T - 9.5;
  camStd(t, [[0, 1.28, 960, 590], [2.0, 1.34, 960, 600], [2.3, 1.5, 1180, 620], [3.6, 1.52, 1180, 620], [4.2, 1.3, 960, 600], [6.0, 1.36, 1000, 610], [6.3, 1.5, 1180, 620], [7.0, 1.2, 960, 580], [9, 1.24, 960, 580]]);
  hall(T);
  const lg = prog(t, 6.9, 7.2) * (1 - prog(t, 8.7, 9));
  guestRow(T, 640, 80, 9, 150, 1770, 21, lg);
  const mc = P({ ...MC, x: 700, face: { eye: 'dot', mouth: 'smile', look: [1, 0] } });
  const fx = P({ ...FX, x: 1220, face: { eye: 'dot', mouth: 'small', look: [-1, 0] } });
  // 第 3 页：孟尝君探身问 → 冯谖摇头「没有」→ 孟尝君愣
  if (t < 4.2) {
    if (t > .2 && t < 2.2) { mc.lean = .1; mc.armR = kf(t, [[.2, .15], [.35, 1.4, eback]]); mc.face = { eye: 'happy', mouth: Math.floor(T * 7) % 2 && t < 1.6 ? 'O' : 'smile', look: [1, 0] }; }
    if (t >= 2.2) { fx.face = { eye: 'line', mouth: 'flat' }; for (const h of [2.3, 2.55, 2.8]) { const k = prog(t, h, h + .25); if (k > 0 && k < 1) fx.lean = .07 * Math.sin(2 * Math.PI * k); } }
    if (t >= 3.0) { mc.face = { eye: 'wide', mouth: 'o', look: [1, 0] }; }
  }
  // 第 4 页：再问 → 「也没有」还一摊手 → 满堂憋不住笑 → 孟尝君冒汗
  if (t >= 4.2) {
    mc.face = { eye: 'happy', mouth: Math.floor(T * 7) % 2 && t < 5.6 ? 'O' : 'smile', look: [1, 0] }; mc.lean = .14; mc.armR = kf(t, [[4.3, .15], [4.45, 1.5, eback]]);
    if (t >= 6.1) { fx.face = { eye: 'line', mouth: 'flat' }; fx.armL = fx.armR = kf(t, [[6.4, .15], [6.55, 1.5, eback], [7.4, 1.5], [7.6, .15]]); for (const h of [6.1, 6.35]) { const k = prog(t, h, h + .25); if (k > 0 && k < 1) fx.lean = .07 * Math.sin(2 * Math.PI * k); } }
    if (t >= 6.9) { mc.face = { eye: 'line', mouth: 'wave' }; mc.lean = 0; mc.armR = undefined; }
  }
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1)); changjia(1150, 690, -.5, .8);
  const [mx, my] = HEAD(mc), [fx2, fy] = HEAD(fx);
  pop(T, 10.3, '?', mx + 90, my + 10, 90, { ttl: 1.6 });
  pop(T, 12.6, '…', mx + 110, my + 30, 80, { ttl: 1.4, stroke: false });
  pop(T, 15.2, '?', mx + 90, my + 10, 90, { ttl: 1.2 });
  sweat(T, 16.5, mx + 100, my + 130, 70, 1.4);
  pop(T, 16.45, '噗', 520, 640 - 1.9 * 80, 60, { ttl: .8, rot: -.2 }); pop(T, 16.6, '噗嗤', 1500, 640 - 1.9 * 80, 56, { ttl: .8, rot: .15 });
  tag(T, 9.8, 13.4, 560, 440, '孟尝君');
}
