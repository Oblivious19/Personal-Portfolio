<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    let sectionEl;
    let triggers = [];

    const modules = [
        {
            id: "MOD.01",
            name: "Languages",
            icon: "fa-solid fa-code",
            skills: [
                { name: "JavaScript", level: 92 },
                { name: "Python", level: 85 },
                { name: "Java", level: 78 },
            ],
        },
        {
            id: "MOD.02",
            name: "Frameworks",
            icon: "fa-solid fa-layer-group",
            skills: [
                { name: "React", level: 90 },
                { name: "Node.js / Express", level: 88 },
                { name: "MERN Stack", level: 87 },
            ],
        },
        {
            id: "MOD.03",
            name: "Tools & Databases",
            icon: "fa-solid fa-database",
            skills: [
                { name: "MongoDB / PostgreSQL", level: 86 },
                { name: "GitHub / Postman", level: 90 },
                { name: "Firebase", level: 80 },
            ],
        },
        {
            id: "MOD.04",
            name: "Core Systems",
            icon: "fa-solid fa-microchip",
            skills: [
                { name: "Problem-Solving", level: 93 },
                { name: "Leadership", level: 85 },
                { name: "Teamwork", level: 92 },
            ],
        },
    ];

    const certifications = [
        "Cloud Computing — NPTEL (Top 5%)",
        "Computer Networking — NPTEL",
        "Introduction to Operating Systems — NPTEL",
    ];

    onMount(() => {
        if (!browser) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        gsap.registerPlugin(ScrollTrigger);

        sectionEl.querySelectorAll(".diag-bar-fill").forEach((bar) => {
            const level = bar.dataset.level;
            if (reduced) {
                bar.style.width = `${level}%`;
                return;
            }
            const tween = gsap.fromTo(
                bar,
                { width: "0%" },
                {
                    width: `${level}%`,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: bar, start: "top 90%", once: true },
                }
            );
            triggers.push(tween.scrollTrigger);
        });

        if (!reduced) {
            sectionEl.querySelectorAll(".diag-card").forEach((card, i) => {
                const tween = gsap.fromTo(
                    card,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        delay: (i % 2) * 0.12,
                        ease: "power3.out",
                        scrollTrigger: { trigger: card, start: "top 90%", once: true },
                    }
                );
                triggers.push(tween.scrollTrigger);
            });
        }
    });

    onDestroy(() => {
        if (!browser) return;
        triggers.forEach((t) => t?.kill());
    });
</script>

<section bind:this={sectionEl} id="skills" class="py-20 lg:py-32 flex flex-col gap-16">
    <div class="flex flex-col gap-3 text-center">
        <p class="text-xs sm:text-sm tracking-[0.3em] text-neon-cyan/70 uppercase">
            &gt; run system.diagnostics
        </p>
        <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
            <span class="text-slate-600">//</span> all systems
            <span class="poppins hero-gradient-text">operational</span>
        </h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto w-full">
        {#each modules as mod}
            <div
                class="diag-card hud-frame relative flex flex-col gap-4 p-5 sm:p-6 border border-solid border-violet-500/20 bg-noir-900/70 hover:border-neon-cyan/40 duration-300"
            >
                <div class="hud-corners absolute inset-0 pointer-events-none" />
                <div class="flex items-center justify-between">
                    <span class="text-[10px] tracking-[0.25em] text-slate-500">{mod.id}</span>
                    <span class="status-pulse inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div class="flex items-center gap-3">
                    <i class={mod.icon + " text-neon-violet"} />
                    <h4 class="text-lg sm:text-xl font-medium poppins">{mod.name}</h4>
                </div>
                <div class="flex flex-col gap-3">
                    {#each mod.skills as skill}
                        <div class="flex flex-col gap-1.5">
                            <div class="flex justify-between text-xs sm:text-sm">
                                <span class="text-slate-300">{skill.name}</span>
                                <span class="text-neon-cyan/80">{skill.level}%</span>
                            </div>
                            <div class="diag-bar">
                                <div class="diag-bar-fill" data-level={skill.level} />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <div
        class="hud-frame relative max-w-[900px] mx-auto w-full p-5 sm:p-6 border border-solid border-violet-500/20 bg-noir-900/70 flex flex-col gap-3"
    >
        <div class="hud-corners absolute inset-0 pointer-events-none" />
        <span class="text-[10px] tracking-[0.25em] text-slate-500">MOD.05 · CREDENTIALS</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <p>
                <span class="text-neon-cyan/80">[edu]</span> B.E. Information Technology · Mumbai
                University · <span class="text-neon-violet font-semibold">CGPA 9.38</span>
            </p>
            {#each certifications as cert}
                <p><span class="text-neon-cyan/80">[cert]</span> {cert}</p>
            {/each}
        </div>
    </div>
</section>
