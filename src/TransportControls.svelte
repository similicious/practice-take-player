<script>
  import {
    songLength,
    songLengthReadble,
    playbackPosition,
    playbackPositionReadble,
    playbackPostitionBars,
    isPlaying,
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
    <button disabled>Song lädt</button>
  {:then}
    {#if !$isPlaying}
      <button on:click={play}>Play</button>
    {:else}
      <button on:click={pause}>Pause</button>
    {/if}
  {/await}
  <button disabled={!$isPlaying} on:click={stop}>Stop</button>

  <p>{$playbackPositionReadble}</p>
  <input
    type="range"
    bind:value={$playbackPosition}
    min="0"
    max={$songLength}
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

  input {
    flex: 1;
  }
</style>
