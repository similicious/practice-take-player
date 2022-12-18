<script lang="ts">
  import type { TrackModel } from "./models/track";

  import VolumeControls from "./VolumeControls.svelte";

  export let track: TrackModel;
</script>

<article>
  <header>
    <h2>{track.name}</h2>
  </header>
  <section>
    <VolumeControls volume={track.channel} />
    <label for={`mute_${track.name}`}>Mute</label>
    <input
      id={`mute_${track.name}`}
      type="checkbox"
      bind:checked={track.channel.mute}
    />
    <label for={`solo_${track.name}`}>Solo</label>
    <input
      id={`solo_${track.name}`}
      type="checkbox"
      bind:checked={track.channel.solo}
    />
  </section>
</article>

<style>
  article {
    border: 1px solid black;
    margin-top: 1rem;
    padding: 0.5rem;
  }
</style>
