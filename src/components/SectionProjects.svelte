<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Step from "./Step.svelte";

    let sectionEl;
    let triggers = [];

    const steps = [
        {
            name: "Query2Map",
            subtitle: "NPTEL Research · IIT Ropar",
            icon: "fa-solid fa-brain",
            liveUrl: "https://query-2map-frontend-cm4w.onrender.com/",
            accent: "violet",
            badge: "Live Product",
            stats: ["85% answer accuracy", "AI-powered learning", "Graph-based DSA"],
            tags: ["MERN", "Ollama Mistral", "NLP", "Express.js"],
        },
        {
            name: "Supriyapa",
            subtitle: "Freelance · E-commerce Platform",
            icon: "fa-solid fa-cart-shopping",
            liveUrl: "https://supriyapa.com/",
            accent: "rose",
            badge: "Live Store",
            stats: ["200+ users", "20% less cart drop-off", "Full admin panel"],
            tags: ["React", "Node.js", "MongoDB", "Razorpay", "JWT"],
        },
        {
            name: "ConsumeWise",
            subtitle: "Personal Project · AI Health",
            icon: "fa-solid fa-barcode",
            liveUrl: "https://consumewise-six.vercel.app/",
            githubUrl: "https://github.com/Oblivious19/ConsumeWise",
            accent: "emerald",
            badge: "Live Product",
            stats: ["95% scan accuracy", "85%+ product coverage", "OCR + ML"],
            tags: ["Python", "OCR", "Machine Learning", "Next.js"],
        },
    ];

    onMount(() => {
        if (!browser) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;

        gsap.registerPlugin(ScrollTrigger);

        const cards = sectionEl.querySelectorAll(".case-card");
        cards.forEach((card, i) => {
            const tween = gsap.fromTo(
                card,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 88%",
                        once: true,
                    },
                }
            );
            triggers.push(tween.scrollTrigger);
        });

        const heading = sectionEl.querySelector(".section-heading");
        const tw = gsap.fromTo(
            heading,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: heading, start: "top 90%", once: true },
            }
        );
        triggers.push(tw.scrollTrigger);
    });

    onDestroy(() => {
        if (!browser) return;
        triggers.forEach((t) => t?.kill());
    });
</script>

<section bind:this={sectionEl} class="py-20 lg:py-32 flex flex-col gap-16" id="projects">
    <div class="section-heading flex flex-col gap-3 text-center">
        <p class="text-xs sm:text-sm tracking-[0.3em] text-neon-cyan/70 uppercase">
            &gt; ls ~/projects --live
        </p>
        <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
            <span class="text-slate-600">//</span> deployed to
            <span class="poppins hero-gradient-text">production</span>
        </h3>
        <p class="text-slate-400 max-w-xl mx-auto">
            Real products, real users — shipped end-to-end, not tutorial clones.
        </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
        <div class="case-card">
            <Step step={steps[0]}>
                <p>
                    Built during my <strong class="text-violet-400">NPTEL internship at IIT Ropar</strong>,
                    Query2Map maps your questions to a graph-based DSA ontology and serves ranked,
                    personalized learning content — try it live.
                </p>
            </Step>
        </div>
        <div class="case-card">
            <Step step={steps[1]}>
                <p>
                    A live <strong class="text-rose-400">e-commerce clothing store</strong>
                    I built end-to-end — browse products, checkout with Razorpay, and manage everything
                    from a custom admin panel.
                </p>
            </Step>
        </div>
        <div class="case-card">
            <Step step={steps[2]}>
                <p>
                    An <strong class="text-emerald-400">AI food label scanner</strong> using OCR and ML
                    to scan barcodes and deliver nutrition insights with 95% accuracy — deployed
                    and live on Vercel.
                </p>
            </Step>
        </div>
    </div>

    <a
        href="https://github.com/Oblivious19"
        target="_blank"
        rel="noopener noreferrer"
        class="mx-auto px-5 py-2.5 border border-solid border-slate-700 flex items-center gap-2 hover:border-neon-cyan/60 hover:text-neon-cyan hover:neon-glow-cyan duration-200"
    >
        <i class="fab fa-github-alt" />
        <p class="text-base sm:text-lg">cat more_work.md → GitHub</p>
    </a>
</section>
