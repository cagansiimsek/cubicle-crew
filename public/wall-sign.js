// Shared save rules and canvas artwork for the wall sign and its shop preview.
export const WALL_SIGN = { w: 76, h: 35, minRoomWidth: 400, titleMax: 24, subtitleMax: 48 };
export const DEFAULT_WALL_SIGN = {
  enabled: false, title: '', subtitle: '', titleColor: '#386caa', subtitleColor: '#80749e',
};

const hexColor = /^#[0-9a-f]{6}$/i;
const cleanText = (text, limit) => Array.from(text.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, limit).join('');

export function cleanWallSign(value) {
  if (!value || typeof value.enabled !== 'boolean' ||
      typeof value.title !== 'string' || typeof value.subtitle !== 'string' ||
      typeof value.titleColor !== 'string' || !hexColor.test(value.titleColor) ||
      typeof value.subtitleColor !== 'string' || !hexColor.test(value.subtitleColor)) return null;
  const title = cleanText(value.title, WALL_SIGN.titleMax);
  if (value.enabled && !title) return null;
  return {
    enabled: value.enabled, title, subtitle: cleanText(value.subtitle, WALL_SIGN.subtitleMax),
    titleColor: value.titleColor.toLowerCase(), subtitleColor: value.subtitleColor.toLowerCase(),
  };
}

export function drawWallSign(ctx, x, y, sign) {
  const rect = (color, dx, dy, w, h) => {
    ctx.fillStyle = color; ctx.fillRect(x + dx, y + dy, w, h);
  };
  ctx.save();
  // Layered enamel face, a beveled metal edge and four inset fasteners.
  rect('rgba(23, 41, 66, 0.18)', 3, 3, 73, 32);
  rect('#597d9f', 1, 1, 74, 33);
  rect('#597d9f', 0, 2, 76, 30);
  rect('#abc8e3', 1, 1, 74, 31);
  rect('#e6f0fa', 2, 1, 72, 1);
  rect('#7c9dbe', 1, 31, 74, 1);
  rect('#d7e5f2', 2, 3, 72, 28);
  rect('#f7f9fd', 3, 3, 70, 27);
  rect('#ffffff', 4, 3, 68, 1);
  rect('#edf2fa', 3, 17, 70, 13);
  rect('#e4ebf7', 4, 29, 68, 1);
  rect('#739dc5', 1, 8, 1, 16);
  rect('#739dc5', 74, 8, 1, 16);
  for (const [sx, sy] of [[2, 3], [71, 3], [2, 28], [71, 28]]) {
    rect('#698cae', sx, sy, 3, 2);
    rect('#edf5fc', sx, sy, 2, 1);
    rect('#91aec9', sx + 1, sy, 1, 2);
  }
  rect('#cbd9ec', 12, 14, 22, 1);
  rect('#cbd9ec', 42, 14, 22, 1);
  rect('#a4bddd', 36, 13, 3, 3);
  rect('#eaf1fb', 37, 14, 1, 1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = sign.titleColor;
  ctx.fillText(sign.title, x + 38, y + 8, 64);
  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = sign.subtitleColor;
  if (ctx.measureText(sign.subtitle).width <= 64) {
    ctx.fillText(sign.subtitle, x + 38, y + 23, 64);
  } else {
    const words = sign.subtitle.split(' ');
    let split = 1;
    while (split < words.length - 1 && ctx.measureText(words.slice(0, split + 1).join(' ')).width <= 64) split++;
    ctx.fillText(words.slice(0, split).join(' '), x + 38, y + (words.length > 1 ? 20 : 23), 64);
    if (words.length > 1) ctx.fillText(words.slice(split).join(' '), x + 38, y + 27, 64);
  }
  ctx.restore();
}
