<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";

    let article;

    onMount(() => {
        if (!browser) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced || !article) return;
        gsap.fromTo(
            article.children,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
        );
    });
</script>

<svelte:head>
    <title>How I landed my IIT Ropar research internship — Shreya Ojha</title>
    <meta
        name="description"
        content="The story behind my NPTEL research internship at IIT Ropar and building Query2Map, an AI-powered learning platform."
    />
</svelte:head>

<main class="flex flex-col flex-1 px-4 py-10 sm:py-16 max-w-[720px] mx-auto w-full">
    <div bind:this={article} class="flex flex-col gap-8">
        <a
            href="/"
            class="text-sm text-slate-400 hover:text-neon-cyan duration-200 w-fit"
        >
            &larr; cd ~/home
        </a>

        <div class="flex flex-col gap-3">
            <p class="text-xs sm:text-sm tracking-[0.25em] uppercase text-neon-cyan/70">
                &gt; cat blog/iit-ropar.md
            </p>
            <h1 class="font-semibold text-3xl sm:text-4xl md:text-5xl poppins leading-tight">
                How I landed my
                <span class="hero-gradient-text">IIT Ropar</span> research internship
            </h1>
            <p class="text-sm text-slate-500">
                May – July 2025 · NPTEL · Prof. Sudarshan Iyengar's group · ~4 min read
            </p>
        </div>

        <div class="glitch-divider w-full" aria-hidden="true" />

        <div class="flex flex-col gap-6 text-slate-300 leading-relaxed text-base sm:text-lg">
            <p>
                In the summer of 2025 I spent three months as an NPTEL research intern at
                <strong class="text-neon-violet">IIT Ropar</strong>, working under
                Prof. Sudarshan Iyengar. This is the short version of how I got there, what I
                built, and what I'd tell anyone trying to land a research internship as an
                undergrad.
            </p>

            <h2 class="text-xl sm:text-2xl font-medium poppins text-slate-100 mt-2">
                <span class="text-neon-cyan">##</span> Getting in
            </h2>
            <p>
                There was no secret referral. I had been taking NPTEL courses seriously —
                seriously enough to land in the <strong class="text-neon-cyan">top 5%</strong> in
                Cloud Computing — and when the NPTEL internship applications opened, my course
                record did the talking. If you're an undergrad in India, this path is genuinely
                underrated: the courses are free, the certificates are proctored, and professors
                actually look at them.
            </p>

            <h2 class="text-xl sm:text-2xl font-medium poppins text-slate-100 mt-2">
                <span class="text-neon-cyan">##</span> What I built: Query2Map
            </h2>
            <p>
                My project was <strong class="text-neon-violet">Query2Map</strong> — an
                AI-powered learning platform that takes a student's natural-language question
                ("how do I know when to use a heap?") and maps it onto a graph-based ontology of
                DSA concepts, then serves back a ranked, personalized learning path with curated
                videos and articles.
            </p>
            <p>
                The stack: <strong>MERN</strong> end to end, with
                <strong>Ollama Mistral</strong> running the language model locally,
                <strong>NLP</strong> for query understanding, and the YouTube + SERP APIs for
                real-time content. I engineered the Express.js API layer and got answer accuracy
                to <strong class="text-neon-cyan">85%</strong> against our evaluation set.
            </p>

            <h2 class="text-xl sm:text-2xl font-medium poppins text-slate-100 mt-2">
                <span class="text-neon-cyan">##</span> What research taught me that shipping didn't
            </h2>
            <p>
                I came in as someone who shipped products — I left as someone who
                <em>measures</em> them. In freelance work, "it works" is the finish line. In a
                research group, "it works" is where the questions start: works compared to what?
                On which queries does it fail? Why 85% and not 95%? That habit of instrumenting
                and interrogating everything followed me back into every project since.
            </p>

            <h2 class="text-xl sm:text-2xl font-medium poppins text-slate-100 mt-2">
                <span class="text-neon-cyan">##</span> Advice if you want this
            </h2>
            <ul class="flex flex-col gap-2 list-disc pl-5">
                <li>Treat NPTEL courses as a portfolio, not a checkbox — rank matters.</li>
                <li>Have one real project you can demo live before you apply.</li>
                <li>
                    In research, write down what you tried and why it failed — your professor
                    cares about the process as much as the result.
                </li>
            </ul>
        </div>

        <a
            href="https://query-2map-frontend-cm4w.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-2.5 w-fit px-5 py-2.5 rounded-full border border-violet-500/40 bg-violet-950/30 text-sm sm:text-base text-violet-200 hover:border-neon-violet hover:neon-glow-violet duration-200"
        >
            <span class="status-pulse inline-block w-1.5 h-1.5 rounded-full bg-neon-violet" />
            Try Query2Map live
            <span class="group-hover:translate-x-0.5 duration-200">→</span>
        </a>

        <div class="glitch-divider w-full" aria-hidden="true" />

        <p class="text-sm text-slate-500">
            <span class="text-neon-cyan/70">&gt;</span> written by Shreya Ojha ·
            <a href="/#footer" class="text-neon-cyan hover:text-neon-cyan-bright duration-200"
                >Open_channel()</a
            >
        </p>
    </div>
</main>
