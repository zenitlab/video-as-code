// 张良拾履 · 第 29–41 句（138–203 秒）：跟了刘邦以后的计策。2026-11-10 用户确认加入。
// 载入顺序：props.js → scenes.js → scenes_mid.js → scenes2.js（scenes2 的 SCENES 要用到这里的函数）

const XY = { robe: '#5a1a1a', robe2: '#3e1010' };   // 项羽：黑盔红缨，深红袍
const HAN = { robe: '#9a3a2e', robe2: '#6e2a20' };  // 汉军
// ---------- 新道具 ----------
// 火：多层（外橙、内黄、白芯），形状逐帧变，往上冒火星
function fire(t, x, y, s, seed = 0) {
  if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s);
  const f = (w, h, c, ph) => { g.fillStyle = c; g.beginPath(); g.moveTo(-w, 0); g.quadraticCurveTo(-w * 1.1, -h * .5, Math.sin(t * 9 + ph + seed) * w * .4, -h * (1 + .15 * Math.sin(t * 13 + seed + ph))); g.quadraticCurveTo(w * 1.1, -h * .5, w, 0); g.closePath(); g.fill(); };
  f(34, 100, '#e8642a', 0); f(24, 74, '#f6a63a', 1.3); f(12, 40, '#fff2c0', 2.1);
  g.restore(); glow(x, y - 40 * s, 140 * s, .7);
  for (let i = 0; i < 3; i++) { const ph = ((t * .9 + i / 3 + seed * .37) % 1); g.fillStyle = `rgba(255,200,110,${1 - ph})`; g.fillRect(x + Math.sin(i * 2 + seed + t * 3) * 30 * s, y - (60 + ph * 160) * s, 4, 4); }
}
// 旗：杆 + 飘动的旗面，k 0..1 冒出来
function flag(t, x, y, s, k, col = '#c0392b', ch = '汉') {
  if (k <= 0) return; const e = eback(clamp(k)); g.save(); g.translate(x, y); g.scale(s, s * e);
  g.strokeStyle = '#3a2a1e'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -120); g.stroke();
  g.fillStyle = col; g.beginPath(); g.moveTo(0, -120); for (let i = 0; i <= 6; i++) g.lineTo(i * 10, -120 + 6 * Math.sin(t * 6 + i * .8 + x)); for (let i = 6; i >= 0; i--) g.lineTo(i * 10, -76 + 6 * Math.sin(t * 6 + i * .8 + x)); g.closePath(); g.fill();
  g.fillStyle = '#f2e2b8'; g.font = `900 26px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 30, -98); g.restore();
}
// 金饼（买通守将用）
function goldCake(x, y, r) { const gr = g.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r); gr.addColorStop(0, '#ffe39a'); gr.addColorStop(1, '#c08a2a'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r, r * .55, 0, 0, 6.283); g.fill(); glow(x, y, r * 2, .4); }
// 白旗（投降）
function whiteFlag(t, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#5a4430'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -110); g.stroke(); g.fillStyle = '#efeae0'; g.beginPath(); g.moveTo(0, -110); for (let i = 0; i <= 6; i++) g.lineTo(i * 9, -110 + 8 * Math.sin(t * 9 + i)); for (let i = 6; i >= 0; i--) g.lineTo(i * 9, -70 + 8 * Math.sin(t * 9 + i)); g.fill(); g.restore(); }
// 剑（项庄舞剑）
function sword(x, y, ang, len = 150) { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = '#5a4430'; g.fillRect(-6, -4, 12, 30); g.fillStyle = '#d9a64e'; g.fillRect(-18, -8, 36, 8); g.fillStyle = '#cfd6de'; g.beginPath(); g.moveTo(-6, -8); g.lineTo(0, -len); g.lineTo(6, -8); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-1, -len + 10, 2, len - 20); g.restore(); }
// 矮桌 + 饭碗
function lowTable(x, y, w, bowl = true) {
  g.fillStyle = '#5a2a1e'; g.fillRect(x - w / 2, y, w, 26); g.fillStyle = '#7a3a28'; g.fillRect(x - w / 2, y, w, 6); g.fillStyle = '#3a1a12'; g.fillRect(x - w / 2 + 16, y + 26, 20, 60); g.fillRect(x + w / 2 - 36, y + 26, 20, 60);
  if (bowl) { g.fillStyle = '#2a3a4a'; g.beginPath(); g.ellipse(x + 40, y - 6, 46, 12, 0, 0, Math.PI); g.lineTo(x - 6, y - 6); g.fill(); g.fillStyle = '#f2ece0'; g.beginPath(); g.ellipse(x + 40, y - 8, 40, 9, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(x + 40, y - 14, 22, Math.PI, 0); g.fill(); }
}
// 筷子：n 根摆在桌上（借箸代筹）
function chopsticks(t, steps, x, y) { steps.forEach((t0, i) => { if (t < t0) return; const k = eback(prog(t, t0, t0 + .18)); g.save(); g.translate(x + i * 44, y - 30 * (1 - k)); g.rotate(.1); g.fillStyle = '#d8b878'; g.fillRect(-4, -70, 8, 130); g.fillStyle = '#8a3a28'; g.fillRect(-4, -70, 8, 20); g.restore(); if (k >= 1) ring(t, t0 + .18, x + i * 44, y + 60, 40, 8, .4, 2); }); }
// 喷饭：一团白点往前喷
function spray(t, t0, x, y, dir) { const k = prog(t, t0, t0 + .7); if (k <= 0 || k >= 1) return; const r = rng(31); g.save(); for (let i = 0; i < 22; i++) { const a = (r() - .5) * 1.1, sp = 300 + r() * 380; const px = x + dir * Math.cos(a) * sp * k, py = y + Math.sin(a) * sp * k + 260 * k * k; g.globalAlpha = 1 - k; g.fillStyle = '#f2ece0'; g.beginPath(); g.ellipse(px, py, 7, 5, a, 0, 6.283); g.fill(); } g.restore(); }
// 信：纸上一行红字
function letter(x, y, s, str, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-56, -66, 120, 140); g.fillStyle = '#ece0c2'; g.fillRect(-60, -70, 120, 140); g.fillStyle = '#b8322a'; g.font = `900 34px ${SERIF}`; g.textAlign = 'center'; [...str].forEach((ch, i) => g.fillText(ch, 0, -30 + i * 38)); g.restore(); }
// 封地图：一大块齐地发金光（三万户），张良只点一个小点（留）
function fiefMap(t, x, y, s, pick) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-286, -186, 580, 380); g.fillStyle = '#e6d8b4'; g.fillRect(-290, -190, 580, 380); g.strokeStyle = 'rgba(120,90,50,.5)'; g.lineWidth = 3; g.strokeRect(-278, -178, 556, 356);
  g.strokeStyle = 'rgba(70,100,140,.6)'; g.lineWidth = 6; g.beginPath(); g.moveTo(-280, -40); g.quadraticCurveTo(-60, -110, 280, -60); g.stroke();
  const qa = 1 - .75 * eout(pick); g.fillStyle = `rgba(224,176,74,${.85 * qa})`; g.beginPath(); g.moveTo(40, -150); g.quadraticCurveTo(240, -170, 250, -20); g.quadraticCurveTo(200, 60, 60, 40); g.quadraticCurveTo(-10, -60, 40, -150); g.fill();
  g.fillStyle = `rgba(90,60,20,${qa})`; g.font = `900 46px ${SERIF}`; g.textAlign = 'center'; g.fillText('齐　三万户', 140, -40);
  const r = 12 + 6 * Math.sin(t * 6) * eout(pick); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(-150, 110, r, 0, 6.283); g.fill(); g.fillStyle = '#2a1d14'; g.font = `900 40px ${SERIF}`; g.fillText('留', -150, 72);
  if (pick > 0) ring(t, 0, -150, 110, 60, 60, 1, 3);
  g.restore(); if (pick > 0) glow(x - 150 * s, y + 110 * s, 120 * s, .6 * eout(pick));
}
// 悬崖岩壁
function cliffs(t) {
  const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#0e1220'); sk.addColorStop(1, '#1c1a24'); g.fillStyle = sk; g.fillRect(-1200, -300, W + 2400, H + 600);
  g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(1500, 160, 34, 0, 6.283); g.fill(); glow(1500, 160, 120, .2);
  const r = rng(51); g.fillStyle = '#2a2622'; g.beginPath(); g.moveTo(-1200, H + 300); for (let x = -1200; x <= W + 1200; x += 120) g.lineTo(x, 240 + r() * 120); g.lineTo(W + 1200, H + 300); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3; for (let i = 0; i < 40; i++) { const x = -1100 + i * 110, y = 420 + (i * 97) % 500; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 50, y + 70); g.lineTo(x + 30, y + 140); g.stroke(); }
  g.fillStyle = '#0a0a10'; g.fillRect(-1200, 900, W + 2400, 400);   // 深谷
}
// 栈道：沿岩壁的一条木板路，从 x0 到 x1；burnAt(x) 返回这一段起火的时刻
function plankRoad(t, x0, x1, y, burnStart, burnSpeed) {
  for (let x = x0; x < x1; x += 60) {
    const tb = burnStart + (x1 - x) / burnSpeed;   // 从右往左烧（身后）
    const fall = Math.max(0, t - tb - 1.2), dy = fall > 0 ? 300 * fall * fall : 0, rot = fall * 1.5;
    g.save(); g.translate(x + 30, y + dy); g.rotate(rot);
    g.fillStyle = t > tb ? '#3a2416' : '#7a5a3a'; g.fillRect(-30, 0, 58, 16); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(-30, 0, 58, 3);
    g.strokeStyle = '#4a3420'; g.lineWidth = 6; g.beginPath(); g.moveTo(-20, 16); g.lineTo(-30, 70); g.stroke();
    g.restore();
    if (t > tb && dy < 600) fire(t, x + 30, y + dy, .55 * eout(prog(t, tb, tb + .3)) * (1 - prog(t, tb + 2.5, tb + 3.5)), x * .01);
  }
}

// ================= 第 30–31 句：峣关（143–153） =================
function sYao(T) {
  const t = T - 143;
  camStd(t, [[0, 1.0, 960, 540], [2.4, 1.04, 1080, 520], [5, 1.08, 1100, 520], [7, 1.12, 900, 560], [10, 1.06, 1100, 540]]);
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#141826'); sk.addColorStop(1, '#3a2c2a'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  mountains(T, 760);
  // 关：两边山崖夹一座关门
  g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(1180, 900); g.lineTo(1260, 360); g.lineTo(1360, 420); g.lineTo(1380, 900); g.fill(); g.beginPath(); g.moveTo(1700, 900); g.lineTo(1720, 400); g.lineTo(1840, 330); g.lineTo(2200, 900); g.fill();
  g.fillStyle = '#4a3a2e'; g.fillRect(1380, 560, 320, 340); g.fillStyle = '#3a2a1e'; g.fillRect(1360, 540, 360, 30);
  const open = eout(prog(t, 5.6, 6.4)); g.fillStyle = '#1a1210'; g.fillRect(1470, 690, 140, 210); g.fillStyle = '#6a2a1e'; g.fillRect(1470 - 70 * open, 690, 70, 210); g.fillRect(1540 + 70 * open, 690, 70, 210);
  glow(1540, 800, 200, .3 * open);
  // 山头上一面接一面冒出旗子（疑兵）
  const fl = [[200, 700], [380, 640], [560, 690], [760, 620], [950, 660], [300, 560], [660, 520], [1100, 600], [480, 470], [860, 470]];
  fl.forEach(([x, y], i) => flag(T, x, y, 1.1, prog(t, .6 + i * .16, .9 + i * .16)));
  // 秦将站在关门上：收了金子，挥白旗
  const qj = { x: 1540, y: 560, D: 150, who: 'qin', robe: '#3a3a40', robe2: '#26262a', face: { eye: 'dot', mouth: 'small', look: [-1, 0] } };
  if (t > 3.6) qj.face = { eye: 'happy', mouth: 'grin' };
  if (t > 5.0 && t < 7.4) { qj.armR = 2.6; }
  if (t > 7.4) { const k = prog(t, 7.4, 8.2); qj.face = { eye: 'xx', mouth: 'O' }; qj.rot = -k * 1.6; qj.x -= k * 120; qj.lift = Math.sin(k * Math.PI) * 120; }
  chibi(breathe(qj, T));
  if (t > 5.0 && t < 7.4) { const h = handPos(qj, 1); whiteFlag(T, h[0], h[1] + 20, 1); }
  // 金子飞过去
  for (let i = 0; i < 5; i++) { const t0 = 2.4 + i * .18, u = prog(t, t0, t0 + .8); if (u <= 0 || u >= 1) continue; goldCake(lerp(560, 1520, u), lerp(860, 520, u) - Math.sin(u * Math.PI) * 200, 26); }
  if (t > 3.3 && t < 5) for (let i = 0; i < 4; i++) goldCake(1470 + i * 26, 560 - 40, 22);
  // 张良和刘邦在左前方；张良抬手拦住刘邦，再一指：冲
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 360, y: 980, face: { eye: 'dot', mouth: 'small', look: [1, -.3] } });
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 720, y: 980, face: { eye: 'smug', mouth: 'smile', look: [1, -.3] } });
  if (t > 5.4 && t < 7) { lb.face = { eye: 'happy', mouth: 'grin' }; lb.x += kf(t, [[5.4, 0], [6, 60]]); walk(lb, lb.x, 60); zl.armL = kf(t, [[5.9, .15], [6.05, 1.6, eback]]); zl.face = { eye: 'angry', mouth: 'flat', look: [-1, 0] }; }
  if (t >= 7) { lb.x += 60; lb.face = { eye: 'wide', mouth: 'o', look: [1, 0] }; zl.armR = kf(t, [[7.0, .15], [7.15, 2.0, eback]]); zl.face = { eye: 'angry', mouth: 'grit', look: [1, 0] }; zl.hair = spring(t, 7.05, .6, 5); }
  chibi(breathe(lb, T)); chibi(breathe(zl, T, 1));
  pop(T, 143 + 6.0, '慢', 560, 980 - 2.5 * D, 70, { ttl: .8, col: COL.red });
  // 汉军冲锋
  for (let i = 0; i < 6; i++) { const t0 = 7.2 + i * .12; if (t < t0) continue; const x = kf(t, [[t0, 200 + i * 40], [t0 + 1.6, 1560, k => k]]); if (t > t0 + 1.6) continue; const s = P({ who: 'qin', ...HAN, x, y: 900 + (i % 3) * 30, D: 120, face: { eye: 'angry', mouth: 'grit', look: [1, 0] }, armR: 2.4 }); walk(s, x, 40); s.lean += .2; chibi(s); }
  speedLines(T, 150.2, 151.6, 1200, 820, 1, 300, 8, 7);
  if (t > 8.1) { pop(T, 151.2, '大破', 1520, 420, 110, { ttl: 1.6, col: COL.red, rot: -.08 }); }
}

// ================= 第 32 句：鸿门宴（153–158） =================
function sHongmen(T) {
  const t = T - 153;
  camStd(t, [[0, 1.1, 960, 480], [1.6, 1.16, 900, 490], [2.0, 1.1, 800, 480], [5, 1.14, 760, 480]]);
  tentIn(T); glow(960, 700, 500, .35);
  g.fillStyle = '#5a2a1e'; g.fillRect(560, 880, 800, 26);
  const xy = P({ who: 'xy', ...XY, beard: 'black', x: 1360, y: 900, face: { eye: 'smug', mouth: 'smirk', look: [-1, 0] } });
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 760, y: 900, face: { eye: 'xx', mouth: 'wave', look: [1, 0] } });
  lb.x += shake(T, 2, 14);
  // 项庄舞剑：左右转着靠近刘邦
  const xz = P({ who: 'qin', robe: '#6a1a1a', robe2: '#4a1010', x: 1040 + 60 * Math.sin(T * 3), y: 900, face: { eye: 'smug', mouth: 'grin', look: [-1, 0] }, armR: 2.4 + .6 * Math.sin(T * 6), lean: .1 * Math.sin(T * 6) });
  if (t > 1.7) { xz.face = { eye: 'wide', mouth: 'O', look: [-1, 0] }; xz.armR = 2.8; xz.lean = 0; xz.x = 1040; }
  // 樊哙撞进来
  const fx = kf(t, [[1.4, -300], [1.75, 520, eout]]);
  const fk = { x: fx, y: 900, D: 250, who: 'strong', robe: '#4a3a3a', robe2: '#302626', beard: 'black', face: { eye: 'angry', mouth: 'grit', look: [1, 0] }, armL: 1.2, armR: 1.4, lean: .15 };
  if (t > 2.0) { lb.face = t < 2.6 ? { eye: 'xx', mouth: 'wave' } : { eye: 'smug', mouth: 'smile', look: [-1, 0] }; }
  if (t > 2.6) { lb.x = kf(t, [[2.6, 760], [4.6, -300, k => k]]); walk(lb, 760 - lb.x, 60); lb.lean += .1; lb.face = { eye: 'happy', mouth: 'smile', look: [-1, 0] }; }
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: kf(t, [[0, 420], [.8, -100, k => k]]), y: 900, face: { eye: 'smug', mouth: 'small', look: [-1, 0] } });
  if (t < .8) { walk(zl, 420 - zl.x, 60); chibi(zl); }
  chibi(breathe(xy, T)); chibi(breathe(xz, T)); const hs = handPos(xz, 1); sword(hs[0], hs[1], .4 * Math.sin(T * 6) + (t > 1.7 ? .2 : 0));
  chibi(breathe(lb, T)); if (t > 1.4) chibi(fk);
  pop(T, 155.15, '肚子疼', lb.x + 40, 900 - 2.45 * D, 52, { ttl: 1.0, col: '#e8c070' });
  dust(T, 154.75, 600, 900, 220, 10, 3); ring(T, 154.75, 600, 905, 200, 30, .7, 4); speedLines(T, 154.4, 154.8, 400, 760, 1, 260, 7, 2);
  tag(T, 153.4, 157.6, 1250, 440, '项羽'); tag(T, 153.4, 154.8, 960, 440, '项庄舞剑');
  pop(T, 155.0, '!', 1080, 900 - 2.4 * D, 110, { ttl: .8 });
  sweat(T, 153.3, 860, 900 - 2.0 * D, 70, 1.2);
}

// ================= 第 33–34 句：烧栈道，项羽放心（158–168） =================
function sPlank(T) {
  const t = T - 158;
  camStd(t, [[0, 1.1, 1100, 520], [2.6, 1.16, 1150, 540], [4.8, 1.1, 1000, 540], [5.2, .95, 400, 540], [6.2, 1.05, 100, 400], [10, 1.12, 60, 400]]);
  cliffs(T);
  plankRoad(T, 200, 2000, 700, 160.6, 700);
  // 刘邦和张良走在栈道右端，张良回头一指，扔火把
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: kf(t, [[0, 1300], [2.2, 1620, eout]]), y: 700, face: { eye: 'dot', mouth: 'small', look: [1, 0] } });
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: kf(t, [[0, 1050], [2.2, 1380, eout]]), y: 700, face: { eye: 'dot', mouth: 'small', look: [1, 0] } });
  if (t < 2.2) { walk(lb, lb.x, 70); walk(zl, zl.x, 70); }
  if (t > 1.6 && t < 4.6) { lb.face = { eye: 'wide', mouth: 'o', look: [-1, 0] }; zl.face = { eye: 'smug', mouth: 'smirk', look: [-1, 0] }; zl.armL = kf(t, [[2.2, .15], [2.4, 2.4, eback], [2.6, 1.6]]); }
  if (t > 3.2) { lb.face = { eye: 'xx', mouth: 'O', look: [-1, 0] }; }
  chibi(breathe(lb, T)); chibi(breathe(zl, T, 1));
  if (t > 2.0 && t < 2.6) { const h = handPos(zl, -1); g.fillStyle = '#5a4430'; g.fillRect(h[0] - 4, h[1] - 50, 8, 60); fire(T, h[0], h[1] - 50, .35, 7); }
  if (t >= 2.6) { const u = prog(t, 2.6, 2.9); if (u < 1) { const x = lerp(1300, 1180, u), y = lerp(560, 700, u) - Math.sin(u * Math.PI) * 60; fire(T, x, y, .35, 7); } }
  // 对面远处的项羽：看见火光，放心大笑
  const xy = P({ who: 'xy', ...XY, beard: 'black', x: -260, y: 700, face: { eye: 'smug', mouth: 'small', look: [1, 0] }, armL: .6, armR: .6 });
  g.fillStyle = '#2a2622'; g.fillRect(-700, 700, 760, 400);   // 项羽站的山头
  if (t > 6.6) { xy.face = { eye: 'happy', mouth: 'grin' }; for (const h of [6.7, 7.05, 7.4]) { const k = prog(t, h, h + .3); if (k > 0 && k < 1) xy.lift = D * .1 * Math.sin(Math.PI * k); } }
  chibi(breathe(xy, T)); flag(T, -480, 700, 1.4, 1, '#2a2a2a', '楚');
  pop(T, 164.7, '哈哈哈', -60, 700 - 2.0 * D, 70, { ttl: 1.6, rot: -.1 });
  tag(T, 158.4, 161.8, 1300, 300, '栈道　悬崖上的木板路');
}

// ================= 第 35–37 句：借箸代筹，刘邦吐饭（168–183） =================
function sMeal(T) {
  const t = T - 168;
  camStd(t, [[0, 1.1, 960, 480], [5, 1.16, 1000, 490], [6.6, 1.22, 1080, 500], [10, 1.22, 1080, 500], [10.4, 1.16, 900, 490], [15, 1.12, 900, 480]]);
  room(T, '#2a1f19', 880, 1000);
  for (const x of [200, 1720]) pillar(x, 60, 880, 56);
  // 郦食其（劝立六国后人的人）
  const lq = P({ who: 'guan', robe: '#6a6a72', robe2: '#4a4a52', beard: 'goatee', x: 480, y: 880, face: { eye: 'happy', mouth: Math.floor(T * 7) % 2 && t < 2.6 ? 'O' : 'smile', look: [1, 0] }, armR: t < 2.6 ? 1.2 + .3 * Math.sin(T * 7) : undefined });
  if (t > 10) { lq.face = { eye: 'xx', mouth: 'O', look: [1, 0] }; }
  if (t > 12.6) { lq.x = kf(t, [[12.6, 480], [14.6, -300, k => k]]); walk(lq, 480 - lq.x, 55); lq.lean += .15; }
  chibi(breathe(lq, T));
  // 刘邦坐在矮桌后吃饭
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 1000, y: 880, sy: .8, face: { eye: 'happy', mouth: Math.floor(T * 6) % 2 ? 'o' : 'small' }, armR: 1.1 + .5 * Math.max(0, Math.sin(T * 6)) });
  if (t > 1.6 && t < 5) { lb.lean = .1 * Math.max(0, Math.sin(T * 7)); }
  if (t >= 5) { lb.armR = undefined; lb.face = t < 6.8 ? { eye: 'dot', mouth: 'small', look: [1, 0] } : t < 8.4 ? { eye: 'wide', mouth: 'o', look: [1, .5] } : { eye: 'wide', mouth: 'puff', look: [1, .5] }; }
  if (t >= 10) {   // 吐饭：后仰蓄力 → 往前喷 → 跳脚骂
    lb.lean = kf(t, [[10, 0], [10.25, -.2, eout], [10.4, .25, eout], [10.7, 0]]); lb.face = t < 10.4 ? { eye: 'xx', mouth: 'puff' } : t < 11.6 ? { eye: 'xx', mouth: 'O' } : { eye: 'angry', mouth: 'grit', look: [-1, 0] };
    if (t > 11.6) { lb.sy = 1; lb.armR = kf(t, [[11.6, .15], [11.75, 1.6, eback]]); lb.flush = .6; for (const h of [11.7, 12.1, 12.5]) { const k = prog(t, h, h + .3); if (k > 0 && k < 1) lb.lift = D * .15 * Math.sin(Math.PI * k); } }
  }
  chibi(breathe(lb, T));
  lowTable(1020, 830, 380, t < 10.4);
  // 张良来了，借筷子一根根摆
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: kf(t, [[4.9, 2100], [5.8, 1440, eout]]), y: 880, face: { eye: 'smug', mouth: 'smile', look: [-1, .3] } });
  if (t > 4.9 && t < 5.8) walk(zl, 2100 - zl.x, 70);
  if (t >= 6.6 && t < 10) { zl.armL = 1.1 + .15 * Math.sin(T * 8); }
  if (t > 4.9) chibi(breathe(zl, T, 2));
  const CH = [6.8, 7.2, 7.6, 8.0, 8.4, 8.8, 9.15, 9.5];
  chopsticks(T, CH.map(x => 168 + x), 870, 820);
  spray(T, 178.4, 1060, 880 - 1.25 * D, -1);
  pop(T, 178.4, '噗', 880, 880 - 2.0 * D, 90, { ttl: .9, rot: -.15 });
  pop(T, 169.9, '好好好', 1000, 880 - 2.2 * D, 54, { ttl: 1.6 });
  steam(T, 179.6, 182.4, 1000, 880 - 2.1 * D, 110); vein(T, 179.6, 1090, 880 - 1.95 * D, 46, 182.4); sweat(T, 178.6, 560, 880 - 2.0 * D, 70, 1.2);
  tag(T, 168.4, 172.4, 330, 440, '郦食其');
}

// ================= 第 38–39 句：踩脚，假王改真王（183–193） =================
function sStep(T) {
  const t = T - 183;
  // 2.9 秒踩脚时镜头猛推到脚下，再拉回
  camStd(t, [[0, 1.12, 980, 480], [2.6, 1.18, 1000, 500], [2.85, 1.6, 960, 760], [3.5, 1.6, 960, 760], [3.9, 1.22, 1020, 520], [10, 1.18, 1000, 500]]);
  room(T, '#2a1f19', 880, 1000);
  for (const x of [200, 1720]) pillar(x, 60, 880, 56);
  // 信使跪在左边
  const ms = P({ who: 'qin', robe: '#3a5a7a', robe2: '#2a4060', x: 330, y: 880, sy: .74, lean: .15, face: { eye: 'close', mouth: 'small' } });
  if (t > 6.2) ms.face = { eye: 'happy', mouth: 'grin', look: [1, 0] };
  chibi(breathe(ms, T));
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 960, y: 880, face: { eye: 'dot', mouth: 'small', look: [0, .5] }, armL: 1.0, armR: 1.0 });
  if (t > 1.4) { lb.face = { eye: 'angry', mouth: 'grit', look: [-1, 0] }; lb.flush = .6; lb.armL = undefined; lb.armL = kf(t, [[1.4, 1.0], [1.6, 2.6, eout], [1.85, 1.1, ein], [2.4, 1.1]]); lb.armR = undefined; }
  if (t > 2.4 && t < 2.9) { lb.face = { eye: 'angry', mouth: 'O', look: [-1, 0] }; lb.lean = -.08; }
  if (t >= 2.9 && t < 3.9) { lb.face = { eye: 'xx', mouth: 'o' }; lb.lift = D * .12 * Math.sin(Math.PI * prog(t, 2.9, 3.2)); lb.hair = spring(t, 2.9, .5, 5); lb.flush = .3; }
  if (t >= 3.9 && t < 5.4) { lb.face = { eye: 'smug', mouth: 'small', look: [1, 0] }; lb.flush = 0; }
  if (t >= 5.4) { lb.face = { eye: 'smug', mouth: 'grin', look: [-1, 0] }; lb.armR = kf(t, [[5.5, .15], [5.7, 2.3, eback]]); lb.flush = 0; }
  // 张良站在右边，伸脚踩，再凑到耳边
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 1240, y: 880, face: { eye: 'smug', mouth: 'flat', look: [-1, 0] } });
  if (t > 2.6 && t < 3.6) { const k = eout(prog(t, 2.75, 2.9)) * (1 - eio(prog(t, 3.3, 3.6))); zl.feetL = [-1.05 * k, -.08 * k]; zl.stompL = k > .3; zl.lean = -.08 * k; }
  if (t >= 3.6 && t < 5.4) { zl.lean = kf(t, [[3.6, 0], [3.8, -.28]]); zl.x = kf(t, [[3.6, 1240], [3.8, 1160]]); zl.face = { eye: 'close', mouth: 'o' }; }
  // 书案在三人身后（画在人前面会挡住踩脚）
  g.fillStyle = '#5a2a1e'; g.fillRect(660, 728, 640, 22); g.fillStyle = '#7a3a28'; g.fillRect(660, 728, 640, 5); g.fillStyle = '#3a1a12'; g.fillRect(690, 750, 18, 90); g.fillRect(1252, 750, 18, 90);
  // 陈平：站刘邦左边，和张良同时踩，再一起凑到耳边
  const cp = P({ who: 'guan', robe: '#4a5a6a', robe2: '#34404c', x: 700, y: 880, face: { eye: 'smug', mouth: 'flat', look: [1, 0] } });
  if (t > 2.6 && t < 3.6) { const k = eout(prog(t, 2.75, 2.9)) * (1 - eio(prog(t, 3.3, 3.6))); cp.feetR = [.85 * k, -.08 * k]; cp.stompR = k > .3; cp.lean = .08 * k; }
  if (t >= 3.6 && t < 5.4) { cp.lean = kf(t, [[3.6, 0], [3.8, .26]]); cp.x = kf(t, [[3.6, 700], [3.8, 770]]); cp.face = { eye: 'close', mouth: 'o' }; }
  if (t >= 5.4) cp.face = { eye: 'happy', mouth: 'smile', look: [1, 0] };
  chibi(breathe(cp, T, 2)); chibi(breathe(lb, T)); chibi(breathe(zl, T, 1));
  // 信：先拿在手里，拍桌后摊在桌上，「假王」
  if (t < 1.6) { const h = handPos(lb, 1); letter(960, h[1] - 40, .9, '假王'); }
  else letter(1120, 716, .55, '假王', -.3);
  if (t > 1.85 && t < 2.1) { dust(T, 184.85, 830, 736, 200, 8, 6); }
  pop(T, 184.85, '啪', 760, 620, 80, { ttl: .6, rot: .15 });
  pop(T, 185.9, '踩', 1420, 700, 90, { ttl: .8, col: COL.red, rot: -.1 });
  ring(T, 185.9, 1000, 878, 110, 20, .6, 4); dust(T, 185.9, 1000, 880, 120, 8, 4); ring(T, 185.9, 915, 878, 110, 20, .6, 4); dust(T, 185.9, 915, 880, 120, 8, 7);
  pop(T, 186.7, '…', 1160, 880 - 2.4 * D, 70, { ttl: 1.2, stroke: false });
  pop(T, 188.7, '真王！', 960, 880 - 2.6 * D, 90, { ttl: 2.4, col: '#ffd86a' });
  if (t > 5.6) { const h = handPos(lb, 1); glow(h[0], h[1] - 10, 90, .5 + .3 * Math.sin(T * 6)); }
  tag(T, 183.4, 186.6, 200, 440, '韩信派来的人');
}

// ================= 第 40–41 句：封赏，只要留县（193–203） =================
function sReward(T) {
  const t = T - 193;
  camStd(t, [[0, 1.1, 960, 480], [4.6, 1.14, 900, 480], [5.0, 1.08, 1000, 470], [10, 1.14, 1050, 470]]);
  room(T, '#2e1f18', 880, 960);
  g.fillStyle = '#3a1a12'; g.fillRect(-300, 70, W + 600, 70); g.fillStyle = '#d9a64e'; g.fillRect(-300, 136, W + 600, 8);
  for (const x of [180, 1740]) pillar(x, 140, 880, 60);
  g.fillStyle = '#6a2a1e'; g.fillRect(420, 760, 360, 120); g.fillStyle = '#d9a64e'; g.fillRect(420, 760, 360, 8);   // 宝座台
  const lb = P({ who: 'lb', ...LB, beard: 'black', buckle: 1, x: 600, y: 760, face: { eye: 'happy', mouth: 'grin', look: [1, 0] } });
  if (t < 4.6) lb.armR = kf(t, [[.4, .15], [.6, 1.6, eback]]);
  if (t > 5) lb.face = t < 7.2 ? { eye: 'dot', mouth: 'small', look: [1, 0] } : { eye: 'wide', mouth: 'O', look: [1, 0] };
  chibi(breathe(lb, T));
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 1150, y: 880, sy: t < 4.6 ? .74 : 1, lean: t < 4.6 ? .15 : 0, face: t < 4.6 ? { eye: 'close', mouth: 'smile' } : { eye: 'happy', mouth: 'smile', look: [1, -.3] } });
  if (t > 6.6) zl.armR = kf(t, [[6.6, .15], [6.8, 1.9, eback]]);
  chibi(breathe(zl, T, 1));
  if (t > 5) { const k = eback(prog(t, 5.0, 5.3)); g.save(); g.translate(1450, 470); g.scale(k, k); fiefMap(T, 0, 0, .9, prog(t, 6.8, 7.4)); g.restore(); }
  pop(T, 200.2, '!', 600, 760 - 2.4 * D, 110, { ttl: .8 });
  tag(T, 200.8, 202.7, 1480, 780, '留侯　就是这么来的');
}
