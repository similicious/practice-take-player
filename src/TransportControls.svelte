<script>
  import IconButton from "@smui/icon-button";
  import Slider from "@smui/slider";

  import {
    isPlaying,
    playbackPosition,
    playbackPositionReadble,
    playbackPostitionBars,
    songLength,
    songLengthReadble,
  } from "./stores";

  import * as Tone from "tone";

  export let tracksLoaded = Promise.resolve();

  async function play() {
    await Tone.start();
    Tone.Transport.start();
  }

  function stop() {
    Tone.Transport.stop();
  }

  function pause() {
    Tone.Transport.pause();
  }
</script>

<article>
  {#await tracksLoaded}
    <IconButton class="material-icons" disabled>hourglass_top</IconButton>
  {:then}
    {#if !$isPlaying}
      <IconButton class="material-icons" on:click={play}>play_arrow</IconButton>
    {:else}
      <IconButton class="material-icons" on:click={pause}>pause</IconButton>
    {/if}
  {/await}
  <IconButton class="material-icons" disabled={!$isPlaying} on:click={stop}
    >stop</IconButton
  >

  <p>{$playbackPositionReadble}</p>

  <Slider
    bind:value={$playbackPosition}
    min={0}
    max={$songLength}
    style="flex: 1"
  />

  <p>{$songLengthReadble}</p>
  <p>{$playbackPostitionBars}</p>
</article>

<style>
  article {
    border-top: 1px solid black;
    padding: 0.5rem;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: white;
    height: 4rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
