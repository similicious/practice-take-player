<script lang="ts">
  import Card, { Content } from "@smui/card";
  import IconButton, { Icon } from "@smui/icon-button";

  import type { TrackModel } from "./models/track";

  import VolumeControls from "./VolumeControls.svelte";

  export let hideMuteSolo = false;
  export let track: TrackModel;
  $: ({ name, mute, volume, channel } = track);
</script>

<article>
  <Card>
    <Content>
      <header>
        <h2>{name}</h2>
      </header>
      <section>
        <VolumeControls {volume} {mute} />

        {#if !hideMuteSolo}
          <IconButton toggle bind:pressed={$mute}>
            <Icon class="material-icons">volume_up</Icon>
            <Icon class="material-icons" on>volume_off</Icon>
          </IconButton>

          <IconButton
            on:click={() => (channel.solo = !channel.solo)}
            toggle
            :pressed={channel.solo}
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
