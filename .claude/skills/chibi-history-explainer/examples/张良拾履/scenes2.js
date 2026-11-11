// 张良拾履 · 内容第二部分：第 6–34 句（25–172 秒）+ 全片的 SCENES / PAGES / overlay / CUES
const DURATION = 250;
const SH = 78;   // 2026-11-10 插入计策段（补前因后果后 15 页，138–226 秒），原 148 秒以后的段落整体后移 78 秒
const LB = { robe: '#9a3a2e', robe2: '#6e2a20' };
const P = (base, more) => Object.assign({ D, y: DECK }, base, more);
const breathe = (o, t, ph = 0) => { if (!o.lift) o.sy = (o.sy || 1) * (1 + .015 * Math.sin(t * 3.8 + ph)); return o; };
const HEAD = o => [o.x, o.y - (o.lift || 0) - 2.25 * o.D * (o.sy || 1)];   // 头顶上方一点（放符号）
function camStd(t, keys) { const z = kf(t, keys.map(k => [k[0], k[1]])), cx = kf(t, keys.map(k => [k[0], k[2]])), cy = kf(t, keys.map(k => [k[0], k[3]])); camera(cx, cy, z); }
// 斗笠（逃亡时戴）
function bambooHat(o) { const [x, y] = [o.x, o.y - (o.lift || 0) - 1.47 * o.D * (o.sy || 1)]; g.save(); g.translate(x, y - .42 * o.D); g.rotate(o.lean || 0); g.fillStyle = '#b8955a'; g.beginPath(); g.moveTo(-.75 * o.D, .1 * o.D); g.quadraticCurveTo(0, -.45 * o.D, .75 * o.D, .1 * o.D); g.closePath(); g.fill(); g.strokeStyle = 'rgba(90,60,30,.5)'; g.lineWidth = 3; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(0, -.3 * o.D); g.lineTo(i * .22 * o.D, .08 * o.D); g.stroke(); } g.restore(); }
// 雾（老头消失）
function fogLayer(t, a) { if (a <= 0) return; g.save(); for (let i = 0; i < 9; i++) { const x = ((i * 260 + t * 40) % (W + 600)) - 300, y = 420 + (i % 3) * 120; const gr = g.createRadialGradient(x, y, 0, x, y, 380); gr.addColorStop(0, `rgba(200,205,215,${.35 * a})`); gr.addColorStop(1, 'rgba(200,205,215,0)'); g.fillStyle = gr; g.fillRect(x - 400, y - 400, 800, 800); } g.restore(); }

// ================= 第 6–9 句：韩国贵族 → 秦灭韩 → 散尽家财（25–45） =================
function sPalace(T) {
  const Q = (b, m) => P(b, Object.assign({ y: 860 }, m));
  const t = T - 25;
  camStd(t, [[0, 1.3, 960, 560], [5, 1.36, 960, 570], [5.4, 1.12, 960, 500], [10, 1.14, 960, 500], [11.2, 1.3, 960, 560], [15, 1.34, 980, 570], [15.4, 1.26, 1000, 560], [20, 1.32, 1050, 570]]);
  const ruin = prog(t, 10.6, 11.0);
  room(t, '#2e1f18', 860, 960, 1 - .65 * ruin);
  // 宫殿：红柱、横梁、匾
  g.fillStyle = '#3a1a12'; g.fillRect(-300, 70, W + 600, 70); g.fillStyle = '#d9a64e'; g.fillRect(-300, 136, W + 600, 8);
  for (const x of [180, 560, 1360, 1740]) pillar(x, 140, 860, 60);
  if (t < 15) plaque(960 - 380 * ein(prog(t, 11.0, 11.5)), 200, '韩', prog(t, 11.0, 11.5), t);
  if (t > 11.5 && t < 12.3) { dust(T, 36.5, 580, 860, 260, 12, 9); }
  // 帘子和灯
  for (const x of [370, 1550]) { const fl = 1 + .05 * Math.sin(T * 8 + x); g.fillStyle = '#f0a050'; g.beginPath(); g.ellipse(x, 300, 26, 32, 0, 0, 6.283); g.fill(); glow(x, 300, 140 * fl, .8 * (1 - .7 * ruin)); glow(x, 330, 420, .3 * (1 - .7 * ruin)); }
  // 第 6 句：张良（锦衣玉带）站中间，「贵族」时身后放光
  // 第 7 句：祖父、父亲进来，上面一排五个韩王一个个冒出来，祖父拜三个，父亲拜两个
  // 第 8 句：黑旗扫过，匾掉下来，韩王和祖辈都不见了
  // 第 9 句：弟弟的白布灵位在左；张良转过身，打开钱箱，钱往右飞
  const kings = [[6.8, 560], [7.3, 760], [7.8, 960], [8.3, 1160], [8.8, 1360]];
  if (t >= 5 && t < 10.9) {
    g.fillStyle = '#5a1a12'; g.fillRect(440, 392, 1040, 18); g.fillStyle = '#d9a64e'; g.fillRect(440, 392, 1040, 4);   // 台
    kings.forEach(([tk, x], i) => { if (t < tk) return; const k = eback(prog(t, tk, tk + .25)); const o = { x, y: 392, D: 80 * k, who: 'king', robe: '#c08a2a', robe2: '#8a5a1a', face: { eye: 'close', mouth: 'smile' }, shadow: false, buckle: 1 }; chibi(breathe(o, T, i)); });
    const gp = Q({ who: 'guan', robe: '#6a4a8a', robe2: '#4a3266', beard: 'goatee', x: 650, face: { eye: 'close', mouth: 'smile' } });
    const fa = Q({ who: 'guan', robe: '#8a3a3a', robe2: '#662626', beard: 'goatee', x: 1270, face: { eye: 'close', mouth: 'smile' } });
    const inK = eout(prog(t, 5.2, 5.6)); gp.x = lerp(-200, 650, inK); fa.x = lerp(2100, 1270, inK); if (t < 5.6) { walk(gp, gp.x, 80); walk(fa, fa.x, 80); }
    kings.forEach(([tk], i) => { const who = i < 3 ? gp : fa; const k = prog(t, tk + .05, tk + .45); if (k > 0 && k < 1) { who.lean = .28 * Math.sin(Math.PI * k); who.face = { eye: 'close', mouth: 'small' }; } });
    gp.armL = gp.armR = undefined; chibi(breathe(gp, T)); chibi(breathe(fa, T, 1));
    tag(T, 30.6, 35, 400, 520, '祖父'); tag(T, 30.6, 35, 1450, 520, '父亲');
  }
  const zl = Q({ who: 'zl', ...ZL, x: 960, buckle: 1, face: { eye: 'happy', mouth: 'smile' } });
  if (t < 5) { if (t > 2.6) rays(T, 960, 380, 560, at(t, 2.6, .4) * (1 - prog(t, 4.6, 5))); zl.hair = .1 * Math.sin(T * 2); chibi(breathe(zl, T)); pop(T, 27.0, '✦', 1100, 300, 60, { ttl: 1.6, col: '#ffd86a' }); }
  if (t >= 10.9 && t < 15) {   // 秦灭韩
    zl.buckle = 0; zl.x = 960; const k = prog(t, 11.6, 11.9);
    zl.face = t < 11.6 ? { eye: 'wide', mouth: 'O', look: [0, -1] } : { eye: 'line', mouth: 'wave' }; zl.sy = t < 11.6 ? 1 : kf(t, [[11.6, 1], [11.8, .88], [12.2, .94]]); zl.hair = -.3;
    chibi(breathe(zl, T)); sweat(T, 37.0, 1060, 380, 70, 1.2);
    for (const [x, d] of [[1460, 0], [1680, .25]]) { const sx = kf(t, [[11.8 + d, 2200], [12.6 + d, x, eout]]); const s = Q({ who: 'qin', robe: '#3a3a40', robe2: '#26262a', x: sx, face: { eye: 'angry', mouth: 'flat' }, armL: .5 }); if (t < 12.6 + d) walk(s, 2200 - sx, 70); chibi(breathe(s, T, d * 9)); const h = handPos(s, -1); g.strokeStyle = '#5a4430'; g.lineWidth = 8; g.beginPath(); g.moveTo(h[0], h[1] + 120); g.lineTo(h[0], h[1] - 300); g.stroke(); g.fillStyle = '#9aa0a8'; g.beginPath(); g.moveTo(h[0] - 14, h[1] - 300); g.lineTo(h[0], h[1] - 350); g.lineTo(h[0] + 14, h[1] - 300); g.fill(); }
  }
  if (t >= 15) {   // 弟死不葬，散尽家财
    g.fillStyle = '#e8e2d4'; g.fillRect(260, 600, 120, 180); g.fillStyle = '#2a1d14'; g.font = `900 40px ${SERIF}`; g.textAlign = 'center'; g.fillText('弟', 320, 680); g.fillStyle = '#5a4430'; g.fillRect(230, 780, 180, 80);
    glow(420, 720, 60, .8 + .1 * Math.sin(T * 9)); g.fillStyle = '#efe6d4'; g.fillRect(414, 740, 10, 40);
    const zz = Q({ who: 'zl', ...ZL, x: 780, face: t < 16.3 ? { eye: 'line', mouth: 'wave', look: [-1, 0] } : { eye: 'angry', mouth: 'flat', look: [1, 0] } });
    if (t >= 16.3) { zz.lean = kf(t, [[16.3, 0], [16.45, -.08], [16.6, 0]]); zz.hair = spring(t, 16.4, .5, 5); }
    if (t >= 17.1) { zz.armR = kf(t, [[17.1, .15], [17.3, 1.7, eback]]); }
    chibi(breathe(zz, T));
    const op = eout(prog(t, 17.0, 17.4)); chest(1250, 860, 1.4, op);
    if (t > 17.3) { for (let i = 0; i < 26; i++) { const t0 = 17.35 + i * .09, u = (t - t0) / 1.0; if (u < 0 || u > 1) continue; const r = rng(i + 3); const x = 1250 + u * (500 + r() * 400), y = 770 - Math.sin(u * Math.PI) * (300 + r() * 200) + u * 120; coin(x, y, 22, T * 8 + i); } }
    tag(T, 42.4, 44.8, 1450, 420, '求　刺客');
  }
  blackFlag(T, prog(t, 10.0, 10.9));
}

