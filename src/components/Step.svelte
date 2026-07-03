<script>
    export let step;

    // mobile: details collapsed until tapped; desktop always expanded via sm:block
    let expanded = false;

    const accents = {
        violet: {
            border: "border-violet-500/25 group-hover:border-violet-400/70",
            glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]",
            icon: "text-violet-400",
            tag: "bg-violet-950/60 text-violet-300 border-violet-500/30",
            btn: "bg-violet-600 hover:bg-violet-500",
            stat: "text-violet-400",
            label: "text-violet-400/70",
        },
        emerald: {
            border: "border-emerald-500/25 group-hover:border-emerald-400/70",
            glow: "group-hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]",
            icon: "text-emerald-400",
            tag: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
            btn: "bg-emerald-600 hover:bg-emerald-500",
            stat: "text-emerald-400",
            label: "text-emerald-400/70",
        },
        rose: {
            border: "border-rose-500/25 group-hover:border-rose-400/70",
            glow: "group-hover:shadow-[0_0_40px_rgba(251,113,133,0.2)]",
            icon: "text-rose-400",
            tag: "bg-rose-950/60 text-rose-300 border-rose-500/30",
            btn: "bg-rose-600 hover:bg-rose-500",
            stat: "text-rose-400",
            label: "text-rose-400/70",
        },
    };

    $: accent = accents[step.accent || "violet"];
</script>

<article
    class={"hud-frame group relative flex flex-col gap-5 p-5 sm:p-7 border border-solid bg-noir-900/70 backdrop-blur-sm duration-300 " +
        accent.border +
        " " +
        accent.glow}
>
    <div class="hud-corners absolute inset-0 pointer-events-none" />

    <div class={"text-[10px] tracking-[0.25em] uppercase " + accent.label}>
        // case-file
        {#if step.badge}
            <span class="float-right flex items-center gap-1.5 normal-case tracking-normal">
                {#if step.liveUrl}
                    <span class="relative flex h-1.5 w-1.5">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                        />
                        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                {/if}
                {step.badge}
            </span>
        {/if}
    </div>

    <button
        type="button"
        class="flex items-start gap-4 w-full text-left sm:pointer-events-none sm:cursor-default"
        on:click={() => (expanded = !expanded)}
        aria-expanded={expanded}
    >
        <div
            class={"grid place-items-center w-14 h-14 sm:w-16 sm:h-16 bg-noir-800 border border-solid border-slate-800 text-2xl sm:text-3xl shrink-0 duration-300 group-hover:scale-110 " +
                accent.icon}
        >
            <i class={step.icon} />
        </div>
        <div class="flex flex-col gap-1 text-left flex-1">
            <h3 class="font-semibold text-xl sm:text-2xl poppins">{step.name}</h3>
            {#if step.subtitle}
                <p class="text-sm opacity-60">{step.subtitle}</p>
            {/if}
        </div>
        <span
            class={"sm:hidden text-xs mt-2 duration-200 " +
                accent.icon +
                (expanded ? " rotate-180" : "")}
        >
            <i class="fa-solid fa-chevron-down" />
        </span>
    </button>

    <div class={(expanded ? "flex" : "hidden") + " sm:flex flex-col gap-5 flex-1"}>
        <div class="text-left text-sm sm:text-base leading-relaxed opacity-90">
            <slot />
        </div>

        {#if step.stats?.length}
            <div class="flex flex-wrap gap-2">
                {#each step.stats as stat}
                    <span
                        class={"px-3 py-1 text-xs sm:text-sm font-medium bg-noir-800 border border-solid border-slate-800 " +
                            accent.stat}
                    >
                        {stat}
                    </span>
                {/each}
            </div>
        {/if}

        {#if step.tags?.length}
            <div class="flex flex-wrap gap-2">
                {#each step.tags as tag}
                    <span class={"px-2.5 py-0.5 text-xs border border-solid " + accent.tag}>
                        {tag}
                    </span>
                {/each}
            </div>
        {/if}

        <div class="flex flex-wrap gap-3 mt-auto pt-2">
            {#if step.liveUrl}
                <a
                    href={step.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class={"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white duration-200 " +
                        accent.btn}
                >
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs" />
                    Live Demo
                </a>
            {/if}
            {#if step.githubUrl}
                <a
                    href={step.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-solid border-slate-700 hover:border-neon-cyan/60 hover:text-neon-cyan duration-200"
                >
                    <i class="fab fa-github" />
                    Source
                </a>
            {/if}
        </div>
    </div>

    <p class={"sm:hidden text-[10px] tracking-widest opacity-40 " + (expanded ? "hidden" : "")}>
        [ tap for details ]
    </p>
</article>
