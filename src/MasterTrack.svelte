<script lang="ts">
  import Card, { Content } from "@smui/card";

  import type { ChannelStore } from "./stores/track-state";

  import VolumeControls from "./VolumeControls.svelte";

  export let channelStore: ChannelStore;
</script>

<article>
  <Card>
    <Content>
      <header>
        <h2>Master</h2>
      </header>
      <section>
        <VolumeControls {channelStore} />
      </section>
    </Content>
  </Card>
</article>

<style>
  article {
    margin-top: 1rem;
  }

  section {
    display: flex;
    align-items: center;
  }
</style>
