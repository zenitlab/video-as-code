// 封面生成：复用片子的引擎和场景画法，按封面尺寸重新构图
// 用法：node cover/build.mjs [A,B,C] [宽x高]   默认 A,B,C 和 1080x1440（抖音 3:4）；横版用 A16,B16,C16 1920x1080
//   输出 cover/张良_封面_<方向>_<宽x高>.png
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const PW = [process.env.PW_PKG, path.join(root, 'package.json')].filter(Boolean);
const pwPkg = PW.find(p => existsSync(p.replace(/package\.json$/, 'node_modules/playwright-core')));
if (!pwPkg) { console.error('找不到 playwright-core：在工程文件夹里运行 npm install（或用环境变量 PW_PKG 指向一个装了 playwright-core 的 package.json）'); process.exit(1); }
const require = createRequire(pwPkg);
const { chromium } = require('playwright-core');
const variants = (process.argv[2] || 'A,B,C').split(',');
const [w, h] = (process.argv[3] || '1080x1440').split('x').map(Number);
const cw = Math.max(w, 1920);   // 场景背景按片子的 1920 宽铺，竖版也用 1920 宽画，再从中间裁出 w
writeFileSync(path.join(here, '_engine.js'), readFileSync(path.join(root, 'engine.js'), 'utf8').replace('const W = 1920, H = 1080;', `const W = ${cw}, H = ${h}; const OUTW = ${w};`));
writeFileSync(path.join(here, '_gen.html'), `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body>
<canvas id="c" width="${cw}" height="${h}"></canvas><script src="_engine.js"></script><script src="../props.js"></script><script src="../scenes.js"></script><script src="../scenes_mid.js"></script><script src="../scenes_mid2.js"></script><script src="../scenes2.js"></script><script src="cover.js"></script>
<script>window.ready = document.fonts.load('900 100px ' + SERIF, '一个老头把鞋扔下桥他忍了后来成了帝王师张良八根筷子让刘邦把饭吐桌子底下踩一脚立马改口留侯史记').then(() => true);</script></body></html>`);
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: cw, height: h } });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto(pathToFileURL(path.join(here, '_gen.html')).href);
await page.evaluate(() => window.ready);
for (const v of variants) {
  await page.evaluate(v => window.drawCover(v), v);
  const f = path.join(here, `张良_封面_${v}_${w}x${h}.png`);
  await page.screenshot({ path: f, clip: { x: (cw - w) / 2, y: 0, width: w, height: h } });
  console.log('ok', f);
}
await browser.close();
