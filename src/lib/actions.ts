/**
 * Reveal on Scroll Action
 * Adds 'animate-fade-in-up' class when element enters viewport.
 */
export function reveal(node: HTMLElement, { threshold = 0.1, root = null }: { threshold?: number, root?: HTMLElement | null } = {}) {
    node.classList.add("opacity-0", "translate-y-4"); // Initial state
    node.style.transition = "opacity 0.7s, transform 0.7s"; // Ensure default transition exists if not in class

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    node.classList.remove("opacity-0", "translate-y-4");
                    node.classList.add("animate-fade-in-up");
                    observer.unobserve(node);
                }
            });
        },
        {
            root,
            threshold,
        }
    );

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        },
    };
}

/**
 * Typewriter Action
 * Types out text character by character when element enters viewport.
 */
export function typewriter(node: HTMLElement, { speed = 30, delay = 0 }: { speed?: number, delay?: number } = {}) {
    // Only run if text content exists and isn't empty
    const text = (node.textContent || "").trim();
    if (!text) return;

    node.textContent = "";
    node.style.visibility = "hidden"; // Hide initially until running to prevent flash

    let i = 0;
    let running = false;
    let timeoutId: any;
    let intervalId: any;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !running) {
                running = true;

                timeoutId = setTimeout(() => {
                    node.style.visibility = "visible";
                    node.style.borderRight = "2px solid #7f1d1d"; // Cursor

                    intervalId = setInterval(() => {
                        node.textContent = text.slice(0, i + 1);
                        i++;
                        if (i > text.length) {
                            clearInterval(intervalId);
                            node.style.borderRight = "none";
                        }
                    }, speed);

                }, delay);

                observer.unobserve(node);
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        }
    }
}
