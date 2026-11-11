// 张良拾履 · 计策段补前因后果（2026-11-10 用户确认改稿：15 页，138–226 秒）
// 做法：scenes_mid.js 里原来的场景按新字幕重新分配时间（旧时间轴 → 新时间轴的分段线性映射），
//       再补两个新场景（刘邦先入关中、荥阳被围），在旧场景上叠新内容（陈平、算筹、第八条、留县回忆）。
// 载入顺序：scenes_mid.js → scenes_mid2.js → scenes2.js

const lin = k => k;
// 分段线性映射：keys = [[新的局部秒, 旧的局部秒], …]
const remap = (keys, x) => kf(x, keys, lin);
// 反过来：旧时刻 → 新时刻（拟音、计数器用）；旧时间轴里停住不动的段落取第一个
function unmap(keys, y) { for (let i = 1; i < keys.length; i++) { const [x0, y0] = keys[i - 1], [x1, y1] = keys[i]; if (y >= Math.min(y0, y1) && y <= Math.max(y0, y1) && y1 !== y0) return x0 + (y - y0) * (x1 - x0) / (y1 - y0); } return null; }
// [新起点, 旧起点, 映射]
const MAP = {
  yao:  [143, 143, [[0, 0], [2.4, .6], [6.6, 5.0], [9.2, 7.0], [12, 9.8]]],
  hm:   [160, 153, [[0, 0], [1.7, 1.4], [3.0, 2.6], [6, 5.0]]],
  pl:   [166, 158, [[0, 0], [1.6, 2.2], [3.4, 4.8], [4.0, 6.2], [6, 7.6]]],
  meal: [172, 168, [[0, 0], [5.5, 4.6], [6.4, 5.8], [8.0, 6.8], [10.6, 9.5], [18.0, 9.9], [18.4, 10.25], [18.6, 10.4], [19.6, 11.6], [23, 15]]],
  step: [201, 183, [[0, 1.2], [1.4, 2.6], [1.8, 2.9], [3.4, 3.6], [6.6, 5.3], [13, 11.7]]],
  rew:  [214, 193, [[0, 0], [5, 5], [7.4, 6.8], [12, 11.4]]],
};
const oldT = (m, T) => m[1] + remap(m[2], T - m[0]);
const newT = (m, oldAbs) => { const x = unmap(m[2], oldAbs - m[1]); return x == null ? null : m[0] + x; };

