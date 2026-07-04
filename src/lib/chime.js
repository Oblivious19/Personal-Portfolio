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
