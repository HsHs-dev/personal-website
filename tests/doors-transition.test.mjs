import test from 'node:test';
import assert from 'node:assert/strict';
import { entryFrame } from '../src/components/doors/transition.ts';

test('entry first opens, then travels, then conceals the handoff', () => {
  assert.deepEqual(entryFrame(0, false), { travel: 0, veil: 0, labels: 1 });
  assert.equal(entryFrame(.15, false).travel, 0);
  assert.ok(entryFrame(.5, false).travel > 0);
  assert.equal(entryFrame(.5, false).veil, 0);
  assert.equal(entryFrame(.5, false).labels, 0);
  assert.deepEqual(entryFrame(1, false), { travel: 1, veil: 1, labels: 0 });
});

test('reduced motion never moves the camera and still covers the route change', () => {
  for (let step = 0; step <= 20; step++) assert.equal(entryFrame(step / 20, true).travel, 0);
  assert.equal(entryFrame(1, true).veil, 1);
});

test('progress is clamped and movement and fade never reverse', () => {
  assert.deepEqual(entryFrame(-2, false), entryFrame(0, false));
  assert.deepEqual(entryFrame(4, false), entryFrame(1, false));
  let previous = entryFrame(0, false);
  for (let step = 1; step <= 100; step++) {
    const next = entryFrame(step / 100, false);
    assert.ok(next.travel >= previous.travel);
    assert.ok(next.veil >= previous.veil);
    assert.ok(next.labels <= previous.labels);
    previous = next;
  }
});
