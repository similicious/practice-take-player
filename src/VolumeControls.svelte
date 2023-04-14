<script lang="ts">
  import Slider from "@smui/slider";
  import type { MuteStore } from "./stores/mute-state";
  import type { VolumeStore } from "./stores/volume-state";
  export let volume: VolumeStore;
  export let mute: MuteStore;
</script>

<Slider
  bind:value={$volume}
  max={0}
  min={-42}
  step={1}
  disabled={$mute}
  style="flex: 1"
/>

{#if $mute}
  -&infin;
{:else}
  {$volume} dB
{/if}
