<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";
    import { loaderDone } from "$lib/loader.js";
    import HeroInteractive from "./HeroInteractive.svelte";
    import SectionProjects from "./SectionProjects.svelte";
    import SectionStory from "./SectionStory.svelte";
    import SectionSkills from "./SectionSkills.svelte";
    import GlitchDivider from "./GlitchDivider.svelte";

    const bootLines = [
        "> boot shreya_ojha.sys",
        "> loading modules ......... ok",
        "> identity verified",
    ];

    let typedLines = [];
    let currentLine = "";
    let bootDone = false;
    let heroContent;
    let typeTimer;

    function typeBoot(lineIdx = 0, charIdx = 0) {
        if (lineIdx >= bootLines.length) {
            typeTimer = setTimeout(() => {
                bootDone = true;
                revealHero();
            }, 250);
            return;
        }
        const line = bootLines[lineIdx];
        if (charIdx < line.length) {
            currentLine = line.slice(0, charIdx + 1);
            typeTimer = setTimeout(() => typeBoot(lineIdx, charIdx + 1), 18);
        } else {
            typedLines = [...typedLines, line];
            currentLine = "";
            typeTimer = setTimeout(() => typeBoot(lineIdx + 1, 0), 160);
        }
    }

    function revealHero() {
        if (!heroContent) return;
        gsap.fromTo(
            heroContent.children,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
        );
    }

    let unsubLoader;

    onMount(() => {
        if (!browser) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            typedLines = bootLines;
            bootDone = true;
            return;
        }
        // wait for the entry loader's split reveal before booting the hero;
        // on mobile the boot log is hidden, so reveal the hero right away
        const isMobile = window.innerWidth < 640;
        let started = false;
        unsubLoader = loaderDone.subscribe((done) => {
            if (done && !started) {
                started = true;
                if (isMobile) {
                    bootDone = true;
                    revealHero();
                } else {
                    typeBoot();
                }
            }
        });
    });

    onDestroy(() => {
        if (!browser) return;
        clearTimeout(typeTimer);
        unsubLoader?.();
    });
</script>

<main class="flex flex-col flex-1 p-4">
    <!-- full-bleed hero: escapes the page container/padding and tucks under the sticky header -->
    <section
        id="introPage"
        class="relative -mt-24"
        style="margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw);"
    >
        <HeroInteractive>
        <div class="flex flex-col lg:justify-center text-center lg:text-left gap-6 md:gap-8">
            <!-- boot sequence (desktop only — hidden on mobile to reduce clutter) -->
            <div
                class="hidden sm:block text-left text-xs sm:text-sm text-neon-cyan/70 sm:min-h-[66px] mx-auto lg:mx-0 w-fit"
                aria-hidden="true"
            >
                {#each typedLines as line}
                    <p>{line}</p>
                {/each}
                {#if currentLine}
                    <p>{currentLine}<span class="terminal-caret">▍</span></p>
                {/if}
            </div>

            <div
                bind:this={heroContent}
                class="flex flex-col gap-6 md:gap-8 duration-200"
                style={bootDone ? "" : "opacity: 0; pointer-events: none;"}
            >
                <div class="mx-auto lg:mx-0 w-fit">
                    <span
                        class="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium border border-violet-500/30 bg-violet-950/40 text-violet-300 backdrop-blur-sm"
                    >
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"
                            />
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        STATUS: open for opportunities
                    </span>
                </div>

                <h2
                    class="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-[3.6rem] leading-tight"
                >
                    <span class="glitch-text poppins hero-gradient-text">SHREYA OJHA</span>
                    <br />
                    <span class="text-2xl sm:text-3xl md:text-4xl text-slate-300 tracking-wide">
                        Full-Stack Developer<span class="terminal-caret text-neon-cyan">_</span>
                    </span>
                </h2>

                <p class="text-base sm:text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
                    Full-stack developer who takes products from idea to production —
                    including an <span class="text-neon-violet">AI learning platform</span>
                    built at IIT Ropar and an
                    <span class="text-neon-cyan">E-commerce store</span> processing real
                    payments today.
                </p>

                <div class="flex flex-col sm:flex-row items-center gap-4 mx-auto lg:mx-0">
                    <a
                        href="#projects"
                        class="blueShadow text-base sm:text-lg poppins relative overflow-hidden px-6 py-3 group bg-white text-slate-950 inline-block"
                    >
                        <div
                            class="absolute top-0 right-full w-full h-full bg-violet-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
                        />
                        <span class="relative z-[1]">./view_work.sh &rarr;</span>
                    </a>
                    <a
                        href="#footer"
                        class="text-base sm:text-lg poppins px-6 py-3 inline-block border border-solid border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan hover:neon-glow-cyan hover:bg-neon-cyan/10 duration-200"
                    >
                                    Open_channel() →
                    </a>
                </div>
            </div>
        </div>
        </HeroInteractive>
    </section>

    <GlitchDivider />
    <SectionProjects />
    <GlitchDivider />
    <SectionStory />
    <GlitchDivider />
    <SectionSkills />

    <p class="mx-auto pb-16 text-slate-500 text-sm">
        <span class="text-neon-cyan/70">&gt;</span> eager to contribute to real-world, high-impact
        projects<span class="terminal-caret">_</span>
    </p>
</main>
