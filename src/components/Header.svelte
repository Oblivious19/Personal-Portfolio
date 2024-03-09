


<script>
 import response from 'express/lib/response';
 const { redirect } = response;
  import Techfolio from "./Techfolio.svelte";
  

    export let y;

    export let tabs=[
        {name:'Projects',link:'#projects'},
        {name:'About',link:'#About'},
        {name:'LinkedIn',link:'https://www.linkedin.com/in/shreya-ojha-a9548a218/'},
        {name:'Resume',link:'file:///C:/Users/shrey/OneDrive/Desktop/ShreyaOjha_Resume_updated.pdf'}
    ];
</script>

<header
    class={"sticky z-[10] top-0 duration-200 px-6 flex items-center justify-between border-b border-solid " +
        (y > 0
            ? " py-4 bg-slate-950 border-violet-950"
            : " py-6 bg-transparent border-transparent")}
>
    <h1 class="  text-xl font-medium">
        <b class=" font-semibold poppins">Shreya</b> <span class="poppins font">Ojha</span>
    </h1>
    <div class="sm:flex items-center gap-4 hidden">
        {#each tabs as tab, index}
            <a
                href={tab.link}
                class="duration-200 hover:text-violet-400"
                target={index === 2 ? "_blank" : ""}
            >
                <p>{tab.name}</p>
            </a>
        {/each}
        <button 
            class="blueShadow relative overflow-hidden px-5 py-2 group rounded-full bg-violet-600 text-white"
        >
            <div
                class="absolute top-0 right-full w-full h-full bg-violet-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
            />
            <h4 class="relative z-9 ">Techfolio</h4>
        </button>
        <button
            class="blueShadow relative overflow-hidden px-5 py-2 group rounded-full bg-white text-slate-950"
        >
            <div
                class="absolute top-0 right-full w-full h-full bg-violet-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
            />
           <a href="footer"> <h4 class="relative z-9">Get in touch</h4></a>
        </button>
    </div>
</header>