// ================= 第 10 句：大力士和铁锤（45–50） =================
function sStrong(T) {
  const t = T - 45;
  const slam = 1.9, sh = t > slam && t < slam + .25 ? 10 * Math.sin((t - slam) * 80) * (1 - (t - slam) / .25) : 0;
  g.save(); camStd(t, [[0, 1.1, 960, 430], [1.8, 1.14, 900, 440], [2.2, 1.2, 900, 460], [5, 1.24, 960, 450]]); g.translate(0, sh);
  room(t, '#221a16', 860, 900);
  for (const x of [300, 1620]) { g.fillStyle = '#3a2a1e'; g.fillRect(x - 8, 420, 16, 440); const fl = 1 + .08 * Math.sin(T * 11 + x); g.fillStyle = '#ffb060'; g.beginPath(); g.ellipse(x, 400, 22 * fl, 40 * fl, 0, 0, 6.283); g.fill(); glow(x, 400, 160 * fl, .9); glow(x, 450, 520, .35); }
  const st = { x: 820, y: 860, D: 290, who: 'strong', robe: '#5a4a3a', robe2: '#3e3226', beard: 'black', face: { eye: 'smug', mouth: 'grin' } };
  // 举锤：下蹲蓄力 → 双手举过头 → 砸地 → 回稳
  st.sy = kf(t, [[.3, 1], [.6, .9, eout], [.9, 1.08, eout], [1.2, 1], [1.7, 1.06], [slam, .86, ein], [slam + .2, 1.02], [slam + .4, 1]]);
  const up = kf(t, [[.6, .15], [1.0, 2.9, eback], [1.7, 3.0], [slam, 1.2, ein], [slam + .5, 1.0]]);
  st.armL = st.armR = up; st.face = t < 1.7 ? { eye: 'smug', mouth: 'grin' } : t < slam + .4 ? { eye: 'xx', mouth: 'grit' } : { eye: 'happy', mouth: 'grin' };
  chibi(breathe(st, T));
  const hl = handPos(st, 1), hr = handPos(st, -1); hammer((hl[0] + hr[0]) / 2, (hl[1] + hr[1]) / 2, 1.5, t < 1.7 ? 0 : kf(t, [[1.7, 0], [slam, Math.PI * .95, ein]]));
  dust(T, 45 + slam, 820 + 330, 860, 300, 12, 4); ring(T, 45 + slam, 1150, 865, 260, 30, .8, 4);
  const zl = P({ who: 'zl', ...ZL, x: 1420, y: 860, face: t < slam ? { eye: 'wide', mouth: 'o', look: [-1, -.5] } : t < 3.3 ? { eye: 'xx', mouth: 'O' } : { eye: 'happy', mouth: 'grin', look: [-1, 0] } });
  if (t > slam && t < slam + .4) { zl.lift = D * .3 * Math.sin(Math.PI * prog(t, slam, slam + .4)); zl.hair = spring(t, slam, .8, 5); }
  if (t > 3.3) zl.armR = kf(t, [[3.3, .15], [3.45, 2.3, eback]]);
  chibi(breathe(zl, T)); sweat(T, 45 + slam + .3, 1520, 860 - 2.1 * D, 70, 1);
  g.restore();
  countRoll(T, 46.3, 47.6, 0, 120, '斤', W - 90, 120, 49.6);
  g.save(); g.font = `400 26px ${SANS}`; g.fillStyle = `rgba(200,190,170,${.7 * at(T, 47.8, .3) * (1 - prog(T, 49.6, 49.9))})`; g.textAlign = 'right'; g.fillText('秦制　约合今 30 公斤', W - 90, 250); g.restore();
}

// ================= 第 11–12 句：博浪沙伏击，砸中副车（50–60） =================
function sDesert(T) {
  const t = T - 50, hit = 6.3;
  const sh = t > hit && t < hit + .3 ? 12 * Math.sin((t - hit) * 70) * (1 - (t - hit) / .3) : 0;
  g.save(); camStd(t, [[0, 1.0, 960, 540], [5, 1.04, 960, 540], [5.6, 1.06, 900, 540], [6.3, 1.12, 600, 560], [10, 1.08, 760, 540]]); g.translate(0, sh);
  const sk = g.createLinearGradient(0, 0, 0, 700); sk.addColorStop(0, '#1a1622'); sk.addColorStop(1, '#5a3a2a'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  glow(1500, 560, 600, .35);
  const dune = (y, amp, col, seed) => { const r = rng(seed); g.fillStyle = col; g.beginPath(); g.moveTo(-300, y); for (let x = -300; x <= W + 300; x += 240) g.quadraticCurveTo(x + 120, y - amp * (.5 + r()), x + 240, y); g.lineTo(W + 300, H + 300); g.lineTo(-300, H + 300); g.fill(); };
  dune(600, 90, '#4a3428', 3); dune(680, 60, '#5e4230', 5);
  g.fillStyle = '#6e4e36'; g.fillRect(-300, 740, W + 600, 400); g.fillStyle = '#7e5c40'; g.fillRect(-300, 740, W + 600, 6);   // 驰道
  // 车队：三辆车，第二辆是副车（被砸），第三辆金顶是秦始皇
  const sp = t < hit ? 0 : (t - hit) * 520;
  [0, 1, 2].forEach(i => {
    const x = -420 + 220 * Math.max(0, t - 1) - i * 640 + (i === 1 ? 0 : sp);
    const wreck = i === 1 ? eout(prog(t, hit, hit + .3)) : 0;
    const xx = i === 1 && t > hit ? -420 + 220 * (hit - 1) - 640 : x;
    if (xx < -700 || xx > W + 600) return;
    horse(xx + 330, 800, 1.5, (i === 1 && t > hit) ? 0 : T * 7 + i, i === 2 ? '#d8c7a0' : '#b8a27c');
    carriage(xx, 800, 1.6, i === 1 && t > hit ? 0 : T * 6, i === 2, wreck);
  });
  // 砸中：烟、尘、金星
  const hx = -420 + 220 * (hit - 1) - 640;
  if (t > hit) { dust(T, 50 + hit, hx, 790, 340, 14, 8); ring(T, 50 + hit, hx, 795, 300, 40, .9, 4); const k = prog(t, hit, hit + 2.5); if (k < 1) { g.save(); g.globalAlpha = .55 * (1 - k); g.fillStyle = '#8a8070'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(hx - 60 + i * 30, 640 - k * 200 - i * 20, 50 + k * 60, 0, 6.283); g.fill(); } g.restore(); } stars(T, 50 + hit + .2, 50 + hit + 2.2, hx, 560, 60); }
  // 伏在前景沙丘后的两个人：探头 → 大力士跳起甩锤
  const peek = eout(prog(t, 2.4, 2.8));
  const stg = { x: 1400, y: 1080 + 330 - 330 * peek, D: 250, who: 'strong', robe: '#5a4a3a', robe2: '#3e3226', beard: 'black', face: { eye: 'smug', mouth: 'flat', look: [-1, 0] } };
  const zl = P({ who: 'zl', ...ZL, x: 1700, y: 1080 + 300 - 260 * peek, face: { eye: 'smug', mouth: 'flat', look: [-1, 0] } });
  const throwT = 5.4;
  if (t > throwT - .4) { stg.y = kf(t, [[throwT - .4, 1080], [throwT, 930, eout], [throwT + .5, 1000], [throwT + .9, 1080]]); stg.armL = stg.armR = kf(t, [[throwT - .4, 2.9], [throwT, 1.6, ein], [throwT + .5, 1.2]]); stg.lean = kf(t, [[throwT - .4, .15], [throwT, -.25, ein], [throwT + .4, 0]]); stg.face = { eye: 'xx', mouth: 'grit' }; }
  if (t > hit + .2) { stg.face = { eye: 'happy', mouth: 'grin', look: [-1, 0] }; zl.face = { eye: 'wide', mouth: 'O', look: [-1, 0] }; }
  if (t > 8.0) { stg.face = { eye: 'wide', mouth: 'o', look: [-1, 0] }; zl.face = { eye: 'xx', mouth: 'wave' }; }
  chibi(stg); chibi(zl);
  // 飞锤
  if (t > throwT && t < hit) { const u = (t - throwT) / (hit - throwT), x = lerp(1380, hx, u), y = lerp(560, 640, u) - Math.sin(u * Math.PI) * 300; for (const dd of [.06, .03]) { const uu = Math.max(0, u - dd / (hit - throwT)); g.save(); g.globalAlpha = .3; hammer(lerp(1380, hx, uu), lerp(560, 640, uu) - Math.sin(uu * Math.PI) * 300 + 140, 1.1, uu * 14); g.restore(); } hammer(x, y + 140, 1.1, u * 14); }
  // 前景沙丘（挡住两人的身子）
  const fr = g.createLinearGradient(0, 940, 0, 1080); fr.addColorStop(0, '#7a5a3e'); fr.addColorStop(1, '#4a3424'); g.fillStyle = fr; g.beginPath(); g.moveTo(1050, H + 300); g.lineTo(1050, 1080); g.quadraticCurveTo(1250, 900, 1550, 950); g.quadraticCurveTo(1800, 990, W + 300, 960); g.lineTo(W + 300, H + 300); g.fill();
  g.restore();
  tag(T, 52.2, 54.6, 1450, 440, '博浪沙');
  tag(T, 56.6, 59.6, 300, 440, '副车');
  if (T > 57.2) { tag(T, 57.2, 59.6, 1300, 400, '秦始皇的车　跑了'); }
}

