// Pixel mascot drawn from a character map, plus the "look at the cursor" behaviour.
//   w = white body, d = dark fill/outline, e = eye (moves), s = purple drop shadow

const MAP = [
  '............dddddddddddd.............',
  '..........dddwwwwwwwwwwddd...........',
  '........dddwwwwwwwwwwwwwwddd.........',
  '.......ddwwwwwwwwwwwwwwwwwwdd........',
  '......ddwwwwwwwwwwwwwwwwwwwwdd.......',
  '......dwwwddddddwwwwddddddwwwds......',
  '.....ddwwddddddddwwddddddddwwdd......',
  '.....dwwwddddddddwwddddddddwwwds.....',
  '.....dwwdddddddddwwdddddddddwwds.....',
  '.....dwwdddddddddwwdddddddddwwds.....',
  '.....dwwddddddddwwwwddddddddwwds.....',
  '....ddwwwdddddddwwwwdddddddwwwdd.....',
  '...ddwwwwddddddwwwwwwddddddwwwwdd....',
  '..ddwwwwwwwwwwwwwddwwwwwwwwwwwwwdd...',
  '.ddwwwwddwwwwwwwddddwwwwwwwddwwwwdd..',
  '.dwwwwwddddddddddddddddddddddwwwwwds.',
  '.dwwwwwddddddddddddddddddddddwwwwwds.',
  '.dwwwwwdddddddeeddddeedddddddwwwwwds.',
  '.dwwwwwddddddeeeddddeeeddddddwwwwwds.',
  '.dwwwwwddddddeeeddddeeeddddddwwwwwds.',
  '.dwwwwwddddddeeeddddeeeddddddwwwwwds.',
  '.ddwwwwddddddeeeddddeeeddddddwwwwdds.',
  '..ddwwwwddddddddddddddddddddwwwwddss.',
  '...ddwwwwwddddddddddddddddwwwwwddss..',
  '....dddwwwwwwddddddddddwwwwwwdddss...',
  '.....sdddwwwwwwwwwwwwwwwwwwdddsss....',
  '.......sddddwwwwwwwwwwwwddddsss......',
  '.........ssddddddddddddddssss........',
  '............ssssssssssssss...........',
];

const W = MAP[0].length;
const H = MAP.length;

/** Run-length encode one character class into <rect>s. */
function rects(match: (c: string) => boolean): string {
  let out = '';
  MAP.forEach((row, y) => {
    let x = 0;
    while (x < W) {
      if (match(row[x])) {
        const start = x;
        while (x < W && match(row[x])) x++;
        out += `<rect x="${start}" y="${y}" width="${x - start}" height="1"/>`;
      } else x++;
    }
  });
  return out;
}

export function mascotSVG(): string {
  return `
<svg class="mascot-svg" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" aria-hidden="true">
  <g fill="#5b3ff0">${rects((c) => c === 's')}</g>
  <g fill="#12151b">${rects((c) => c === 'd' || c === 'e')}</g>
  <g fill="#ffffff">${rects((c) => c === 'w')}</g>
  <g class="mascot-eyes" fill="#ffffff">${rects((c) => c === 'e')}</g>
  <g class="mascot-blink" fill="#ffffff">${rects((c) => c === 'e')}</g>
</svg>`;
}

/**
 * Makes the mascot's eyes and head follow the pointer anywhere on the page.
 * Writes CSS custom properties; style.css does the movement.
 */
export function attachLookAt(head: HTMLElement): () => void {
  let raf = 0;
  let px = 0;
  let py = 0;
  let last = '';

  const update = () => {
    raf = 0;
    const b = head.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (px - (b.left + b.width / 2)) / 420));
    const ny = Math.max(-1, Math.min(1, (py - (b.top + b.height / 2)) / 420));
    const ex = Math.round(nx * 3); // whole pixels keep it crunchy
    const ey = Math.round(ny);
    const tilt = Math.round(nx * 3) * 3;
    const key = `${ex},${ey},${tilt}`;
    if (key === last) return;
    last = key;
    head.style.setProperty('--eye-x', `${ex}px`);
    head.style.setProperty('--eye-y', `${ey}px`);
    head.style.setProperty('--tilt', `${tilt}deg`);
  };

  const onMove = (e: PointerEvent) => {
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    window.removeEventListener('pointermove', onMove);
    if (raf) cancelAnimationFrame(raf);
  };
}
