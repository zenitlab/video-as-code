// 冯谖封面：三个方向，画面直接调片子里的场景函数（定格在某一刻），字的版式照片子（粗宋 + 浅蓝 / 红下划线）
// A 弹剑：第三回站上长案、顶光、全堂捂耳（片子的钩子）
// B 狡兔三窟：地下剖面三个发光的窝（成语自带搜索量）
// C 烧借据：一把火 + 百姓欢呼 + 头顶「义」
// 竖版用 1920 宽画布画、截图时裁中间 OUTW；横版 A16 / B16 / C16 字放左上
function ctext(str, x, y, size, align = 'left') {
  const parts = parse(str); g.save(); g.font = `900 ${size}px ${SERIF}`; g.textBaseline = 'middle';
  const total = parts.reduce((w, [s]) => w + g.measureText(s).width, 0); let cx = align === 'center' ? x - total / 2 : x;
  for (const [s, key] of parts) {
    const w = g.measureText(s).width, col = key === 1 ? COL.blue : key === 2 ? COL.red : COL.text;
    g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = size * .25; g.shadowOffsetY = 3; g.fillStyle = col; g.fillText(s, cx, y);
    if (key) { g.shadowBlur = 0; g.fillRect(cx, y + size * .6, w, Math.max(5, size * .06)); }
    cx += w;
  }
  g.restore();
}
function shadeTop(y1, a = .7) { const gr = g.createLinearGradient(0, 0, 0, y1); gr.addColorStop(0, `rgba(6,5,6,${a})`); gr.addColorStop(1, 'rgba(6,5,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, y1); }
function shadeLeft(x0, x1, a = .65) { const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, `rgba(6,5,6,${a})`); gr.addColorStop(1, 'rgba(6,5,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, x1, H * .55); }
function finish() { grain(.08); const v = g.createRadialGradient(W / 2, H * .55, Math.min(OUTW, H) * .4, W / 2, H * .55, Math.max(OUTW, H) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }
function yiGlyph(t, x, y, size) { rays(t, x, y, size * 1.8, .9); g.save(); g.font = `900 ${size}px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = size * .06; g.strokeStyle = '#5a2a10'; g.strokeText('义', x, y); g.fillStyle = '#ffd86a'; g.shadowColor = 'rgba(255,170,60,.9)'; g.shadowBlur = 40; g.fillText('义', x, y); g.restore(); }
// 场景定格（camera 由场景自己设；竖版高 1440 时整体往下挪一点，给顶部字留位置）
function still(fn, T, dy = 0, z = 1) { curT = T; g.save(); g.translate(W / 2, H / 2 + dy); g.scale(z, z); g.translate(-W / 2, -H / 2); fn(T); g.restore(); }

window.drawCover = v => {
  g = g0; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H);
  const L = (W - OUTW) / 2, V = OUTW < H, dy = V ? (H - 1080) / 2 + 120 : 0;
  g.fillStyle = '#120d0a'; g.fillRect(0, 0, W, H);
  if (v[0] === 'A') {
    still(sSong3, 48.0, dy); finish(); countX(1e3, [0, 0, 0], '弹剑唱歌', L + OUTW - 70, V ? 580 : 120);
    if (V) { shadeTop(560); ctext('说自己什么都不会的门客', W / 2, 150, 64, 'center'); ctext('〔弹剑要了三回〕', W / 2, 320, 130, 'center'); }
    else { shadeLeft(L, L + 1150); ctext('说自己什么都不会的门客', L + 80, 150, 68); ctext('〔弹剑要了三回〕', L + 80, 310, 130); }
  }
  if (v[0] === 'B') {
    if (V) still(T => denView(T, 166.6, 3), 170.6, 40, 1.0); else still(T => denView(T, 166.6, 3), 170.6, -60, 1.12); finish();
    if (V) { shadeTop(520); ctext('〔狡兔三窟〕', W / 2, 200, 170, 'center'); ctext('原来是这么挖的', W / 2, 380, 70, 'center'); }
    else { shadeLeft(L, L + 1100); ctext('〔狡兔三窟〕', L + 80, 170, 160); ctext('原来是这么挖的', L + 80, 330, 70); }
  }
  if (v[0] === 'C') {
    still(sXue, 88.6, dy); finish(); yiGlyph(88.6, V ? W / 2 + 300 : L + 1420, V ? 640 : 190, V ? 170 : 140);
    if (V) { shadeTop(500); ctext('把主人的借据', W / 2, 150, 72, 'center'); ctext('〔一把火烧了〕', W / 2, 320, 130, 'center'); }
    else { shadeLeft(L, L + 1100); ctext('把主人的借据', L + 80, 150, 76); ctext('〔一把火烧了〕', L + 80, 310, 130); }
  }
  m.setTransform(1, 0, 0, 1, 0, 0); m.drawImage(B, 0, 0);
};
