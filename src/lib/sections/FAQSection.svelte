<script lang="ts">
    import { reveal } from "$lib/actions";
    import { slide } from "svelte/transition";

    const faqs = [
        {
            question: "Who can join DZypher?",
            answer: "Anyone with a passion for data science, AI, and technology! Whether you're a beginner just starting out or a pro looking to collaborate, there's a place for you here.",
        },
        {
            question: "How do I register for events?",
            answer: "You can register for our workshops and events through the 'Programs' section on this website. We usually use platforms like MakeMyPass for ticketing.",
        },
        {
            question: "Is membership free?",
            answer: "Yes, joining the DZypher community on Discord and attending most online sessions is free. Some workshops and offline events may have a nominal fee to cover logistics.",
        },
        {
            question: "Can I contribute to open source projects?",
            answer: "Absolutely! We encourage members to contribute to our open-source repositories on GitHub. Check out the 'Showcase' section to see what we're building.",
        },
        {
            question: "What is VORTIX?",
            answer: "VORTIX is our flagship annual tech fest featuring datathons, coding competitions, workshops, and more. It's the highlight of our year!",
        },
    ];

    let openIndex = 0;

    function toggle(index: number) {
        openIndex = openIndex === index ? -1 : index;
    }
</script>

<div
    class="min-h-[60vh] py-24 px-6 flex flex-col items-center justify-center relative"
>
    <div class="container mx-auto max-w-3xl relative z-10">
        <h2
            use:reveal
            class="reveal-fade-up text-4xl font-bold text-center mb-16 text-white"
        >
            Frequently Asked <span class="text-primary-500">Questions</span>
        </h2>

        <div class="space-y-4">
            {#each faqs as faq, i}
                <div
                    use:reveal
                    class="reveal-fade-up border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-colors hover:border-primary-500/30"
                    style="transition-delay: {i * 100}ms"
                >
                    <button
                        class="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                        on:click={() => toggle(i)}
                    >
                        <span class="font-semibold text-lg text-stone-200"
                            >{faq.question}</span
                        >
                        <i
                            class="fas fa-chevron-down text-stone-500 transition-transform duration-300 {openIndex ===
                            i
                                ? 'rotate-180 text-primary-500'
                                : ''}"
                        ></i>
                    </button>

                    {#if openIndex === i}
                        <div
                            transition:slide={{ duration: 300 }}
                            class="px-6 pb-6 text-stone-400 leading-relaxed"
                        >
                            {faq.answer}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>
