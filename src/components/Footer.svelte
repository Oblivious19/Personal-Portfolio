<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    // quiet visitor counter (Abacus — free, no-signup). Increments once per
    // tab session in production; dev only reads. Hidden until the count loads.
    let views = null;
    onMount(async () => {
        const key = "shreya-ojha-portfolio/site-views";
        const counted = sessionStorage.getItem("viewCounted");
        const action = dev || counted ? "get" : "hit";
        try {
            const res = await fetch(`https://abacus.jasoncameron.dev/${action}/${key}`);
            const data = await res.json();
            if (typeof data.value === "number") {
                views = data.value;
                if (action === "hit") sessionStorage.setItem("viewCounted", "1");
            }
        } catch {
            // counter is decorative — fail silently
        }
    });

    const socials = [
        { label: "GitHub", href: "https://github.com/Oblivious19", icon: "fab fa-github" },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/shreya-ojha-a9548a218/",
            icon: "fab fa-linkedin-in",
        },
        { label: "X", href: "https://x.com/Oblivious9021", icon: "fab fa-x-twitter" },
    ];

    const nav = [
        { label: "projects", href: "/#projects" },
        { label: "journey", href: "/#experience" },
        { label: "skills", href: "/#skills" },
        { label: "blog", href: "/blog/iit-ropar" },
    ];
</script>

<footer
    id="footer"
    class="relative border-t border-solid border-violet-950 bg-gradient-to-b from-noir-950 via-noir-900 to-noir-950 overflow-hidden"
>
    <!-- ambient glow -->
    <div
        class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse 70% 55% at 50% 110%, rgba(139, 92, 246, 0.16) 0%, rgba(244, 114, 182, 0.06) 45%, transparent 75%);"
        aria-hidden="true"
    />

    <div class="relative max-w-[1100px] mx-auto px-6 sm:px-10 py-20 sm:py-28 flex flex-col gap-14">
        <!-- big invitation -->
        <div class="flex flex-col gap-5 text-center sm:text-left">
            <p class="text-xs sm:text-sm tracking-[0.3em] uppercase text-neon-cyan/70">
                // next project could be yours
            </p>
            <h3
                class="poppins font-semibold text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight"
            >
                Have an idea?
                <br />
                <span class="hero-gradient-text">Let's make it real.</span>
            </h3>
        </div>

        <!-- giant email — the one action that matters -->
        <a
            href="mailto:shreyaojha2@gmail.com"
            class="group w-fit mx-auto sm:mx-0 flex flex-wrap items-center gap-3 sm:gap-5"
        >
            <span
                class="text-lg sm:text-3xl md:text-4xl text-slate-200 group-hover:text-neon-cyan duration-300 border-b border-slate-700 group-hover:border-neon-cyan pb-1.5 break-all"
            >
                shreyaojha2@gmail.com
            </span>
            <span
                class="grid place-items-center w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-neon-cyan/50 text-neon-cyan group-hover:bg-neon-cyan/10 group-hover:neon-glow-cyan group-hover:-rotate-45 duration-300 shrink-0"
            >
                <i class="fa-solid fa-arrow-right" />
            </span>
        </a>

        <!-- links row -->
        <div
            class="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-10 pt-6 border-t border-solid border-violet-500/15"
        >
            <nav class="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm">
                {#each nav as item}
                    <a
                        href={item.href}
                        class="text-slate-400 hover:text-neon-cyan duration-200"
                    >
                        /{item.label}
                    </a>
                {/each}
                <a
                    href="/Shreya_Ojha_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-neon-violet hover:text-neon-violet-bright duration-200"
                >
                    /resume.pdf ↓
                </a>
            </nav>

            <div class="flex items-center gap-3">
                {#each socials as s}
                    <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        class="w-11 h-11 rounded-full border border-slate-700 grid place-items-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/60 hover:neon-glow-cyan duration-200"
                    >
                        <i class={s.icon} />
                    </a>
                {/each}
            </div>
        </div>

        <!-- bottom bar -->
        <div
            class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600"
        >
            <p>
                © {new Date().getFullYear()} Shreya Ojha · Mumbai, India · IST (UTC+5:30){#if views !== null}
                    · <span class="text-slate-600/90">viewers: {views.toLocaleString("en-IN")}</span>{/if}
            </p>
            <p>
                built with <span class="text-neon-violet/70">SvelteKit + Three.js</span> ·
                <span class="text-neon-cyan/60">no templates were harmed</span>
            </p>
        </div>
    </div>
</footer>