// ================= 第 13–14 句：大索天下十日，改名躲到下邳（60–70） =================
function sWanted(T) {
  const t = T - 60;
  camStd(t, [[0, 1.0, 960, 540], [5, 1.08, 960, 520]]);
  room(t, '#3a2e26', 900, 960, .8);
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; for (let r = 0; r < 18; r++) for (let x = -200 + (r % 2) * 70; x < W + 200; x += 140) g.strokeRect(x, r * 50, 140, 50);
  const ts = [.4, .8, 1.1, 1.4, 1.65, 1.85, 2.05, 2.2, 2.35, 2.5, 2.62, 2.74];
  const spots = [[360, 330], [700, 300], [1050, 340], [1400, 310], [1700, 360], [520, 600], [880, 620], [1230, 580], [1580, 640], [250, 560], [1060, 470], [1820, 560]];
  ts.forEach((tt, i) => poster(spots[i][0], spots[i][1], 1.2, (rng(i + 1)() - .5) * .3, prog(t, tt, tt + .15)));
  // 秦兵举火把跑过
  for (const [d, y] of [[0, 0], [.3, 40]]) { const x = kf(t, [[2.4 + d, -200], [4.8 + d, 2100, k => k]]); if (t < 2.4 + d || t > 4.8 + d) continue; const s = P({ who: 'qin', robe: '#3a3a40', robe2: '#26262a', x, y: 980 + y, face: { eye: 'angry', mouth: 'grit', look: [1, 0] }, armR: 2.6 }); walk(s, x, 60); s.lean += .15; chibi(s); const h = handPos(s, 1); g.fillStyle = '#5a4430'; g.fillRect(h[0] - 5, h[1] - 60, 10, 70); const fl = 1 + .1 * Math.sin(T * 13); g.fillStyle = '#ffb060'; g.beginPath(); g.ellipse(h[0], h[1] - 72, 16 * fl, 28 * fl, 0, 0, 6.283); g.fill(); glow(h[0], h[1] - 72, 160, .9); }
  countRoll(T, 61.3, 63.4, 1, 10, '天', W - 90, 120, 64.6);
}
function sRoad(T) {
  const t = T - 65;
  camStd(t, [[0, 1.12, 900, 420], [5, 1.18, 1100, 430]]);
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#0e1220'); sk.addColorStop(1, '#2b2420'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(400, 200, 38, 0, 6.283); g.fill(); glow(400, 200, 140, .25);
  mountains(t, 720);
  g.fillStyle = '#2e2620'; g.fillRect(-300, 700, W + 600, 600); g.fillStyle = '#4a3c30'; g.beginPath(); g.ellipse(960, 760, 1400, 40, 0, 0, 6.283); g.fill();
  // 路牌：下邳
  const pk = eback(prog(t, 2.3, 2.6)); if (pk > 0) { g.save(); g.translate(1700, 700); g.scale(1, pk); g.fillStyle = '#5a4430'; g.fillRect(-8, -260, 16, 260); g.fillStyle = '#c9a56a'; g.fillRect(-90, -250, 180, 70); g.fillStyle = '#2a1d14'; g.font = `900 46px ${SERIF}`; g.textAlign = 'center'; g.fillText('下邳', 0, -198); g.restore(); glow(1700, 640, 200, .3); }
  // 戴斗笠的张良踮着脚往右溜
  const x = kf(t, [[0, 200], [4.6, 1450, k => k]]); const zl = P({ who: 'zl', ...ZL, x, face: { eye: 'smug', mouth: 'small', look: [-1, 0] } });
  walk(zl, x, 55); zl.lean += .08; chibi(zl); bambooHat(zl);
  // 名字：张良 → 划掉
  const [nx, ny] = [x + 10, DECK - 2.75 * D];
  g.save(); g.globalAlpha = at(t, .3, .25); g.font = `900 52px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const changed = t > 1.6;
  g.fillStyle = '#efe6d4'; g.fillText(changed ? '？？' : '张良', nx, ny);
  if (t > 1.0 && !changed) { g.strokeStyle = COL.red; g.lineWidth = 6; g.beginPath(); g.moveTo(nx - 60, ny); g.lineTo(nx - 60 + 120 * eout(prog(t, 1.0, 1.25)), ny); g.stroke(); }
  g.restore();
  if (t > 1.6) pop(T, 66.6, '改名', nx, ny - 70, 34, { ttl: 1.2, col: '#e8c070', font: SANS, weight: 600 });
}

// ================= 第 15–18 句：回到桥上，老头折回来，约五天后（70–90） =================
function sBridge2(T) {
  const t = T - 70;
  camStd(t, [[0, 1.3, 1000, 380], [5, 1.24, 900, 360], [7.4, 1.18, 760, 350], [9.6, 1.24, 900, 360], [15, 1.28, 980, 370], [20, 1.24, 980, 350]]);
  bridge(T, 'night');
  // 张良：先跪着，攥拳忍住 → 呼气；老头折回来时站起；最后跪下应「诺」
  const zl = P({ who: 'zl', ...ZL, x: 1110, face: { eye: 'wide', mouth: 'o', look: [-1, 0] } });
  const kneel = (o, k) => { o.sy = lerp(1, .74, k); o.lean = .14 * k; };
  if (t < 8) { kneel(zl, 1); zl.face = t < 1.4 ? { eye: 'line', mouth: 'flat', look: [-1, 0] } : t < 2.8 ? { eye: 'tight', mouth: 'grit' } : { eye: 'close', mouth: 'smile' }; if (t > 1.4 && t < 2.8) { zl.flush = .5; zl.armR = .5; zl.fistR = true; zl.x += shake(T, 2, 20); } }
  if (t >= 7.8 && t < 18) { const k = 1 - eout(prog(t, 8.0, 8.25)); kneel(zl, k); zl.face = t < 10.6 ? { eye: 'wide', mouth: 'o', look: [-1, 0] } : t < 11.6 ? { eye: 'wide', mouth: 'O', look: [-1, 0] } : { eye: 'dot', mouth: 'small', look: [-1, 0] }; zl.hair = spring(t, 8.0, .6, 5); }
  if (t >= 18) { kneel(zl, eout(prog(t, 18, 18.25))); zl.face = { eye: 'close', mouth: 'smile' }; zl.lean += .1 * Math.sin(Math.PI * prog(t, 18.2, 18.7)); }
  chibi(breathe(zl, T));
  // 老头：往左走出画 → 折回 → 竖起手指「孺子可教」→ 指天约五天后 → 走
  let ox; if (t < 3.5) ox = kf(t, [[0, 600], [3.5, -300, k => k]]); else if (t < 7.6) ox = -400; else ox = kf(t, [[7.6, -300], [8.9, 820, eout]]);
  if (t > 18.8) ox = kf(t, [[18.8, 820], [20.5, -200, k => k]]);
  const om = P({ who: 'old', ...OM, x: ox, cane: -1, armL: .3, caneLen: .55, face: { eye: 'happy', mouth: 'smile' } });
  if (t < 3.5 || (t > 7.6 && t < 8.9) || t > 18.8) walk(om, ox, 85);
  if (t >= 8.9) om.face = { eye: 'smug', mouth: 'smirk', look: [1, 0] };
  if (t >= 10 && t < 15) { om.armR = kf(t, [[10.1, .15], [10.25, 2.5, eback]]); om.face = { eye: 'happy', mouth: 'grin' }; om.lean = .05 * Math.sin(T * 3); om.hair = spring(t, 10.2, .4, 5); }
  if (t >= 15 && t < 18.8) { om.armR = kf(t, [[15.1, .15], [15.25, 2.95, eback]]); om.face = { eye: 'smug', mouth: Math.floor(T * 8) % 2 && t < 16.6 ? 'O' : 'smirk', look: [1, -.5] }; }
  if (t > 18.8) om.face = { eye: 'happy', mouth: 'smile' };
  chibi(breathe(om, T));
  // 符号
  const [hx, hy] = HEAD(zl);
  puffCloud(T, 72.9, zl.x + 40, DECK - 1.0 * D, 110, 1);
  pop(T, 77.8, '!', hx + 20, hy - 20, 110, { ttl: .8 });
  pop(T, 81.4, '?', hx + 40, hy - 20, 110, { ttl: .9 });
  pop(T, 88.2, '诺', hx + 110, hy + 60, 64, { ttl: 1.0 });
  notes(T, 70, 73.4, Math.max(-100, ox) + 60, DECK - 2.4 * D, 46);
  if (t > 10.2 && t < 14.6) { const h = handPos(om, 1); glow(h[0], h[1] - 20, 80, .6 + .3 * Math.sin(T * 6)); }
  // 一里地：从张良到左边画出一条虚线
  if (t > 5.3 && t < 7.8) { const k = eout(prog(t, 5.3, 6.0)); g.save(); g.strokeStyle = 'rgba(240,230,210,.7)'; g.lineWidth = 4; g.setLineDash([16, 14]); g.beginPath(); g.moveTo(1000, DECK - 40); g.lineTo(1000 - 1300 * k, DECK - 40); g.stroke(); g.restore(); }
  bubble(T, 85.6, 89.4, 760, 230, 380, 250, om.x + 60, DECK - 2.2 * D, tt => { g.fillStyle = '#e8a050'; const sy = 60 - 50 * eout(prog(tt, 86.0, 86.8)); g.beginPath(); g.arc(0, sy, 50, Math.PI, 0); g.fill(); glow(0, sy, 120, .6); g.fillStyle = '#7a5a3e'; g.fillRect(-200, 60, 400, 80); g.font = `900 40px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText('五日后　平明', 0, -60); });
}

