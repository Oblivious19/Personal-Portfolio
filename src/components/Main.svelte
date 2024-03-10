<script>
    import Step from "./Step.svelte";
    import Footer from "./Footer.svelte";

    let steps = [
        {
            name: "Managed Email Service ",
            icon: "far fa-envelope-open",
            href:"https://github.com/Oblivious19/Managed-Email-Service",
            description:
            "Revolutionizing email management with SMTP, JavaScript, jQuery, and Express APIs. Seamlessly send, receive, and manage emails hassle-free!"        },
        {
            name: "Simon Game",
            icon: " 	fas fa-gamepad",
            href:"https://oblivious19.github.io/Simon-Game/",
            description:
                "Simon says, Follow the lights and sounds, repeat the sequence, and aim for the highest score! Are you up for the challenge?",
        },
        {
            name: "Online Drum Kit",
            icon: "fa-solid fa-diagram-project",
            href:" https://oblivious19.github.io/drum-kit-js/",
            description:
                "Augment your datasets with our filters and dataset manipulations to ensure your models are trained on the highest quality datasets (coming soon).",
        },
    ];

    let benefits = [
        {
            metric: "10x",
            name: "A Self Taught Developer",
            description:
                "I taught myself to code using free online resources and absolutely fell in love with the creativity and problem solving that is involved in developing and engineering innovative new online experiences. Starting of with JavaScript, HTML & CSS and evolving my knowledge base to include JavaScript frameworks, backend programming, design, cloud services and much much more.",
        },
        {
            name: "A Product Design & UX finatic",
            description:
                "Carefully crafting and designing amazing user experiences allows me to express and experiment with every morsel of creativity I have. I love the challenge of learning new design concepts and enabling users with amazing online experiences.",
        },
        {
            name: "An Excellent Communicator",
            description:
                "Communication is key and it's a paramount value of mine. I believe in transparency and constructive communication above all else. This helps me develop deep relationships and ensures my effectiveness and productivity in any work space with any team.",
        },
    ];
</script>

