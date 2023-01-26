<script lang="ts">
  import Card, { Content } from "@smui/card";

  import type { Volume } from "tone";

  import VolumeControls from "./VolumeControls.svelte";

  export let volume: Volume;
</script>

<article>
  <Card>
    <Content>
      <header>
        <h2>Master</h2>
      </header>
      <section>
        <VolumeControls {volume} />
      </section>
    </Content>
  </Card>
</article>

<style>
  article {
    margin-top: 1rem;
  }
</style>
