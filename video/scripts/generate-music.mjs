// Generates an original, royalty-free 30s chill-pop track -> public/music.wav
// Pure synthesis (no samples), so it is safe to publish anywhere.
import { writeFileSync } from "node:fs";

const SR = 44100;
const DURATION = 30;
const N = SR * DURATION;
const BPM = 110;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

const L = new Float32Array(N);
const R = new Float32Array(N);

const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Cmaj7 - Am7 - Fmaj7 - G6 (one chord per bar)
const CHORDS = [
    [60, 64, 67, 71],
    [57, 60, 64, 67],
    [53, 57, 60, 64],
    [55, 59, 62, 64],
];
const ROOTS = [36, 33, 29, 31];

// Deterministic noise so every render sounds identical
let seed = 1234567;
const noise = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
};

const add = (i, v, pan = 0) => {
    if (i < 0 || i >= N) return;
    L[i] += v * (1 - Math.max(0, pan));
    R[i] += v * (1 + Math.min(0, pan));
};

const totalBars = Math.ceil(DURATION / BAR);

// ---- Pad: detuned saws through a one-pole low-pass ----
for (let bar = 0; bar < totalBars; bar++) {
    const chord = CHORDS[bar % 4];
    const start = Math.floor(bar * BAR * SR);
    const len = Math.floor(BAR * SR) + Math.floor(0.4 * SR); // overlap tail
    chord.forEach((note, ni) => {
        [-0.08, 0, 0.08].forEach((detune, di) => {
            const f = midiToHz(note + detune);
            let phase = (ni * 0.13 + di * 0.37) % 1;
            let lp = 0;
            const pan = (di - 1) * 0.5;
            for (let j = 0; j < len; j++) {
                const t = j / SR;
                const env =
                    Math.min(1, t / 0.35) *
                    Math.min(1, Math.max(0, (len / SR - t) / 0.45));
                phase += f / SR;
                if (phase >= 1) phase -= 1;
                const saw = 2 * phase - 1;
                lp += 0.06 * (saw - lp);
                add(start + j, lp * env * 0.022, pan);
            }
        });
    });
}

// ---- Bass: sine + soft square, pluck envelope ----
for (let bar = 0; bar < totalBars; bar++) {
    const root = ROOTS[bar % 4];
    [0, 2, 3.5].forEach((beatPos) => {
        const start = Math.floor((bar * BAR + beatPos * BEAT) * SR);
        const f = midiToHz(root + 12);
        const len = Math.floor(BEAT * 1.2 * SR);
        for (let j = 0; j < len; j++) {
            const t = j / SR;
            const env = Math.min(1, t / 0.01) * Math.exp(-t * 3.2);
            const s = Math.sin(2 * Math.PI * f * t);
            const v = (s + 0.25 * Math.tanh(s * 4)) * env * 0.16;
            add(start + j, v);
        }
    });
}

// ---- Arp: plucked triangle 8ths with ping-pong delay (from bar 1) ----
const arpL = new Float32Array(N);
const arpR = new Float32Array(N);
for (let bar = 1; bar < totalBars; bar++) {
    const chord = CHORDS[bar % 4];
    const pattern = [0, 1, 2, 3, 2, 1, 3, 2];
    pattern.forEach((idx, step) => {
        const start = Math.floor((bar * BAR + step * BEAT * 0.5) * SR);
        const f = midiToHz(chord[idx] + 12);
        const len = Math.floor(0.5 * SR);
        const pan = step % 2 === 0 ? -0.35 : 0.35;
        for (let j = 0; j < len && start + j < N; j++) {
            const t = j / SR;
            const env = Math.min(1, t / 0.004) * Math.exp(-t * 9);
            const p = (f * t) % 1;
            const tri = 4 * Math.abs(p - 0.5) - 1;
            const v = (tri * 0.7 + Math.sin(2 * Math.PI * f * 2 * t) * 0.3) * env * 0.07;
            arpL[start + j] += v * (1 - Math.max(0, pan));
            arpR[start + j] += v * (1 + Math.min(0, pan));
        }
    });
}
const delay = Math.floor(BEAT * 0.75 * SR);
for (let i = delay; i < N; i++) {
    arpL[i] += arpR[i - delay] * 0.38;
    arpR[i] += arpL[i - delay] * 0.38;
}
for (let i = 0; i < N; i++) {
    L[i] += arpL[i];
    R[i] += arpR[i];
}

// ---- Drums (enter at bar 1, snare from bar 3, break on last bar) ----
const lastFullBar = Math.floor(DURATION / BAR) - 1;
for (let bar = 1; bar < totalBars; bar++) {
    if (bar === lastFullBar) continue; // breathe before the outro
    for (let b = 0; b < 4; b++) {
        // Kick
        const ks = Math.floor((bar * BAR + b * BEAT) * SR);
        let kPhase = 0;
        for (let j = 0; j < 0.4 * SR; j++) {
            const t = j / SR;
            const f = 45 + 110 * Math.exp(-t * 28);
            kPhase += f / SR;
            add(ks + j, Math.sin(2 * Math.PI * kPhase) * Math.exp(-t * 7) * 0.42);
        }
        // Clap / snare on 2 & 4
        if (bar >= 3 && (b === 1 || b === 3)) {
            let prev = 0;
            for (let j = 0; j < 0.25 * SR; j++) {
                const t = j / SR;
                const n = noise();
                const hp = n - prev;
                prev = n;
                const env = Math.exp(-t * 16) + (t < 0.02 ? 0.4 : 0);
                add(ks + j, (hp * 0.6 + Math.sin(2 * Math.PI * 190 * t) * 0.4) * env * 0.12);
            }
        }
        // Off-beat hats
        const hs = Math.floor((bar * BAR + (b + 0.5) * BEAT) * SR);
        let prev = 0;
        for (let j = 0; j < 0.06 * SR; j++) {
            const t = j / SR;
            const n = noise();
            const hp = n - prev;
            prev = n;
            add(hs + j, hp * Math.exp(-t * 60) * 0.06, 0.3);
        }
    }
}

// ---- Master: soft clip, normalize, fades ----
let peak = 0;
for (let i = 0; i < N; i++) {
    L[i] = Math.tanh(L[i] * 1.2);
    R[i] = Math.tanh(R[i] * 1.2);
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const gain = 0.89 / peak;
const fadeIn = 0.4 * SR;
const fadeOut = 3 * SR;

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
    const fade = Math.min(1, i / fadeIn, (N - i) / fadeOut);
    const l = Math.max(-1, Math.min(1, L[i] * gain * fade));
    const r = Math.max(-1, Math.min(1, R[i] * gain * fade));
    buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
}
writeFileSync(new URL("../public/music.wav", import.meta.url), buf);
console.log("Wrote public/music.wav");
