// 张良拾履封面：三个方向，画法全部来自片子（engine / props / scenes），字的版式照片子（粗宋 + 浅蓝 / 红下划线）
// A 扔鞋：老头把鞋踢下桥，张良举拳又忍住（片子开头，全片的钩子）
// B 吐饭：借箸八根筷子，刘邦一口饭喷出来（最好笑的一段）
// C 踩脚：桌子底下张良一脚，刘邦改口
// 横版 A16 / B16 / C16：同构图，字放左上（和片子一样）
const T0 = 12;
function ctext(str, x, y, size, align = 'left') {
  const parts = parse(str); g.save(); g.font = `900 ${size}px ${SERIF}`; g.textBaseline = 'middle';
  const total = parts.reduce((w, [s]) => w + g.measureText(s).width, 0); let cx = align === 'center' ? x - total / 2 : x;
  for (const [s, key] of parts) {
    const w = g.measureText(s).width; const col = key === 1 ? COL.blue : key === 2 ? COL.red : COL.text;
    g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = size * .25; g.shadowOffsetY = 3; g.fillStyle = col; g.fillText(s, cx, y);
    if (key) { g.shadowBlur = 0; g.fillStyle = col; g.fillRect(cx, y + size * .6, w, Math.max(5, size * .06)); }
    cx += w;
  }
  g.restore();
}
function shadeTop(y1, a = .7) { const gr = g.createLinearGradient(0, 0, 0, y1); gr.addColorStop(0, `rgba(6,5,6,${a})`); gr.addColorStop(1, 'rgba(6,5,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, y1); }
function shadeLeft(x1, a = .65) { const gr = g.createLinearGradient(0, 0, x1, 0); gr.addColorStop(0, `rgba(6,5,6,${a})`); gr.addColorStop(1, 'rgba(6,5,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, x1, H * .55); }
function finish() { grain(.08); const v = g.createRadialGradient(W / 2, H * .55, Math.min(W, H) * .4, W / 2, H * .55, Math.max(W, H) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }

// ---------- 三个画面（世界坐标和片子一样，靠镜头裁） ----------
function sceneShoe(t, cx, cy, z) {
  g.save(); camera(cx, cy, z); bridge(t, 'night');
  const om = P({ who: 'old', ...OM, x: 790, cane: -1, armL: .3, caneLen: .55, face: { eye: 'happy', mouth: 'grin' }, feetR: [.5, -.42], barefootR: true, lean: .16, hair: .3 });
  const zl = P({ who: 'zl', ...ZL, x: 1190, face: { eye: 'angry', mouth: 'grit', look: [-1, 0] }, flush: .85, armR: 2.8, fistR: true, lean: -.1, hair: .7, sy: 1.04 });
  chibi(om); chibi(zl);
  for (const [dx, dy, a] of [[-90, 60, .18], [-55, 34, .3], [-25, 14, .45]]) shoe(1000 + dx, 520 + dy, 2.2 - dx * .01, 1.1, a);
  shoe(1000, 520, 2.2, 1.15);
  const [hx, hy] = HEAD(zl); vein(t, t - .5, hx + 95, hy + 50, 56);
  pop(t, t - .5, '!', hx - 10, hy - 50, 110, { ttl: 5 });
  g.restore();
}
function sceneMeal(t, cx, cy, z) {
  g.save(); camera(cx, cy, z); room(t, '#2a1f19', 880, 1000); for (const x of [200, 1720]) pillar(x, 60, 880, 56);
  const lq = P({ who: 'guan', robe: '#6a6a72', robe2: '#4a4a52', beard: 'goatee', x: 520, y: 880, face: { eye: 'xx', mouth: 'O', look: [1, 0] }, lean: -.15 });
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 1000, y: 880, sy: .8, face: { eye: 'xx', mouth: 'O' }, lean: .25 });
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 1430, y: 880, face: { eye: 'smug', mouth: 'smirk', look: [-1, 0] }, armL: 1.1 });
  chibi(lq); chibi(lb); chibi(zl); lowTable(1020, 830, 380, false);
  chopsticks(t, [0, 0, 0, 0, 0, 0, 0, 0], 870, 820);
  spray(178.65, 178.4, 1060, 880 - 1.25 * D, -1); spray(178.85, 178.4, 1060, 880 - 1.25 * D, -1);
  pop(t, t - .5, '噗', 820, 880 - 2.05 * D, 110, { ttl: 5, rot: -.15 });
  sweat(t, t - .3, 600, 880 - 2.0 * D, 80, 5);
  g.restore();
}
function sceneStep(t, cx, cy, z) {
  g.save(); camera(cx, cy, z); room(t, '#2a1f19', 880, 1000); for (const x of [200, 1720]) pillar(x, 60, 880, 56);
  g.fillStyle = '#5a2a1e'; g.fillRect(660, 728, 640, 22); g.fillStyle = '#7a3a28'; g.fillRect(660, 728, 640, 5); g.fillStyle = '#3a1a12'; g.fillRect(690, 750, 18, 90); g.fillRect(1252, 750, 18, 90);
  letter(1120, 716, .6, '假王', -.3);
  const cp = P({ who: 'guan', robe: '#4a5a6a', robe2: '#34404c', x: 700, y: 880, face: { eye: 'smug', mouth: 'flat', look: [1, 0] }, feetR: [.85, -.08], stompR: true, lean: .08 });
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 960, y: 880, face: { eye: 'xx', mouth: 'O' }, lift: 18, flush: .4, armL: 2.4, hair: .5 });
  const zl = P({ who: 'zl', ...ZL, beard: 'goatee', x: 1240, y: 880, face: { eye: 'smug', mouth: 'flat', look: [-1, 0] }, feetL: [-1.05, -.08], stompL: true, lean: -.08 });
  chibi(cp); chibi(lb); chibi(zl);
  for (const x of [915, 1000]) { ring(t, t - .2, x, 878, 110, 20, 1, 4); dust(t, t - .15, x, 880, 120, 8, 4); }
  g.restore();
}

