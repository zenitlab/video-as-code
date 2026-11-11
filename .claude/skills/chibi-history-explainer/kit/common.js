// Q 版小人讲解片 · 场景公用助手（空白模板用；张良拾履例片里这些散在 scenes.js / scenes2.js 里）
// 载入顺序：engine.js → props.js → common.js → scenes.js

const D = 205;          // 小人头直径（近景：人占画面高约一半，D1 实测）
const DECK = 860;       // 默认地面高度（世界坐标；镜头把它放到画面下 10% 左右）
// 小人参数的快捷写法：P({ who, robe, robe2, x, face… }, 覆盖项)
const P = (base, more) => Object.assign({ D, y: DECK }, base, more);
// 待机呼吸：D1 里小人从不完全静止
const breathe = (o, t, ph = 0) => { if (!o.lift) o.sy = (o.sy || 1) * (1 + .015 * Math.sin(t * 3.8 + ph)); return o; };
// 头顶上方一点（放「!」「?」、青筋、汗）
const HEAD = o => [o.x, o.y - (o.lift || 0) - 2.25 * o.D * (o.sy || 1)];
// 镜头关键帧：keys = [[局部秒, 缩放, 中心x, 中心y], …]
function camStd(t, keys) { const z = kf(t, keys.map(k => [k[0], k[1]])), cx = kf(t, keys.map(k => [k[0], k[2]])), cy = kf(t, keys.map(k => [k[0], k[3]])); camera(cx, cy, z); }
// 走路：身体每步一颠、两脚交替抬、左右轻摆、发带跟着晃（dist = 走过的距离）
function walk(o, dist, stride = 80) {
  const ph = dist / stride * Math.PI;
  o.lift = Math.abs(Math.sin(ph)) * o.D * .07; o.lean = (o.lean || 0) + .05 * Math.sin(ph);
  o.feetL = [0, -Math.max(0, Math.sin(ph)) * .12]; o.feetR = [0, -Math.max(0, -Math.sin(ph)) * .12];
  o.hair = (o.hair || 0) + .15 * Math.sin(ph * 2);
}
// 跪下：k 0..1
const kneel = (o, k) => { o.sy = lerp(1, .74, k); o.lean = (o.lean || 0) + .14 * k; };
// 手的位置（不计倾斜；拿东西、在手边发光用）
function handPos(o, side) { const a = side < 0 ? o.armL : o.armR, sy = o.sy || 1; if (a == null) return [o.x + side * .2 * o.D, o.y - (o.lift || 0) - .5 * o.D * sy]; return [o.x + side * (.27 + .44 * Math.sin(a)) * o.D, o.y - (o.lift || 0) + (-.92 + .44 * Math.cos(a)) * o.D * sy]; }
// 一次「蓄力 → 动作 → 过冲 → 回稳」的数值曲线：t0 开始，a 蓄力量（反方向），b 动作量，返回当前值
// 帧数按 D1：蓄力 4 帧、动作 3–4 帧、过冲 2–4 帧、回稳约 8 帧
function strike(t, t0, a, b, ant = .13, act = .11, over = .12, settle = .25) {
  return kf(t, [[t0, 0], [t0 + ant, -a, eout], [t0 + ant + act, b, eout], [t0 + ant + act + over, b * .8], [t0 + ant + act + over + settle, 0]]);
}
// 时间重映射（改稿时把旧动画拉到新字幕上用，见 references/pitfalls.md「改稿加字幕」）
const lin = k => k;
const remap = (keys, x) => kf(x, keys, lin);
