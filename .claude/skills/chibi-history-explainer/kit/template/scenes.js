// 空白模板（15 秒，两页 + 一个换场）：演示这套的常用写法，开新片时整份替换内容。
// 第一页：门口冲门被挡三回（D1 开头那种：×1 ×2 ×3，第三回升级成跳起被弹飞，帽子掉、冒金星）
// 第二页：换场到书房，思考气泡 + 原文卷轴 + 网页小标签
// 要提供给引擎的：DURATION、SCENES、PAGES、overlay(t)、CUES（拟音）

const DURATION = 15.0;
const A = { robe: '#8b8478', robe2: '#6c665c' };   // 主角灰褐
const G = { robe: '#3f8a5a', robe2: '#2c6a42' };   // 门卫绿

// ---------- 道具：朱漆门（门钉阵列 + 金门环 + 门框高光） ----------
function door(t, x, y, w, h) {
  const gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, '#6a1a12'); gr.addColorStop(.5, '#9a2a1e'); gr.addColorStop(1, '#6a1a12');
  g.fillStyle = gr; g.fillRect(x - w / 2, y - h, w, h);
  g.fillStyle = '#d9a64e'; g.fillRect(x - 6, y - h, 12, h); g.fillRect(x - w / 2 - 20, y - h - 20, w + 40, 20);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) for (const s of [-1, 1]) { g.fillStyle = '#e0b04a'; g.beginPath(); g.arc(x + s * (40 + c * 50), y - h + 80 + r * 90, 9, 0, 6.283); g.fill(); }
  g.strokeStyle = '#e0b04a'; g.lineWidth = 9; for (const s of [-1, 1]) { g.beginPath(); g.arc(x + s * 50, y - h * .45, 34, 0, 6.283); g.stroke(); }
  glow(x - w / 2 - 120, y - h + 40, 260, .5); glow(x + w / 2 + 120, y - h + 40, 260, .5);   // 两侧灯笼光
}

// ---------- 场景 1：门口冲门被挡三回 ----------
const HITS = [1.0, 2.0];   // 前两回：冲 → 被挡弹回
const JUMP = 3.0;          // 第三回：跳起 → 被弹飞 → 落地 → 帽子掉 → 金星
function s1(T) {
  const t = T;
  camStd(t, [[0, 1.12, 960, 520], [5, 1.16, 960, 530]]);
  room(t, '#241a15', DECK, 1100);
  door(t, 1250, DECK, 520, 700);
  const hero = P({ who: 'guard', ...A, x: 760, face: { eye: 'wide', mouth: 'o', look: [1, 0] } });
  const gd = P({ who: 'guard', ...G, x: 1180, buckle: 1, face: { eye: 'smug', mouth: 'smirk', look: [-1, 0] }, armL: 1.5, armR: 1.5 });
  // 冲门：蓄力后仰 4 帧 → 冲出 4 帧 → 撞上弹回 → 回稳
  for (const h of HITS) if (t > h && t < h + .9) {
    hero.lean = strike(t, h, .26, .2); hero.x += kf(t, [[h, 0], [h + .13, -30], [h + .26, 260, eout], [h + .34, 260], [h + .5, 0, eout]]);
    hero.face = t < h + .26 ? { eye: 'angry', mouth: 'grit', look: [1, 0] } : { eye: 'xx', mouth: 'o' };
    hero.hair = spring(t, h + .13, .8, 5); gd.lean = t > h + .26 ? -.12 * Math.exp(-(t - h - .26) * 6) : 0;
  }
  // 跳起被弹飞：下蹲 → 拉长起跳 → 后翻飞出 → 压扁落地 → 帽子晚一拍转着掉
  if (t > JUMP) {
    const u = prog(t, JUMP + .2, JUMP + .8);
    hero.sy = kf(t, [[JUMP, 1], [JUMP + .07, .88], [JUMP + .2, 1.3, eout], [JUMP + .3, 1], [JUMP + .8, 1], [JUMP + .86, .82], [JUMP + 1.0, 1]]);
    hero.lift = t < JUMP + .8 ? Math.sin(Math.PI * prog(t, JUMP + .07, JUMP + .8)) * 330 : 0;
    hero.x += t < JUMP + .2 ? kf(t, [[JUMP, 0], [JUMP + .2, 300]]) : lerp(300, -260, eout(u));
    hero.rot = t > JUMP + .2 && t < JUMP + .8 ? -u * 6.283 * .75 : 0;
    hero.face = t < JUMP + .8 ? { eye: 'xx', mouth: 'O' } : { eye: 'line', mouth: 'wave' };
    gd.lift = Math.sin(Math.PI * prog(t, JUMP + .05, JUMP + .4)) * 200; gd.face = t > JUMP + .9 ? { eye: 'happy', mouth: 'grin' } : gd.face;
  }
  chibi(breathe(gd, T, 1)); chibi(breathe(hero, T));
  for (const h of HITS) { ring(t, h + .26, 1110, DECK + 4, 150, 24, .7, 3); dust(t, h + .34, 900, DECK, 120, 8, 3); speedLines(t, h + .13, h + .3, 760, DECK - 200, 1, 160, 5, 2); }
  dust(t, JUMP + .82, 500, DECK, 160, 10, 5); stars(t, JUMP + 1.1, 5.0, 500, DECK - 2.3 * D, 70);
  const [hx, hy] = HEAD(gd); pop(t, 1.3, '闪身步', hx + 160, hy + 40, 34, { ttl: .8, font: SANS, weight: 600 });
}

