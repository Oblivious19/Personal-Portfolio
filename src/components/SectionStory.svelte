<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    let sectionEl;
    let spineEl;
    let triggers = [];
    let expandedChapter = null;

    function toggleChapter(i) {
        expandedChapter = expandedChapter === i ? null : i;
    }

    const chapters = [
        {
            year: "2022",
            title: "System boot",
            place: "Mumbai University · B.E. Information Technology",
            story:
                "I started my engineering journey with a curiosity for how things work under the hood. Four years later I'm graduating with a 9.38 CGPA — but the real education happened in the projects between the lectures.",
            chips: ["B.E. IT", "CGPA 9.38", "2022–2026"],
        },
        {
            year: "2024",
            title: "First production code",
            place: "Drona-HQ · Full Stack Developer (Remote)",
            story:
                "My first taste of real-world engineering: I built a Managed Email Service with Express.js, MongoDB and Mailgun — async flows, delivery tracking, 5+ custom APIs. I learned that shipping reliable software matters more than clever code.",
            chips: ["Express.js", "MongoDB", "Mailgun"],
        },
        {
            year: "2025",
            title: "Going solo",
            place: "Supriyapa · Freelance Full Stack Developer",
            story:
                "A client trusted me to build their entire e-commerce platform — storefront, admin panel, payments, the works. I scaled it to 200+ users and cut cart abandonment by 20%. It's live right now, taking real orders.",
            chips: ["React", "Node.js", "Razorpay", "supriyapa.com"],
            link: "https://supriyapa.com/",
        },
        {
            year: "2025",
            title: "Research mode",
            place: "IIT Ropar · NPTEL Research Intern (Prof. Sudarshan Iyengar)",
            story:
                "At IIT Ropar I built Query2Map — an AI learning platform that maps natural-language questions to a graph-based DSA ontology using Ollama Mistral and NLP, hitting 85% answer accuracy. Research taught me to measure everything.",
            chips: ["NLP", "Ollama Mistral", "MERN", "85% accuracy"],
            link: "https://query-2map-frontend-cm4w.onrender.com/",
        },
        {
            year: "NOW",
            title: "Open for missions",
            place: "Available for opportunities",
            story:
                "I'm looking for teams and founders building things that matter. If you need someone who can own a feature from database schema to pixel-perfect UI — let's talk.",
            chips: ["Full Stack", "AI-curious", "Ships fast"],
        },
    ];

    onMount(() => {
        if (!browser) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;

        gsap.registerPlugin(ScrollTrigger);

        // spine draws itself with scroll
        const spineTween = gsap.fromTo(
            spineEl,
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionEl,
                    start: "top 70%",
                    end: "bottom 75%",
                    scrub: 0.6,
                },
            }
        );
        triggers.push(spineTween.scrollTrigger);

        sectionEl.querySelectorAll(".chapter").forEach((el) => {
            const tween = gsap.fromTo(
                el,
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 85%", once: true },
                }
            );
            triggers.push(tween.scrollTrigger);
        });
    });

    onDestroy(() => {
        if (!browser) return;
        triggers.forEach((t) => t?.kill());
    });
</script>

<section bind:this={sectionEl} id="experience" class="py-20 lg:py-32 flex flex-col gap-16">
    <div class="flex flex-col gap-3 text-center">
        <p class="text-xs sm:text-sm tracking-[0.3em] text-neon-cyan/70 uppercase">
            &gt; git log --oneline --reverse
        </p>
        <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
            <span class="text-slate-600">//</span> the
            <span class="poppins hero-gradient-text">journey</span> so far
        </h3>
    </div>

    <div class="relative w-full mx-auto max-w-[760px] pl-8 sm:pl-12" id="About">
        <!-- spine -->
        <div
            bind:this={spineEl}
            class="spine-line absolute left-2 sm:left-4 top-0 bottom-0 w-[2px]"
        />

        <div class="flex flex-col gap-14 sm:gap-16">
            {#each chapters as chapter, i}
                <div class="chapter relative">
                    <!-- node -->
                    <span
                        class="timeline-node absolute -left-[30px] sm:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-neon-cyan"
                    />
                    <div class="flex flex-col gap-2">
                        <button
                            type="button"
                            class="flex flex-col gap-2 w-full text-left sm:pointer-events-none sm:cursor-default"
                            on:click={() => toggleChapter(i)}
                            aria-expanded={expandedChapter === i}
                        >
                            <div class="flex items-baseline gap-3 flex-wrap">
                                <span
                                    class="text-neon-violet font-bold text-lg sm:text-xl tracking-widest"
                                    >{chapter.year}</span
                                >
                                <h3 class="text-xl sm:text-2xl font-medium poppins flex-1">
                                    {chapter.title}
                                </h3>
                                <span
                                    class={"sm:hidden text-xs text-neon-cyan/70 duration-200 " +
                                        (expandedChapter === i ? "rotate-180" : "")}
                                >
                                    <i class="fa-solid fa-chevron-down" />
                                </span>
                            </div>
                            <p class="text-sm text-neon-cyan/80">{chapter.place}</p>
                        </button>
                        <div
                            class={(expandedChapter === i ? "flex" : "hidden") +
                                " sm:flex flex-col gap-2"}
                        >
                            <p class="text-slate-300 leading-relaxed max-w-[620px]">
                                {chapter.story}
                            </p>
                            <div class="flex flex-wrap gap-2 mt-1">
                                {#each chapter.chips as chip}
                                    <span
                                        class="px-2.5 py-0.5 text-xs border border-solid border-violet-500/30 bg-violet-950/40 text-violet-300"
                                    >
                                        {chip}
                                    </span>
                                {/each}
                            </div>
                            {#if chapter.link}
                                <a
                                    href={chapter.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 text-sm text-neon-cyan hover:text-neon-cyan-bright duration-200 w-fit mt-1"
                                >
                                    <i class="fa-solid fa-arrow-up-right-from-square text-xs" />
                                    view live product
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
