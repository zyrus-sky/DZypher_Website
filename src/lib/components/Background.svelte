<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { afterNavigate } from "$app/navigation";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  interface Star {
    x: number;
    y: number;
    size: number;
    color: string; // Precomputed rgba string for performance
    speed: number;
    vx: number;
    vy: number;
  }

  let stars: Star[] = [];
  let width: number;
  let height: number;
  let animationFrame: number;
  let mouseX = 0;
  let mouseY = 0;
  let warpSpeed = 0;

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  afterNavigate(() => {
    warpSpeed = 20;
    setTimeout(() => {
      // Decay handled in loop or just reset?
      // Let's rely on a decay factor in the loop for smoothness
    }, 100);
  });

  function animate() {
    if (!ctx) return;

    // Performance: Clear rect is much faster than fillRect with alpha
    ctx.clearRect(0, 0, width, height);

    // Warp speed logic
    if (warpSpeed > 0) warpSpeed *= 0.95;
    if (warpSpeed < 0.1) warpSpeed = 0;

    // Use a path for all stars of the same color?
    // Actually, drawing thousands of individual sub-pixels is fast if we don't change state.
    // We already moved color to the star object.
    // Optimization: Just use a single fillStyle white/grey and vary radius? No, we want opacity.

    // BEST OPTIMIZATION: Do not change ctx.fillStyle or globalAlpha inside the loop continuously if possible.
    // However, since stars twinkle, they change opacity.
    // Let's stick to simple drawing but use valid optimizations:
    // 1. Math.PI * 2 is constant.
    const TWO_PI = Math.PI * 2;
    // 2. Reduce object access overhead.

    const len = stars.length;
    for (let i = 0; i < len; i++) {
      const star = stars[i];

      // Physics
      // Repulsion
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      // Optimization: Dist squared check to avoid Math.sqrt for far away particles
      const distSq = dx * dx + dy * dy;
      const maxDist = 200;
      const maxDistSq = 40000; // 200 * 200

      if (distSq < maxDistSq) {
        const dist = Math.sqrt(distSq);
        const force = (maxDist - dist) / maxDist;
        star.vx -= (dx / dist) * force * 0.5;
        star.vy -= (dy / dist) * force * 0.5;
      }

      star.x += star.vx;
      star.y += star.vy;
      star.vx *= 0.95;
      star.vy *= 0.95;

      star.y -= star.speed + warpSpeed;

      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;

      // Draw
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, TWO_PI);
      ctx.fill();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function initStars() {
    stars = [];
    const isMobile = width < 768;
    // Increased particle density as requested
    const density = isMobile ? 15000 : 8000;
    const starCount = Math.floor((width * height) / density);

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      // Brighter, more visible stars
      const opacity = Math.random() * 0.8 + 0.2;
      const color = `rgba(239, 68, 68, ${opacity})`;

      stars.push({
        x,
        y,
        // Larger stars
        size: Math.random() * (isMobile ? 2.5 : 3.5),
        color,
        speed: Math.random() * 0.2 + 0.05,
        vx: 0,
        vy: 0,
      });
    }
  }

  onMount(() => {
    // Enable alpha for transparency
    ctx = canvas.getContext("2d", { alpha: true });

    if (typeof window !== "undefined") {
      mouseX = window.innerWidth / 2;
      mouseY = window.innerHeight / 2;
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div class="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
  <!-- Reddish Cloud / Aurora: Optimized with will-change -->
  <div
    class="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(127,29,29,0.3)_0%,_rgba(0,0,0,0)_50%)] animate-slow-spin opacity-80 hardware-accel"
  ></div>
  <div
    class="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(153,27,27,0.2)_0%,_rgba(0,0,0,0)_50%)] animate-slow-spin-reverse opacity-70 hardware-accel"
  ></div>

  <canvas
    bind:this={canvas}
    class="absolute inset-0 z-10 opacity-100 hardware-accel"
  ></canvas>
</div>

<style>
  /* Hardware Acceleration Class */
  .hardware-accel {
    transform: translateZ(0);
    will-change: transform, opacity;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg) translateZ(0); /* Force GPU */
    }
    to {
      transform: rotate(360deg) translateZ(0);
    }
  }
  @keyframes spin-reverse {
    from {
      transform: rotate(360deg) translateZ(0);
    }
    to {
      transform: rotate(0deg) translateZ(0);
    }
  }
  .animate-slow-spin {
    animation: spin 60s linear infinite;
  }
  .animate-slow-spin-reverse {
    animation: spin-reverse 80s linear infinite;
  }
</style>
