const DURATION = 1;
function sc(t) {
  g.fillStyle = '#3050a0'; g.fillRect(0, 0, W, H/2); g.fillStyle = '#a03030'; g.fillRect(0, H/2, W, H/2);
  chibi({ x: 600, y: 800, D: 300, who: 'old', robe: '#8c6a48', robe2: '#664a30', face: { eye: 'smug', mouth: 'grin' }, armR: 1.05, cane: -1, armL: .3, caneLen: .55 });
  chibi({ x: 1300, y: 800, D: 300, who: 'zl', robe: '#7fa6b6', robe2: '#58808f', face: { eye: 'wide', mouth: 'o' } });
}
const SCENES = [[0, sc]]; const PAGES = []; function overlay(t) {}
