<script lang="ts">
  import type { Volume } from "tone";

  import VolumeControls from "./VolumeControls.svelte";

  export let volume: Volume;
</script>

<article>
  <header>
    <h2>Master</h2>
  </header>
  <section>
    <VolumeControls {volume} />
  </section>
</article>

<style>
  article {
    border: 1px solid black;
    margin-top: 1rem;
    padding: 0.5rem;
  }
</style>
