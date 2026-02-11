<script lang="ts">
    import HomeSection from "$lib/sections/HomeSection.svelte";
    import ProgramsSection from "$lib/sections/ProgramsSection.svelte";
    import RoadmapSection from "$lib/sections/RoadmapSection.svelte";
    import ShowcaseSection from "$lib/sections/ShowcaseSection.svelte";
    import TeamSection from "$lib/sections/TeamSection.svelte";
    import FanficSection from "$lib/sections/FanficSection.svelte";
    import OriginSection from "$lib/sections/OriginSection.svelte";
    import FAQSection from "$lib/sections/FAQSection.svelte";
</script>

<!-- Main Scroll Container -->
<div class="relative text-white selection:bg-primary-500 selection:text-white">
    <HomeSection />
    <ProgramsSection />
    <RoadmapSection />
    <ShowcaseSection />
    <OriginSection />
    <TeamSection />
    <FanficSection />
    <FAQSection />
</div>
