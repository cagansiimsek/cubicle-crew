import test from 'node:test';
import assert from 'node:assert/strict';
import { setOffice, PIC_W, PIC_H } from '../public/catalog.js';
import { DEFAULT_WALL_SIGN, WALL_SIGN } from '../public/wall-sign.js';

const picture = { pal: ['#204060'], px: '0'.repeat(PIC_W * PIC_H) };
const sign = { ...DEFAULT_WALL_SIGN, enabled: true, title: '  Studio   Ъ ', subtitle: 'Making things', titleColor: '#386CAA' };

test('wall sign saves alongside a legacy name and all three picture slots', () => {
  const save = { officeName: 'Legacy name', pictures: [picture, null, picture] };
  assert.deepEqual(setOffice(save, { wallSign: sign }), { ok: true });
  assert.deepEqual(save.wallSign, { ...sign, title: 'Studio Ъ', titleColor: '#386caa' });
  assert.equal(save.officeName, 'Legacy name');
  assert.deepEqual(save.pictures, [picture, null, picture]);
  assert.equal(setOffice(save, { picture: 1, pic: picture }).ok, true);
  assert.equal(save.wallSign.title, 'Studio Ъ');
  assert.equal(setOffice(save, { wallSign: { ...save.wallSign, enabled: false } }).ok, true);
  assert.equal(save.wallSign.enabled, false);
  assert.equal(save.wallSign.title, 'Studio Ъ');
  assert.equal(save.officeName, 'Legacy name');
});

test('invalid signs leave the office save intact and long text is bounded', () => {
  const save = { officeName: 'Existing', pictures: [picture] };
  for (const wallSign of [null, { ...sign, enabled: 'true' }, { ...sign, title: '   ' }, { ...sign, titleColor: 'url(https://example.com)' }]) {
    assert.deepEqual(setOffice(save, { picture: 0, pic: null, wallSign }), { ok: false, error: 'wallSign' });
    assert.deepEqual(save, { officeName: 'Existing', pictures: [picture] });
  }
  assert.equal(setOffice(save, { wallSign: { ...sign, title: '𐐀'.repeat(30), subtitle: 'x'.repeat(60) } }).ok, true);
  assert.equal(Array.from(save.wallSign.title).length, WALL_SIGN.titleMax);
  assert.equal(save.wallSign.subtitle.length, WALL_SIGN.subtitleMax);
});
