import { spring } from "svelte/motion";

/**
 * Scroll Reveal Action
 * Adds animation classes when element enters viewport
 */
export function reveal(
    node: HTMLElement,
    {
        threshold = 0.1,
        delay = 0,
        duration = 800,
        y = 20,
        cls = "reveal-active"
    }: {
        threshold?: number;
        delay?: number;
        duration?: number;
        y?: number;
        cls?: string;
    } = {}
) {
    // Set initial state
    node.style.opacity = "0";
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    node.style.opacity = "1";
                    node.style.transform = "translateY(0)";
                    node.classList.add(cls);
                }, delay);
                observer.unobserve(node);
            }
        });
    }, { threshold });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}

/**
 * Typewriter Action
 * Animates text typing effect with blinking cursor
 */
export function typewriter(
    node: HTMLElement,
    {
        speed = 30,
        delay = 0,
        scramble = false
    }: {
        speed?: number;
        delay?: number;
        scramble?: boolean;
    } = {}
) {
    const text = (node.textContent || "").trim();
    if (!text) return;

    node.textContent = "";
    node.style.visibility = "hidden"; // Hide until start

    // Cursor style - using CSS variable for theme
    const cursorColor = "rgb(var(--color-primary-500-rgb))";

    let i = 0;
    let observer: IntersectionObserver;
    let timeoutId: any;
    let intervalId: any;

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            timeoutId = setTimeout(() => {
                node.style.visibility = "visible";
                node.style.borderRight = `2px solid ${cursorColor}`;

                // Blinking cursor animation
                node.animate([
                    { borderColor: 'transparent' },
                    { borderColor: cursorColor },
                    { borderColor: 'transparent' }
                ], {
                    duration: 800,
                    iterations: Infinity
                });

                intervalId = setInterval(() => {
                    if (scramble && i < text.length) {
                        // Show some random characters before the correct one
                        const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                        node.textContent = text.slice(0, i) + randomChar;
                    }

                    node.textContent = text.slice(0, i + 1);
                    i++;

                    if (i > text.length) {
                        clearInterval(intervalId);
                        node.style.borderRight = "none"; // Remove cursor at end
                    }
                }, speed);

            }, delay);
            observer.disconnect();
        }
    });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        }
    };
}

/**
 * Parallax Action
 * Moves element based on scroll position
 */
export function parallax(
    node: HTMLElement,
    {
        factor = 0.1,
        direction = 'up'
    }: {
        factor?: number;
        direction?: 'up' | 'down';
    } = {}
) {
    function update() {
        const scrolled = window.scrollY;
        const rect = node.getBoundingClientRect();
        const elementTop = rect.top + scrolled;

        // Only animate if in view (approximate)
        if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + rect.height + window.innerHeight) {
            const distance = scrolled - elementTop;
            const movement = distance * factor * (direction === 'down' ? 1 : -1);
            node.style.transform = `translateY(${movement}px)`;
        }
    }

    window.addEventListener('scroll', update);
    update(); // Initial calculation

    return {
        destroy() {
            window.removeEventListener('scroll', update);
        }
    };
}
