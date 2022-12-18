<script lang="ts">
  import type { Channel } from "tone";
  export let volume: Pick<Channel, "volume">;
</script>

<input
  type="range"
  bind:value={volume.volume.value}
  max="0"
  min="-42"
  step="1"
  disabled={volume.volume.value === -Infinity}
/>
{#if volume.volume.value === -Infinity}
  -&infin;
{:else}
  {Math.round(volume.volume.value)} dB
{/if}
