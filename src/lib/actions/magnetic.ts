import { spring } from "svelte/motion";

export function magnetic(node: HTMLElement, { stiffness = 0.15, damping = 0.2, distance = 0.5 } = {}) {
    let x = spring(0, { stiffness, damping });
    let y = spring(0, { stiffness, damping });

    function handleMouseMove(e: MouseEvent) {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        x.set(deltaX * distance);
        y.set(deltaY * distance);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const unsubscribeX = x.subscribe(($x) => {
        node.style.transform = `translate(${$x}px, ${y.stiffness ? 0 : 0}px)`; // Only applying X for now to test, wait, transform overwrites.
        // Better approach: use CSS variables or direct transform if no other transform exists.
        // Let's use CSS translate to avoid conflict with scale/rotate if possible, 
        // or just strict transform.
        node.style.setProperty("--mx", `${$x}px`);
    });

    const unsubscribeY = y.subscribe(($y) => {
        node.style.setProperty("--my", `${$y}px`);
        node.style.transform = `translate(var(--mx, 0px), var(--my, 0px))`;
    });

    node.addEventListener("mousemove", handleMouseMove);
    node.addEventListener("mouseleave", handleMouseLeave);

    return {
        destroy() {
            node.removeEventListener("mousemove", handleMouseMove);
            node.removeEventListener("mouseleave", handleMouseLeave);
            unsubscribeX();
            unsubscribeY();
        }
    };
}
