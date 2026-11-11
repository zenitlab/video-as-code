// 冯谖弹剑 · 第 5–20 页（18.6–103 秒）：粗饭、三回弹剑唱歌、老母亲、收债、烧借据、买义

// ---------- 道具 ----------
function fishIcon(x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); const gr = g.createLinearGradient(0, -20, 0, 20); gr.addColorStop(0, '#9fb8c8'); gr.addColorStop(1, '#5a7a8a'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, 46, 20, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(40, 0); g.lineTo(70, -20); g.lineTo(70, 20); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(-28, -4, 6, 0, 6.283); g.fill(); g.fillStyle = COL.ink; g.beginPath(); g.arc(-28, -4, 3, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.beginPath(); g.arc(-8, 0, 14, -1, 1); g.stroke(); g.restore(); }
function houseIcon(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#8a6a48'; g.fillRect(-50, -40, 100, 60); g.fillStyle = '#5a3a2a'; g.beginPath(); g.moveTo(-66, -36); g.lineTo(0, -86); g.lineTo(66, -36); g.closePath(); g.fill(); g.fillStyle = '#2a1d14'; g.fillRect(-14, -10, 28, 30); g.fillStyle = '#f0c070'; g.fillRect(20, -26, 18, 16); g.restore(); }
// 碗：coarse 粗饭（菜叶 + 糙米），fish 碗里一条鱼
function bowl(x, y, s, kind = 'coarse') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = kind === 'coarse' ? '#6a5a48' : '#2a3a4a'; g.beginPath(); g.ellipse(0, 0, 50, 12, 0, 0, Math.PI); g.lineTo(-50, 0); g.fill(); g.fillStyle = kind === 'coarse' ? '#b8a878' : '#f2ece0'; g.beginPath(); g.ellipse(0, -2, 44, 9, 0, 0, 6.283); g.fill(); if (kind === 'coarse') { g.fillStyle = '#5a7a3a'; for (const d of [-20, 4, 22]) { g.beginPath(); g.ellipse(d, -8, 14, 6, d * .02, 0, 6.283); g.fill(); } } else fishIcon(0, -14, .55); g.restore(); }
// 借据（券）：一片木简劈成两半，各执一半；k 0..1 两半对上
function tally(x, y, s, k) { g.save(); g.translate(x, y); g.scale(s, s); const gap = (1 - eout(clamp(k))) * 60; for (const side of [-1, 1]) { g.save(); g.translate(side * (gap + 1), 0); g.fillStyle = side < 0 ? '#c9a865' : '#b8954f'; g.beginPath(); if (side < 0) { g.moveTo(-22, -70); g.lineTo(0, -70); for (let i = 0; i <= 6; i++) g.lineTo(i % 2 ? -8 : 0, -70 + i * 23); g.lineTo(-22, 70); } else { g.moveTo(22, -70); g.lineTo(0, -70); for (let i = 0; i <= 6; i++) g.lineTo(i % 2 ? -8 : 0, -70 + i * 23); g.lineTo(22, 70); } g.closePath(); g.fill(); g.fillStyle = '#5a3a20'; for (let i = 0; i < 4; i++) g.fillRect(side * 12 - 3, -50 + i * 26, 6, 10); g.restore(); } g.restore(); if (k >= 1) glow(x, y, 60 * s, .5); }
// 火（多层，逐帧变形，冒火星）
function fire(t, x, y, s, seed = 0) {
  if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s);
  const f = (w, h, c, ph) => { g.fillStyle = c; g.beginPath(); g.moveTo(-w, 0); g.quadraticCurveTo(-w * 1.1, -h * .5, Math.sin(t * 9 + ph + seed) * w * .4, -h * (1 + .15 * Math.sin(t * 13 + seed + ph))); g.quadraticCurveTo(w * 1.1, -h * .5, w, 0); g.closePath(); g.fill(); };
  f(34, 100, '#e8642a', 0); f(24, 74, '#f6a63a', 1.3); f(12, 40, '#fff2c0', 2.1);
  g.restore(); glow(x, y - 40 * s, 140 * s, .7);
  for (let i = 0; i < 3; i++) { const ph = ((t * .9 + i / 3 + seed * .37) % 1); g.fillStyle = `rgba(255,200,110,${1 - ph})`; g.fillRect(x + Math.sin(i * 2 + seed + t * 3) * 30 * s, y - (60 + ph * 160) * s, 4, 4); }
}
// 信（纸上一行红字）
function letter(x, y, s, str, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-56, -66, 120, 140); g.fillStyle = '#ece0c2'; g.fillRect(-60, -70, 120, 140); g.fillStyle = '#b8322a'; g.font = `900 34px ${SERIF}`; g.textAlign = 'center'; [...str].forEach((ch, i) => g.fillText(ch, 0, -30 + i * 38)); g.restore(); }
// 孟尝君府门口（门开 op 0..1）
function mansionGate(t, dx, op = 0, night = true) {
  const sk = g.createLinearGradient(0, 0, 0, 900); sk.addColorStop(0, night ? '#0e1220' : '#3a3050'); sk.addColorStop(1, night ? '#2a2024' : '#c08a6a'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1300);
  g.fillStyle = '#1a1617'; g.fillRect(-300, 520, W + 600, 340); for (let x = -300; x < W + 300; x += 70) g.fillRect(x, 500, 40, 24);
  g.fillStyle = '#2e2620'; g.fillRect(-300, DECK, W + 600, 500);
  const dw = 480, dh = 560; glow(dx, DECK - 250, 400 * op, .7 * op);
  g.fillStyle = '#1a1210'; g.fillRect(dx - dw / 2, DECK - dh, dw, dh);
  for (const s of [-1, 1]) { const w2 = dw / 2 * (1 - .8 * op); const gx = s < 0 ? dx - dw / 2 : dx + dw / 2 - w2; const gr = g.createLinearGradient(gx, 0, gx + w2, 0); gr.addColorStop(0, '#6a1a12'); gr.addColorStop(1, '#9a2a1e'); g.fillStyle = gr; g.fillRect(gx, DECK - dh, w2, dh); for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) { g.fillStyle = '#e0b04a'; g.beginPath(); g.arc(gx + (c + .5) * w2 / 3, DECK - dh + 70 + r * 100, 8 * (1 - .5 * op), 0, 6.283); g.fill(); } }
  g.fillStyle = '#d9a64e'; g.fillRect(dx - dw / 2 - 30, DECK - dh - 30, dw + 60, 30); g.fillRect(dx - 110, DECK - dh - 110, 220, 70); g.fillStyle = '#3a1a10'; g.font = `900 46px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('孟尝君府', dx, DECK - dh - 74);
}
// 薛的集镇：远处一排矮房 + 地面
function townXue(t, warm = 1) {
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#1a1a28'); sk.addColorStop(1, '#4a3a30'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  for (let i = 0; i < 9; i++) { const x = -100 + i * 260, h = 160 + (i * 53) % 80; g.fillStyle = '#2a2220'; g.fillRect(x, 640 - h, 220, h); g.fillStyle = '#3a2a22'; g.beginPath(); g.moveTo(x - 20, 640 - h); g.lineTo(x + 110, 640 - h - 60); g.lineTo(x + 240, 640 - h); g.fill(); g.fillStyle = 'rgba(255,190,110,.6)'; g.fillRect(x + 90, 640 - h + 40, 30, 30); glow(x + 105, 640 - h + 55, 50, .4 * warm); }
  g.fillStyle = '#3a3026'; g.fillRect(-300, 640, W + 600, 700); glow(960, 700, 700, .3 * warm);
}
// 一群百姓（站着，远小近大）；mood: 'calm' | 'shock' | 'cheer'
function villagers(t, rows, mood = 'calm', seed = 41) {
  const cols = [['#7a6a52', '#5a4c3a'], ['#6a5a4a', '#4c4034'], ['#5a6a5a', '#404c40'], ['#8a7058', '#665240'], ['#6a6070', '#4c4452']];
  rows.forEach(([y, D0, n, x0, x1], ri) => { const r = rng(seed + ri * 7); for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + .5) / n) + (r() - .5) * 30, c = cols[Math.floor(r() * cols.length)], ph = r() * 6.28, kind = r();
    const o = { x, y, D: D0, who: kind < .25 ? 'old' : kind < .45 ? 'granny' : 'bun', robe: c[0], robe2: c[1], face: { eye: 'dot', mouth: 'small', look: [(r() - .5), 0] } };
    if (kind < .25) { o.cane = -1; o.armL = .3; o.caneLen = .55; }
    if (mood === 'shock') { o.face = { eye: 'wide', mouth: 'O' }; o.lift = D0 * .06 * Math.max(0, Math.sin(t * 3 + ph)); }
    if (mood === 'cheer') { o.face = { eye: 'happy', mouth: 'grin' }; o.armR = 2.6 + .3 * Math.sin(t * 9 + ph); if (kind >= .25) o.armL = 2.6 + .3 * Math.sin(t * 9 + ph + 1); o.lift = D0 * .15 * Math.abs(Math.sin(t * 6 + ph)); }
    chibi(breathe(o, t, ph));
  } });
}

// ---------- 场景 ----------
// 第 5 页：收下了，给吃粗饭（18.6–24.0）
function sCoarse(T) {
  const t = T - 18.6;
  camStd(t, [[0, 1.2, 900, 580], [2.4, 1.24, 900, 590], [3.0, 1.45, 1250, 640], [5.4, 1.5, 1260, 640]]);
  hall(T); guestRow(T, 620, 80, 8, 150, 1500, 31);
  const mc = P({ ...MC, x: 600, face: { eye: 'happy', mouth: 'smile', look: [1, 0] } });
  if (t < 2.0) { mc.lean = .08 * Math.abs(Math.sin(t * 6)); }
  const fx = P({ ...FX, x: 1260, face: { eye: 'dot', mouth: 'small', look: [-1, 0] }, sy: .8 });
  if (t > 3.6) fx.face = { eye: 'line', mouth: 'wave', look: [0, 1] };
  // 仆人端碗进来：放下就走
  const sx = kf(t, [[2.2, 1900], [3.0, 1420, eout], [3.6, 1420], [4.4, 1950, k => k]]);
  const sv = P({ who: 'bun', robe: '#5a5a5a', robe2: '#3a3a3a', x: sx, face: { eye: 'smug', mouth: 'flat', look: [-1, 0] }, armL: t < 3.3 ? 1.4 : undefined });
  if ((t > 2.2 && t < 3.0) || t > 3.6) walk(sv, sx, 70);
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1)); if (t > 2.2 && t < 4.4) chibi(sv);
  g.fillStyle = '#4a2418'; g.fillRect(1080, 760, 380, 22);
  if (t < 3.3 && t > 2.2) { const h = handPos(sv, -1); bowl(h[0], h[1] - 10, 1); } else if (t >= 3.3) bowl(1300, 756, 1);
  for (const [x, d] of [[420, 0], [880, .3]]) pop(T, 20.8 + d, '嘻', x, 620 - 1.9 * 80, 44, { ttl: 1.2, rot: -.1, font: SANS, weight: 600 });
  sweat(T, 22.4, 1360, 860 - 1.9 * D * .8, 60, 1.2);
}
// 倚柱弹剑唱歌（第 6、8、10 页共用）：n = 第几回，wish = 'fish' | 'car' | 'house'
function pillarSong(T, t0, n, wish) {
  const t = T - t0;
  const views = [[1.6, 1500, 560], [1.75, 1540, 600], [1.9, 1560, 640]];
  const [z, cx, cy] = views[n - 1];
  camStd(t, [[0, z - .15, cx - 60, cy - 20], [1.2, z, cx, cy], [5.8, z + .05, cx, cy + 10]]);
  hall(T); guestRow(T, 680, 88, 8, 140, 1240, 7 + n); bigPillar(1700, -100, DECK, 110);
  const fx = P({ ...FX, x: 1560, face: { eye: 'close', mouth: 'smile' }, lean: .1, armR: .7 });
  const PL = [.4, .9, 1.4], vibs = PL.map(h => t > h ? Math.exp(-(t - h) * 4) : 0);
  for (const h of PL) { const k = prog(t, h, h + .25); if (k > 0 && k < 1) fx.armR = .7 + .35 * Math.sin(Math.PI * k); }
  if (t > 1.7) { fx.face = { eye: 'close', mouth: Math.floor(T * 5) % 2 ? 'O' : 'o' }; fx.lean = .1 + .04 * Math.sin(T * 5); fx.hair = .2 * Math.sin(T * 5); }
  if (n === 3) fx.sx = 1;
  chibi(breathe(fx, T)); changjia(1500, 650, -.5, .9, Math.max(...vibs));
  notes(T, t0 + .4, t0 + 5.6, 1560, DECK - 2.6 * D, 54);
  SONG_BUBBLE = [t0, wish];
}
let SONG_BUBBLE = null, SONG_LYRIC = null;
// 弹剑页的思考气泡画在屏幕坐标（overlay 里调），避开三行字幕；[t0, wish, 气泡x, 气泡y, 起点x, 起点y]
function songBubble(t) { if (SONG_LYRIC && t > SONG_LYRIC[0] - .1 && t < SONG_LYRIC[0] + 4.5) lyrics(t, SONG_LYRIC[0], 240, 480, SONG_LYRIC[1], SONG_LYRIC[2]); if (!SONG_BUBBLE) return; const [t0, wish, bx, by, fx0, fy0] = SONG_BUBBLE; if (t < t0 || t > t0 + 5.9) return; bubble(t, t0 + 2.8, t0 + 5.6, bx, by, 440, 300, fx0, fy0, tt => { if (wish === 'fish') fishIcon(0, 10, 1.6, .1 * Math.sin(tt * 6)); if (wish === 'car') { horse(-10, 80, .7, tt * 7); carriage(-110, 80, .65, tt * 6); } if (wish === 'house') { houseIcon(40, 60, 1.3); chibi({ x: -90, y: 110, D: 70, who: 'granny', robe: '#4a4a6a', robe2: '#34344c', shadow: false, face: { eye: 'close', mouth: 'smile' } }); } g.strokeStyle = COL.red; g.lineWidth = 9; g.beginPath(); g.moveTo(-110, -80); g.lineTo(110, 90); g.stroke(); }); }
// 唱词从嘴里一个字一个字飘出来（像音符）：str 里〔〕的字标红、放大
function lyrics(t, t0, x, y, str, size = 56, dir = 1) {
  let red = false, i = 0;
  for (const ch of str) { if (ch === '〔') { red = true; continue; } if (ch === '〕') { red = false; continue; }
    const ti = t0 + i * .16, u = t - ti; i++; if (u < 0 || u > 3.2) continue;
    const px = x + i * size * 1.05, py = y - u * 18 + Math.sin(u * 5 + i) * 8, a = Math.min(1, u * 5) * (1 - prog(u, 2.6, 3.2)), sc = (red ? 1.5 : 1) * (1 + .3 * Math.exp(-u * 6));
    g.save(); g.translate(px, py); g.rotate(Math.sin(u * 3 + i) * .2); g.scale(sc, sc); g.globalAlpha = a; g.font = `900 ${size}px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = size * .14; g.strokeStyle = 'rgba(30,20,12,.85)'; g.strokeText(ch, 0, 0); g.fillStyle = red ? COL.red : '#f2e6c8'; g.fillText(ch, 0, 0); g.restore(); }
}
// 弹三下 + 唱（共用）：返回弹剑颤动量；o 是冯谖，PL 是弹的时刻（局部）
function pluckSing(o, t, T, PL, singFrom) {
  for (const h of PL) { const k = prog(t, h, h + .25); if (k > 0 && k < 1) { o.armR = .7 + .45 * Math.sin(Math.PI * k); o.face = { eye: 'close', mouth: 'o' }; } }
  if (t > singFrom) { o.face = { eye: 'close', mouth: Math.floor(T * 5) % 2 ? 'O' : 'o' }; o.lean = (o.lean || 0) + .05 * Math.sin(T * 5); o.hair = .25 * Math.sin(T * 5); }
  return Math.max(0, ...PL.map(h => t > h ? Math.exp(-(t - h) * 3.5) : 0));
}
// 第 6 页（第一回 · 吃饭没有鱼）：饭桌前拨菜叶、叹气 → 起身靠柱子弹剑，唱词飘出（24.0–29.6）
function sSong1(T) {
  const t = T - 24.0;
  camStd(t, [[0, 1.5, 1300, 640], [1.6, 1.55, 1320, 650], [2.2, 1.45, 1460, 610], [5.6, 1.52, 1470, 615]]);
  hall(T); guestRow(T, 680, 88, 8, 140, 1240, 8); bigPillar(1700, -100, DECK, 110);
  const sx = t < 1.7 ? 1300 : kf(t, [[1.7, 1300], [2.2, 1560, eout]]);
  const fx = P({ ...FX, x: sx, face: { eye: 'line', mouth: 'wave', look: [0, 1] }, sy: t < 1.7 ? .8 : 1 });
  if (t < 1.7) { fx.armR = 1.0 + .25 * Math.sin(T * 9); if (t > 1.0) fx.face = { eye: 'close', mouth: 'puff' }; }
  else if (t < 2.2) walk(fx, sx - 1300, 70);
  else { fx.lean = .1; fx.armR = .7; }
  const vib = t > 2.2 ? pluckSing(fx, t, T, [2.4, 2.8, 3.2], 3.4) : 0;
  chibi(breathe(fx, T));
  g.fillStyle = '#4a2418'; g.fillRect(1120, 760, 360, 22); bowl(1300, 756, 1);
  if (t < 1.7) { const h = handPos(fx, 1); g.strokeStyle = '#d8b878'; g.lineWidth = 5; g.beginPath(); g.moveTo(h[0], h[1]); g.lineTo(1290 + 20 * Math.sin(T * 9), 748); g.moveTo(h[0] + 8, h[1]); g.lineTo(1306 + 20 * Math.sin(T * 9), 750); g.stroke(); }
  puffCloud(T, 25.0, sx - 40, DECK - 1.2 * D * .8, 100, -1);
  if (t > 2.2) changjia(1500, 650, -.5, .9, vib);
  SONG_LYRIC = [27.0, '长铗归来乎　食无〔鱼〕', 50];
  notes(T, 26.4, 29.6, 1560, DECK - 2.6 * D, 50);
  SONG_BUBBLE = [24.0, 'fish', 1560, 560, 1240, 470];
}
// 第 8 页（第二回 · 出门没有车）：府门口，别的门客坐车出门，尘土扑一脸 → 靠门柱弹剑（34.6–39.4）
function sSong2(T) {
  const t = T - 34.6;
  camStd(t, [[0, 1.0, 960, 580], [1.8, 1.04, 980, 590], [2.2, 1.3, 1130, 640], [4.8, 1.36, 1140, 645]]);
  mansionGate(T, 1500, 1, false);
  // 门客的车一辆接一辆从前景开出去
  for (const [t0, c] of [[.1, 0], [1.0, 2]]) { const u = t - t0; if (u < 0 || u > 1.4) continue; const cx = lerp(1700, -700, eio(u / 1.4)); horse(cx - 260, DECK + 90, 1.5, T * 9, '#b8a27c'); carriage(cx, DECK + 90, 1.6, T * 8, true); chibi({ x: cx + 10, y: DECK + 90 - 175, D: 160, who: 'bun', robe: GUEST[c][0], robe2: GUEST[c][1], face: { eye: 'smug', mouth: 'smirk', look: [1, 0] } }); dust(T, 34.6 + t0 + .5, 1200, DECK + 40, 260, 12, 3 + c); }
  const fx = P({ ...FX, x: 1180, lean: .08, face: { eye: 'dot', mouth: 'small', look: [-1, 0] }, armR: .7 });
  if (t > .7 && t < 2.2) { fx.face = { eye: 'xx', mouth: 'O' }; fx.lean = .08 + .1 * Math.max(0, Math.sin((t - .7) * 12)); fx.armL = 1.6; }
  const vib = t > 2.2 ? pluckSing(fx, t, T, [2.3, 2.7, 3.1], 3.3) : 0;
  chibi(breathe(fx, T));
  if (t > .7 && t < 2.4) { g.save(); g.globalAlpha = .55 * (1 - prog(t, 1.8, 2.4)); g.fillStyle = '#b8a888'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(1150 + Math.sin(i * 2 + T) * 60, DECK - 1.4 * D + i * 18 - (t - .7) * 40, 50 + i * 6, 0, 6.283); g.fill(); } g.restore(); }
  changjia(1120, 650, -.5, .9, vib);
  pop(T, 35.5, '咳咳', 980, DECK - 2.3 * D, 60, { ttl: 1.2, rot: -.15 });
  SONG_LYRIC = [36.9, '长铗归来乎　出无〔车〕', 50];
  notes(T, 36.9, 39.4, 1180, DECK - 2.6 * D, 50);
  SONG_BUBBLE = [34.6, 'car', 1560, 560, 1300, 480];
}
// 第 10 页（第三回 · 没钱养家）：站上长案放声唱，顶光打下来，全堂捂耳朵冒青筋（44.4–49.2）
function sSong3(T) {
  const t = T - 44.4;
  const sh = t > 2.2 ? shake(T, 6, 9) : 0;
  camStd(t, [[0, 1.05, 960, 560], [2.0, 1.1, 960, 560], [2.4, 1.35, 860, 520], [4.8, 1.42, 850, 520]]);
  g.translate(sh, 0);
  hall(T);
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-300, -300, W + 600, H + 600);   // 全场压暗
  // 长案在中间，冯谖站上去
  g.fillStyle = '#4a2418'; g.fillRect(640, 740, 640, 30); g.fillStyle = '#3a1a12'; g.fillRect(660, 770, 24, 90); g.fillRect(1236, 770, 24, 90);
  const up = eout(prog(t, .4, .9));
  const fx = P({ ...FX, x: 960, y: lerp(DECK, 740, up), face: { eye: 'smug', mouth: 'small', look: [0, 0] } });
  if (t > .4 && t < .9) fx.lift = Math.sin(Math.PI * prog(t, .4, .9)) * 120;
  fx.armR = .7;
  const vib = t > 1.0 ? pluckSing(fx, t, T, [1.1, 1.45, 1.8], 2.0) : 0;
  if (t > 2.0) { fx.armL = 2.4 + .3 * Math.sin(T * 6); fx.sx = 1.05; fx.sy = 1.05 + .03 * Math.sin(T * 10); }
  // 顶光
  if (t > .9) { const a = at(t, .9, .3); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, -100, 0, 760); gr.addColorStop(0, `rgba(255,220,150,${.35 * a})`); gr.addColorStop(1, `rgba(255,200,120,${.08 * a})`); g.fillStyle = gr; g.beginPath(); g.moveTo(880, -100); g.lineTo(1040, -100); g.lineTo(1220, 760); g.lineTo(700, 760); g.closePath(); g.fill(); g.restore(); glow(960, 600, 380, .5 * a); }
  // 四周门客捂耳朵
  [[380, 0], [600, .1], [1320, .15], [1540, .05], [220, .2], [1720, .25]].forEach(([x, d], i) => { const o = P({ who: i % 2 ? 'guan' : 'bun', robe: GUEST[i % 6][0], robe2: GUEST[i % 6][1], x, D: 170, face: { eye: 'dot', mouth: 'small', look: [x < 960 ? 1 : -1, -.5] } }); if (t > 2.0 + d) { o.armL = o.armR = 2.75; o.face = { eye: 'xx', mouth: 'grit' }; o.flush = .4; o.lean = .06 * Math.sin(T * 8 + i); } chibi(breathe(o, T, i)); if (t > 2.3 + d) { const [hx, hy] = HEAD(o); vein(T, 46.7 + d, hx + 60, hy + 40, 36); } });
  chibi(breathe(fx, T));
  changjia(900, 530 + (740 - DECK) * up * 0 - (DECK - 740) * up, -.5, .9, vib);
  // 声浪：一圈圈往外扩
  if (t > 2.0) for (let i = 0; i < 3; i++) { const ph = ((T * 1.4 + i / 3) % 1); g.save(); g.strokeStyle = `rgba(255,236,190,${.5 * (1 - ph)})`; g.lineWidth = 6; g.beginPath(); g.arc(960, 740 - 1.45 * D, 120 + ph * 520, -2.6, -.5); g.stroke(); g.restore(); }
  SONG_LYRIC = [46.4, '长铗归来乎　无以为〔家〕', 54];
  notes(T, 46.2, 49.2, 1000, 740 - 2.6 * D, 64);
  SONG_BUBBLE = [44.4, 'house', 1580, 600, 1060, 380];
}
// 第 7 页：给他鱼（29.8–34.4）
function sFish(T) {
  const t = T - 29.8;
  camStd(t, [[0, 1.3, 1000, 600], [1.0, 1.32, 1000, 600], [1.6, 1.5, 1240, 640], [4.6, 1.54, 1250, 640]]);
  hall(T); guestRow(T, 620, 80, 8, 150, 1500, 33);
  const mc = P({ ...MC, x: 640, face: { eye: 'happy', mouth: 'smile', look: [1, 0] }, armR: kf(t, [[.2, .15], [.35, 1.5, eback], [1.6, 1.5], [1.8, .15]]) });
  const fx = P({ ...FX, x: 1260, sy: .8, face: { eye: 'dot', mouth: 'small', look: [1, -.5] } });
  const fl = prog(t, .9, 1.6), land = t > 1.6;
  if (t > 1.0 && !land) fx.face = { eye: 'wide', mouth: 'O', look: [1, -.5] };
  if (land) { fx.face = { eye: 'happy', mouth: Math.floor(T * 6) % 2 ? 'grin' : 'smile' }; fx.armR = 1.0 + .5 * Math.max(0, Math.sin(T * 6)); fx.lift = t < 2.0 ? D * .15 * Math.sin(Math.PI * prog(t, 1.6, 2.0)) : 0; }
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1));
  g.fillStyle = '#4a2418'; g.fillRect(1080, 760, 380, 22); bowl(1300, 756, 1, land ? 'fish' : 'coarse');
  if (fl > 0 && fl < 1) fishIcon(lerp(1900, 1300, fl), lerp(560, 740, fl) - Math.sin(fl * Math.PI) * 260, 1, fl * 9);
  ring(T, 31.4, 1300, 760, 100, 20, .5, 3); sparkles(T, 31.4, 1300, 740, 8, 100, 2);
  tag(T, 31.8, 34.2, 1250, 440, '门客分三等　这是中等');
}
// 第 9 页：给他车（39.6–44.2）
function sCar(T) {
  const t = T - 39.6;
  camStd(t, [[0, 1.12, 960, 560], [4.6, 1.2, 1000, 570]]);
  mansionGate(T, 1380, 1, false);
  const cx = kf(t, [[0, -600], [1.4, 760, eout]]);
  horse(cx + 340, DECK, 1.5, t < 1.4 ? T * 7 : 0, '#c9b48e'); carriage(cx, DECK, 1.6, t < 1.4 ? T * 6 : 0, true);
  const fx = P({ ...FX, x: t < 1.8 ? 1180 : cx + 20, y: t < 1.8 ? DECK : DECK - 170, D: 180, face: { eye: 'wide', mouth: 'O', look: [-1, 0] } });
  if (t > 1.4 && t < 1.8) { const k = prog(t, 1.4, 1.8); fx.x = lerp(1180, cx + 20, k); fx.y = DECK - 170 * k; fx.lift = Math.sin(Math.PI * k) * 160; }
  if (t >= 1.8) { fx.face = { eye: 'smug', mouth: 'grin' }; fx.armR = 2.6; fx.hair = spring(t, 1.8, .5, 5); }
  chibi(breathe(fx, T));
  if (t >= 1.8) { const h = handPos(fx, 1); changjia(h[0], h[1] + 10, .2, .8, .3); }
  for (const [x, d] of [[1680, 0], [1850, 1]]) { const o = P({ who: 'bun', ...{ robe: GUEST[d][0], robe2: GUEST[d][1] }, x, D: 160, face: { eye: 'wide', mouth: 'o', look: [-1, 0] } }); chibi(breathe(o, T, d)); }
  pop(T, 41.8, '有车了', cx + 330, DECK - 420, 56, { ttl: 2, col: '#ffd86a' });
  dust(T, 41.0, cx + 340, DECK, 200, 10, 4);
}
// 第 11 页：手下都烦了（49.4–54.0）
function sAnnoyed(T) {
  const t = T - 49.4;
  camStd(t, [[0, 1.3, 1300, 620], [4.6, 1.36, 1320, 630]]);
  hall(T); bigPillar(1700, -100, DECK, 110);
  const fx = P({ ...FX, x: 1520, face: { eye: 'xx', mouth: 'wave' }, lean: .08 });
  chibi(breathe(fx, T));
  [[980, 0], [1180, .2], [1880, .35], [1280, .5]].forEach(([x, d], i) => { const k = eback(prog(t, .2 + d, .5 + d)); if (k <= 0) return; const o = P({ who: i % 2 ? 'guan' : 'bun', robe: GUEST[i + 1][0], robe2: GUEST[i + 1][1], x, D: 190 * k, face: { eye: 'angry', mouth: 'grit', look: [x < 1520 ? 1 : -1, 0] }, armR: x < 1520 ? 1.6 + .1 * Math.sin(T * 9 + i) : undefined, armL: x > 1520 ? 1.6 + .1 * Math.sin(T * 9 + i) : undefined, flush: .5 }); chibi(o); const [hx, hy] = HEAD(o); vein(T, 49.7 + d, hx + 70, hy + 40, 40); });
  sweat(T, 50.6, 1620, DECK - 2.0 * D, 70, 1.4); sweat(T, 52.0, 1440, DECK - 2.1 * D, 60, 1.4);
  pop(T, 51.4, '贪', 1160, 440, 90, { ttl: 2, col: COL.red, rot: -.1 });
}
// 第 12 页：家里还有谁 → 老母亲（54.2–59.0）
function sMother(T) {
  const t = T - 54.2;
  camStd(t, [[0, 1.28, 960, 600], [4.8, 1.34, 980, 610]]);
  hall(T); guestRow(T, 640, 80, 9, 150, 1770, 27);
  const mc = P({ ...MC, x: 700, face: { eye: 'dot', mouth: Math.floor(T * 7) % 2 && t < 1.4 ? 'O' : 'smile', look: [1, 0] }, lean: .1, armR: 1.2 });
  const fx = P({ ...FX, x: 1220, face: t < 1.6 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'line', mouth: 'small', look: [0, 1] } });
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1)); changjia(1150, 690, -.5, .8);
  bubble(T, 55.8, 59.0, 1220, 330, 400, 280, 1220, DECK - 2.3 * D, tt => { houseIcon(90, 60, .9); chibi({ x: -60, y: 110, D: 90, who: 'granny', robe: '#4a4a6a', robe2: '#34344c', shadow: false, cane: -1, armL: .3, caneLen: .55, face: { eye: 'close', mouth: 'smile' } }); });
}
// 第 13 页：给母亲送吃送用 → 不唱了（分屏，59.2–64.6）
function sGift(T) {
  const t = T - 59.2;
  // 左半：仆人挑担子送到老母亲家
  g.save(); g.beginPath(); g.rect(0, 0, W / 2 - 4, H); g.clip();
  g.save(); g.translate(-480, 0); camera(700, 600, 1.2);
  townXue(T, .6); houseIcon(980, DECK, 2.6);
  const sx = kf(t, [[0, 100], [1.8, 700, eout]]);
  const sv = P({ who: 'bun', robe: '#5a5a5a', robe2: '#3a3a3a', x: sx, face: { eye: 'smug', mouth: 'smile', look: [1, 0] }, armL: 2.4, armR: 2.4 });
  if (t < 1.8) walk(sv, sx, 70); else { sv.lean = .12 * Math.max(0, Math.sin((t - 1.8) * 3)); sv.armL = sv.armR = 2.4 + .1 * Math.sin(T * 5); } chibi(sv);
  const hl = handPos(sv, -1), hr = handPos(sv, 1); g.strokeStyle = '#6a4a2a'; g.lineWidth = 10; g.beginPath(); g.moveTo(hl[0] - 60, hl[1]); g.lineTo(hr[0] + 60, hr[1]); g.stroke();
  for (const s of [-1, 1]) { const bx = (s < 0 ? hl[0] - 50 : hr[0] + 50); g.fillStyle = '#c9a865'; g.fillRect(bx - 34, hl[1] + 40, 68, 54); g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, hl[1]); g.lineTo(bx - 30, hl[1] + 40); g.moveTo(bx, hl[1]); g.lineTo(bx + 30, hl[1] + 40); g.stroke(); }
  const gm = P({ who: 'granny', robe: '#4a4a6a', robe2: '#34344c', x: 1040, cane: -1, armL: .3, caneLen: .55, face: t < 1.8 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'happy', mouth: 'grin' } });
  if (t > 1.8) { gm.lift = D * .08 * Math.abs(Math.sin(T * 6)); gm.lean = .08 * Math.sin(T * 4); gm.armR = 1.4 + .3 * Math.sin(T * 6); }
  chibi(breathe(gm, T)); if (t > 1.9) { const [hx, hy] = HEAD(gm); for (let i = 0; i < 3; i++) { const ph = ((T * .7) + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.fillStyle = '#e2493c'; g.font = `700 40px ${SANS}`; g.fillText('♥', hx - 40 + i * 36, hy - ph * 100); g.restore(); } }
  g.restore(); g.restore();
  // 右半：冯谖放下剑，安安静静
  g.save(); g.beginPath(); g.rect(W / 2 + 4, 0, W / 2, H); g.clip();
  g.save(); g.translate(480, 0); camera(1560, 600, 1.3);
  hall(T); bigPillar(1700, -100, DECK, 110);
  const fx = P({ ...FX, x: 1560, lean: .1 + .04 * Math.sin(T * 2.4), face: t < 2.6 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'close', mouth: 'smile' }, hair: .2 * Math.sin(T * 2.4) });
  if (t > 2.6) fx.armR = .9 + .15 * Math.sin(T * 3);
  chibi(breathe(fx, T)); changjia(1500, 650, -.5 + .4 * eio(prog(t, 2.8, 3.4)), .9);
  if (t > 3.4) pop(T, 62.7, '……', 1680, DECK - 2.5 * D, 70, { ttl: 2, stroke: false });
  g.restore(); g.restore();
  g.fillStyle = '#e8dcc0'; g.fillRect(W / 2 - 4, 0, 8, H);   // 分屏线
}
// 第 14 页：谁去薛收债 → 我能（64.8–70.4）
function sNotice(T) {
  const t = T - 64.8;
  camStd(t, [[0, 1.12, 960, 560], [2.6, 1.16, 960, 570], [3.2, 1.3, 1200, 600], [5.6, 1.34, 1210, 600]]);
  hall(T); guestRow(T, 640, 90, 9, 150, 1300, 19);
  // 门客们一个个转开眼、吹口哨
  if (t > 1.4) for (let i = 0; i < 5; i++) notes(T, 66.2 + i * .1, 70.4, 200 + i * 230, 640 - 2.4 * 90, 34);
  const mc = P({ ...MC, x: 560, face: { eye: 'dot', mouth: Math.floor(T * 7) % 2 && t < 1.8 ? 'O' : 'small', look: [1, 0] }, armR: 2.0 });
  chibi(breathe(mc, T)); const h = handPos(mc, 1); letter(h[0] + 20, h[1] - 60, .9, '收债');
  const fx = P({ ...FX, x: 1460, face: t < 3.0 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'smug', mouth: 'smile', look: [-1, 0] } });
  if (t > 3.0) { fx.armR = kf(t, [[3.0, .15], [3.15, 2.9, eback]]); fx.hair = spring(t, 3.1, .5, 5); }
  chibi(breathe(fx, T)); if (t > 3.1) { const hh = handPos(fx, 1); glow(hh[0], hh[1], 120, .7 + .2 * Math.sin(T * 6)); }
  const [mx, my] = HEAD(mc); pop(T, 66.0, '谁去？', mx + 120, my + 30, 54, { ttl: 1.6 }); pop(T, 68.1, '!', mx + 60, my - 10, 100, { ttl: 1 });
  tag(T, 65.0, 69.0, 560, 440, '薛　孟尝君的封地');
}
// 第 15 页：临走问买什么（70.6–76.2）
function sDepart(T) {
  const t = T - 70.6;
  camStd(t, [[0, 1.16, 900, 570], [2.6, 1.2, 880, 570], [3.0, 1.4, 1350, 610], [5.6, 1.44, 1360, 610]]);
  mansionGate(T, 1600, 1, false);
  horse(840, DECK, 1.5, 0); carriage(500, DECK, 1.6, 0); for (const [x, y] of [[440, DECK - 200], [520, DECK - 210]]) { g.fillStyle = '#7a3424'; g.fillRect(x - 30, y - 50, 60, 50); g.fillStyle = '#d9a64e'; g.fillRect(x - 30, y - 50, 60, 5); }
  const fx = P({ ...FX, x: 1080, face: { eye: 'dot', mouth: Math.floor(T * 7) % 2 && t < 1.6 ? 'O' : 'small', look: [1, 0] }, armR: t < 1.6 ? 1.3 : undefined });
  const mc = P({ ...MC, x: 1420, face: t < 2.8 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'close', mouth: 'smirk' } });
  if (t > 2.8) { mc.armL = 1.4 + .25 * Math.sin(T * 8); mc.lean = -.05; }
  chibi(breathe(fx, T)); chibi(breathe(mc, T, 1));
  pop(T, 71.0, '买啥？', 1080, DECK - 2.6 * D, 54, { ttl: 1.6 });
}
// 第 16–18 页：薛，对借据 → 全免、烧借据 → 万岁（76.4–92.2）
const JOINS = [78.4, 78.8, 79.15, 79.5, 79.8, 80.1, 80.4, 80.7];
function sXue(T) {
  const t = T - 76.4;
  camStd(t, [[0, 1.0, 960, 560], [2.0, 1.12, 960, 580], [5.0, 1.16, 960, 590], [7.6, 1.2, 960, 600], [8.4, 1.06, 960, 560], [11, 1.1, 960, 570], [15.8, 1.14, 960, 570]]);
  townXue(T);
  const burn = prog(t, 8.2, 8.8), mood = t > 11.4 ? 'cheer' : t > 5.6 ? 'shock' : 'calm';
  villagers(T, [[700, 110, 9, 100, 1820], [800, 140, 7, 60, 1860]], mood);
  // 桌子 + 冯谖
  const fx = P({ ...FX, x: 960, y: 980, face: { eye: 'dot', mouth: 'small', look: [0, .5] } });
  if (t > 5.4 && t < 8.2) { fx.armR = kf(t, [[5.4, .15], [5.55, 2.8, eback]]); fx.face = { eye: 'smug', mouth: Math.floor(T * 7) % 2 ? 'O' : 'smile' }; }
  if (t >= 8.2) { fx.armR = kf(t, [[8.0, 2.8], [8.2, 1.4, ein], [8.5, .15]]); fx.face = { eye: 'happy', mouth: 'smile' }; }
  chibi(breathe(fx, T));
  if (t < 8.4) { g.fillStyle = '#5a2a1e'; g.fillRect(760, 880, 400, 24); }
  // 借据：一对一对合上，合完堆在桌上
  JOINS.forEach((tj, i) => { const k = prog(T, tj - .35, tj); if (t < 8.4) tally(820 + (i % 4) * 90 + (i > 3 ? 40 : 0), 820 - (i > 3 ? 40 : 0), .5, k); if (k >= 1 && T < tj + .4) ring(T, tj, 820 + (i % 4) * 90, 830, 60, 14, .4, 2); });
  // 一把火
  if (t >= 8.4) { const s = eout(prog(t, 8.4, 9.2)); for (let i = 0; i < 6; i++) { g.fillStyle = '#3a2416'; g.fillRect(860 + i * 30, 900 - (i % 2) * 10, 18, 50); } fire(T, 900, 920, 1.6 * s, 1); fire(T, 1000, 925, 1.3 * s, 3); fire(T, 960, 915, 2.0 * s, 5); }
  if (t > 7.8 && t < 8.5) { const u = prog(t, 7.9, 8.4); fire(T, lerp(1080, 960, u), lerp(700, 900, u) - Math.sin(u * Math.PI) * 120, .4, 9); }
  if (t > 5.6) pop(T, 82.2, '免！', 1100, 980 - 2.6 * D, 80, { ttl: 1.6, col: COL.red });
  if (t > 11.4) for (const [x, d] of [[300, 0], [960, .3], [1600, .6]]) pop(T, 87.9 + d, '万岁', x, 380, 70, { ttl: 3.5 - d, col: '#ffd86a', rot: (d - .3) * .3 });
  tag(T, 76.6, 79.4, 300, 440, '薛');
  tag(T, 77.6, 80.8, 1300, 440, '借据劈两半　各拿一半');
}
// 第 19 页：连夜赶回去（92.4–97.2）
function sNight(T) {
  const t = T - 92.4;
  if (t < 2.2) {
    camStd(t, [[0, 1.05, 960, 560], [2.2, 1.08, 960, 560]]);
    const sk = g.createLinearGradient(0, 0, 0, 800); sk.addColorStop(0, '#0e1220'); sk.addColorStop(1, '#2b2420'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100); g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(1500, 180, 40, 0, 6.283); g.fill(); glow(1500, 180, 150, .25);
    mountains(T, 760); g.fillStyle = '#2e2620'; g.fillRect(-300, 800, W + 600, 500);
    const cx = kf(t, [[0, -700], [2.2, 2300, k => k]]); horse(cx + 340, 860, 1.4, T * 12); carriage(cx, 860, 1.5, T * 10);
    chibi(P({ ...FX, x: cx + 20, y: 860 - 160, D: 170, face: { eye: 'angry', mouth: 'grit', look: [1, 0] }, lean: .15, hair: .6 }));
    speedLines(T, 92.4, 94.6, cx - 100, 700, 1, 300, 8, 3); dust(T, 93.2, cx - 60, 860, 200, 10, 7);
    tag(T, 92.6, 94.4, 300, 440, '连夜');
    return;
  }
  const tt = t - 2.2;
  camStd(tt, [[0, 1.3, 960, 600], [2.6, 1.34, 970, 600]]);
  hall(T);
  const mc = P({ ...MC, x: 700, face: { eye: 'wide', mouth: 'o', look: [1, 0] } });
  const fx = P({ ...FX, x: kf(tt, [[0, 1900], [.5, 1220, eout]]), face: { eye: 'xx', mouth: 'O' } });
  if (tt < .5) { walk(fx, 1900 - fx.x, 50); fx.lean += .2; }
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1)); dust(T, 95.1, 1260, DECK, 160, 10, 2); sweat(T, 95.2, 1320, DECK - 2.0 * D, 70, 1.4);
  const [mx, my] = HEAD(mc); pop(T, 95.4, '这么快？', mx + 200, my + 140, 60, { ttl: 1.8 });
}
// 第 20 页：您家缺的是「义」（97.4–103.0）
function sYi(T) {
  const t = T - 97.4;
  camStd(t, [[0, 1.2, 960, 580], [2.2, 1.24, 960, 590], [2.6, 1.1, 960, 520], [5.6, 1.14, 960, 520]]);
  hall(T);
  // 满屋宝贝：钱箱、玉璧、金饼、宝马（缩略）
  chest(300, DECK, 1.3, 1); chest(1660, DECK, 1.3, 1); for (const [x, y] of [[480, 640], [1460, 620]]) { g.strokeStyle = '#7ab89a'; g.lineWidth = 18; g.beginPath(); g.arc(x, y, 34, 0, 6.283); g.stroke(); glow(x, y, 70, .4); }
  const mc = P({ ...MC, x: 680, face: { eye: 'dot', mouth: 'small', look: [1, 0] } });
  const fx = P({ ...FX, x: 1220, face: { eye: 'smug', mouth: Math.floor(T * 7) % 2 && t < 2.2 ? 'O' : 'smile', look: [-1, 0] } });
  if (t < 2.2) fx.armR = 1.2 + .8 * Math.sin(T * 3);
  if (t > 2.4) { fx.armL = kf(t, [[2.4, .15], [2.6, 2.6, eback]]); fx.face = { eye: 'smug', mouth: 'grin', look: [-1, -1] }; mc.face = { eye: 'wide', mouth: 'O', look: [1, -1] }; }
  chibi(breathe(mc, T)); chibi(breathe(fx, T, 1));
  const k = eback(prog(t, 2.5, 2.9)); if (k > 0) { rays(T, 960, 320, 420, k); g.save(); g.translate(960, 330); g.scale(k, k); g.font = `900 240px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 14; g.strokeStyle = '#5a2a10'; g.strokeText('义', 0, 0); g.fillStyle = '#ffd86a'; g.shadowColor = 'rgba(255,170,60,.9)'; g.shadowBlur = 40; g.fillText('义', 0, 0); g.restore(); }
}
