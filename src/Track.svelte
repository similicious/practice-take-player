<script lang="ts">
  import Card, { Content } from "@smui/card";
  import type { TrackModel } from "./models/track";

  import VolumeControls from "./VolumeControls.svelte";

  export let track: TrackModel;
  $: ({ channel, channelStore, name } = track);
</script>

<article>
  <Card>
    <Content>
      <header>
        <h2>{name}</h2>
      </header>
      <section>
        <VolumeControls channelStore={track.channelStore} />
        <label for={`mute_${track.name}`}>Mute</label>
        <input
          id={`mute_${track.name}`}
          type="checkbox"
          on:change={() =>
            $channelStore.mute
              ? track.channelStore.unmute()
              : track.channelStore.mute()}
        />
        <label for={`solo_${track.name}`}>Solo</label>
        <input
          id={`solo_${track.name}`}
          type="checkbox"
          bind:checked={channel.solo}
        />
      </section>
    </Content>
  </Card>
</article>

<style>
  article {
    margin-bottom: 1rem;
  }

  section {
    display: flex;
    align-items: center;
  }
</style>