window.drawCover = v => {
  const L = (W - OUTW) / 2;   // 裁切后左边界
  const t = T0; curT = t; g = g0; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H);
  const V = OUTW < H;
  if (v === 'A' || v === 'A16') {
    if (V) sceneShoe(t, 990, 370, 1.32); else sceneShoe(t, 1060, 400, 1.3);
    finish();
    if (V) { shadeTop(560); ctext('一个老头把鞋扔下桥', W / 2, 150, 70, 'center'); ctext('张良〔忍了〕', W / 2, 330, 170, 'center'); ctext('后来　刘邦说【我不如他】', W / 2, H - 110, 54, 'center'); }
    else { shadeLeft(L + 1100); ctext('一个老头把鞋扔下桥', L + 80, 150, 72); ctext('张良〔忍了〕', L + 80, 320, 170); }
  }
  if (v === 'B' || v === 'B16') {
    if (V) sceneMeal(t, 1130, 500, 1.3); else sceneMeal(t, 1000, 500, 1.12);
    finish(); countX(1e3, [0, 0, 0, 0, 0, 0, 0, 0], '', L + OUTW - 70, V ? 560 : 120);
    if (V) { shadeTop(560); ctext('张良摆了八根筷子', W / 2, 150, 76, 'center'); ctext('刘邦〔把饭吐了〕', W / 2, 330, 140, 'center'); }
    else { shadeLeft(L + 1100); ctext('张良摆了八根筷子', L + 80, 150, 76); ctext('刘邦〔把饭吐了〕', L + 80, 310, 140); }
  }
  if (v === 'C' || v === 'C16') {
    if (V) sceneStep(t, 970, 600, 1.35); else sceneStep(t, 980, 560, 1.2);
    finish();
    if (V) { shadeTop(560); ctext('桌子底下', W / 2, 150, 76, 'center'); ctext('〔踩了刘邦一脚〕', W / 2, 320, 130, 'center'); }
    else { shadeLeft(L + 1100); ctext('桌子底下', L + 80, 150, 76); ctext('〔踩了刘邦一脚〕', L + 80, 310, 130); }
  }
  m.setTransform(1, 0, 0, 1, 0, 0); m.drawImage(B, 0, 0);
};