<main class="flex flex-col flex-1 p-4">
    <section
        id="introPage"
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 py-8 sm:py-14"
    >
        <div
            class="flex flex-col lg:justify-center text-center lg:text-left gap-6 md:gap-8 lg:gap-10"
        >
            <h2 class="font-semibold text-4xl sm:text-5xl md:text-6xl">
                Hi! I'm <span class="poppins text-violet-400">Shreya</span> Ojha
                <br />Full Stack
                <span class="poppins text-violet-400">Developer</span>
            </h2>
            <p class="text-base sm:text-lg md:text-xl">
                My <span class="text-violet-400"> favorite tech</span> includes JavaScript
                (React,NEXT.JS or SvelteKit), TailwindCSS, Node.js + Express.js & PostgreSQL
                or MongoDB!
            </p>
            <button
                class="blueShadow mx-auto lg:mr-auto lg:ml-0 text-base sm:text-lg md:text-xl poppins relative overflow-hidden px-6 py-3 group rounded-full bg-white text-slate-950"
            >
                <div
                    class="absolute top-0 right-full w-full h-full bg-violet-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
                />
                <h4 class="relative z-9">Get in touch &rarr;</h4>
            </button>
        </div>
        <div class="relative shadow-2xl grid place-items-center">
            <img
                src={"images/MyProfile.png"}
                alt="My Photo"
                class=" object-cover z-[2] max-h-[70vh]"
            />
        </div>
        <!-- <div  class="flex p-0.5 relative max-w-[700px] w-full mx-auto">
            <div
                class="absolute inset-0 overflow-hidden rounded-md flex items-center justify-center"
            >
                <div
                    class="bg-gradient-to-r absolute inset-[-20px]  from-violet-800 to-indigo-800 specialSpin"
                />
            </div>

            <img
                src={"images/zetane-engine.jpeg"}
                alt="Zetane Engine"
                class="w-full h-full object-cover z-[2]"
            />
        </div> -->
    </section>
    <section class="py-20 lg:py-32 flex flex-col gap-24" id="projects">
        <div class="flex flex-col gap-2 text-center">
            <h6 class="text-large sm:text-xl md:text-2xl">
                A few of my creative endeavors.
            </h6>
            <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
                Curious to <span class="poppins text-violet-400">see</span> my work?
            </h3>
        </div>
        <a
            href="https://github.com/Oblivious19"
            target="_blank"
            class="mx-auto px-4 py-2 rounded-md border border-solid border-white flex items-center gap-2 mb-4 sm:-mb-0 -mt-10 hover:border-violet-700 duration-200"
        >
            <i class=" fab fa-github-alt " />
            <p class="text-lg">GitHub</p>
        </a>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
            <Step step={steps[0]}>
                <p>
                    Revolutionizing email management with <strong
                        class="text-violet-400"
                        >SMTP, JavaScript,NodeJS, jQuery, and Express APIs.</strong
                    >  Seamlessly send, receive, and manage emails hassle-free! 
                </p>
            </Step>
            <Step step={steps[1]}>
                <p>
                    Simon says, <strong 
                        class="text-violet-400"></strong
                    > a fun game created using JavaScript,jQuery
                    <strong class="text-violet-400">Node.js + Express.js and creativity</strong
                    > "Follow the lights and sounds, repeat the sequence, 
                    and aim for the highest score! Are you up for the challenge?
                  
            </Step>
            <Step step={steps[2]}>
                <p>
                    Get ready to rock with my online drum kit! Tap into the beat using  <strong class="text-violet-400"
                        >Express APIs, JavaScript, and jQuery.</strong
                    >
                    It's your turn to drum up some fun—let's make music together! 
                   
                </p>
            </Step>
        </div>
    </section>
    <section
        id="About"
        class="py-20 pt-10 lg:pt-16 lg:py-32 flex flex-col gap-16 sm:gap-20 md:gap-24 relative"
    >
        <!-- <div class="z-[-1] bg-violet-950 w-screen left-1/2 -translate-x-1/2 top-0 h-full absolute"> </div> -->
        <div
            class="flex flex-col gap-2 text-center relative before:absolute before:top-0 before:left-0 before:w-2/3 before:h-1.5 before:bg-violet-700 after:absolute after:bottom-0 after:right-0 after:w-2/3 after:h-1.5 after:bg-violet-700 py-4"
        >
            <h6 class="text-large sm:text-xl md:text-2xl">
                Want to know more?
            </h6>
            <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
                A bit <span class="poppins text-violet-400">about</span> me.
            </h3>
        </div>
        <p class="mx-auto poppins font-semibold text-lg sm:text-xl md:text-2xl">
            I am . . .
        </p>
        <div class="flex flex-col gap-20 w-full mx-auto max-w-[800px]">
            {#each benefits as benefit, index}
                <!-- <div class="flex flex-col gap-2 mx-auto">
                    <div class="flex items-end gap-4">
                        <p
                            class="poppins text-6xl sm:text-7xl md:text-8xl text-slate-500 font-medium"
                        >
                            {benefit.metric}
                        </p>
                        <p
                            class="text-xl sm:text-2xl md:text-3xl capitalize pb-2"
                        >
                            {benefit.name}
                        </p>
                    </div>
                    <p class="text-center italic">- {benefit.description}</p>
                </div> -->
                <div class="flex gap-6 sm:gap-8">
                    <p
                        class="poppins text-4xl sm:text-5xl md:text-6xl text-slate-500 font-semibold"
                    >
                        0{index + 1}
                    </p>
                    <div class="flex flex-col gap-6 sm:gap-8">
                        <h3 class="text-2xl sm:text-3xl md:text-5xl">
                            {benefit.name}
                        </h3>
                        <p>{benefit.description}</p>
                    </div>
                </div>
            {/each}
        </div>
        <h5 class={" text-2xl sm:text-3xl font-semibold text-center poppins "}>
            The <span class="text-violet-400">Complete</span> Package
        </h5>
        <div
            class="flex flex-col overflow-x-scroll gap-10 max-w-[800px] mx-auto w-full"
        >
            <table class="bg-white text-slate-700 rounded text-center">
                <thead class={"border-b border-solid border-slate-200  "}>
                    <tr class="bg-violet-700 text-white items-center whitespace-nowrap p-4 px-8">
                        <th />
                        <th
                            class="bg-violet-700 text-white items-center whitespace-nowrap text-3xl p-4 px-8"
                            >Technical </th
                        >
                        <th class="whitespace-nowrap p-2 px-4 text-3xl">Skills</th>
                        
                        <th class="whitespace-nowrap p-2 px-4"></th>
                        
                        <th class="whitespace-nowrap p-2 px-4"></th>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-solid border-slate-200">
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Programming Language</td
                        >
                        <td><i class=" text-slate-500" />Java</td>
                        <td><i class="text-slate-500" />Python</td>
                        <td><i class=" text-slate-500" />C/C++</td>
                        <td><i class=" text-green-500" />JavaScript</td>
                    </tr>
                    <tr class="border-b border-solid border-slate-200">
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Web Development</td
                        >
                        <td><i class=" text-slate-500" />React</td>
                        <td><i class=" text-slate-500" />SvelteKit</td>
                        <td><i class=" text-slate-500" />NextJs</td>
                        <td><i class=" text-green-500" />Typescript</td>
                    </tr>
                    <tr>
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Data Science</td
                        >
                        <td><i class=" text-slate-500" />Machine learning</td>
                        <td><i class=" text-slate-500" />Statistics</td>
                        <td><i class=" text-slate-500" />Deep Learning</td>
                        <td><i class="text-green-500" />Data Visualization</td>
                    </tr>
                    <tr class="border-t border-solid border-slate-200">
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >UI/UX Design</td
                        >
                        <td><i class=" text-slate-500" />Figma</td>
                        <td><i class=" text-slate-500" />Canva</td>
                        <td><i class=" text-slate-500 ml-" />Adobe Photoshop</td>
                        <td><i class=" text-green-500" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mx-auto -mt-12 italic sm:hidden opacity-50">
            <p>Scroll to see more &rarr;</p>
        </div>
        <p class="mx-auto">So why not invest?</p>
    </section>
</main>