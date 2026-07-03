<script>
    import Mascot3D from "./Mascot3D.svelte";

    const channels = [
        {
            label: "email",
            value: "shreyaojha2@gmail.com",
            href: "mailto:shreyaojha2@gmail.com",
            icon: "fa-solid fa-envelope",
        },
        {
            label: "github",
            value: "Oblivious19",
            href: "https://github.com/Oblivious19",
            icon: "fab fa-github",
        },
        {
            label: "linkedin",
            value: "shreya-ojha",
            href: "https://www.linkedin.com/in/shreya-ojha-a9548a218/",
            icon: "fab fa-linkedin",
        },
        {
            label: "x",
            value: "@Oblivious9021",
            href: "https://x.com/Oblivious9021",
            icon: "fab fa-x-twitter",
        },
        {
            label: "resume",
            value: "download.pdf",
            href: "/Shreya_Ojha_Resume.pdf",
            icon: "fa-solid fa-file-arrow-down",
        },
    ];
</script>

<footer
    class="py-20 sm:py-28 bg-noir-950 border-t border-solid border-violet-950 flex flex-col gap-10 justify-center items-center px-4"
    id="footer"
>
    <div class="flex flex-col gap-3 text-center">
        <p class="text-xs sm:text-sm tracking-[0.3em] text-neon-cyan/70 uppercase">
            &gt; open_channel --secure
        </p>
        <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
            <span class="text-slate-600">//</span> let's
            <span class="poppins hero-gradient-text">build</span> something
        </h3>
        <p class="text-slate-400 max-w-md mx-auto">
            Founder with an idea? Team that ships? The channel is open — response time is fast.
        </p>
    </div>

    <div
        class="hud-frame relative w-full max-w-[560px] border border-solid border-violet-500/25 bg-noir-900/80 p-6 sm:p-8 flex flex-col gap-4"
    >
        <div class="hud-corners absolute inset-0 pointer-events-none" />
        <div class="flex items-center gap-1.5 border-b border-violet-500/20 pb-3 -mx-2 px-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <span class="ml-2 text-[10px] sm:text-xs opacity-50">shreya@mumbai ~ contact</span>
        </div>

        {#each channels as ch}
            <a
                href={ch.href}
                target={ch.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                class="group flex items-center gap-3 text-sm sm:text-base hover:translate-x-1 duration-200"
            >
                <span class="text-neon-cyan/70 w-24 shrink-0">[{ch.label}]</span>
                <i class={ch.icon + " text-neon-violet w-5 text-center"} />
                <span class="text-slate-300 group-hover:text-neon-cyan duration-200"
                    >{ch.value}</span
                >
                <i
                    class="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-70 duration-200 text-neon-cyan"
                />
            </a>
        {/each}

        <p class="text-xs text-slate-600 pt-2 border-t border-violet-500/10">
            loc: Mumbai, India · timezone: IST (UTC+5:30)
        </p>
    </div>

    <!-- mascot cameo -->
    <div class="w-[180px] h-[180px] opacity-80" aria-hidden="true">
        <Mascot3D size="sm" />
    </div>

    <p class="text-xs text-slate-600">
        © {new Date().getFullYear()} Shreya Ojha · built with SvelteKit + Three.js ·
        <span class="text-neon-violet/60">no templates were harmed</span>
    </p>
</footer>