// ---------- 场景 2：书房，想 + 原文 ----------
function s2(T) {
  const t = T - 7.5;
  camStd(t, [[0, 1.1, 960, 520], [7.5, 1.18, 960, 540]]);
  room(T, '#2a1f19', DECK, 800);
  g.fillStyle = '#4a3020'; g.fillRect(560, 760, 520, 30);
  glow(1000, 720, 70, .9); g.fillStyle = '#efe6d4'; g.fillRect(994, 730, 12, 30);
  const hero = P({ who: 'guard', ...A, x: 760, face: { eye: 'line', mouth: 'small' }, armR: .9 + .1 * Math.sin(T * 7) });
  if (t > 2) hero.face = { eye: 'dot', mouth: 'o', look: [1, -.5] };
  chibi(breathe(hero, T)); slips(900, 740, .45, .6);
  bubble(T, 9.6, 14.6, 1150, 360, 420, 280, 760, DECK - 2.3 * D, tt => { g.font = `900 40px ${SERIF}`; g.fillStyle = '#5a3a20'; g.textAlign = 'center'; g.fillText('再写一封', 0, 10); });
  tag(T, 8.0, 14.6, 400, 520, '书房');
}
const SCENES = [[0, s1], [7.5, s2]];

// ---------- 字幕：【】浅蓝信息词，〔〕红结论词；| 后面的字到第三个时刻才出 ----------
const PAGES = [
  [0.15, 7.2, [['他在宰相门口', .2], ['被看门的〔挡了三回〕', .6]]],
  [7.5, 14.6, [['回到家里', 7.6], ['他想了想　|〔再写一封〕', 8.8, 10.0]]],
];
function overlay(t) {
  pages(t, PAGES);
  countX(t, [HITS[0] + .26, HITS[1] + .26, JUMP + .2], '', W - 90, 120, 7.0);
  scrollV(t, 10.4, 14.4, 1730, 250, 124, 430, '再上〔书〕', '出处·篇名');
  footnote('人物和场面都是示意');
}
// ---------- 拟音（名字见 audio/mix.py 的 S()）：跟动作走，不跟拍 ----------
const CUES = [
  ...HITS.flatMap(h => [[h + .13, 'whoosh', .7], [h + .26, 'thud', .8], [h + .3, 'pop', .4]]),
  [JUMP + .07, 'hop', .6], [JUMP + .2, 'whoosh', .8], [JUMP + .82, 'thud', 1.0], [JUMP + 1.1, 'pop', .5],
  [7.5, 'whoosh', .3], [9.6, 'pop', .45], [10.4, 'paper', .5],
];
