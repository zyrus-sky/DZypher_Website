<script lang="ts">
    import { selectedFanfic } from "$lib/stores";
    import { fade, scale } from "svelte/transition";
    import { typewriter } from "$lib/actions";

    let visible = $state(false);
    let loading = $state(false);
    let content = $state("");
    let theme = $state<"light" | "dark">("dark");

    function toggleTheme() {
        theme = theme === "light" ? "dark" : "light";
    }

    // Svelte 5: Use $effect to subscribe to store
    $effect(() => {
        if ($selectedFanfic) {
            visible = true;
            loadContent($selectedFanfic);
            // Disable body scroll
            document.body.style.overflow = "hidden";
        } else {
            visible = false;
            content = "";
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    });

    function close() {
        $selectedFanfic = null;
    }

    async function loadContent(fic: any) {
        loading = true;
        content = "";

        try {
            if (fic.link.includes("docs.google.com/document/d/")) {
                const match = fic.link.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match && match[1]) {
                    const docId = match[1];
                    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

                    // Try multiple proxies
                    const proxies = [
                        `https://corsproxy.io/?${encodeURIComponent(exportUrl)}`,
                        `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`,
                        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(exportUrl)}`,
                    ];

                    let success = false;
                    for (const proxyUrl of proxies) {
                        try {
                            const res = await fetch(proxyUrl);
                            if (res.ok) {
                                const text = await res.text();
                                // Validate content (Google Docs export failure often returns HTML login page)
                                if (
                                    text.length > 50 &&
                                    !text.trim().startsWith("<!DOCTYPE") &&
                                    !text.includes("Google Accounts")
                                ) {
                                    content = text;
                                    success = true;
                                    break;
                                }
                            }
                        } catch (err) {
                            console.warn(`Proxy failed: ${proxyUrl}`, err);
                        }
                    }

                    if (!success) {
                        throw new Error("All proxies failed to load content");
                    }
                }
            } else {
                // Fallback for non-doc links
                content = fic.description || "No content available.";
            }
        } catch (e) {
            console.error(e);
            content =
                "Failed to load story content. Access restrictions or network issues may be preventing content loading.\n\n" +
                "Please try the external link directly: " +
                fic.link;
        } finally {
            loading = false;
        }
    }
</script>

{#if visible && $selectedFanfic}
    <div
        class="fixed inset-0 z-[200] flex flex-col items-center overflow-y-auto custom-scrollbar transition-colors duration-500 {theme ===
        'light'
            ? 'bg-[#fdfbf7] text-stone-900'
            : 'bg-zinc-950 text-stone-300'}"
        transition:fade={{ duration: 300 }}
        data-lenis-prevent
    >
        <!-- Navbar / Controls -->
        <div
            class="sticky top-0 w-full flex justify-between items-center p-4 md:px-8 border-b z-50 backdrop-blur-md {theme ===
            'light'
                ? 'bg-[#fdfbf7]/80 border-stone-200'
                : 'bg-zinc-950/80 border-white/10'}"
        >
            <h2
                class="font-serif font-bold text-lg md:text-xl truncate max-w-md"
            >
                {$selectedFanfic.title}
            </h2>
            <div class="flex gap-4">
                <button
                    class="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    onclick={toggleTheme}
                    title="Toggle Theme"
                >
                    <i
                        class="fas {theme === 'light'
                            ? 'fa-moon'
                            : 'fa-sun'} text-xl"
                    ></i>
                </button>
                <button
                    class="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    onclick={close}
                    title="Close Reader"
                >
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
        </div>

        <!-- Content Container -->
        <div class="w-full max-w-3xl px-6 py-12 md:py-20 flex-1">
            <!-- Header Info -->
            <div class="text-center mb-16">
                <h1
                    class="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight"
                >
                    {$selectedFanfic.title}
                </h1>
                <p
                    class="font-mono text-sm tracking-widest uppercase opacity-60 mb-8"
                >
                    by {$selectedFanfic.author}
                </p>
                <div
                    class="w-24 h-1 mx-auto rounded-full {theme === 'light'
                        ? 'bg-stone-300'
                        : 'bg-stone-700'}"
                ></div>
            </div>

            <!-- Story Text -->
            {#if loading}
                <div class="flex justify-center py-20">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
                    ></div>
                </div>
            {:else}
                <article
                    class="prose prose-lg md:prose-xl mx-auto font-serif leading-loose whitespace-pre-wrap {theme ===
                    'light'
                        ? 'prose-stone'
                        : 'prose-invert'}"
                >
                    {content}
                </article>

                <div
                    class="mt-24 pt-12 border-t border-white/10 text-center opacity-50 text-sm"
                >
                    <p>End of Story</p>
                    <p class="mt-2">DZypher Fanficx</p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #d6d3cd;
        border-radius: 2px;
    }
</style>
