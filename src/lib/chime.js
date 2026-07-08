// Synthesized robot "purr" — a soft fluttery trill that plays while the
// mascot is long-pressed. Returns a stop() function (call on release), or
// null if audio is unavailable. Always user-gesture triggered, so no
// autoplay concerns.
export function playPurr() {
    if (typeof window === "undefined") return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    let ctx;
    try {
        ctx = new Ctx();
        if (ctx.state === "suspended") ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.16, now + 0.15);
        master.connect(ctx.destination);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 900;

        // tremolo gain fluttered by an LFO — this flutter *is* the purr
        const trem = ctx.createGain();
        trem.gain.value = 0.6;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 24;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.value = 0.4;
        lfo.connect(lfoDepth).connect(trem.gain);

        // body tone + a quieter fifth above, both creeping upward = "happier"
        const body = ctx.createOscillator();
        body.type = "triangle";
        body.frequency.setValueAtTime(150, now);
        body.frequency.linearRampToValueAtTime(195, now + 2.5);
        const fifth = ctx.createOscillator();
        fifth.type = "sine";
        fifth.frequency.setValueAtTime(225, now);
        fifth.frequency.linearRampToValueAtTime(292, now + 2.5);
        const fifthGain = ctx.createGain();
        fifthGain.gain.value = 0.35;

        body.connect(trem);
        fifth.connect(fifthGain).connect(trem);
        trem.connect(filter).connect(master);
        body.start(now);
        fifth.start(now);
        lfo.start(now);

        let stopped = false;
        const stop = () => {
            if (stopped) return;
            stopped = true;
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(Math.max(master.gain.value, 0.001), t);
            master.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            setTimeout(() => ctx.close().catch(() => {}), 400);
        };
        // safety: never purr forever if release is missed (long enough to
        // cover the 5s heart-nova hold)
        setTimeout(stop, 8000);
        return stop;
    } catch {
        ctx?.close().catch(() => {});
        return null;
    }
}

// Short tap version of the purr — a quick happy "brrp!" (~0.35s).
export function playChirp() {
    if (typeof window === "undefined") return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;

    let ctx;
    try {
        ctx = new Ctx();
        if (ctx.state === "suspended") ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
        master.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        master.connect(ctx.destination);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1200;

        // same purr flutter, compressed into a quick upward "brrp"
        const trem = ctx.createGain();
        trem.gain.value = 0.6;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 28;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.value = 0.4;
        lfo.connect(lfoDepth).connect(trem.gain);

        const body = ctx.createOscillator();
        body.type = "triangle";
        body.frequency.setValueAtTime(170, now);
        body.frequency.exponentialRampToValueAtTime(300, now + 0.28);
        const fifth = ctx.createOscillator();
        fifth.type = "sine";
        fifth.frequency.setValueAtTime(255, now);
        fifth.frequency.exponentialRampToValueAtTime(450, now + 0.28);
        const fifthGain = ctx.createGain();
        fifthGain.gain.value = 0.35;

        body.connect(trem);
        fifth.connect(fifthGain).connect(trem);
        trem.connect(filter).connect(master);
        body.start(now);
        fifth.start(now);
        lfo.start(now);
        body.stop(now + 0.4);
        fifth.stop(now + 0.4);
        lfo.stop(now + 0.4);

        setTimeout(() => ctx.close().catch(() => {}), 600);
    } catch {
        ctx?.close().catch(() => {});
    }
}

// Synthesized "power-on" entry chime (Web Audio, no asset file).
// Best-effort: resolves true if it actually played, false if the
// browser blocked autoplay or Web Audio is unavailable.
export async function playEntryChime() {
    if (typeof window === "undefined") return false;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;

    let ctx;
    try {
        ctx = new Ctx();
        if (ctx.state === "suspended") {
            await ctx.resume();
        }
        if (ctx.state !== "running") {
            ctx.close().catch(() => {});
            return false;
        }

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.value = 0.2;
        master.connect(ctx.destination);

        // "ta" — low sine thump
        const thump = ctx.createOscillator();
        thump.type = "sine";
        thump.frequency.setValueAtTime(110, now);
        thump.frequency.exponentialRampToValueAtTime(55, now + 0.25);
        const thumpGain = ctx.createGain();
        thumpGain.gain.setValueAtTime(1, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        thump.connect(thumpGain).connect(master);
        thump.start(now);
        thump.stop(now + 0.35);

        // "dum" — rising-fifth pad, detuned triangles through an opening lowpass
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.5);
        const padGain = ctx.createGain();
        padGain.gain.setValueAtTime(0.0001, now);
        padGain.gain.exponentialRampToValueAtTime(0.55, now + 0.12);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        filter.connect(padGain).connect(master);

        for (const detune of [-6, 6]) {
            const osc = ctx.createOscillator();
            osc.type = "triangle";
            osc.detune.value = detune;
            osc.frequency.setValueAtTime(220, now); // A3
            osc.frequency.exponentialRampToValueAtTime(330, now + 0.28); // → E4
            osc.connect(filter);
            osc.start(now + 0.05);
            osc.stop(now + 1.15);
        }

        setTimeout(() => ctx.close().catch(() => {}), 1500);
        return true;
    } catch {
        ctx?.close().catch(() => {});
        return false;
    }
}
