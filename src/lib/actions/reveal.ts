/**
 * Svelte Action: reveal
 *
 * Adds an 'is-visible' class to an element when it enters the viewport.
 * Useful for triggering CSS transitions/animations on scroll.
 */
export function reveal(node: HTMLElement, options: { threshold?: number; rootMargin?: string } = {}) {
    const { threshold = 0.1, rootMargin = '0px' } = options;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    node.classList.add('is-visible');
                    observer.unobserve(node); // Trigger only once
                }
            });
        },
        {
            threshold,
            rootMargin,
        }
    );

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        },
    };
}
