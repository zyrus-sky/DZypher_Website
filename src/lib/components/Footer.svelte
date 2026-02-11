<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import { SOCIALS } from "$lib/data";
    import { reveal } from "$lib/actions";

    const links = [
        { label: "Home", href: "#home" },
        { label: "Programs", href: "#events" },
        { label: "Roadmap", href: "#roadmap" },
        { label: "Showcase", href: "#gallery" },
        { label: "Team", href: "#team" },
    ];

    let email = "";
    let isSubscribed = false;

    function handleSubscribe() {
        if (email) {
            // Simulate API call
            setTimeout(() => {
                isSubscribed = true;
                email = "";
            }, 1000);
        }
    }
</script>

<footer
    class="pt-24 pb-12 px-6 bg-black border-t border-white/10 relative overflow-hidden"
>
    <!-- Background Elements -->
    <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
    ></div>
    <div
        class="absolute -top-20 -left-20 w-64 h-64 bg-primary-900/20 rounded-full blur-[100px]"
    ></div>
    <div
        class="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-900/20 rounded-full blur-[100px]"
    ></div>

    <div class="container mx-auto max-w-6xl relative z-10">
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
            <!-- Brand -->
            <div class="space-y-6">
                <div class="w-32">
                    <Logo className="w-full" />
                </div>
                <p class="text-stone-400 text-sm leading-relaxed">
                    Fostering a community of innovators, builders, and dreamers.
                    Join us in shaping the future of technology.
                </p>
                <div class="flex gap-4">
                    {#each Object.entries(SOCIALS) as [key, url]}
                        <a
                            href={url}
                            target="_blank"
                            class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-primary-600 transition-all"
                        >
                            <i class="fab fa-{key}"></i>
                        </a>
                    {/each}
                </div>
            </div>

            <!-- Links -->
            <div>
                <h3 class="text-white font-bold mb-6">Quick Links</h3>
                <ul class="space-y-3">
                    {#each links as link}
                        <li>
                            <a
                                href={link.href}
                                class="text-stone-400 hover:text-primary-400 transition-colors text-sm"
                            >
                                {link.label}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- Resources -->
            <div>
                <h3 class="text-white font-bold mb-6">Resources</h3>
                <ul class="space-y-3">
                    <li>
                        <a
                            href="javascript:void(0)"
                            class="text-stone-400 hover:text-primary-400 transition-colors text-sm"
                            >Blog</a
                        >
                    </li>
                    <li>
                        <a
                            href="javascript:void(0)"
                            class="text-stone-400 hover:text-primary-400 transition-colors text-sm"
                            >Documentation</a
                        >
                    </li>
                    <li>
                        <a
                            href="javascript:void(0)"
                            class="text-stone-400 hover:text-primary-400 transition-colors text-sm"
                            >Privacy Policy</a
                        >
                    </li>
                    <li>
                        <a
                            href="javascript:void(0)"
                            class="text-stone-400 hover:text-primary-400 transition-colors text-sm"
                            >Terms of Service</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Newsletter -->
            <div>
                <h3 class="text-white font-bold mb-6">Stay Updated</h3>
                <p class="text-stone-400 text-sm mb-4">
                    Subscribe to our newsletter for the latest updates and event
                    announcements.
                </p>
                <form
                    on:submit|preventDefault={handleSubscribe}
                    class="space-y-3"
                >
                    <input
                        type="email"
                        bind:value={email}
                        placeholder="Enter your email"
                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        class="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                    >
                        {isSubscribed ? "Subscribed!" : "Subscribe"}
                    </button>
                </form>
            </div>
        </div>

        <div
            class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500"
        >
            <p>
                &copy; {new Date().getFullYear()} DZypher. All rights reserved.
            </p>
            <p>Designed & Built with ❤️ by the DZypher Web Team.</p>
        </div>
    </div>
</footer>
