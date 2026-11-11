// 冯谖弹剑 · 第 21–37 页（103.2–195 秒）：失势、百姓迎接、狡兔三窟、高枕而卧、结尾

const KQ = { who: 'king', robe: '#8a3a3a', robe2: '#662626', beard: 'black', buckle: 1 };   // 齐王
const KW = { who: 'king', robe: '#3a6a4a', robe2: '#284c34', beard: 'goatee', buckle: 1 };  // 魏王
function rabbit(x, y, s, ph = 0, look = 1) {
  g.save(); g.translate(x, y); g.scale(s * look, s); const hop = Math.abs(Math.sin(ph)) * 14;
  g.fillStyle = '#efe6d6'; g.beginPath(); g.ellipse(0, -30 - hop, 46, 30, -.1, 0, 6.283); g.fill();
  g.beginPath(); g.arc(40, -58 - hop, 24, 0, 6.283); g.fill();
  for (const d of [0, 14]) { g.beginPath(); g.ellipse(34 + d, -98 - hop, 8, 28, .2 + d * .01, 0, 6.283); g.fill(); g.fillStyle = '#e8b4b0'; g.beginPath(); g.ellipse(34 + d, -96 - hop, 4, 18, .2, 0, 6.283); g.fill(); g.fillStyle = '#efe6d6'; }
  g.beginPath(); g.arc(-44, -34 - hop, 12, 0, 6.283); g.fill();
  g.fillStyle = COL.ink; g.beginPath(); g.arc(48, -62 - hop, 4, 0, 6.283); g.fill(); g.fillStyle = 'rgba(236,138,132,.7)'; g.beginPath(); g.ellipse(52, -50 - hop, 7, 4, 0, 0, 6.283); g.fill();
  g.restore();
}
// 地下剖面：地面一条线，下面三个窝（洞道 + 圆室），n 个已挖，第 n 个在 t0 时开挖
const DENS = [[460, '薛'], [960, '齐相'], [1460, '宗庙']];
function denView(T, t0, n) {
  const t = T - t0;
  camStd(t, [[0, .8, 960, 212], [5, .86, 960, 230]]);
  const sk = g.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#1a2030'); sk.addColorStop(1, '#3a3a3a'); g.fillStyle = sk; g.fillRect(-900, -900, W + 1800, 1320);
  const so = g.createLinearGradient(0, 420, 0, H); so.addColorStop(0, '#5a4430'); so.addColorStop(1, '#2a1e14'); g.fillStyle = so; g.fillRect(-900, 420, W + 1800, 1200);
  g.fillStyle = '#3d4a2c'; g.fillRect(-900, 410, W + 1800, 16); for (let i = -12; i < 52; i++) { const x = i * 52; g.strokeStyle = '#3d4a2c'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 412); g.lineTo(x + 6, 396 + 4 * Math.sin(T * 2 + i)); g.stroke(); }
  const r = rng(77); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(30,20,10,${.2 + r() * .3})`; g.beginPath(); g.ellipse(r() * W, 460 + r() * 600, 6 + r() * 10, 4 + r() * 6, 0, 0, 6.283); g.fill(); }
  DENS.slice(0, n).forEach(([x, lab], i) => {
    const k = i === n - 1 ? eout(prog(t, .4, 1.6)) : 1; if (k <= 0) return;
    g.fillStyle = '#140e0a'; g.beginPath(); g.moveTo(x - 30, 420); g.quadraticCurveTo(x - 60, 420 + 200 * k, x, 420 + 260 * k); g.lineTo(x + 40, 420 + 260 * k); g.quadraticCurveTo(x - 10, 420 + 180 * k, x + 30, 420); g.fill();
    g.beginPath(); g.ellipse(x + 30, 700 + 20 * k, 150 * k, 90 * k, 0, 0, 6.283); g.fill();
    if (k >= 1) { glow(x + 30, 700, 160, .5); g.font = `900 64px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffd86a'; g.fillText(lab, x + 30, 712); }
    if (i === n - 1 && t > .4 && t < 1.8) for (let j = 0; j < 10; j++) { const ph = ((t * 2 + j / 10) % 1); g.fillStyle = `rgba(140,100,60,${1 - ph})`; g.beginPath(); g.arc(x + (j - 5) * 12, 420 - ph * 120 + ph * ph * 160, 7, 0, 6.283); g.fill(); }
  });
  // 冯谖在地面上挖
  const dx = DENS[n - 1][0] + 160;
  const fx = { ...FX, x: dx, y: 412, D: 150, face: t < 1.6 ? { eye: 'xx', mouth: 'grit' } : { eye: 'happy', mouth: 'smile' }, armR: t < 1.6 ? 1.4 + .9 * Math.max(0, Math.sin(t * 14)) : 2.4 };
  if (t >= 1.6) { fx.lift = 150 * .2 * Math.abs(Math.sin(t * 6)); fx.armL = 2.4 + .3 * Math.sin(t * 12); fx.hair = .3 * Math.sin(t * 12); }
  if (t < 1.6) fx.lean = -.1 * Math.max(0, Math.sin(t * 14));
  chibi(breathe(fx, T)); const h = handPos(fx, 1); g.strokeStyle = '#6a4a2a'; g.lineWidth = 8; g.beginPath(); g.moveTo(h[0], h[1]); g.lineTo(h[0] - 90, h[1] + 80); g.stroke(); g.fillStyle = '#9aa0a8'; g.beginPath(); g.ellipse(h[0] - 96, h[1] + 92, 22, 14, .7, 0, 6.283); g.fill();
  rabbit(DENS[0][0] + 130, 775, .8, T * 5, Math.sin(T * 1.3) > 0 ? 1 : -1);
  for (let i = 0; i < 14; i++) { const ph = ((T * .25 + i / 14) % 1); g.fillStyle = `rgba(120,90,60,${.6 * (1 - ph)})`; g.beginPath(); g.arc(100 + i * 130 + 20 * Math.sin(T + i), 440 + ph * 600, 4, 0, 6.283); g.fill(); }
}

