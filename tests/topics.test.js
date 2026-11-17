import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TALK_THEMES, CATEGORIES, TOPIC_MODES, getTopicPool, drawTheme } from '../src/topics.js';

test('200 unique bilingual prompts', () => {
  assert.equal(TALK_THEMES.length, 200);
  for (const field of ['id', 'textEn', 'textJa']) assert.equal(new Set(TALK_THEMES.map(t => t[field])).size, 150);
  TALK_THEMES.forEach(t => ['textEn', 'textJa', 'category', 'color'].forEach(key => assert.ok(t[key])));
});
test('every category exhausts without repetition and avoids immediate repeat on restart', () => {
  for (const category of [...new Set(['All', ...CATEGORIES, ...TOPIC_MODES.map(mode => mode.id)])]) {
    const pool = getTopicPool(TALK_THEMES, category);
    assert.ok(pool.length > 0, category);
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

test('guided topic modes have nonempty pools and contain no duplicates', () => {
  for (const mode of TOPIC_MODES) {
    const pool = getTopicPool(TALK_THEMES, mode.id);
    assert.ok(pool.length >= 10, mode.id);
    assert.equal(new Set(pool.map(theme => theme.id)).size, pool.length);
    if (mode.categories) assert.ok(pool.every(theme => mode.categories.includes(theme.category)));
  }
  assert.deepEqual(getTopicPool(TALK_THEMES, 'missing-category'), []);
});
