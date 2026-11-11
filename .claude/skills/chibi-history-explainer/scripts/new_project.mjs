#!/usr/bin/env node
// 新建一条 Q 版小人讲解片工程。macOS、Windows、Linux 通用。
// 用法：node new_project.mjs <目标文件夹> [配乐音频] [--example | --example=冯谖]
//   默认复制 15 秒空白模板（门口挡三回 + 书房想）；--example 复制张良拾履全片（250 秒）；--example=冯谖 复制冯谖弹剑全片（195 秒）。
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const kit = path.join(here, '..', 'kit');
const [destArg, ...rest] = process.argv.slice(2);
const exArg = rest.find(a => a.startsWith('--example'));
const example = exArg ? (exArg.split('=')[1] || '张良拾履') : null;
const ex = example && path.join(here, '..', 'examples', example);
const music = rest.find(a => !a.startsWith('--'));
if (ex && !existsSync(ex)) { console.error('没有这个例片：' + example); process.exit(1); }
if (!destArg) { console.error('用法：node new_project.mjs <目标文件夹> [配乐音频] [--example | --example=冯谖]'); process.exit(1); }
const dest = path.resolve(destArg);
mkdirSync(dest, { recursive: true });
if (readdirSync(dest).length) { console.error('目标文件夹不是空的，停止'); process.exit(1); }

const cp = (from, to) => cpSync(from, path.join(dest, to), { recursive: true });
for (const f of ['engine.js', 'props.js', 'render.mjs', 'test.html', 'test_chars.js', 'package.json']) cp(path.join(kit, f), f);
for (const d of ['audio', 'stills', 'out', '对比']) mkdirSync(path.join(dest, d), { recursive: true });
cp(path.join(kit, 'audio', 'mix.py'), 'audio/mix.py'); cp(path.join(kit, 'audio', 'samples'), 'audio/samples');
if (example) {
  for (const f of readdirSync(ex)) if (f.endsWith('.js') || f === 'index.html' || f === '文案.md') cp(path.join(ex, f), f);
  if (existsSync(path.join(ex, 'cover'))) {
    mkdirSync(path.join(dest, 'cover'), { recursive: true });
    for (const f of readdirSync(path.join(ex, 'cover'))) if (/\.(js|mjs)$/.test(f)) cp(path.join(ex, 'cover', f), path.join('cover', f));
  }
  if (example === '冯谖') cp(path.join(kit, 'common.js'), 'common.js');
} else {
  for (const f of ['common.js', 'template/scenes.js', 'template/index.html']) cp(path.join(kit, f), path.basename(f));
}
if (music) cp(path.resolve(music), 'audio/bgm' + path.extname(music));

console.log('已建好：' + dest);
console.log(`下一步：cd "${dest}"`);
console.log('        npm install                                   # 第一次：装渲染用的 playwright-core');
console.log('        node render.mjs stills 1,3.5,9                # 出截图');
console.log('        node render.mjs video --out=成片 --crf=22      # 出无声片 + out/cues.json');
console.log('        uv run -q --with numpy --with scipy python -I audio/mix.py out/cues.json out/mix.wav [audio/bgm.xxx]');
