<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import Mascot3D from "./Mascot3D.svelte";

    let stage;
    let canvas;

    let glowX = 50;
    let glowY = 50;
    let clock = "";
    let clockInterval;

    let rafId;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let ctx;
    let width = 0;
    let height = 0;
    let reducedMotion = false;
    let isMobile = false;

    const PARTICLE_COUNT = 40;
    const CONNECT_DIST = 110;
    const MOUSE_RADIUS = 130;

    class Particle {
        constructor(w, h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.22;
            this.vy = (Math.random() - 0.5) * 0.22;
            this.r = Math.random() * 1.1 + 0.35;
            this.cyan = Math.random() < 0.3;
        }

        update(w, h) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.vx -= (dx / dist) * force * 0.06;
                this.vy -= (dy / dist) * force * 0.06;
            }

            this.vx *= 0.99;
            this.vy *= 0.99;
        }
    }

    function initParticles(w, h) {
        const count = isMobile ? 22 : reducedMotion ? 16 : PARTICLE_COUNT;
        particles = Array.from({ length: count }, () => new Particle(w, h));
    }

    function drawParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
            p.update(width, height);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.cyan
                ? "rgba(244, 114, 182, 0.4)"
                : "rgba(167, 139, 250, 0.4)";
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle =
                        a.cyan || b.cyan
                            ? `rgba(244, 114, 182, ${0.07 * (1 - dist / CONNECT_DIST)})`
                            : `rgba(139, 92, 246, ${0.09 * (1 - dist / CONNECT_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        rafId = requestAnimationFrame(drawParticles);
    }

    function resizeCanvas() {
        if (!canvas || !stage) return;
        const rect = stage.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx = canvas.getContext("2d");
        ctx.scale(devicePixelRatio, devicePixelRatio);
        if (particles.length === 0) initParticles(width, height);
    }

    function handleMouseMove(e) {
        if (!stage || isMobile) return;
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouse = { x, y };
        glowX = (x / rect.width) * 100;
        glowY = (y / rect.height) * 100;
    }

    function handleMouseLeave() {
        mouse = { x: -9999, y: -9999 };
    }

    function updateClock() {
        clock = new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: false,
        });
    }

    onMount(() => {
        if (!browser) return;

        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        isMobile = window.innerWidth < 768;

        resizeCanvas();
        if (!reducedMotion) drawParticles();

        updateClock();
        clockInterval = setInterval(updateClock, 1000);
        window.addEventListener("resize", resizeCanvas);
    });

    onDestroy(() => {
        if (!browser) return;
        cancelAnimationFrame(rafId);
        clearInterval(clockInterval);
        window.removeEventListener("resize", resizeCanvas);
    });
</script>

<div
    bind:this={stage}
    class="hud-frame relative w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] overflow-hidden bg-noir-700/40"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    role="presentation"
>
    <div class="hud-corners absolute inset-0 pointer-events-none" />

    <!-- ambient layers -->
    <div class="hero-gradient absolute inset-0 pointer-events-none" />
    <div class="hero-grid absolute inset-0 pointer-events-none opacity-40" />
    <div class="hero-stars absolute inset-0 pointer-events-none" />

    <!-- data-mesh canvas -->
    <canvas bind:this={canvas} class="absolute inset-0 pointer-events-none z-[1]" />

    <!-- cursor glow -->
    <div
        class="hero-cursor-glow pointer-events-none absolute z-[2]"
        style="left: {glowX}%; top: {glowY}%;"
    />

    <!-- HUD status readouts -->
    <div
        class="absolute top-3 left-4 z-[6] flex items-center gap-2 text-[10px] sm:text-xs tracking-widest text-neon-cyan/80 pointer-events-none"
    >
        <span class="status-pulse inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
        SYS.ONLINE
    </div>
    <div
        class="absolute top-3 right-4 z-[6] text-[10px] sm:text-xs tracking-widest text-slate-500 pointer-events-none"
    >
        LOC: MUMBAI · {clock} IST
    </div>
    <div
        class="absolute bottom-3 left-4 z-[6] text-[10px] sm:text-xs tracking-widest text-slate-600 pointer-events-none"
    >
        UNIT: SO-01 // FULL-STACK
    </div>
    <div
        class="absolute bottom-3 right-4 z-[6] text-[10px] sm:text-xs tracking-widest text-neon-violet/70 pointer-events-none"
    >
        v2.0
    </div>

    <!-- the mascot -->
    <div class="absolute inset-0 z-[5]">
        <Mascot3D />
    </div>
</div>
