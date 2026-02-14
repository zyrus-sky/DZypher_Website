<script lang="ts">
    import { onMount } from "svelte";

    // Props using Svelte 5 syntax
    let {
        text = "DZypher",
        duration = 1000,
        className = "",
    }: {
        text?: string;
        duration?: number;
        className?: string;
    } = $props();

    let displayText = $state(text);
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let interval: any;
    let running = false;

    function scramble() {
        if (running) return;
        running = true;

        let iteration = 0;
        clearInterval(interval);

        interval = setInterval(() => {
            displayText = text
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iteration >= text.length) {
                clearInterval(interval);
                running = false;
            }

            iteration += 1 / 3; // Controls speed of reveal
        }, 30);
    }

    onMount(() => {
        scramble();
    });
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<span class={className} onmouseover={scramble} role="term" aria-label={text}>
    {displayText}
</span>
