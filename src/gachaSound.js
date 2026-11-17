// Original, lightweight Web Audio synthesis for a capsule-toy vending mechanism.
// Audio only begins after a user gesture. No sound files, APIs, or tracking.
function tone(ctx, when, duration, fromHz, toHz, level, waveform = 'triangle') {
  const osc = ctx.createOscillator();
  const volume = ctx.createGain();
  osc.type = waveform;
  osc.frequency.setValueAtTime(fromHz, when);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, toHz), when + duration);
  volume.gain.setValueAtTime(0.0001, when);
  volume.gain.exponentialRampToValueAtTime(level, when + Math.min(0.006, duration / 4));
  volume.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(volume);
  volume.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + duration + 0.01);
}

function friction(ctx, when, duration, filterHz, level) {
  const size = Math.max(1, Math.round(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < size; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * (1 - i / size);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const volume = ctx.createGain();
  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = filterHz;
  filter.Q.value = 0.8;
  volume.gain.setValueAtTime(0.0001, when);
  volume.gain.exponentialRampToValueAtTime(level, when + Math.min(0.008, duration / 4));
  volume.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  source.connect(filter);
  filter.connect(volume);
  volume.connect(ctx.destination);
  source.start(when);
  source.stop(when + duration + 0.01);
}

export function playMechanicalSound(ctx, kind) {
  if (!ctx || ctx.state === 'closed') return;
  const t = ctx.currentTime + 0.008;
  if (kind === 'engage') {
    tone(ctx, t, 0.07, 165, 110, 0.075);
    friction(ctx, t, 0.04, 900, 0.045);
  } else if (kind === 'tick') {
    // Short high-frequency pawl click layered with low plastic gear chatter.
    friction(ctx, t, 0.025, 1550, 0.10);
    tone(ctx, t, 0.037, 260, 125, 0.065, 'triangle');
  } else if (kind === 'dispense') {
    // Ratchet finishing, a heavier mechanism thud, then bouncing capsule.
    friction(ctx, t, 0.21, 610, 0.095);
    tone(ctx, t + 0.025, 0.14, 165, 62, 0.15);
    tone(ctx, t + 0.21, 0.092, 350, 145, 0.115);
    friction(ctx, t + 0.21, 0.083, 1200, 0.07);
    tone(ctx, t + 0.37, 0.07, 310, 155, 0.075);
  }
}
