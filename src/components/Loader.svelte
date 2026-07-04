<script>
    import { onMount, onDestroy, createEventDispatcher, tick } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";
    import { playEntryChime } from "$lib/chime.js";

    const dispatch = createEventDispatcher();

    const bootLines = [
        "█ SHREYA.OS v2.0 — initializing",
        "> mounting /dev/skills .......... ok",
        "> loading neural_modules ........ ok",
        "> connecting mumbai.node ........ ok",
        "> injecting caffeine ............ ok",
        "> compiling portfolio ........... ok",
    ];

    let visibleLines = 0;
    let progress = 0;
    let phase = "log"; // log → name → split
    let finished = false;

    let topPanel;
    let bottomPanel;
    let contentEl;
    let seamEl;
    let nameEl;

    let timers = [];
    let progressTween;

    // entry chime: try autoplay at the name reveal; if blocked, retry on the
    // first tap/keypress while the loader is still up
    function chimeUnlock() {
        removeChimeUnlock();
        if (!finished) playEntryChime();
    }
    function removeChimeUnlock() {
        if (!browser) return;
        window.removeEventListener("pointerdown", chimeUnlock);
        window.removeEventListener("keydown", chimeUnlock);
    }
    async function tryChime() {
        const played = await playEntryChime();
        if (!played && !finished) {
            window.addEventListener("pointerdown", chimeUnlock, { once: true });
            window.addEventListener("keydown", chimeUnlock, { once: true });
        }
    }

    $: barBlocks = (() => {
        const total = 18;
        const filled = Math.round((progress / 100) * total);
        return "█".repeat(filled) + "░".repeat(total - filled);
    })();

    function finish() {
        if (finished) return;
        finished = true;
        if (browser) document.documentElement.style.overflow = "";
        dispatch("done");
    }

    function splitReveal() {
        phase = "split";
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(contentEl, { opacity: 0, duration: 0.18, ease: "power1.in" })
            .set(seamEl, { opacity: 1 })
            .to(seamEl, { scaleX: 1, duration: 0.22, ease: "power3.out" }, "<")
            .to(topPanel, { yPercent: -100, duration: 0.55, ease: "power4.inOut" }, ">-0.05")
            .to(bottomPanel, { yPercent: 100, duration: 0.55, ease: "power4.inOut" }, "<")
            .to(seamEl, { opacity: 0, duration: 0.3 }, "<0.2");
    }

    async function showName() {
        phase = "name";
        tryChime();
        await tick();
        if (!nameEl) {
            timers.push(setTimeout(splitReveal, 750));
            return;
        }
        // glitch slam-in
        const tl = gsap.timeline();
        tl.fromTo(
            nameEl,
            { scale: 1.18, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.22, ease: "power4.out" }
        )
            .to(nameEl, { x: -4, duration: 0.04, repeat: 1, yoyo: true }, ">")
            .to(nameEl, { x: 3, duration: 0.04, repeat: 1, yoyo: true }, ">")
            .to(nameEl, { x: 0, duration: 0.03 }, ">");

        timers.push(setTimeout(splitReveal, 750));
    }

    onMount(() => {
        if (!browser) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            finish();
            return;
        }

        document.documentElement.style.overflow = "hidden";

        // stream boot lines
        bootLines.forEach((_, i) => {
            timers.push(setTimeout(() => (visibleLines = i + 1), 90 + i * 145));
        });

        // progress: fast → stall at 87 → snap to 100
        const state = { p: 0 };
        progressTween = gsap.to(state, {
            p: 87,
            duration: 0.95,
            ease: "power2.out",
            onUpdate: () => (progress = Math.round(state.p)),
            onComplete: () => {
                timers.push(
                    setTimeout(() => {
                        progressTween = gsap.to(state, {
                            p: 100,
                            duration: 0.18,
                            ease: "power1.in",
                            onUpdate: () => (progress = Math.round(state.p)),
                            onComplete: showName,
                        });
                    }, 160)
                );
            },
        });

        // failsafe: force completion even if tweens stall (background tab)
        timers.push(setTimeout(finish, 4000));
    });

    onDestroy(() => {
        if (!browser) return;
        timers.forEach(clearTimeout);
        progressTween?.kill();
        removeChimeUnlock();
        document.documentElement.style.overflow = "";
    });
</script>

{#if !finished}
    <div class="fixed inset-0 z-[100]" role="presentation" aria-hidden="true">
        <!-- split panels -->
        <div bind:this={topPanel} class="absolute top-0 left-0 w-full h-1/2 bg-noir-950" />
        <div bind:this={bottomPanel} class="absolute bottom-0 left-0 w-full h-1/2 bg-noir-950" />

        <!-- cyan seam flash -->
        <div
            bind:this={seamEl}
            class="absolute top-1/2 left-0 w-full h-[2px] bg-neon-cyan opacity-0 scale-x-0 shadow-[0_0_20px_rgba(244,114,182,0.9)]"
        />

        <!-- content -->
        <div bind:this={contentEl} class="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
            {#if phase === "log"}
                <div class="max-w-[520px] mx-auto w-full text-xs sm:text-sm text-neon-cyan/80 flex flex-col gap-1.5">
                    {#each bootLines.slice(0, visibleLines) as line, i}
                        <p class={i === 0 ? "text-neon-violet-bright" : ""}>{line}</p>
                    {/each}
                    <p class="pt-3 text-slate-400 tracking-wider">
                        [{barBlocks}] <span class="text-neon-cyan">{progress}%</span>
                    </p>
                </div>
            {:else}
                <div bind:this={nameEl} class="text-center flex flex-col gap-3">
                    <h2
                        class="glitch-text poppins hero-gradient-text font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight"
                    >
                        SHREYA OJHA
                    </h2>
                    <p class="text-xs sm:text-sm tracking-[0.4em] text-emerald-400">
                        [ ACCESS GRANTED ]
                    </p>
                </div>
            {/if}
        </div>
    </div>
{/if}
