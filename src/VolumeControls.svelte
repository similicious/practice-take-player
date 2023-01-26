<script lang="ts">
  import Slider from "@smui/slider";
  import type { Channel } from "tone";
  export let volume: Pick<Channel, "volume">;
</script>

<!-- 
<Slider
  bind:value={volume.volume.value}
  max={0}
  min={-42}
  step={1}
  disabled={volume.volume.value === -Infinity}
  style="flex: 1"
/> -->

<input
  type="range"
  bind:value={volume.volume.value}
  max="0"
  min="-42"
  step="1"
  disabled={volume.volume.value === -Infinity}
  style="flex: 1"
/>

{#if volume.volume.value === -Infinity}
  -&infin;
{:else}
  {Math.round(volume.volume.value)} dB
{/if}
