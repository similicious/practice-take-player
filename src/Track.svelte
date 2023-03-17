<script lang="ts">
  import Card, { Content } from "@smui/card";
  import IconButton, { Icon } from "@smui/icon-button";

  import type { TrackModel } from "./models/track";

  import VolumeControls from "./VolumeControls.svelte";

  export let hideMuteSolo = false;
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

        {#if !hideMuteSolo}
          <IconButton
            on:click={() =>
              $channelStore.muted
                ? track.channelStore.unmute()
                : track.channelStore.mute()}
            toggle
            :pressed={$channelStore.muted}
          >
            <Icon class="material-icons">volume_mute</Icon>
            <Icon class="material-icons" on>volume_off</Icon>
          </IconButton>

          <IconButton
            on:click={() =>
              $channelStore.soloed
                ? track.channelStore.unsolo()
                : track.channelStore.solo()}
            toggle
            :pressed={$channelStore.soloed}
          >
            <Icon class="material-icons">groups_2</Icon>
            <Icon class="material-icons" on>person</Icon>
          </IconButton>
        {/if}
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
    gap: 0.25rem;
    align-items: center;
  }
</style>