// ================= 第 19–22 句：天亮赴约迟到、鸡叫又迟到、被骂飞（90–109） =================
function sDawn1(T) {
  const t = T - 90;
  camStd(t, [[0, 1.2, 1000, 360], [2.3, 1.24, 980, 360], [5, 1.28, 900, 380], [10, 1.24, 900, 360]]);
  bridge(T, 'dawn');
  const om = P({ who: 'old', ...OM, x: 760, cane: -1, armL: .3, caneLen: .55, armR: .6, face: { eye: 'close', mouth: 'flat' } });
  om.feetR = [0, -Math.max(0, Math.sin(T * 9)) * .06];   // 脚尖点地等人
  if (t >= 2.3 && t < 5) om.face = { eye: 'smug', mouth: 'frown', look: [1, 0] };
  if (t >= 5 && t < 8.6) { om.face = { eye: 'angry', mouth: 'grit', look: [1, 0] }; om.flush = .5; om.armL = kf(t, [[5.0, .3], [5.15, 2.5, eback]]); om.caneLen = .5; for (const h of [5.2, 5.7]) { const k = prog(t, h, h + .32); if (k > 0 && k < 1) { om.lift = D * .2 * Math.sin(Math.PI * k); om.hair = .5 * Math.sin(Math.PI * k); } } om.armL += shake(T, .06, 9); }
  if (t >= 8.6) { const x = kf(t, [[8.6, 760], [10, -100, k => k]]); om.x = x; walk(om, x, 85); om.face = { eye: 'close', mouth: 'frown' }; }
  chibi(breathe(om, T));
  const x = kf(t, [[.6, 2100], [1.9, 1150, eout]]); const zl = P({ who: 'zl', ...ZL, x, face: { eye: 'happy', mouth: 'smile', look: [-1, 0] } });
  if (t < 1.9) { walk(zl, 2100 - x, 60); zl.lean += .14; }
  if (t >= 2.3) zl.face = { eye: 'wide', mouth: 'O', look: [-1, 0] };
  if (t >= 5) { zl.face = { eye: 'xx', mouth: 'wave' }; zl.lean = kf(t, [[5, 0], [5.2, .35, eout]]); zl.sy = .95; }
  if (t >= 8.8) zl.face = { eye: 'line', mouth: 'wave', look: [-1, 0] };
  chibi(breathe(zl, T));
  speedLines(T, 90.6, 91.9, x + 140, DECK - 200, -1, 200, 6, 4); dust(T, 91.9, x + 60, DECK, 120, 8, 2);
  const [hx, hy] = HEAD(zl); pop(T, 92.35, '!', hx + 20, hy - 20, 110, { ttl: .8 });
  const [ohx, ohy] = HEAD(om); steam(T, 95.1, 98.4, ohx, ohy + 40, 110); vein(T, 95.1, ohx + 95, ohy + 50, 46, 98.4); sweat(T, 95.4, hx - 80, hy + 140, 70, 1.2);
}
function sDawn2(T) {
  const t = T - 100;
  camStd(t, [[0, 1.16, 980, 350], [3, 1.22, 950, 360], [5.2, 1.22, 1000, 360], [6.0, 1.12, 1150, 340], [9, 1.16, 1000, 350]]);
  bridge(T, 'predawn');
  // 公鸡站在左边栏杆柱上打鸣
  const crow = kf(t, [[.3, 0], [.45, 1, eout], [1.4, 1], [1.6, 0]]); rooster(200, 590, 1.3, crow); pop(T, 100.45, '喔——', 330, 380, 66, { ttl: 1.1, rot: -.1, col: '#f0d48a' });
  const om = P({ who: 'old', ...OM, x: 760, cane: -1, armL: .3, caneLen: .55, armR: .6, face: { eye: 'close', mouth: 'flat' } });
  om.feetR = [0, -Math.max(0, Math.sin(T * 9)) * .06];
  if (t >= 2.6 && t < 5.2) om.face = { eye: 'smug', mouth: 'frown', look: [1, 0] };
  // 第 22 句：甩袖把张良扇飞（D1 跳起被弹飞的拆法：蓄力 → 甩 → 张良后翻飞出画）
  const sw = 5.3;
  if (t >= 5.0) { om.face = t < sw + .2 ? { eye: 'angry', mouth: 'grit', look: [1, 0] } : { eye: 'smug', mouth: 'smirk', look: [1, 0] }; om.armR = kf(t, [[5.0, .6], [sw, -.4, eout], [sw + .12, 2.3, eout], [sw + .5, 1.6], [sw + 1.0, .6]]); om.lean = kf(t, [[5.0, 0], [sw, -.12], [sw + .12, .15], [sw + .5, 0]]); }
  chibi(breathe(om, T));
  const x = kf(t, [[1.0, 2150], [2.0, 1150, eout]]); const zl = P({ who: 'zl', ...ZL, x, face: { eye: 'angry', mouth: 'grit', look: [-1, 0] } });
  if (t < 2.0) { walk(zl, 2150 - x, 50); zl.lean += .2; }
  if (t >= 2.6) zl.face = { eye: 'wide', mouth: 'O', look: [-1, 0] };
  if (t >= 4.0) zl.face = { eye: 'line', mouth: 'wave', look: [-1, 0] };
  if (t >= sw + .1) { const u = prog(t, sw + .1, sw + 1.1); zl.x = 1150 + u * 1100; zl.lift = Math.sin(u * Math.PI) * 420 + u * 0; zl.rot = u * 7; zl.face = { eye: 'xx', mouth: 'O' }; zl.hair = .8; zl.armL = 2.4; zl.armR = 2.4; }
  chibi(zl);
  speedLines(T, 101.0, 102.0, x + 140, DECK - 200, -1, 240, 7, 5); dust(T, 102.0, x + 60, DECK, 140, 10, 2);
  ring(T, 100 + sw + .12, 1100, DECK - 250, 200, 60, .6, 4); speedLines(T, 100 + sw + .1, 100 + sw + .6, 1300, DECK - 300, 1, 260, 6, 6);
  if (t < sw) { const [hx, hy] = HEAD(zl); pop(T, 102.65, '!', hx + 20, hy - 20, 110, { ttl: .8 }); }
  pop(T, 100 + sw + .9, '哼', 900, DECK - 2.6 * D, 64, { ttl: .9, rot: -.15 });
  stars(T, 100 + sw + .5, 100 + sw + 1.4, Math.min(1850, 1150 + prog(T, 100 + sw + .1, 100 + sw + 1.1) * 1100), DECK - 500, 70);
}

