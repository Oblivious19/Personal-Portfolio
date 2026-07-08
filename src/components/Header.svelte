<script>
    export let y;

    export let tabs = [
        { name: "projects", link: "/#projects" },
        { name: "journey", link: "/#experience" },
        { name: "skills", link: "/#skills" },
    ];
</script>

<header
    class={"sticky z-[30] top-0 duration-200 px-6 flex items-center justify-between border-b border-solid " +
        (y > 0
            ? " py-4 bg-noir-950/90 backdrop-blur border-violet-950"
            : " py-6 bg-transparent border-transparent")}
>
    <a href="/" class="text-base sm:text-lg font-medium hover:opacity-80 duration-200" aria-label="Home">
        <span class="text-neon-cyan/80">~/</span><span class="text-slate-200">shreya-ojha</span>
        <span class="text-neon-violet">$</span><span class="terminal-caret text-slate-500">_</span>
    </a>
    <div class="sm:flex items-center gap-5 hidden">
        {#each tabs as tab}
            <a
                href={tab.link}
                class="group text-sm duration-200 hover:text-neon-cyan text-slate-400"
                target={tab.external ? "_blank" : undefined}
                rel={tab.external ? "noopener noreferrer" : undefined}
            >
                <span class="text-neon-violet/0 group-hover:text-neon-violet/90 duration-200">[</span
                >{tab.name}<span
                    class="text-neon-violet/0 group-hover:text-neon-violet/90 duration-200">]</span
                >
            </a>
        {/each}
        <a
            href="/#footer"
            class="relative overflow-hidden px-5 py-2 group border border-solid border-neon-cyan/40 text-neon-cyan text-sm hover:neon-glow-cyan hover:border-neon-cyan/80 duration-200"
        >
            Open_channel()
        </a>
    </div>
</header>
