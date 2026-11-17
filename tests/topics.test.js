import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TALK_THEMES, CATEGORIES, drawTheme } from '../src/topics.js';

test('150 unique bilingual prompts', () => {
  assert.equal(TALK_THEMES.length, 150);
  for (const field of ['id', 'textEn', 'textJa']) assert.equal(new Set(TALK_THEMES.map(t => t[field])).size, 150);
  TALK_THEMES.forEach(t => ['textEn', 'textJa', 'category', 'color'].forEach(key => assert.ok(t[key])));
});
test('every category exhausts without repetition and avoids immediate repeat on restart', () => {
  for (const category of ['All', ...CATEGORIES]) {
    const pool = TALK_THEMES.filter(t => category === 'All' || t.category === category);
    const seen = new Set();
    let previous;
    for (let i = 0; i < pool.length; i++) {
      const next = drawTheme(TALK_THEMES, category, seen, () => 0.5);
      assert.ok(pool.includes(next));
      assert.ok(!seen.has(next.id));
      seen.add(next.id); previous = next;
    }
    if (pool.length > 1) assert.notEqual(drawTheme(TALK_THEMES, category, seen, () => 0.5).id, previous.id);
  }
});
test('invalid or empty pools return null', () => {
  assert.equal(drawTheme(TALK_THEMES, 'unknown', new Set()), null);
  assert.equal(drawTheme([], 'All', new Set()), null);
});