// ================= 第 23–27 句：半夜去等，「就该这样」，授书，约黄石，消失（109–133） =================
function sMid(T) {
  const t = T - 109;
  camStd(t, [[0, 1.1, 1000, 340], [3, 1.22, 1050, 360], [5, 1.26, 960, 370], [10, 1.3, 960, 380], [15, 1.24, 900, 330], [16.6, 1.3, 800, 340], [20, 1.24, 900, 360], [24, 1.28, 1000, 360]]);
  bridge(T, 'night');
  // 张良：提灯走来 → 坐下等 → 打瞌睡 → 老头来了惊醒站起 → 接书 → 伸手
  const x = kf(t, [[.2, 2150], [1.8, 1150, eout]]); const zl = P({ who: 'zl', ...ZL, x, face: { eye: 'dot', mouth: 'small', look: [-1, 0] } });
  if (t < 1.8) walk(zl, 2150 - x, 70);
  const sit = t > 2.0 && t < 5.9 ? eout(prog(t, 2.0, 2.25)) : 0; zl.sy = lerp(1, .74, sit);
  if (t > 3 && t < 5.9) { zl.face = { eye: 'line', mouth: 'small' }; zl.lean = .12 * Math.max(0, Math.sin((t - 3) * 2.2)); }
  if (t >= 5.9) { zl.face = { eye: 'wide', mouth: 'O', look: [-1, 0] }; zl.hair = spring(t, 5.95, .7, 5); zl.lift = D * .25 * Math.sin(Math.PI * prog(t, 5.9, 6.2)); }
  if (t >= 7.8) zl.face = { eye: 'happy', mouth: 'grin', look: [-1, 0] };
  if (t >= 10.4 && t < 12.5) { zl.armL = zl.armR = kf(t, [[10.4, .15], [11.0, 1.0]]); zl.face = { eye: 'wide', mouth: 'o', look: [-1, .3] }; zl.lean = .1 * eout(prog(t, 11.0, 11.4)); }
  if (t >= 12.5 && t < 15) { zl.armL = zl.armR = 1.0; zl.face = { eye: 'happy', mouth: 'smile', look: [0, 0] }; }
  if (t >= 15 && t < 20) { zl.armL = zl.armR = 1.0; zl.face = { eye: 'dot', mouth: 'o', look: [-1, -.3] }; }
  if (t >= 20) { zl.armR = 1.0; zl.armL = kf(t, [[21.2, 1.0], [21.5, 1.7, eback]]); zl.face = t < 21.2 ? { eye: 'dot', mouth: 'small', look: [-1, 0] } : { eye: 'wide', mouth: 'o', look: [-1, 0] }; if (t > 22.6) zl.face = { eye: 'line', mouth: 'flat', look: [-1, 0] }; }
  chibi(breathe(zl, T));
  // 竹简：老头手里 → 递到张良手里
  // 老头：从左边来 → 高兴竖手 → 掏书 → 指远处 → 转身走进雾里
  const ox = t < 9 ? kf(t, [[5.2, -250], [6.4, 820, eout]]) : t < 20 ? 820 : kf(t, [[20.2, 820], [23.2, -100, k => k]]);
  const om = P({ who: 'old', ...OM, x: ox, cane: -1, armL: .3, caneLen: .55, face: { eye: 'dot', mouth: 'small', look: [1, 0] } });
  if (t < 6.4 || t > 20.2) walk(om, ox, 85);
  if (t >= 6.4 && t < 10) { om.face = { eye: 'happy', mouth: 'grin' }; om.armR = kf(t, [[7.6, .15], [7.75, 2.3, eback]]); for (const h of [6.5, 6.85]) { const k = prog(t, h, h + .3); if (k > 0 && k < 1) om.lift = D * .12 * Math.sin(Math.PI * k); } }
  if (t >= 10 && t < 15) { om.face = { eye: 'smug', mouth: 'smirk', look: [1, 0] }; om.armR = kf(t, [[10.2, .15], [10.4, 1.2, eback], [11.0, 1.35], [11.4, .15]]); }
  if (t >= 15 && t < 20) { om.face = { eye: 'smug', mouth: Math.floor(T * 8) % 2 && t < 17 ? 'O' : 'smirk', look: [1, -.4] }; om.armR = kf(t, [[15.1, .15], [15.3, 2.1, eback]]); }
  if (t >= 20.2) om.face = { eye: 'close', mouth: 'smile' };
  const fade = 1 - prog(t, 21.2, 22.6);
  if (fade > 0) { g.save(); g.globalAlpha = fade; chibi(breathe(om, T)); g.restore(); }
  fogLayer(T, eio(prog(t, 20.6, 21.6)) * (1 - prog(t, 23.4, 24)));
  // 竹简
  if (t > 10.3 && t < 25) { const ho = handPos(om, 1), hz = [(handPos(zl, -1)[0] + handPos(zl, 1)[0]) / 2, handPos(zl, 1)[1]]; const k = eio(prog(t, 10.6, 11.3)); const sx = lerp(ho[0] + 30, hz[0], k), sy = lerp(ho[1] - 30, hz[1] - 40, k); if (t < 12.6) rays(T, sx, sy, 260 * at(t, 10.4, .3), .9); slips(sx, sy, .7, 0); }
  // 符号：Zzz、!、心、「当如是」
  const [hx, hy] = HEAD(zl);
  if (t > 3.2 && t < 5.9) for (let i = 0; i < 3; i++) { const ph = ((T * .6) + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.font = `700 ${40 + i * 10}px ${SERIF}`; g.fillStyle = '#d8dcea'; g.fillText('Z', hx + 60 + ph * 70, hy + 120 - ph * 120); g.restore(); }
  pop(T, 114.9, '!', hx + 20, hy - 20, 110, { ttl: .7 });
  if (t > 7.8 && t < 9.8) for (let i = 0; i < 4; i++) { const ph = ((T * .7) + i / 4) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.fillStyle = '#e2493c'; g.font = `700 44px ${SANS}`; g.fillText('♥', 820 - 60 + i * 40, DECK - 2.3 * D - ph * 120); g.restore(); }
  pop(T, 130.4, '?', hx + 40, hy - 20, 100, { ttl: .9 });
  bubble(T, 121.0, 123.6, 1180, 200, 400, 260, hx, hy, tt => { chibi({ x: -70, y: 100, D: 80, who: 'zl', ...ZL, shadow: false, armR: 1.2, face: { eye: 'dot', mouth: 'smile' } }); chibi({ x: 80, y: 100, D: 80, who: 'king', robe: '#c08a2a', robe2: '#8a5a1a', shadow: false, lean: .25, face: { eye: 'close', mouth: 'small' } }); g.font = `900 34px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText('王者师', 0, -85); });
  bubble(T, 125.0, 128.6, 560, 210, 420, 270, 820, DECK - 2.2 * D, tt => { g.fillStyle = '#7a8a9a'; g.beginPath(); g.moveTo(-200, 80); g.lineTo(-90, -60); g.lineTo(0, 30); g.lineTo(80, -40); g.lineTo(200, 80); g.fill(); g.save(); g.translate(30, 95); g.scale(.6, .6); yellowStone(tt, 0, 0, 1, .7); if (tt > 126.4) { g.fillStyle = COL.ink; g.beginPath(); g.arc(-25, -60, 6, 0, 6.283); g.arc(25, -60, 6, 0, 6.283); g.fill(); g.strokeStyle = COL.ink; g.lineWidth = 5; g.beginPath(); g.arc(0, -45, 16, .3, 2.8); g.stroke(); } g.restore(); });
}
// 第 28 句：天亮一看，太公兵法；竹简飞向镜头（道具飞屏）
function sReveal(T) {
  const t = T - 133;
  camStd(t, [[0, 1.3, 1000, 380], [3, 1.5, 1100, 430], [5, 1.55, 1100, 440]]);
  bridge(T, 'dawn');
  const zl = P({ who: 'zl', ...ZL, x: 1110, armL: 1.0, armR: 1.0, face: t < 1.6 ? { eye: 'dot', mouth: 'small', look: [0, .3] } : { eye: 'wide', mouth: 'O' } });
  if (t > 1.6) { zl.lift = D * .12 * Math.sin(Math.PI * prog(t, 1.6, 1.9)); zl.hair = spring(t, 1.6, .7, 5); }
  chibi(breathe(zl, T));
  const op = eout(prog(t, .6, 1.4)); const h = handPos(zl, 1);
  if (t > 1.3) rays(T, 1110, h[1] - 60, 420, at(t, 1.3, .4));
  if (t < 3.8) slips(1110, h[1] - 60, .8 + .4 * op, op, '太公兵法');
  const [hx, hy] = HEAD(zl); pop(T, 134.6, '!', hx + 20, hy - 20, 110, { ttl: .8 });
}
function flyIn(T) {   // 叠在 135.8–138.6 之间：竹简转着飞向镜头填满画面，再从中间往两边裂开
  const k = prog(T, 135.9, 137.6); if (k <= 0) return; const s = lerp(1.2, 9, ein(k)), rot = (1 - k) * .6;
  if (T < 137.6) { g.save(); g.translate(W / 2, H / 2); g.rotate(rot); slips(0, 0, s, 1, ''); g.restore(); return; }
  const kk = eio(prog(T, 137.9, 138.7)); if (kk >= 1) return;
  for (const side of [-1, 1]) { g.save(); g.beginPath(); side < 0 ? g.rect(0, 0, W / 2, H) : g.rect(W / 2, 0, W / 2, H); g.clip(); g.translate(W / 2 + side * kk * W * .6, H / 2); slips(0, 0, 9, 1, ''); g.restore(); }
}

// ================= 第 29–30 句：刘邦帐中（138–148） =================
function sTent(T) {
  const t = T - 138;
  camStd(t, [[0, 1.1, 960, 470], [5, 1.16, 960, 480], [5.4, 1.2, 860, 470], [10, 1.24, 900, 470]]);
  tentIn(T);
  glow(960, 760, 300, .4 + .05 * Math.sin(T * 7));
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 640, y: 900, face: { eye: 'dot', mouth: 'small', look: [1, .4] } });
  if (t > 2.5 && t < 5) { lb.lean = .1 * Math.max(0, Math.sin((t - 2.5) * 5)); lb.face = { eye: 'close', mouth: 'smile' }; }
  if (t >= 5) { lb.face = { eye: 'happy', mouth: 'grin' }; lb.armR = kf(t, [[5.2, .15], [5.4, 2.3, eback]]); lb.hair = spring(t, 5.3, .4, 5); if (t > 5.4) lb.x += 0; }
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 1280, y: 900, face: { eye: 'smug', mouth: 'smile', look: [-1, .5] }, armL: kf(t, [[1.0, .15], [1.2, 1.15, eback]]) });
  if (t > 1.2 && t < 4.6) zl.armL += .12 * Math.sin(T * 6);
  if (t >= 5) { zl.armL = undefined; zl.face = { eye: 'happy', mouth: 'smile', look: [-1, 0] }; zl.flush = .3; }
  chibi(breathe(lb, T)); chibi(breathe(zl, T, 1));
  sandTable(T, 960, 870, 1.1, prog(t, 2.0, 3.6));
  tag(T, 139.0, 142.4, 470, 440, '刘邦'); tag(T, 145.6, 147.6, 1240, 440, '子房　就是张良');
  if (t > 5.4) { const h = handPos(lb, 1); glow(h[0], h[1] - 10, 90, .5 + .3 * Math.sin(T * 6)); }
}

// ================= 第 31 句：谷城山下黄石（148–153） =================
function sMountain(T) {
  const t = T - 148;
  camStd(t, [[0, 1.0, 960, 540], [2, 1.06, 1000, 540], [5, 1.12, 1100, 560]]);
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#1a1a2a'); sk.addColorStop(1, '#5a4a4a'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  mountains(T, 800); tag(T, 148.6, 150.6, 300, 440, '济北　谷城山');
  g.fillStyle = '#2e2a26'; g.fillRect(-300, 860, W + 600, 500);
  yellowStone(T, 1400, 870, 1.5, at(t, 2.0, .5));
  const x = kf(t, [[0, -100], [1.8, 800, eout]]); const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x, y: 870, face: { eye: 'dot', mouth: 'small', look: [1, 0] } });
  if (t < 1.8) walk(zl, x + 100, 75);
  if (t > 2.2) { zl.face = { eye: 'wide', mouth: 'O', look: [1, 0] }; zl.lift = D * .2 * Math.sin(Math.PI * prog(t, 2.2, 2.5)); zl.hair = spring(t, 2.2, .7, 5); }
  if (t > 3.6) zl.face = { eye: 'happy', mouth: 'smile', look: [1, 0] };
  chibi(breathe(zl, T)); const [hx, hy] = [zl.x, 870 - (zl.lift || 0) - 2.25 * D]; pop(T, 150.25, '!', hx + 20, hy - 20, 110, { ttl: .9 });
}
// ================= 第 32 句：供石、合葬（153–158） =================
function sAltar(T) {
  const t = T - 153;
  camStd(t, [[0, 1.1, 960, 480], [2.2, 1.14, 960, 490], [5, 1.04, 960, 520]]);
  const dim = prog(t, 2.0, 2.6);
  room(T, '#2a1f19', 860, 960, 1 - .5 * dim);
  // 供桌 + 黄石 + 香炉
  const a1 = 1 - dim;
  if (a1 > 0) { g.save(); g.globalAlpha = a1; g.fillStyle = '#5a2a1e'; g.fillRect(1080, 700, 420, 30); g.fillRect(1100, 730, 30, 130); g.fillRect(1450, 730, 30, 130); yellowStone(T, 1240, 700, .7, .5); incense(T, 1400, 700, .9);
    const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 760, y: 860, face: { eye: 'close', mouth: 'small' } }); zl.lean = .3 * Math.max(0, Math.sin((t - .2) * 2.4)); chibi(breathe(zl, T)); g.restore(); }
  // 坟：土堆从下往上隆起，顶上一块小黄石
  if (dim > 0) { const k = eout(prog(t, 2.4, 3.4)); g.save(); g.globalAlpha = dim; const sk = g.createLinearGradient(0, 0, 0, 860); sk.addColorStop(0, '#141826'); sk.addColorStop(1, '#2a2430'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1160); g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(1500, 200, 40, 0, 6.283); g.fill(); glow(1500, 200, 140, .25);
    g.fillStyle = '#3a3026'; g.fillRect(-300, 860, W + 600, 500);
    g.fillStyle = '#4a3c2e'; g.beginPath(); g.ellipse(960, 880, 420, 260 * k, 0, Math.PI, 0); g.fill(); g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.ellipse(900, 880 - 200 * k, 200, 40 * k, -.1, 0, 6.283); g.fill();
    if (k > .8) yellowStone(T, 960, 880 - 255 * k, .5, prog(t, 3.4, 4));
    g.restore(); }
}
// ================= 第 33 句：司马迁看画像（158–164） =================
function sSima(T) {
  const t = T - 158;
  camStd(t, [[0, 1.1, 960, 470], [2.2, 1.14, 1000, 480], [3.4, 1.2, 1100, 470], [6, 1.24, 1060, 470]]);
  room(T, '#2a1f19', 880, 800);
  g.fillStyle = '#4a3020'; g.fillRect(350, 760, 500, 30); g.fillRect(380, 790, 26, 90); g.fillRect(800, 790, 26, 90);
  glow(780, 720, 70, .9); g.fillStyle = '#efe6d4'; g.fillRect(774, 730, 12, 30);
  const sm = P({ who: 'smq', robe: '#7a7466', robe2: '#5a554a', beard: 'goatee', x: 560, y: 880, face: { eye: 'close', mouth: 'small' }, armR: .9 + .1 * Math.sin(T * 7) });
  if (t > 3.3) { sm.armR = undefined; sm.face = t < 4.0 ? { eye: 'dot', mouth: 'small', look: [1, 0] } : { eye: 'wide', mouth: 'O', look: [1, 0] }; if (t > 4.0) { sm.lift = D * .22 * Math.sin(Math.PI * prog(t, 4.0, 4.3)); sm.hair = spring(t, 4.0, .6, 5); } }
  chibi(breathe(sm, T)); slips(700, 740, .45, .6);
  bubble(T, 158.4, 161.5, 960, 330, 380, 300, 640, 880 - 2.3 * D, tt => { chibi({ x: 0, y: 120, D: 110, who: 'zl', ...ZL, sx: 1.5, beard: 'black', face: { eye: 'angry', mouth: 'grit' }, armL: 2.6, armR: 2.6, fistL: 1, fistR: 1, shadow: false }); g.font = `900 34px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText('魁梧奇伟', 0, -110); });
  if (t > 2.2) { const k = eback(prog(t, 2.2, 2.5)); g.save(); g.translate(1350, 560); g.scale(k, k); portrait(T, 0, 0, 1.3, prog(t, 3.3, 3.7), true); g.restore(); }
  const [hx, hy] = [sm.x, 880 - (sm.lift || 0) - 2.25 * D]; pop(T, 162.0, '!', hx + 20, hy - 20, 110, { ttl: .9 }); sweat(T, 162.2, hx + 100, hy + 120, 70, 1.2);
  if (t > 3.8) for (let i = 0; i < 3; i++) { const ph = ((T * .7) + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.fillStyle = '#ec8a84'; g.font = `700 40px ${SANS}`; g.fillText('♥', 1480 + i * 30, 300 - ph * 100); g.restore(); }
}
// ================= 第 34 句：结尾出题（164–172） =================
function sEnd(T) {
  const t = T - 164;
  camStd(t, [[0, 1.3, 980, 380], [3, 1.36, 1000, 390], [8, 1.4, 1000, 390]]);
  const freeze = t > 2.6 ? 2.6 + 164 : T;   // 2.6 秒后画面定格
  bridge(freeze, 'night');
  const om = P({ who: 'old', ...OM, x: OMX, cane: -1, armL: .3, caneLen: .55, face: { eye: 'close', mouth: 'smile' } });
  const zl = P({ who: 'zl', ...ZL, x: ZLX, face: { eye: 'angry', mouth: 'grit', look: [-1, 0] }, flush: .8, fistR: true, armR: kf(Math.min(t, 2.6), [[.8, .15], [1.0, 2.8, eback]]), lean: kf(Math.min(t, 2.6), [[.6, 0], [.8, -.12], [1.0, .04]]) });
  chibi(breathe(om, freeze)); chibi(breathe(zl, freeze));
  const [hx, hy] = HEAD(zl); vein(freeze, 164.9, hx + 95, hy + 50, 52);
  if (t > 2.6) { const k = at(t, 2.6, .3); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${.85 * k})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g.fillStyle = `rgba(0,0,0,${.25 * k})`; g.fillRect(0, 0, W, H); g.restore(); }
}
function endCard(T) {   // 屏幕坐标：大问号 + 渐黑
  const k = eback(prog(T, 166.8, 167.2)); if (k > 0) { g.save(); g.translate(1790, 560); g.scale(k, k); g.font = `900 260px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = COL.red; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 30; g.fillText('？', 0, 0); g.restore(); }
  const f = prog(T, 170.3, 172); if (f > 0) { g.fillStyle = `rgba(0,0,0,${f})`; g.fillRect(0, 0, W, H); }
}

// ================= 时间轴 =================
const SCENES = [[0, s1], [25, sPalace], [45, sStrong], [50, sDesert], [60, sWanted], [65, sRoad], [70, sBridge2], [90, sDawn1], [100, sDawn2], [109, sMid], [133, sReveal], [138, sTent],
  [143, sYao2], [155, sGuanzhong], [160, sHongmen2], [166, sPlank2], [172, sMeal2], [195, sXingyang], [201, sStep2], [214, sReward2],
  [148 + SH, T => sMountain(T - SH)], [153 + SH, T => sAltar(T - SH)], [158 + SH, T => sSima(T - SH)], [164 + SH, T => sEnd(T - SH)]];

// ---------- 字幕：【】浅蓝，〔〕红；| 后面的字到第三个时刻才出 ----------
const PAGES0 = [
  [0.15, 4.75, [['张良在一座【桥】上', .25], ['被一个老头　〔扔了一只鞋〕', 1.0]]],
  [5.0, 9.75, [['老头说　【孺子　下取履】', 5.08], ['小子　下去把鞋捡上来', 6.4]]],
  [10.0, 14.75, [['张良想〔揍他〕', 10.05], ['看他太老　|〔忍了〕', 11.6, 12.7]]],
  [15.0, 19.75, [['刚捡上来', 15.1], ['老头把脚一伸', 16.5], ['【履我】　给我穿上', 17.6]]],
  [20.0, 24.6, [['张良跪下给他穿好', 20.1], ['老头〔笑着走了〕', 21.6]]],
  [25.0, 29.6, [['这个忍下一口气的年轻人', 25.1], ['其实是韩国的【贵族】', 26.5]]],
  [30.0, 34.75, [['祖父和父亲　前后辅佐了', 30.1], ['〔五代〕韩王', 31.6]]],
  [35.0, 39.6, [['秦灭了【韩】', 35.9], ['他家的富贵　〔也到头了〕', 37.0]]],
  [40.0, 44.75, [['弟弟死了都不下葬', 40.1], ['家财全拿去　〔找刺客〕', 41.8]]],
  [45.0, 49.75, [['找到一个【大力士】', 45.1], ['铁锤〔一百二十斤〕', 46.2]]],
  [50.0, 54.75, [['【秦始皇】出巡', 50.3], ['他们埋伏在【博浪沙】', 51.8]]],
  [55.0, 59.75, [['一锤砸下去', 55.1], ['砸中的是〔副车〕', 56.4]]],
  [60.0, 64.75, [['秦始皇〔大怒〕', 60.1], ['全国搜了【十天】', 61.2]]],
  [65.0, 69.6, [['张良改了名字', 65.1], ['躲到【下邳】', 67.2]]],
  [70.0, 74.6, [['所以那天在桥上', 70.1], ['他才〔忍得住〕', 71.5]]],
  [75.0, 79.75, [['老头走出【一里地】', 75.1], ['|又折了回来', 0, 77.6]]],
  [80.0, 84.6, [['【孺子可教矣】', 80.1], ['这小子　〔还能教〕', 81.4]]],
  [85.0, 89.6, [['【五天后】天一亮', 85.1], ['来这儿见我', 86.6]]],
  [90.0, 94.75, [['第五天天亮　他到了', 90.1], ['老头〔已经在了〕', 92.3]]],
  [95.0, 99.6, [['老头发火', 95.1], ['跟老人约　还〔迟到〕', 96.2]]],
  [100.0, 104.75, [['又过五天　【鸡一叫】他就去', 100.1], ['老头〔又先到了〕', 102.6]]],
  [105.0, 108.6, [['又被〔骂了回来〕', 105.1]]],
  [109.0, 113.75, [['第三回　【不到半夜】', 109.1], ['他就去桥上等着', 110.6]]],
  [114.0, 118.75, [['过了一会儿老头来了', 114.1], ['高兴地说　|〔就该这样〕', 115.8, 116.6]]],
  [119.0, 123.75, [['老头拿出一卷书', 119.1], ['读了它　能做〔帝王的老师〕', 120.8]]],
  [124.0, 128.75, [['十三年后　【济北谷城山】下', 124.1], ['那块【黄石头】　〔就是我〕', 125.8]]],
  [129.0, 132.6, [['说完就走', 129.1], ['〔再也没出现〕', 130.6]]],
  [133.0, 137.4, [['天亮一看', 133.1], ['是〔太公兵法〕', 134.3]]],
  [148.0, 152.75, [['十三年后路过济北', 148.1], ['真在谷城山下看见一块【黄石】', 149.6]]],
  [153.0, 157.75, [['他把石头带回去供着', 153.1], ['死后和石头〔葬在一起〕', 155.2]]],
  [158.0, 163.75, [['司马迁以为他【魁梧奇伟】', 158.1], ['看了画像　|长得像个〔漂亮姑娘〕', 160.2, 161.4]]],
  [164.0, 170.2, [['那天在桥上', 164.1], ['要是他〔没忍住〕呢', 165.4]]],
];
const PAGES_MID = [
  [138.6, 142.6, [['后来他跟了【刘邦】', 138.7], ['专门出主意', 140.0]]],
  [143.0, 149.2, [['打峣关　守将是屠户的儿子', 143.1], ['〔见钱眼开〕', 144.4], ['他就在山上插满旗子吓唬　再送去金子', 145.4]]],
  [149.5, 154.6, [['守将答应投降　张良却说', 149.6], ['当兵的未必肯', 151.0], ['〔趁他松懈　打〕', 152.2]]],
  [155.0, 159.6, [['刘邦先进了关中', 155.1], ['【项羽】要打他', 156.2], ['刘邦只好去鸿门赔罪', 157.4]]],
  [160.0, 165.6, [['席上项庄舞剑　要杀刘邦', 160.1], ['张良叫来【樊哙】', 161.6], ['刘邦借口上厕所　〔溜了〕', 163.0]]],
  [166.0, 171.6, [['刘邦被封到偏远的汉中', 166.1], ['张良劝他把栈道　〔一把火烧了〕', 167.6], ['让项羽以为他不回来了', 169.6]]],
  [172.0, 177.6, [['有人劝刘邦', 172.1], ['把六国的后人都立成王', 173.0], ['刘邦正吃着饭　连说好', 174.6]]],
  [178.0, 183.2, [['张良拿起他的筷子　〔当算筹〕', 178.1], ['一条条摆给他看', 179.6], ['【八条都不行】', 180.8]]],
  [183.5, 189.6, [['最要紧的一条', 183.6], ['跟你拼命的人　图的是将来分块封地', 184.6], ['六国一立　〔谁还替你打〕', 186.6]]],
  [190.0, 194.6, [['刘邦把饭〔吐了出来〕', 190.1], ['骂那人差点坏了大事', 191.6]]],
  [195.0, 200.6, [['刘邦被项羽围在【荥阳】', 195.1], ['盼着韩信来救', 196.4], ['韩信却派人来　要当〔假齐王〕', 197.8]]],
  [201.0, 207.6, [['刘邦拍桌子要骂', 201.1], ['张良和陈平　〔踩了他一脚〕', 202.4], ['悄悄说　现在拦不住他　不如顺着他', 204.4]]],
  [208.0, 213.6, [['刘邦马上改口', 208.1], ['要当就当【真王】', 209.2], ['韩信〔这才发兵〕', 211.0]]],
  [214.0, 218.6, [['封赏时刘邦说　决胜千里之外', 214.1], ['是〔子房的功劳〕', 215.6]]],
  [219.0, 225.6, [['让他挑齐地三万户', 219.1], ['他只要了个小小的【留县】', 220.4], ['说当年　就是在留县遇见您', 222.2]]],
];
const shiftPage = ([a, b, lines]) => [a + SH, b + SH, lines.map(([s, t0, t1]) => t1 == null ? [s, t0 + SH] : [s, t0 + SH, t1 + SH])];
const PAGES = [...PAGES0.filter(p => p[0] < 138), ...PAGES_MID, ...PAGES0.filter(p => p[0] >= 148).map(shiftPage)];
function overlay(t) {
  pages(t, PAGES);
  tag(t, .7, 2.2, 1500, 440, '下邳　圯上');
  scrollV(t, 5.35, 9.5, 1730, 250, 124, 430, '孺子　〔下取履〕', '史记·留侯世家');
  scrollV(t, 17.7, 19.6, 1730, 250, 124, 300, '〔履我〕', '史记·留侯世家');
  countX(t, [31.8, 32.3, 32.8, 33.3, 33.8], '五代韩王', W - 90, 120, 34.8);
  scrollV(t, 80.3, 84.5, 1730, 250, 124, 470, '孺子〔可教〕矣', '史记·留侯世家');
  countX(t, [92.5, 102.8, 109.3], '赴约', W - 90, 120, 113.6);
  scrollV(t, 95.4, 99.5, 1730, 250, 124, 560, '与老人期　〔后〕　何也', '史记·留侯世家');
  scrollV(t, 116.5, 118.7, 1730, 250, 124, 440, '〔当如是〕', '史记·留侯世家');
  countX(t, [174.8, 175.2, 175.6, 176.0, 176.4, 176.8, 177.15, 177.5].map(x => newT(MAP.meal, x)), '不可', W - 90, 120, 183.4);
  scrollV(t, 160.4, 165.4, 1740, 240, 116, 420, '项庄舞剑　〔意在沛公〕', '史记·项羽本纪');
  scrollV(t, 190.3, 194.5, 1740, 240, 116, 520, '竖儒　〔几败而公事〕', '史记·留侯世家');
  scrollV(t, 208.3, 213.4, 1740, 240, 116, 560, '何以假为　〔即为真王〕', '史记·淮阴侯列传');
  scrollV(t, 214.3, 218.5, 1740, 220, 110, 690, '运筹策帷帐中　〔决胜千里外〕', '史记·留侯世家');
  tag(t, 162.0 + SH, 163.7 + SH, 1180, 980, '史记原文　状貌如妇人好女');
  flyIn(t);
  if (t > 166.6 + SH) endCard(t - SH);
  footnote('人物和场面都是示意');
}

// ---------- 拟音（render.mjs 读出来交给 audio/mix.py） ----------
const steps = (a, b, dt, name = 'step', v = .45) => { const r = []; for (let x = a; x < b; x += dt) r.push([x, name, v]); return r; };
const CUES0 = [
  ...[.15, .45, .75, 1.05, 1.35].map(x => [x, 'step', .5]), ...[.3, .9, 1.5].map(x => [x, 'tock', .45]),
  [1.98, 'whoosh', .8], [2.12, 'pop', .7], [2.18, 'fall', .55], [SHOE1, 'thud', .9],
  [4.35, 'blip', .35], [5.12, 'hop', .4], [5.5, 'hop', .4], [5.88, 'hop', .4], [5.35, 'paper', .5], [6.6, 'pop', .55],
  [8.0, 'blip', .5], [10.12, 'anger', .7], [10.45, 'whoosh', .7], [10.7, 'rumble', .5], [11.72, 'cough', .55], [12.07, 'cough', .6],
  [13.0, 'deflate', .7], ...[13.75, 14.1, 14.45, 14.8].map(x => [x, 'step', .45]),
  // 15–25
  ...steps(15.0, 16.0, .2, 'step', .5), [16.85, 'hop', .4], [16.9, 'pop', .55], [17.7, 'paper', .45], [18.6, 'anger', .5], ...steps(20.0, 20.55, .18), [20.6, 'thud', .4], [21.38, 'tock', .6], [21.4, 'pop', .4], [21.65, 'hop', .35], [21.95, 'hop', .35], [22.25, 'hop', .35], [23.2, 'pop', .5], [24.6, 'whoosh', .5],
  // 25–45
  [27.4, 'pop', .4], [30.2, 'step', .4], ...[31.8, 32.3, 32.8, 33.3, 33.8].map(x => [x, 'pop', .55]), [35.0, 'whoosh', .9], [36.0, 'fall', .5], [36.5, 'thud', 1.0], [36.8, 'step', .5], [37.1, 'step', .5], [37.4, 'step', .5], [37.6, 'deflate', .5],
  [41.3, 'whoosh', .4], [42.0, 'tock', .5], ...steps(42.35, 44.6, .18, 'tock', .35),
  // 45–60
  [45.6, 'whoosh', .6], [46.9, 'thud', 1.0], [46.92, 'rumble', .6], [47.6, 'pop', .5], ...steps(51.0, 56.3, .3, 'step', .3), [52.4, 'blip', .4], [54.9, 'whoosh', .7], [55.4, 'fall', .5], [56.3, 'thud', 1.0], [56.32, 'rumble', .6], [57.0, 'pop', .4], [58.0, 'deflate', .4],
  // 60–70
  ...[60.4, 60.8, 61.1, 61.4, 61.65, 61.85, 62.05, 62.2, 62.35, 62.5, 62.62, 62.74].map(x => [x, 'paper', .55]), ...steps(62.4, 65, .2, 'step', .5), [63.4, 'pop', .5], ...steps(65, 69.6, .28, 'step', .3), [66.0, 'whoosh', .4], [67.3, 'hop', .4],
  // 70–90
  [71.4, 'rumble', .3], [72.9, 'deflate', .5], [77.8, 'pop', .55], ...steps(77.6, 78.9, .25), [78.0, 'hop', .4], [80.3, 'paper', .45], [80.2, 'pop', .45], [81.4, 'pop', .5], [85.6, 'pop', .4], [88.2, 'blip', .5], ...steps(88.8, 90, .3),
  // 90–109
  ...steps(90.6, 91.9, .14, 'step', .5), [92.35, 'pop', .6], [95.1, 'anger', .7], [95.2, 'hop', .4], [95.7, 'hop', .4], [95.4, 'paper', .4], ...steps(98.6, 100, .3),
  [100.4, 'fall', .3], ...steps(101.0, 102.0, .11, 'step', .55), [102.65, 'pop', .6], [105.1, 'whoosh', 1.0], [105.45, 'thud', .7], [105.6, 'fall', .6], [106.2, 'blip', .5],
  // 109–133
  ...steps(109.2, 110.8, .3), [111.0, 'thud', .3], ...steps(114.2, 115.4, .3), [114.9, 'pop', .6], [116.6, 'paper', .45], [116.7, 'hop', .4], [119.4, 'pop', .5], [119.5, 'rumble', .25], [121.0, 'pop', .4], [125.0, 'pop', .4], [126.4, 'blip', .4], ...steps(129.2, 131.0, .3), [129.6, 'whoosh', .4], [130.4, 'pop', .45],
  // 133–172
  [133.6, 'paper', .6], [134.6, 'pop', .6], [135.9, 'whoosh', .8], [137.6, 'thud', .5], [137.9, 'whoosh', .7], [140.5, 'pop', .4], [140.9, 'pop', .35], [141.3, 'pop', .35], ...steps(148, 149.8, .3), [150.25, 'pop', .6],
  [153.5, 'blip', .3], [155.4, 'rumble', .4], [158.4, 'pop', .4], [160.2, 'pop', .45], [161.4, 'whoosh', .5], [162.0, 'pop', .6], [164.8, 'anger', .6], [165.0, 'whoosh', .6], [166.6, 'thud', .6], [166.8, 'pop', .6],
];
const CUES_MID = [
  ...[.6, .76, .92, 1.08, 1.24, 1.4, 1.56, 1.72, 1.88, 2.04].map(x => [143 + x, 'pop', .35]), ...[0, .18, .36, .54, .72].map(x => [145.4 + x, 'tock', .4]), [148.0, 'paper', .5], [148.6, 'whoosh', .5], [149.0, 'blip', .4], [150.0, 'anger', .5], ...steps(150.2, 151.8, .12, 'step', .45), [150.4, 'rumble', .5], [151.2, 'thud', .9], [151.25, 'pop', .6],
  [153.3, 'whoosh', .35], [153.7, 'whoosh', .35], [154.1, 'whoosh', .35], [154.75, 'thud', 1.0], [155.0, 'pop', .6], ...steps(155.6, 157.6, .2, 'step', .4), [155.8, 'blip', .4],
  ...steps(158, 160.2, .3), [160.2, 'whoosh', .6], [160.6, 'rumble', .6], [161.0, 'rumble', .5], [161.8, 'thud', .4], [162.4, 'thud', .4], [164.7, 'hop', .4], [165.0, 'hop', .4], [165.4, 'hop', .4],
  [168.2, 'blip', .3], [169.9, 'pop', .4], ...steps(172.9, 173.8, .2), ...[174.8, 175.2, 175.6, 176.0, 176.4, 176.8, 177.15, 177.5].map(x => [x, 'tock', .55]), [178.25, 'whoosh', .4], [178.4, 'deflate', .7], [179.6, 'anger', .7], [179.7, 'hop', .4], [180.1, 'hop', .4], [180.5, 'hop', .4], ...steps(180.6, 182.6, .2, 'step', .4),
  [183.4, 'paper', .5], [184.4, 'anger', .5], [184.85, 'thud', 1.0], [185.9, 'thud', .7], [185.92, 'pop', .6], [186.7, 'blip', .4], [188.7, 'pop', .6], [188.75, 'hop', .4],
  [193.6, 'paper', .45], [198.0, 'pop', .5], [199.8, 'tock', .6], [200.2, 'pop', .5],
];
const segOf = x => x < 153 ? MAP.yao : x < 158 ? MAP.hm : x < 168 ? MAP.pl : x < 183 ? MAP.meal : x < 193 ? MAP.step : MAP.rew;
const CUES_MID2 = CUES_MID.map(([a, n, v]) => { const x = newT(segOf(a), a); return x == null ? null : [x, n, v]; }).filter(Boolean);
const CUES_NEW = [
  ...[.9, 1.0, 1.1, 1.2, 1.3].map(x => [155 + x, 'pop', .3]), [156.2, 'anger', .7], [156.2, 'hop', .4], [156.55, 'hop', .4], [156.9, 'hop', .4], [157.4, 'deflate', .4],
  [162.7, 'blip', .4], [179.0, 'pop', .4], [183.6, 'pop', .45], ...[0, .08, .16, .24, .32, .4].map(x => [186.6 + x, 'pop', .35]), [187.0, 'whoosh', .4],
  ...[.2, .3, .4, .5, .6, .7, .8, .9].map(x => [195 + x, 'pop', .3]), [196.3, 'pop', .4], [197.8, 'pop', .6], [198.4, 'paper', .5],
  [211.2, 'pop', .6], ...steps(211.3, 212.6, .15, 'step', .4), [222.2, 'pop', .45],
];
const CUES = [...CUES0.filter(c => c[0] < 143), ...CUES_MID2, ...CUES_NEW, ...CUES0.filter(c => c[0] >= 148).map(([a, n, v]) => [a + SH, n, v])];