// ---------- 30–31：峣关（守将见钱眼开 → 插旗送金 → 投降 → 当兵的未必肯 → 打） ----------
function sYao2(T) {
  sYao(oldT(MAP.yao, T));
  const t = T - 143;
  // 「当兵的未必肯」：关上两个兵皱眉摇头
  if (t > 6.4 && t < 10) for (const [x, d] of [[1420, 0], [1660, 1]]) { const s = { x, y: 560, D: 110, who: 'qin', robe: '#3a3a40', robe2: '#26262a', face: t > 7.9 ? { eye: 'angry', mouth: 'frown', look: [x < 1540 ? 1 : -1, 0] } : { eye: 'dot', mouth: 'small' } }; if (t > 7.9 && t < 9.2) s.lean = .12 * Math.sin((T + d) * 9); chibi(s); }
  tag(T, 143.6, 146.6, 1380, 300, '守将　屠户的儿子');
}
// ---------- 32：刘邦先入关中，项羽要打（155–160） ----------
function sGuanzhong(T) {
  const t = T - 155;
  camStd(t, [[0, 1.08, 960, 520], [1.2, 1.12, 1100, 520], [2.4, 1.1, 800, 520], [5, 1.14, 760, 520]]);
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#141826'); sk.addColorStop(1, '#3a2c2a'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  mountains(T, 780); g.fillStyle = '#2e2620'; g.fillRect(-300, 880, W + 600, 500);
  // 左：咸阳城门
  g.fillStyle = '#4a3a2e'; g.fillRect(140, 420, 560, 460); g.fillStyle = '#3a2a1e'; g.fillRect(110, 390, 620, 40); g.fillStyle = '#1a1210'; g.beginPath(); g.moveTo(330, 880); g.lineTo(330, 690); g.quadraticCurveTo(420, 600, 510, 690); g.lineTo(510, 880); g.fill(); glow(420, 760, 200, .35);
  g.fillStyle = '#d9a64e'; g.fillRect(340, 450, 160, 60); g.fillStyle = '#3a1a10'; g.font = `900 40px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('咸阳', 420, 482);
  flag(T, 200, 420, 1.2, 1, '#c0392b', '汉'); flag(T, 620, 420, 1.2, 1, '#c0392b', '汉');
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 420, y: 880, face: { eye: 'happy', mouth: 'grin' } });
  if (t < 1.2) { lb.armR = 2.4; lb.lift = D * .1 * Math.abs(Math.sin(T * 7)); }
  if (t >= 1.2 && t < 2.4) lb.face = { eye: 'wide', mouth: 'O', look: [1, 0] };
  if (t >= 2.4) { lb.face = { eye: 'xx', mouth: 'wave' }; lb.lean = .3 * eout(prog(t, 2.4, 2.7)); lb.armL = lb.armR = .9; }
  chibi(breathe(lb, T));
  // 右：项羽和楚军，气得跳
  for (let i = 0; i < 5; i++) flag(T, 1300 + i * 120, 860 - (i % 2) * 40, 1.2, prog(t, .9 + i * .1, 1.2 + i * .1), '#2a2a2a', '楚');
  const xy = P({ who: 'xy', ...XY, beard: 'black', x: 1500, y: 880, face: { eye: 'smug', mouth: 'small', look: [-1, 0] } });
  if (t > 1.1) { xy.face = { eye: 'angry', mouth: 'grit', look: [-1, 0] }; xy.flush = .6; for (const h of [1.2, 1.55, 1.9]) { const k = prog(t, h, h + .3); if (k > 0 && k < 1) xy.lift = D * .2 * Math.sin(Math.PI * k); } xy.armR = 2.6; xy.fistR = true; }
  chibi(breathe(xy, T));
  const [hx, hy] = HEAD(xy); steam(T, 156.2, 159.8, hx, hy + 40, 120); vein(T, 156.2, hx + 95, hy + 50, 50);
  sweat(T, 157.6, 520, 880 - 2.0 * D, 70, 1.2);
  tag(T, 157.4, 159.8, 900, 440, '鸿门　赔罪去');
}
// ---------- 33：鸿门宴（160–166） ----------
function sHongmen2(T) {
  sHongmen(oldT(MAP.hm, T));
}
// ---------- 34：烧栈道（166–172） ----------
function sPlank2(T) { sPlank(oldT(MAP.pl, T)); }
// ---------- 35–38：借箸代筹（172–195） ----------
function sMeal2(T) {
  sMeal(oldT(MAP.meal, T));
  const t = T - 172;
  // 算筹注释
  tag(T, 179.0, 182.8, 800, 1010, '算筹　古人计数的小棍');
  // 第八条：思考气泡里，兵们看着一块发光的封地 → 六面旗冒出来，兵转身各回各国
  bubble(T, 183.6, 189.6, 1320, 500, 560, 320, 1440, 880 - 2.3 * D, tt => {
    const k = prog(tt, 186.6, 187.6);
    g.fillStyle = `rgba(224,176,74,${.9 * (1 - k)})`; g.beginPath(); g.ellipse(0, 40, 90, 26, 0, 0, 6.283); g.fill(); if (k < 1) glow(0, 30, 120, .5 * (1 - k));
    g.font = `900 30px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText(k < .5 ? '封地' : '回去侍奉旧主', 0, -110);
    ['齐', '楚', '燕', '韩', '赵', '魏'].forEach((c, i) => { if (k > 0) flag(tt, -250 + i * 95, -10 + (i % 2) * 20, .55, prog(tt, 186.6 + i * .08, 186.9 + i * .08), '#7a5a3a', c); });
    for (let i = 0; i < 5; i++) { const x0 = -200 + i * 100, dir = i < 2 ? -1 : 1; const x = x0 + dir * 260 * eio(k); chibi({ x, y: 140, D: 52, who: 'qin', ...HAN, shadow: false, face: k > 0 ? { eye: 'happy', mouth: 'smile', look: [dir, 0] } : { eye: 'dot', mouth: 'small', look: [0, -1] } }); }
  });
  if (t > 11.2 && t < 18) { /* 刘邦愣住 */ }
}
// ---------- 39：荥阳被围，盼韩信，韩信要假齐王（195–201） ----------
function sXingyang(T) {
  const t = T - 195;
  camStd(t, [[0, 1.06, 960, 520], [2.8, 1.1, 960, 520], [6, 1.16, 1000, 500]]);
  const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#141826'); sk.addColorStop(1, '#3a2c2a'); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1100);
  mountains(T, 780); g.fillStyle = '#2e2620'; g.fillRect(-300, 880, W + 600, 500);
  // 城墙（中间），刘邦站在墙头
  g.fillStyle = '#4a3a2e'; g.fillRect(560, 600, 800, 280); for (let x = 560; x < 1360; x += 80) g.fillRect(x, 570, 46, 34); g.fillStyle = '#d9a64e'; g.fillRect(860, 640, 200, 56); g.fillStyle = '#3a1a10'; g.font = `900 38px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('荥阳', 960, 670);
  flag(T, 620, 570, 1.1, 1, '#c0392b', '汉');
  // 四周楚军旗一圈圈冒出来
  [[160, 880], [300, 900], [440, 880], [1480, 880], [1620, 900], [1760, 880], [240, 760], [1700, 760]].forEach(([x, y], i) => flag(T, x, y, 1.2, prog(t, .2 + i * .1, .5 + i * .1), '#2a2a2a', '楚'));
  const lb = P({ who: 'lb', ...LB, beard: 'black', x: 960, y: 570, D: 180, face: { eye: 'line', mouth: 'wave' } });
  lb.x += shake(T, 2, 12);
  if (t > 1.4) lb.face = { eye: 'dot', mouth: 'small', look: [1, -.5] };
  if (t > 2.8) { lb.face = { eye: 'wide', mouth: 'O', look: [1, -.5] }; lb.hair = spring(t, 2.8, .5, 5); }
  if (t > 3.6) { lb.face = { eye: 'angry', mouth: 'grit', look: [1, -.5] }; lb.flush = .6; }
  chibi(breathe(lb, T));
  sweat(T, 195.3, 1050, 570 - 2.0 * 180, 60, 1.2);
  // 盼着韩信：气泡里韩信骑马；3.6 秒后气泡里换成「假王」的信
  bubble(T, 196.3, 200.6, 1380, 260, 460, 300, 1040, 570 - 2.2 * 180, tt => {
    if (tt < 198.4) { horse(-40, 120, .7, tt * 7); chibi({ x: -40, y: 40, D: 70, who: 'guan', robe: '#3a5a3a', robe2: '#2a402a', beard: 'goatee', shadow: false, face: { eye: 'smug', mouth: 'smile' } }); g.font = `900 30px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText('韩信', 120, -90); }
    else letter(0, 20, 1.1, '假王', -.1);
  });
  tag(T, 195.4, 200.6, 300, 440, '被项羽围住');
}
// ---------- 40–41：踩脚（张良和陈平一起），假王改真王，韩信发兵（201–214） ----------
function sStep2(T) {
  sStep(oldT(MAP.step, T));
  tag(T, 201.2, 204.0, 640, 520, '陈平');
  // 韩信这才发兵：信使高高兴兴跑出画
  pop(T, 211.2, '发兵！', 330, 880 - 1.7 * D, 70, { ttl: 1.8, col: '#ffd86a' });
}
// ---------- 42–43：封赏，只要留县，说当年在留县遇见您（214–226） ----------
function sReward2(T) {
  sReward(oldT(MAP.rew, T));
  bubble(T, 222.2, 225.6, 900, 540, 420, 280, 1150, 880 - 2.3 * D, tt => {
    g.fillStyle = '#7a5a3e'; g.fillRect(-200, 100, 400, 30);
    g.fillStyle = '#5a4430'; g.fillRect(150, -10, 10, 110); g.fillStyle = '#c9a56a'; g.fillRect(110, -20, 90, 44); g.fillStyle = '#2a1d14'; g.font = `900 30px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('留', 155, 2);
    chibi({ x: -90, y: 100, D: 64, who: 'zl', ...ZL, shadow: false, armR: 1.4, face: { eye: 'happy', mouth: 'smile' } });
    chibi({ x: 30, y: 100, D: 64, who: 'lb', ...LB, beard: 'black', shadow: false, armL: 1.4, face: { eye: 'happy', mouth: 'grin' } });
    g.font = `900 28px ${SERIF}`; g.fillStyle = '#5a3a20'; g.fillText('当年', 0, -100);
  });
}
