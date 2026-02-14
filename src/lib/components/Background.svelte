<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { untrack } from "svelte";
  import HeroBkg from "$lib/components/svgs/HeroBkg.svelte";
  import ParticleScroll from "$lib/components/svgs/ParticleScroll.svelte";

  let canvas = $state<HTMLCanvasElement>();

  let ctx = $state<CanvasRenderingContext2D | null>();

  interface Star {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    vx: number;
    vy: number;
    twinklePhase: number; // Offset for twinkle timing
    twinkleSpeed: number;
  }

  interface ShootingStar {
    x: number;
    y: number;
    angle: number;
    speed: number;
    length: number;
    opacity: number;
    life: number;
    maxLife: number;
    color: string;
  }

  let stars = $state<Star[]>([]);
  let shootingStars = $state<ShootingStar[]>([]);
  let width = $state<number>(0);
  let height = $state<number>(0);
  let animationFrame = $state<number>(0);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let warpSpeed = $state(0);
  let frameCount = $state(0);

  let tiltX = $state(0);
  let tiltY = $state(0);

  function handleOrientation(e: DeviceOrientationEvent) {
    if (width > 768) return; // Only relevant for mobile

    // gamma is left/right tilt [-90,90]
    // beta is front/back tilt [-180,180]
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;

    // Normalize: Holding phone approx 45deg is "zero"
    tiltX = gamma;
    tiltY = beta - 45;
  }

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

  // Read primary color from CSS variables for star tinting
  function getPrimaryRGB(): [number, number, number] {
    if (typeof document === "undefined") return [102, 72, 255];
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary-400-rgb")
      .trim();
    if (!val) return [102, 72, 255];
    const parts = val.split(",").map((s) => parseInt(s.trim()));
    if (parts.length === 3 && parts.every((n) => !isNaN(n)))
      return parts as [number, number, number];
    return [102, 72, 255];
  }

  function initStars() {
    stars = [];
    shootingStars = [];
    const isMobile = width < 768;
    const density = isMobile ? 40000 : 8000;
    const starCount = Math.floor((width * height) / density);
    const [pr, pg, pb] = getPrimaryRGB();

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const opacity = Math.random() * 0.8 + 0.2;

      // 15% of stars get primary color tint
      const isPrimary = Math.random() < 0.15;
      const color = isPrimary
        ? `rgba(${pr}, ${pg}, ${pb}, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`;

      stars.push({
        x,
        y,
        size: Math.random() * (isMobile ? 2 : 3.5),
        color,
        speed: Math.random() * 0.2 + 0.05,
        vx: 0,
        vy: 0,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function spawnShootingStar() {
    if (width < 768) return; // Skip on mobile for perf
    const [pr, pg, pb] = getPrimaryRGB();
    const angle = Math.PI * 0.2 + Math.random() * Math.PI * 0.3; // 36° to 90° downward
    shootingStars.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.3,
      angle,
      speed: 6 + Math.random() * 8,
      length: 60 + Math.random() * 80,
      opacity: 1,
      life: 0,
      maxLife: 40 + Math.random() * 30,
      color: `rgba(${pr}, ${pg}, ${pb}, `,
    });
  }

  // Optimized animation loop
  function animate() {
    if (!ctx) return;

    // Check if tab is active to pause animation
    if (document.hidden) {
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    if (warpSpeed > 0) warpSpeed *= 0.95;
    if (warpSpeed < 0.1) warpSpeed = 0;

    const TWO_PI = Math.PI * 2;
    const len = stars.length;
    frameCount++;

    // Cache mouse position logic to avoid recalculation
    const isMobile = width < 768;
    const isInteracting = mouseX !== 0 && mouseY !== 0 && !isMobile;

    for (let i = 0; i < len; i++) {
      const star = stars[i];

      // Desktop Mouse Interaction
      if (isInteracting) {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = 40000;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const force = (200 - dist) / 200;
          star.vx -= (dx / dist) * force * 0.5;
          star.vy -= (dy / dist) * force * 0.5;
        }
      }

      // Mobile Gyroscope Interaction
      if (isMobile) {
        star.vx += tiltX * 0.005 * star.size * 0.1;
        star.vy += tiltY * 0.005 * star.size * 0.1;
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
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;

      // Twinkle effect — subtle size/opacity oscillation
      const twinkle =
        0.7 +
        0.3 * Math.sin(frameCount * star.twinkleSpeed + star.twinklePhase);
      const drawSize = star.size * twinkle;

      // Draw
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, drawSize, 0, TWO_PI);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Shooting Stars — spawn occasionally
    if (!isMobile && frameCount % 180 === 0 && Math.random() < 0.5) {
      spawnShootingStar();
    }

    // Update and draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.life++;
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity = 1 - ss.life / ss.maxLife;

      if (ss.life >= ss.maxLife || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
        continue;
      }

      // Draw streak
      const tailX = ss.x - Math.cos(ss.angle) * ss.length * ss.opacity;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length * ss.opacity;

      const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      gradient.addColorStop(0, `${ss.color}0)`);
      gradient.addColorStop(1, `${ss.color}${ss.opacity})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.stroke();

      // Bright head
      ctx.fillStyle = `${ss.color}${ss.opacity})`;
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 1.5, 0, TWO_PI);
      ctx.fill();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  // Svelte 5: Use $effect for lifecycle management
  $effect(() => {
    if (!canvas) return;

    untrack(() => {
      ctx = canvas!.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Initial setup
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;

      // Initialize stars
      initStars();

      // Start animation
      animate();

      // Event listeners
      const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas!.width = width;
        canvas!.height = height;
        initStars();
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("mousemove", handleMouseMove);
      if (typeof DeviceOrientationEvent !== "undefined") {
        window.addEventListener("deviceorientation", handleOrientation);
      }

      // Cleanup function (will be called when effect is destroyed)
      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        if (typeof DeviceOrientationEvent !== "undefined") {
          window.removeEventListener("deviceorientation", handleOrientation);
        }
      };
    });
  });
</script>

<div class="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
  <!-- Dynamic Gradient Background using CSS variables -->
  <!-- We use Primary-900 with low opacity for the clouds -->
  <div
    class="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--color-primary-900)_0%,rgba(0,0,0,0)_50%)] animate-slow-spin opacity-20 hardware-accel"
    style="filter: blur(100px);"
  ></div>
  <div
    class="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--color-primary-800)_0%,rgba(0,0,0,0)_50%)] animate-slow-spin-reverse opacity-15 hardware-accel"
    style="filter: blur(100px);"
  ></div>

  <canvas
    bind:this={canvas}
    class="absolute inset-0 z-10 opacity-100 hardware-accel"
  ></canvas>

  <!-- Volumetric Noise / Film Grain -->
  <div
    class="absolute inset-0 z-20 pointer-events-none opacity-[0.07] mix-blend-overlay"
  >
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
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
