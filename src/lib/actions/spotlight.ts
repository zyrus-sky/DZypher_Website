export function spotlight(node: HTMLElement) {
    function handleMouseMove(e: MouseEvent) {
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        node.style.setProperty("--x", `${x}px`);
        node.style.setProperty("--y", `${y}px`);
    }

    node.addEventListener("mousemove", handleMouseMove);

    return {
        destroy() {
            node.removeEventListener("mousemove", handleMouseMove);
        }
    };
}
