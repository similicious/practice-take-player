<script lang="ts">
  import type { TrackModel } from "./models/track";
  import Track from "./Track.svelte";
  export let tracks: TrackModel[] = [];
</script>

{#each tracks as track (track.name)}
  <Track {track} />
{/each}
