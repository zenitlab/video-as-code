// 张良拾履 · 场景和道具（都用代码画：平涂 + 渐变 + 高光 + 暖光晕，照 D1 的做法）

// ---------- 右上计数（D1「×1 ×2 ×3」：细一点的大衬线字，换数时模糊放大落定） ----------
function countX(t, steps, label = '', x = W - 90, y = 120, tOut = 1e9, col = '#efe6d4') {
  const n = steps.filter(s => t >= s).length; if (!n || t > tOut + .3) return;
  const t0 = steps[n - 1], k = eout(prog(t, t0, t0 + .25)), a = 1 - prog(t, tOut, tOut + .3);
  g.save(); g.globalAlpha = a; g.textAlign = 'right'; g.textBaseline = 'middle';
  g.filter = k < 1 ? `blur(${((1 - k) * 8).toFixed(1)}px)` : 'none';
  g.translate(x, y); g.scale(1 + .4 * (1 - k), 1 + .4 * (1 - k));
  g.font = `400 104px ${SERIF}`; g.fillStyle = col; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 12;
  g.fillText('×' + n, 0, 0);
  if (label) { g.font = `600 30px ${SERIF}`; g.fillStyle = 'rgba(230,220,200,.75)'; g.fillText(label, 0, 66); }
  g.restore();
}
// 滚动数字计数（120 斤、10 天）
function countRoll(t, t0, t1, from, to, unit, x = W - 90, y = 120, tOut = 1e9, col = '#efe6d4') {
  if (t < t0 || t > tOut + .3) return; const v = Math.round(lerp(from, to, eio(prog(t, t0, t1)))), a = at(t, t0, .2) * (1 - prog(t, tOut, tOut + .3));
  const pk = t >= t1 ? Math.exp(-(t - t1) / .08) : 0;
  g.save(); g.globalAlpha = a; g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.translate(x, y + 40); g.scale(1 + .25 * pk, 1 + .25 * pk);
  g.font = `900 52px ${SERIF}`; const uw = g.measureText(unit).width; g.fillStyle = col; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 12; g.fillText(unit, 0, 0);
  g.font = `900 110px ${SERIF}`; g.fillStyle = t >= t1 ? COL.red : col; g.fillText(v, -uw - 10, 0); g.restore();
  if (t >= t1) ring(t, t1, x - 120, y + 50, 200, 30, .8, 3);
}
// 大红叉（失败）：两笔划出来
function bigX(t, t0, x, y, s) {
  if (t < t0) return; g.save(); g.strokeStyle = COL.red; g.lineWidth = s * .16; g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 10;
  const k1 = eout(prog(t, t0, t0 + .12)), k2 = eout(prog(t, t0 + .12, t0 + .24));
  g.beginPath(); g.moveTo(x - s / 2, y - s / 2); g.lineTo(x - s / 2 + s * k1, y - s / 2 + s * k1); g.stroke();
  if (k2 > 0) { g.beginPath(); g.moveTo(x + s / 2, y - s / 2); g.lineTo(x + s / 2 - s * k2, y - s / 2 + s * k2); g.stroke(); } g.restore();
}
// 金星：头顶两三颗四角星闪
function stars(t, t0, t1, x, y, s) {
  if (t < t0 || t > t1) return; g.save();
  for (let i = 0; i < 3; i++) { const an = (t - t0) * 4 + i * 2.09, px = x + Math.cos(an) * s, py = y + Math.sin(an) * s * .3, sc = .6 + .4 * Math.abs(Math.sin(t * 9 + i));
    g.fillStyle = '#ffd86a'; g.beginPath(); for (let j = 0; j < 8; j++) { const r = j % 2 ? s * .08 : s * .26 * sc, aa = j * Math.PI / 4; g.lineTo(px + Math.cos(aa) * r, py + Math.sin(aa) * r); } g.fill(); }
  g.restore();
}
// 光芒（宝物出现）
function rays(t, x, y, r, a = 1, col = '255,214,130') {
  if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(t * .25); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { g.rotate(Math.PI / 7); const gr = g.createLinearGradient(0, 0, r, 0); gr.addColorStop(0, `rgba(${col},${.35 * a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(r, -r * .07); g.lineTo(r, r * .07); g.fill(); }
  g.restore(); glow(x, y, r * .6, .6 * a);
}
// 思考气泡：一串小圆点 → 云朵（米色带光），inner() 在气泡里画东西
function bubble(t, t0, t1, x, y, w, h, fromX, fromY, inner) {
  if (t < t0 || t > t1 + .25) return; const k = eback(prog(t, t0 + .2, t0 + .45)), a = 1 - prog(t, t1, t1 + .25);
  g.save(); g.globalAlpha = a;
  for (let i = 0; i < 3; i++) { const kk = prog(t, t0 + i * .06, t0 + i * .06 + .12); if (kk <= 0) continue; const u = (i + 1) / 4; g.fillStyle = '#efe4c8'; g.beginPath(); g.arc(lerp(fromX, x - w * .3, u), lerp(fromY, y + h * .4, u), (8 + i * 5) * eout(kk), 0, 6.283); g.fill(); }
  if (k > 0) {
    g.translate(x, y); g.scale(k, k); glow(0, 0, w * .9, .35);
    g.fillStyle = '#efe4c8'; g.beginPath(); const n = 10;
    for (let i = 0; i < n; i++) { const an = i / n * 6.283; g.moveTo(Math.cos(an) * w * .42 + w * .14, Math.sin(an) * h * .38); g.arc(Math.cos(an) * w * .42, Math.sin(an) * h * .38, w * .14, 0, 6.283); }
    g.fill(); g.beginPath(); g.ellipse(0, 0, w * .45, h * .42, 0, 0, 6.283); g.fill();
    g.save(); g.beginPath(); g.ellipse(0, 0, w * .48, h * .45, 0, 0, 6.283); g.clip(); inner(t); g.restore();
  }
  g.restore();
}
// 半两钱
function coin(x, y, r, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, .3 + .7 * Math.abs(Math.cos(rot * 2))); g.fillStyle = '#c8933e'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.fillStyle = '#8a5e22'; g.fillRect(-r * .28, -r * .28, r * .56, r * .56); g.strokeStyle = '#f0c46a'; g.lineWidth = r * .12; g.beginPath(); g.arc(0, 0, r * .86, 3.6, 5.2); g.stroke(); g.restore(); }
// 钱箱
function chest(x, y, s, open = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#6a2a1e'; g.fillRect(-60, -60, 120, 60); g.fillStyle = '#d9a64e'; g.fillRect(-60, -60, 120, 6); g.fillRect(-8, -42, 16, 18);
  g.save(); g.translate(-60, -60); g.rotate(-open * 1.9); g.fillStyle = '#7d3424'; g.beginPath(); g.roundRect(0, -26, 120, 26, [12, 12, 0, 0]); g.fill(); g.fillStyle = '#d9a64e'; g.fillRect(0, -4, 120, 4); g.restore();
  if (open > .3) { g.fillStyle = '#e0b04a'; g.beginPath(); g.ellipse(0, -60, 54, 12, 0, 0, 6.283); g.fill(); glow(0, -70, 120, .5 * open); }
  g.restore();
}
// 铁锤（铁椎）：大铁球 + 木柄
function hammer(x, y, s, rot) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.strokeStyle = '#6b4a2c'; g.lineWidth = 10; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -120); g.stroke();
  const gr = g.createRadialGradient(-14, -150, 4, 0, -140, 46); gr.addColorStop(0, '#8a8d96'); gr.addColorStop(1, '#2a2b30'); g.fillStyle = gr; g.beginPath(); g.arc(0, -140, 44, 0, 6.283); g.fill();
  g.fillStyle = '#3a3b40'; for (let i = 0; i < 6; i++) { const a = i * 1.047; g.beginPath(); g.arc(Math.cos(a) * 44, -140 + Math.sin(a) * 44, 8, 0, 6.283); g.fill(); }
  g.restore();
}
// 马（Q 版，侧面朝右）：步态 ph
function horse(x, y, s, ph, col = '#c9b48e') {
  g.save(); g.translate(x, y); g.scale(s, s); const bob = Math.abs(Math.sin(ph)) * 4, dk = '#8a7454';
  g.lineCap = 'round';
  for (const [lx, o, c] of [[-40, Math.PI, dk], [34, 0, dk], [-30, 0, col], [44, Math.PI, col]]) { const sw = Math.sin(ph + o) * 14; g.strokeStyle = c; g.lineWidth = 11; g.beginPath(); g.moveTo(lx, -52 - bob); g.lineTo(lx + sw * .6, -26); g.lineTo(lx + sw, -4); g.stroke(); g.fillStyle = '#2a1f17'; g.beginPath(); g.ellipse(lx + sw, -3, 8, 5, 0, 0, 6.283); g.fill(); }
  g.fillStyle = col; g.beginPath(); g.ellipse(0, -66 - bob, 64, 30, 0, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(34, -88 - bob); g.quadraticCurveTo(52, -130 - bob, 70, -140 - bob); g.lineTo(88, -124 - bob); g.quadraticCurveTo(70, -96 - bob, 62, -62 - bob); g.closePath(); g.fill();   // 脖子
  g.save(); g.translate(80, -132 - bob); g.rotate(.7); g.beginPath(); g.ellipse(14, 0, 32, 15, 0, 0, 6.283); g.fill(); g.fillStyle = '#e8d8b8'; g.beginPath(); g.ellipse(36, 2, 10, 10, 0, 0, 6.283); g.fill(); g.restore();   // 头（长脸朝前下）
  g.fillStyle = col; g.beginPath(); g.moveTo(70, -146 - bob); g.lineTo(66, -166 - bob); g.lineTo(80, -150 - bob); g.fill();   // 耳
  g.fillStyle = '#5a4430'; g.beginPath(); g.moveTo(36, -92 - bob); g.quadraticCurveTo(50, -140 - bob, 72, -148 - bob); g.lineTo(66, -128 - bob); g.quadraticCurveTo(54, -110 - bob, 48, -84 - bob); g.fill();   // 鬃
  g.strokeStyle = '#5a4430'; g.lineWidth = 8; g.beginPath(); g.moveTo(-62, -72 - bob); g.quadraticCurveTo(-84, -56, -78, -24 + Math.sin(ph) * 5); g.stroke();
  g.fillStyle = COL.ink; g.beginPath(); g.arc(84, -138 - bob, 3.5, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.ellipse(-10, -82 - bob, 40, 8, 0, 0, 6.283); g.fill();
  g.restore();
}
// 车（秦车：车厢 + 伞盖 + 大轮），gold = 主车
function carriage(x, y, s, ph, gold = false, wreck = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (wreck > 0) { g.rotate(-wreck * .35); g.translate(0, wreck * 20); }
  g.strokeStyle = '#3a2a1e'; g.lineWidth = 6; g.beginPath(); g.moveTo(40, -60); g.lineTo(150, -70); g.stroke();   // 辕
  g.fillStyle = gold ? '#7a2a1e' : '#4a3a2e'; g.beginPath(); g.roundRect(-70, -120, 130, 66, 8); g.fill();
  g.fillStyle = gold ? '#d9a64e' : '#6a5440'; g.fillRect(-70, -122, 130, 6);
  g.strokeStyle = '#3a2a1e'; g.lineWidth = 5; g.beginPath(); g.moveTo(-5, -120); g.lineTo(-5, -200); g.stroke();
  g.fillStyle = gold ? '#e0b04a' : '#5c4a3a'; g.beginPath(); g.moveTo(-95, -190); g.quadraticCurveTo(-5, -240, 85, -190); g.closePath(); g.fill();   // 伞盖
  if (gold) glow(-5, -205, 120, .35);
  g.save(); g.translate(-5, -40); g.rotate(ph * .5); g.strokeStyle = '#2a1f17'; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 42, 0, 6.283); g.stroke(); g.lineWidth = 4; for (let i = 0; i < 6; i++) { g.rotate(1.047); g.beginPath(); g.moveTo(0, 0); g.lineTo(42, 0); g.stroke(); } g.restore();
  g.restore();
}
// 通缉画像：纸 + 圆脸简笔 + 红「缉」
function poster(x, y, s, rot, k = 1) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * eback(k), s * eback(k));
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-66, -86, 140, 180);
  g.fillStyle = '#e8dcbc'; g.fillRect(-70, -90, 140, 180); g.strokeStyle = 'rgba(120,90,50,.5)'; g.lineWidth = 2; g.strokeRect(-62, -82, 124, 164);
  g.fillStyle = '#b8322a'; g.font = `900 34px ${SERIF}`; g.textAlign = 'center'; g.fillText('缉', 0, -50);
  g.strokeStyle = '#2a1d14'; g.lineWidth = 3; g.beginPath(); g.arc(0, 10, 30, 0, 6.283); g.stroke(); g.fillStyle = '#2a1d14'; g.beginPath(); g.arc(0, 10, 31, Math.PI * 1.05, Math.PI * 1.95); g.fill();
  g.beginPath(); g.arc(-10, 14, 3, 0, 6.283); g.arc(10, 14, 3, 0, 6.283); g.fill(); g.font = `600 18px ${SERIF}`; g.fillText('张良', 0, 68);
  g.restore();
}
// 公鸡（Q 版）：打鸣时脖子一伸
function rooster(x, y, s, crow = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#e9e0cf'; g.beginPath(); g.ellipse(0, -40, 38, 30, 0, 0, 6.283); g.fill();
  g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(-36, -50); g.quadraticCurveTo(-70, -90, -54, -30); g.fill();   // 尾
  g.fillStyle = '#2f5a3a'; g.beginPath(); g.moveTo(-32, -54); g.quadraticCurveTo(-74, -70, -60, -26); g.lineTo(-40, -36); g.fill();
  g.save(); g.translate(20, -60); g.rotate(-crow * .5); g.translate(0, -crow * 10);
  g.fillStyle = '#e9e0cf'; g.beginPath(); g.arc(8, -16, 20, 0, 6.283); g.fill();
  g.fillStyle = '#d23a2a'; g.beginPath(); g.arc(2, -36, 8, 0, 6.283); g.arc(12, -38, 8, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(18, 0, 5, 9, 0, 0, 6.283); g.fill();
  g.fillStyle = '#e6a33a'; g.beginPath(); g.moveTo(26, -20); g.lineTo(26 + 14 + crow * 4, -16 - crow * 4); g.lineTo(26, -10); g.fill();
  if (crow > .3) { g.beginPath(); g.moveTo(26, -14); g.lineTo(38, -6); g.lineTo(26, -8); g.fill(); }
  g.fillStyle = COL.ink; g.beginPath(); g.arc(14, -20, 3, 0, 6.283); g.fill(); g.restore();
  g.strokeStyle = '#e6a33a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-6, -12); g.lineTo(-8, 0); g.moveTo(8, -12); g.lineTo(10, 0); g.stroke();
  g.restore();
}
// 竹简（一编书）：卷着 → 展开，open 0..1
function slips(x, y, s, open = 0, title = '') {
  g.save(); g.translate(x, y); g.scale(s, s);
  const n = Math.round(lerp(4, 18, open)), w = 14, h = 150, tot = n * w;
  for (let i = 0; i < n; i++) { const xx = -tot / 2 + i * w; const gr = g.createLinearGradient(xx, 0, xx + w, 0); gr.addColorStop(0, '#c9a865'); gr.addColorStop(.5, '#e2c784'); gr.addColorStop(1, '#b8954f'); g.fillStyle = gr; g.fillRect(xx, -h / 2, w - 1.5, h); }
  g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-tot / 2, -h * .3); g.lineTo(tot / 2, -h * .3); g.moveTo(-tot / 2, h * .3); g.lineTo(tot / 2, h * .3); g.stroke();
  if (open < .5) { g.fillStyle = '#b8954f'; g.beginPath(); g.ellipse(tot / 2, 0, 16, h / 2, 0, 0, 6.283); g.fill(); g.strokeStyle = '#8a6a3a'; g.lineWidth = 2; for (let r = 4; r < 16; r += 4) { g.beginPath(); g.ellipse(tot / 2, 0, r, h / 2 - (16 - r), 0, 0, 6.283); g.stroke(); } }
  if (title && open > .6) { g.globalAlpha = prog(open, .6, 1); g.font = `900 30px ${SERIF}`; g.fillStyle = '#2a1d14'; g.textAlign = 'center'; [...title].forEach((ch, i) => g.fillText(ch, 0, -42 + i * 34)); }
  g.restore();
}
// 远山（层叠）+ 黄石
function mountains(t, base, tint = 0) {
  const lay = [['#2a2a38', .9, 300, 7], ['#232331', .75, 420, 11], ['#1b1b26', .6, 520, 5]];
  for (const [c, k, y0, seed] of lay) { const r = rng(seed); g.fillStyle = c; g.beginPath(); g.moveTo(-200, base); let x = -200; while (x < W + 200) { const w = 180 + r() * 260, hh = y0 * k * (.6 + r() * .5); g.quadraticCurveTo(x + w * .5, base - hh, x + w, base - r() * 40); x += w; } g.lineTo(W + 200, base + 400); g.lineTo(-200, base + 400); g.fill(); }
}
function yellowStone(t, x, y, s, glowA = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (glowA > 0) { rays(t, 0, -50, 260, glowA * .8); }
  const gr = g.createLinearGradient(0, -110, 0, 0); gr.addColorStop(0, '#f0c75a'); gr.addColorStop(1, '#a8781e'); g.fillStyle = gr;
  g.beginPath(); g.moveTo(-90, 0); g.quadraticCurveTo(-100, -70, -40, -100); g.quadraticCurveTo(10, -125, 60, -90); g.quadraticCurveTo(100, -55, 92, 0); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(-30, -78, 30, 10, -.4, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(90,60,20,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(10, -96); g.lineTo(0, -60); g.lineTo(20, -30); g.stroke();
  g.restore();
}
// 室内背景：暗褐墙 + 木柱 + 地板，cx 暖光中心
function room(t, wall = '#2a1f19', floorY = 860, cx = W / 2, warm = 1) {
  g.fillStyle = wall; g.fillRect(-300, -300, W + 600, floorY + 300);
  const fl = g.createLinearGradient(0, floorY, 0, H + 300); fl.addColorStop(0, '#3a2b20'); fl.addColorStop(1, '#1e1610'); g.fillStyle = fl; g.fillRect(-300, floorY, W + 600, 700);
  g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-300, floorY, W + 600, 6);
  glow(cx, floorY - 260, 900, .35 * warm);
}
function pillar(x, y0, y1, w = 46, col = '#8a2a1e') { const gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, '#5a1a12'); gr.addColorStop(.4, col); gr.addColorStop(1, '#4a140e'); g.fillStyle = gr; g.fillRect(x - w / 2, y0, w, y1 - y0); g.fillStyle = '#d9a64e'; g.fillRect(x - w / 2 - 6, y1 - 16, w + 12, 16); }
// 匾：横匾一个大字（掉落时 fall 0..1）
function plaque(x, y, ch, fall = 0, t = 0) {
  g.save(); const k = ein(clamp(fall)); g.translate(x, y + k * 520); g.rotate(k * .5);
  g.fillStyle = '#2a1a12'; g.fillRect(-120, -60, 240, 120); g.fillStyle = '#d9a64e'; g.fillRect(-110, -50, 220, 100); g.fillStyle = '#3a1a10'; g.fillRect(-100, -40, 200, 80);
  g.fillStyle = '#e8c070'; g.font = `900 64px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 0, 2); g.restore();
}
// 黑旗扫过（秦灭韩的转场）：一面巨大黑旗从右往左扫，k 0..1
function blackFlag(t, k) {
  if (k <= 0 || k >= 1) return; const x = lerp(W + 300, -W - 300, eio(k));
  g.save(); g.fillStyle = '#121012'; g.beginPath(); g.moveTo(x, -50);
  for (let i = 0; i <= 12; i++) { const yy = -50 + i * 100; g.lineTo(x + W * 1.1 + 40 * Math.sin(i * .9 + t * 8), yy); }
  g.lineTo(x, H + 50); g.closePath(); g.fill();
  g.fillStyle = '#b8322a'; g.font = `900 260px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('秦', x + W * .55, H / 2); g.restore();
}
// 帐篷内：布帐、沙盘、小旗
function tentIn(t) {
  g.fillStyle = '#2b2118'; g.fillRect(-300, -300, W + 600, H + 600);
  g.fillStyle = '#3a2c20'; g.beginPath(); g.moveTo(-300, 860); g.lineTo(W / 2, -120); g.lineTo(W + 300, 860); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4; for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(W / 2, -120); g.lineTo(W / 2 + i * 260, 860); g.stroke(); }
  g.fillStyle = '#4a3a2a'; g.fillRect(-300, 860, W + 600, 500);
  glow(W / 2, 600, 800, .4);
}
function sandTable(t, x, y, s, flagsUp = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#5a4030'; g.fillRect(-260, 0, 520, 60); g.fillStyle = '#3a2a1e'; g.fillRect(-240, 60, 30, 80); g.fillRect(210, 60, 30, 80);
  g.fillStyle = '#b89a66'; g.beginPath(); g.ellipse(0, 0, 250, 40, 0, 0, 6.283); g.fill();
  g.fillStyle = '#8a7048'; for (const [mx, mw] of [[-120, 80], [40, 110], [150, 60]]) { g.beginPath(); g.moveTo(mx - mw / 2, 0); g.quadraticCurveTo(mx, -50, mx + mw / 2, 0); g.fill(); }
  g.strokeStyle = '#4a6a8a'; g.lineWidth = 6; g.beginPath(); g.moveTo(-240, 10); g.quadraticCurveTo(-40, -20, 240, 14); g.stroke();
  const fl = [[-160, '#b8322a'], [-30, '#b8322a'], [90, '#222'], [190, '#222']];
  fl.forEach(([fx, c], i) => { const k = eback(prog(flagsUp, i * .2, i * .2 + .3)); if (k <= 0) return; g.strokeStyle = '#3a2a1e'; g.lineWidth = 3; g.beginPath(); g.moveTo(fx, 0); g.lineTo(fx, -60 * k); g.stroke(); g.fillStyle = c; g.beginPath(); g.moveTo(fx, -60 * k); g.lineTo(fx + 30 + 4 * Math.sin(t * 6 + i), -52 * k); g.lineTo(fx, -42 * k); g.fill(); });
  g.restore();
}
// 香炉 + 烟
function incense(t, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#7a5a2a'; g.beginPath(); g.ellipse(0, 0, 40, 14, 0, 0, Math.PI); g.lineTo(-40, -2); g.fill(); g.fillRect(-40, -24, 80, 24); g.fillStyle = '#9a7a3a'; g.beginPath(); g.ellipse(0, -24, 40, 10, 0, 0, 6.283); g.fill();
  g.strokeStyle = '#c8a36a'; g.lineWidth = 3; for (const dx of [-12, 0, 12]) { g.beginPath(); g.moveTo(dx, -26); g.lineTo(dx, -70); g.stroke(); glow(dx, -72, 10, .8); }
  g.strokeStyle = 'rgba(220,215,205,.35)'; g.lineWidth = 4;
  for (const dx of [-12, 0, 12]) { g.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, yy = -72 - u * 260, xx = dx + Math.sin(u * 7 + t * 2 + dx) * 18 * u; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  g.restore();
}
// 画像：竖幅卷轴里画一个人（flip 0..1 翻面，pretty = 画的是秀气版）
function portrait(t, x, y, s, flip, pretty) {
  g.save(); g.translate(x, y); g.scale(s * Math.cos(flip * Math.PI), s);
  g.fillStyle = '#5a3b22'; g.fillRect(-110, -170, 220, 14); g.fillRect(-110, 160, 220, 14);
  g.fillStyle = '#ecdfc2'; g.fillRect(-100, -160, 200, 320); g.strokeStyle = 'rgba(120,90,50,.45)'; g.lineWidth = 2; g.strokeRect(-90, -150, 180, 300);
  g.restore();
  g.save(); g.translate(x, y); g.scale(Math.abs(Math.cos(flip * Math.PI)), 1);
  const showPretty = flip > .5 ? pretty : !pretty;
  chibi({ x: 0, y: 130 * s, D: 110 * s, who: 'zl', robe: showPretty ? '#e2a7b4' : '#7fa6b6', robe2: showPretty ? '#c07a8a' : '#58808f', face: showPretty ? { eye: 'happy', mouth: 'smile' } : { eye: 'angry', mouth: 'flat' }, shadow: false, sx: showPretty ? .9 : 1.3, beard: showPretty ? null : 'black' });
  if (showPretty) { g.fillStyle = 'rgba(236,138,132,.5)'; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 30 * s, -30 * s + 130 * s - 1.47 * 110 * s + 30 * s, 6 * s, 0, 6.283); g.fill(); } }
  g.restore();
}
// 晨光天（dawn）/ 黎明前（predawn）/ 深夜（night）的天色
function skyFor(tod) {
  if (tod === 'dawn') return [['#3a3050', 0], ['#8a5a6a', .45], ['#e09a6a', .85], ['#f2c486', 1]];
  if (tod === 'predawn') return [['#0f1830', 0], ['#26304e', .6], ['#4a4060', 1]];
  return [['#0e1220', 0], ['#1c1a20', .6], ['#2b211b', 1]];
}
