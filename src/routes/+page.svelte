<script lang="ts">
    import UnifiedHome from "$lib/unified/UnifiedHome.svelte";
    import UnifiedPrograms from "$lib/unified/UnifiedPrograms.svelte";
    import UnifiedRoadmap from "$lib/unified/UnifiedRoadmap.svelte";
    import UnifiedResources from "$lib/unified/UnifiedResources.svelte";
    import UnifiedShowcase from "$lib/unified/UnifiedShowcase.svelte";
    import CoordinatorSection from "$lib/components/CoordinatorSection.svelte";
    import UnifiedLore from "$lib/unified/UnifiedLore.svelte";
    import UnifiedFAQ from "$lib/unified/UnifiedFAQ.svelte";
    import { onMount } from "svelte";
    import { fetchTeamData } from "$lib/stores";

    onMount(() => {
        fetchTeamData();
    });
</script>

<!-- Main Scroll Container -->
<div class="relative text-white selection:bg-primary-500 selection:text-white">
    <UnifiedHome />
    <UnifiedPrograms />
    <UnifiedRoadmap />
    <UnifiedResources />
    <UnifiedShowcase />
    <UnifiedLore />
    <CoordinatorSection />
    <UnifiedFAQ />
</div>
