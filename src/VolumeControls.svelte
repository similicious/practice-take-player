<script lang="ts">
  import Slider from "@smui/slider";
  import type { ChannelStore } from "./stores/track-state";
  export let channelStore: ChannelStore;
</script>

<Slider
  value={$channelStore.volume}
  max={0}
  min={-42}
  step={1}
  on:SMUISlider:input={(e) => channelStore.setVolume(e.detail.value)}
  disabled={$channelStore.volume === -Infinity}
  style="flex: 1"
/>

{#if $channelStore.volume === -Infinity}
  -&infin;
{:else}
  {Math.round($channelStore.volume)} dB
{/if}