// 第 21 页：很不高兴　先生歇着吧（103.2–107.8）
function sDismiss(T) {
  const t = T - 103.2;
  camStd(t, [[0, 1.3, 960, 600], [4.6, 1.36, 980, 610]]);
  hall(T);
  const mc = P({ ...MC, x: 700, face: t < 1.6 ? { eye: 'line', mouth: 'frown', look: [1, 0] } : { eye: 'close', mouth: 'flat' }, flush: .3 });
  if (t > 1.6) { mc.armR = kf(t, [[1.6, .15], [1.75, 2.0, eout], [2.0, 1.6], [2.4, .15]]); mc.lean = -.06; }
  const fx = P({ ...FX, x: t < 2.6 ? 1220 : kf(t, [[2.6, 1220], [4.6, 2100, k => k]]), face: t < 2.2 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'close', mouth: 'smile' } });
  if (t > 2.0 && t < 2.6) fx.lean = .2 * Math.sin(Math.PI * prog(t, 2.0, 2.6));
  if (t > 2.6) walk(fx, fx.x - 1220, 70);
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1));
  const [mx, my] = HEAD(mc); pop(T, 104.6, '哼', mx + 100, my + 30, 64, { ttl: 1.2, rot: -.15 }); speedLines(T, 104.9, 105.3, 900, DECK - 300, 1, 160, 5, 2);
}
// 第 22 页：齐王不用他了（108.0–112.8）
function sFall(T) {
  const t = T - 108.0;
  camStd(t, [[0, 1.14, 960, 560], [4.8, 1.2, 980, 570]]);
  room(T, '#2e1f18', DECK, 960); for (const x of [180, 1740]) pillar(x, 140, DECK, 60);
  g.fillStyle = '#6a2a1e'; g.fillRect(1180, 760, 420, 100); g.fillStyle = '#d9a64e'; g.fillRect(1180, 760, 420, 8);
  const kq = P({ ...KQ, x: 1390, y: 760, face: { eye: 'angry', mouth: 'grit', look: [-1, 0] }, armL: kf(t, [[.3, .15], [.45, 1.6, eback]]) });
  const mc = P({ ...MC, x: kf(t, [[0, 760], [2.4, 760], [4.8, -200, k => k]]), face: t < 1.2 ? { eye: 'wide', mouth: 'O', look: [1, 0] } : { eye: 'line', mouth: 'wave' } });
  if (t > 2.4) { walk(mc, 760 - mc.x, 60); mc.sy = .95; }
  chibi(breathe(kq, T)); chibi(breathe(mc, T, 1));
  sweat(T, 109.2, mc.x + 90, DECK - 2.0 * D, 70, 1.4);
  if (t > 2.4) { const h = handPos(mc, 1); g.fillStyle = '#8a7058'; g.beginPath(); g.ellipse(h[0] + 30, h[1] - 10, 50, 40, 0, 0, 6.283); g.fill(); }
  tag(T, 108.2, 110.6, 300, 440, '一年后'); tag(T, 108.8, 112.6, 1300, 440, '齐王');
  const [kx, ky] = HEAD(kq); pop(T, 108.6, '走！', kx - 120, ky + 30, 64, { ttl: 1.4, col: COL.red });
}
// 第 23–24 页：离薛百里，百姓扶老携幼来迎（113.0–123.6）
function sWelcome(T) {
  const t = T - 113.0;
  camStd(t, [[0, .95, 960, 500], [2.6, 1.0, 960, 520], [5.6, 1.04, 960, 530], [6.0, 1.5, 900, 640], [10.6, 1.56, 900, 650]]);
  const sk = g.createLinearGradient(0, 0, 0, 700); sk.addColorStop(0, '#3a3050'); sk.addColorStop(1, '#e0a070'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1000); glow(1500, 520, 500, .5);
  mountains(T, 620); g.fillStyle = '#4a3c2e'; g.fillRect(-300, 600, W + 600, 700);
  g.fillStyle = '#6e5a44'; g.beginPath(); g.moveTo(860, 600); g.lineTo(1060, 600); g.lineTo(1500, H + 200); g.lineTo(420, H + 200); g.closePath(); g.fill();   // 路
  const cheer = t > 1.6 ? 'cheer' : 'calm';
  villagers(T, [[640, 70, 6, 300, 830], [640, 70, 6, 1090, 1620], [720, 90, 5, 120, 760], [720, 90, 5, 1160, 1800], [830, 120, 4, -40, 600], [830, 120, 4, 1320, 1960], [980, 150, 3, -150, 420], [980, 150, 3, 1500, 2080]], cheer, 51);
  // 孩子（小一号）
  for (const [x, y] of [[560, 850], [1360, 850], [300, 1000], [1640, 1000]]) chibi(breathe({ x, y, D: 80, who: 'bun', robe: '#a07050', robe2: '#7a5038', face: { eye: 'happy', mouth: 'grin' }, armR: 2.6, lift: t > 1.6 ? 12 * Math.abs(Math.sin(T * 7 + x)) : 0 }, T, x));
  // 车上的孟尝君和冯谖，从远处开过来
  const cy = kf(t, [[0, 640], [5.6, 880, eout]]), s = lerp(.5, 1.0, prog(cy, 640, 880));
  horse(960 + 220 * s, cy, 1.3 * s, T * 5); carriage(960 - 60 * s, cy, 1.4 * s, T * 4, true);
  const mc = { ...MC, x: 960 - 40 * s, y: cy - 150 * s, D: 160 * s, face: t < 2 ? { eye: 'dot', mouth: 'small' } : { eye: 'wide', mouth: 'O', look: [0, 0] } };
  const fx = { ...FX, x: 960 - 140 * s, y: cy - 140 * s, D: 140 * s, face: { eye: 'smug', mouth: 'smile', look: [1, 0] } };
  if (t > 6.0) { mc.face = { eye: 'happy', mouth: 'grin', look: [-1, 0] }; fx.face = { eye: 'close', mouth: 'smile' }; }
  chibi(fx); chibi(mc);
  if (t > 6.6) { const [hx, hy] = [mc.x, mc.y - 1.6 * mc.D]; for (const sx of [-1, 1]) sweat(T, 119.6 + (sx + 1) * .3, hx + sx * .25 * mc.D, hy + .5 * mc.D, 40, 1.5); }
  if (t > 1.6 && t < 5.6) for (const [x, d] of [[420, 0], [1500, .4]]) pop(T, 114.8 + d, '恩人回来了', x, 470, 44, { ttl: 2.4, col: '#ffd86a' });
  tag(T, 113.2, 116.0, 300, 440, '离薛还有一百里');
  if (t > 6.4) { const k = eback(prog(t, 6.8, 7.2)); rays(T, 900, 360, 300, k * .8); g.save(); g.translate(900, 360); g.scale(k, k); g.font = `900 150px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 10; g.strokeStyle = '#5a2a10'; g.strokeText('义', 0, 0); g.fillStyle = '#ffd86a'; g.shadowColor = 'rgba(255,170,60,.9)'; g.shadowBlur = 30; g.fillText('义', 0, 0); g.restore(); }
}
// 第 25 页：狡兔三窟（123.8–128.6）
function sRabbit(T) {
  const t = T - 123.8;
  camStd(t, [[0, 1.1, 960, 560], [4.8, 1.14, 960, 570]]);
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#2a3040'); sk.addColorStop(1, '#6a5a48'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  g.fillStyle = '#4a5a34'; g.fillRect(-300, 760, W + 600, 600);
  const holes = [500, 960, 1420]; holes.forEach(x => { g.fillStyle = '#1a140e'; g.beginPath(); g.ellipse(x, 800, 90, 26, 0, 0, 6.283); g.fill(); g.fillStyle = '#5a4a30'; g.beginPath(); g.ellipse(x, 790, 110, 30, 0, Math.PI, 0); g.fill(); });
  // 兔子在三个洞之间钻进钻出
  const seq = [[.3, 0], [1.3, 1], [2.3, 2], [3.3, 1]]; let cur = seq[0];
  for (const s of seq) if (t >= s[0]) cur = s;
  const k = prog(t, cur[0], cur[0] + .9), x = holes[cur[1]], up = Math.sin(Math.PI * k);
  g.save(); g.beginPath(); g.rect(-300, -300, W + 600, 1095); g.clip(); rabbit(x - 30, 800 + 220 * (1 - up), 2.0, t * 4, cur[1] % 2 ? -1 : 1); g.restore();
  if (k > .1 && k < .2) ring(T, T, x, 800, 120, 30, .5, 3);
  holes.forEach((x, i) => pop(T, 124.4 + i * .3, '窟', x, 700, 54, { ttl: 4, col: '#ffd86a', noPop: false }));
}
function sDen1(T) { denView(T, 128.8, 1); }
function sDen2(T) { denView(T, 156.8, 2); }
function sDen3(T) { denView(T, 166.6, 3); }
// 第 27 页：魏国（134.6–140.2）
function sWei(T) {
  const t = T - 134.6;
  camStd(t, [[0, 1.2, 960, 580], [5.6, 1.26, 980, 590]]);
  room(T, '#22281e', DECK, 960); for (const x of [180, 1740]) pillar(x, 140, DECK, 60, '#3a6a4a');
  g.fillStyle = '#2a4a34'; g.fillRect(1200, 760, 420, 100); g.fillStyle = '#d9a64e'; g.fillRect(1200, 760, 420, 8);
  const kw = P({ ...KW, x: 1410, y: 760, face: t < 2.6 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'wide', mouth: 'O', look: [-1, 0] } });
  if (t > 4) { kw.face = { eye: 'happy', mouth: 'grin', look: [-1, 0] }; kw.armR = kf(t, [[4, .15], [4.15, 2.4, eback]]); }
  const fx = P({ ...FX, x: 760, face: { eye: 'smug', mouth: Math.floor(T * 7) % 2 ? 'O' : 'smile', look: [1, 0] }, armR: 1.3 + .4 * Math.sin(T * 4) });
  chibi(breathe(kw, T)); chibi(breathe(fx, T, 1));
  bubble(T, 136.0, 140.0, 860, 330, 440, 280, 760, DECK - 2.3 * D, tt => { chibi({ ...MC, x: -60, y: 100, D: 80, shadow: false, face: { eye: 'dot', mouth: 'small' } }); g.strokeStyle = '#c0392b'; g.lineWidth = 8; g.beginPath(); g.moveTo(10, 60); g.lineTo(120, 60); g.lineTo(100, 44); g.moveTo(120, 60); g.lineTo(100, 76); g.stroke(); g.font = `900 40px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText('谁抢到', 40, -70); });
  tag(T, 134.8, 138.6, 1300, 440, '魏王（原文作梁王）');
}
// 第 28–29 页：魏国车队来请三趟，一趟都不去（140.4–150.8）
const TRIPS = [141.4, 143.0, 144.6];
function sConvoy(T) {
  const t = T - 140.4;
  camStd(t, [[0, 1.0, 960, 560], [5.6, 1.04, 960, 560], [5.8, 1.3, 1250, 610], [10.4, 1.34, 1260, 610]]);
  mansionGate(T, 1600, 0, false);
  g.fillStyle = '#3a2a1e'; g.fillRect(1520, 260, 160, 60); g.fillStyle = '#d9a64e'; g.font = `900 40px ${SERIF}`; g.textAlign = 'center'; g.fillText('薛', 1600, 302);
  // 车队：来 → 被拒 → 回，三趟
  let cx = -900;
  TRIPS.forEach(t0 => { const u = T - t0; if (u >= 0 && u < 1.5) cx = u < .6 ? lerp(-900, 900, eout(u / .6)) : u < .9 ? 900 : lerp(900, -900, ein((u - .9) / .6)); });
  if (cx > -800) for (let i = 0; i < 3; i++) { horse(cx + 340 - i * 600, DECK, 1.2, T * 8); carriage(cx - i * 600, DECK, 1.3, T * 7, true); goldCake(cx - i * 600 - 10, DECK - 230, 22); }
  const mc = P({ ...MC, x: 1330, face: { eye: 'close', mouth: 'flat' } });
  for (const t0 of TRIPS) { const u = T - t0; if (u > .6 && u < 1.0) { mc.lean = .07 * Math.sin((u - .6) * 30); mc.armL = mc.armR = .9; } }
  if (t > 5.8) { mc.lean = .07 * Math.sin(T * 9); mc.face = { eye: 'line', mouth: 'flat' }; mc.armL = mc.armR = .9; }
  const fx = P({ ...FX, x: 1120, face: { eye: 'smug', mouth: 'smirk', look: [1, 0] } });
  if (t > 5.8) { fx.lean = -.22; fx.x = 1180; fx.face = { eye: 'close', mouth: 'o' }; }
  chibi(breathe(fx, T, 1)); chibi(breathe(mc, T));
  if (t > 5.8) pop(T, 146.4, '…', 1200, DECK - 2.5 * D, 64, { ttl: 2, stroke: false });
  for (const t0 of TRIPS) pop(T, t0 + .7, '不去', 1330, DECK - 2.5 * D, 56, { ttl: .6, col: COL.red });
  tag(T, 140.6, 143.6, 300, 440, '黄金千斤　车一百辆');
}
// 第 30 页：齐王慌了（151.0–156.6）
function sQiKing(T) {
  const t = T - 151.0;
  camStd(t, [[0, 1.2, 960, 580], [2.4, 1.24, 960, 590], [2.8, 1.12, 1100, 560], [5.6, 1.16, 1120, 570]]);
  if (t < 2.6) {
    room(T, '#2e1f18', DECK, 960); for (const x of [180, 1740]) pillar(x, 140, DECK, 60);
    const kq = P({ ...KQ, x: 960, face: { eye: 'xx', mouth: 'wave' }, flush: .2 }); kq.lift = D * .15 * Math.abs(Math.sin(T * 9)); kq.x += 120 * Math.sin(T * 4); kq.armL = kq.armR = 2.4 + .4 * Math.sin(T * 9);
    chibi(kq); sweat(T, 151.2, kq.x + 90, DECK - 2.1 * D, 70, 1); sweat(T, 151.9, kq.x - 90, DECK - 2.0 * D, 70, 1);
    pop(T, 151.3, '糟了', 700, DECK - 2.6 * D, 70, { ttl: 1.6, col: COL.red });
    return;
  }
  mansionGate(T, 1600, 1, false);
  horse(760, DECK, 1.3, 0); carriage(420, DECK, 1.4, 0, true); goldCake(420, DECK - 240, 30); goldCake(470, DECK - 230, 26);
  const en = P({ who: 'guan', robe: '#8a3a3a', robe2: '#662626', x: 1040, sy: .74, lean: .2, face: { eye: 'close', mouth: 'small' }, armL: 1.3, armR: 1.3 });
  const mc = P({ ...MC, x: 1340, face: t < 4 ? { eye: 'dot', mouth: 'small', look: [-1, .3] } : { eye: 'happy', mouth: 'smile', look: [-1, 0] } });
  chibi(breathe(en, T)); chibi(breathe(mc, T, 1));
  const h = handPos(en, 1); const k = prog(t, 3.6, 4.2); g.save(); g.translate(lerp(h[0], 1340, k), lerp(h[1] - 30, DECK - 1.2 * D, k)); g.fillStyle = '#e0b04a'; g.fillRect(-26, -26, 52, 52); g.fillStyle = '#8a5a1a'; g.font = `900 30px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('相', 0, 2); g.restore(); glow(lerp(h[0], 1340, k), lerp(h[1] - 30, DECK - 1.2 * D, k), 90, .6);
  tag(T, 153.8, 156.4, 300, 440, '相印');
}
// 第 32 页：先王祭器请到薛，立宗庙（160.8–166.4）
function sTemple(T) {
  const t = T - 160.8;
  camStd(t, [[0, 1.06, 960, 540], [5.6, 1.12, 960, 550]]);
  townXue(T, .8);
  const k = eout(prog(t, 2.4, 4.0));
  g.save(); g.beginPath(); g.rect(0, 0, W, 860); g.clip(); g.translate(0, (1 - k) * 600);
  g.fillStyle = '#5a2a1e'; g.fillRect(660, 560, 600, 300); for (const x of [700, 840, 1080, 1220]) { g.fillStyle = '#8a2a1e'; g.fillRect(x - 14, 580, 28, 280); }
  g.fillStyle = '#2a1a14'; g.beginPath(); g.moveTo(600, 570); g.lineTo(960, 420); g.lineTo(1320, 570); g.closePath(); g.fill(); g.fillStyle = '#d9a64e'; g.fillRect(860, 470, 200, 50); g.fillStyle = '#3a1a10'; g.font = `900 34px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('宗庙', 960, 496);
  g.restore(); if (k > .9) { glow(960, 640, 420, .5); dust(T, 164.8, 960, 860, 400, 12, 3); }
  // 抬着鼎的人
  for (let i = 0; i < 2; i++) { const x = kf(t, [[.2 + i * .3, -200 - i * 260], [2.4 + i * .3, 560 - i * 260, eout]]); const o = P({ who: 'bun', robe: '#6a5a4a', robe2: '#4c4034', x, D: 150, armL: 2.6, armR: 2.6, face: { eye: 'xx', mouth: 'grit' } }); if (t < 2.4 + i * .3) walk(o, x, 60); chibi(o); const h = handPos(o, 1); g.fillStyle = '#7a6a3a'; g.beginPath(); g.ellipse(h[0] - 30, h[1] - 30, 50, 34, 0, 0, 6.283); g.fill(); g.fillRect(h[0] - 60, h[1] - 10, 10, 30); g.fillRect(h[0] - 10, h[1] - 10, 10, 30); g.fillStyle = '#5a4a2a'; g.fillRect(h[0] - 80, h[1] - 64, 100, 10); }
  const fx = P({ ...FX, x: 1460, face: { eye: 'smug', mouth: 'smile', look: [-1, 0] }, armL: kf(t, [[1.0, .15], [1.15, 1.6, eback]]) });
  chibi(breathe(fx, T));
  tag(T, 161.0, 164.0, 300, 440, '先王的祭器');
}
// 第 34 页：高枕而卧（172.4–177.4）
function sPillow(T) {
  const t = T - 172.4;
  camStd(t, [[0, 1.2, 960, 600], [2.0, 1.24, 960, 600], [2.4, 1.5, 820, 660], [5, 1.56, 820, 670]]);
  room(T, '#22202e', DECK, 760, .7); g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(1500, 220, 40, 0, 6.283); g.fill(); glow(1500, 220, 140, .25);
  g.fillStyle = '#4a2a1e'; g.fillRect(420, 760, 760, 40); g.fillStyle = '#6a3a28'; g.fillRect(420, 760, 760, 8);   // 床
  const pk = eback(prog(t, 2.2, 2.6)); g.fillStyle = '#c9a56a'; g.fillRect(650, 760 - 140 * pk, 130, 140 * pk); g.fillStyle = '#a07a40'; g.fillRect(650, 760 - 140 * pk, 130, 10);   // 高枕
  const lying = t > 2.4;
  const mc = { ...MC, x: lying ? 760 : 900, y: lying ? 760 : DECK, D: 190, face: lying ? { eye: 'close', mouth: 'smile' } : { eye: 'dot', mouth: 'small', look: [1, 0] } };
  if (lying) { mc.rot = -Math.PI / 2; mc.y = 810; mc.x = 880; mc.shadow = false; }
  const fx = P({ ...FX, x: 1380, face: { eye: 'smug', mouth: 'smile', look: [-1, 0] }, armR: t < 2 ? kf(t, [[.2, .15], [.35, 1.5, eback]]) : undefined });
  chibi(mc); chibi(breathe(fx, T, 1));
  if (lying) for (let i = 0; i < 3; i++) { const ph = ((T * .6) + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.font = `700 ${46 + i * 10}px ${SERIF}`; g.fillStyle = '#d8dcea'; g.fillText('Z', 560 + ph * 90, 560 - ph * 140); g.restore(); }
  tag(T, 174.6, 177.2, 560, 560, '高枕');
}
// 第 35 页：几十年没出岔子（177.6–182.2）
function sYears(T) {
  const t = T - 177.6;
  camStd(t, [[0, 1.2, 960, 590], [4.6, 1.26, 960, 600]]);
  const seasons = ['#3a4a2e', '#4a5a2a', '#6a4a2a', '#3a4050']; const si = Math.floor(t * 2.2) % 4;
  room(T, '#2e2018', DECK, 960); g.fillStyle = seasons[si]; g.globalAlpha = .25; g.fillRect(-300, -300, W + 600, H + 600); g.globalAlpha = 1;
  // 翻日历
  for (let i = 0; i < 6; i++) { const ph = ((t * 1.6 + i / 6) % 1); g.save(); g.translate(1400 + ph * 300, 300 + ph * 420); g.rotate(ph * 4); g.globalAlpha = 1 - ph; g.fillStyle = '#e8dcbc'; g.fillRect(-40, -50, 80, 100); g.fillStyle = '#b8322a'; g.fillRect(-40, -50, 80, 20); g.restore(); }
  const mc = P({ ...MC, x: 860, face: { eye: 'close', mouth: 'smile' }, armR: 1.0 });
  mc.beard = t > 2.3 ? 'goatee' : 'goatee';
  chibi(breathe(mc, T)); const h = handPos(mc, 1); g.fillStyle = '#e8e2d6'; g.fillRect(h[0] - 18, h[1] - 30, 36, 30); g.strokeStyle = 'rgba(220,215,205,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(h[0], h[1] - 34); g.quadraticCurveTo(h[0] + 10 * Math.sin(T * 3), h[1] - 70, h[0], h[1] - 100); g.stroke();
  tag(T, 177.8, 182.0, 300, 440, '当了几十年相国');
}
// 第 36 页：当初那个什么都不会的人（182.4–187.0）
function sPillarEnd(T) {
  const t = T - 182.4;
  camStd(t, [[0, 1.4, 1480, 560], [4.6, 1.7, 1530, 600]]);
  hall(T); guestRow(T, 680, 88, 8, 140, 1240, 7); bigPillar(1700, -100, DECK, 110);
  const fx = P({ ...FX, x: 1560, lean: .1, face: t < 1.6 ? { eye: 'close', mouth: 'smile' } : { eye: 'smug', mouth: 'smirk', look: [-1, 0] }, armR: .7 });
  const k = prog(t, .6, .85); if (k > 0 && k < 1) fx.armR = .7 + .35 * Math.sin(Math.PI * k);
  chibi(breathe(fx, T)); changjia(1500, 650, -.5, .9, t > .6 ? Math.exp(-(t - .6) * 4) : 0);
  if (t > 2.4) { const [hx, hy] = HEAD(fx); g.save(); g.globalAlpha = at(t, 2.4, .3); g.fillStyle = '#ffd86a'; for (let i = 0; i < 4; i++) { const a = T * 2 + i * 1.57; g.beginPath(); g.arc(hx + Math.cos(a) * 140, hy + 120 + Math.sin(a) * 40, 6, 0, 6.283); g.fill(); } g.restore(); }
}
// 第 37 页：结尾出题（187.2–195）
function sEndQ(T) {
  const t = T - 187.2;
  const freeze = t > 2.4 ? 187.2 + 2.4 : T;
  sSong1(freeze - 187.2 + 24.0 + 2.0);
  if (t > 2.4) { const k = at(t, 2.4, .3); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${.85 * k})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g.fillStyle = `rgba(0,0,0,${.25 * k})`; g.fillRect(0, 0, W, H); g.restore(); }
}
