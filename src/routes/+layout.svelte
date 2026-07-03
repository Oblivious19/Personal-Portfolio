<script>
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import Loader from "../components/Loader.svelte";
    import { loaderDone } from "$lib/loader.js";
    import "../app.css";
    let y;
    let innerWidth = 0;
    let innerHeight = 0;

    function goTop() {
        document.body.scrollIntoView();
    }
</script>

<Loader on:done={() => loaderDone.set(true)} />

<!-- CRT overlay: scanlines + vignette -->
<div class="noir-scanlines fixed inset-0 z-[40] pointer-events-none" aria-hidden="true" />
<div class="noir-vignette fixed inset-0 z-[39] pointer-events-none" aria-hidden="true" />

<div
    class="container relative flex flex-col max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen"
>
    <div
        class={"fixed bottom-0 w-full duration-200 flex p-10 z-[10] " +
            (y > 0
                ? " opacity-full pointer-events-auto"
                : " pointer-events-none opacity-0")}
    >
        <button
            on:click={goTop}
            aria-label="Back to top"
            class="ml-auto rounded-md bg-noir-800 border border-neon-violet/30 text-neon-cyan px-3 sm:px-4 hover:border-neon-cyan/60 hover:neon-glow-cyan duration-200 cursor-pointer aspect-square grid place-items-center"
        >
            <i class="fa-solid fa-arrow-up" />
        </button>
    </div>
    <Header {y} />
    <slot />
    <Footer />
</div>
<svelte:window bind:scrollY={y} bind:innerHeight bind:innerWidth />