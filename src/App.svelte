<script lang="ts">
  import { onMount } from "svelte";

  import type {
    Song,
    SongIndex,
    SongLocator,
    TrackLocator,
    TrackModel,
  } from "./models";

  import {
    Channel,
    Volume,
    Limiter,
    Transport,
    Player,
    Oscillator,
    Loop,
  } from "tone";
  import TracksManager from "./TracksManager.svelte";
  import TransportControls from "./TransportControls.svelte";
  import { songLength, createMuteStore, createVolumeStore } from "./stores";

  let tracks: TrackModel[] = [];
  let tracksLoaded: Promise<any> = Promise.resolve();
  let song: Song;

  const masterVolume = new Volume().connect(new Limiter(0).toDestination());

  async function initializePlayer() {
    const songIndex = await getSongIndex();
    song = await getSong(songIndex[0]);

    const trackLocators: TrackLocator[] = song.tracks.map((loc) => ({
      ...loc,
      url: `songs/${songIndex[0].url}/${loc.url}`,
    }));

    Transport.set({ bpm: song.tempo });

    const songTracks = createSongTracks(trackLocators);
    const clickTrack = createClickTrack();

    tracksLoaded = Promise.all(songTracks.map((t) => t.trackLoaded));
    tracks = [...songTracks.map((t) => t.channel), clickTrack];
  }

  function getSongIndex(): Promise<SongIndex> {
    return fetch("songs/index.json").then(
      (res) => res.json() as Promise<SongIndex>
    );
  }

  function getSong(songLocator: SongLocator): Promise<Song> {
    return fetch(`songs/${songLocator.url}/index.json`).then(
      (res) => res.json() as Promise<Song>
    );
  }

  function createSongTracks(trackLocators: TrackLocator[]) {
    const songTracks = trackLocators.map((locator) => {
      const channel = new Channel().connect(masterVolume);
      const trackLoaded = new Promise<void>((resolve) => {
        const player = new Player(locator.url, () => {
          resolve();
          songLength.set(player.buffer.duration);
        })
          .sync()
          .start(0);
        player.fadeIn = 0.01;
        player.fadeOut = 0.01;

        player.connect(channel);
      });

      const track: TrackModel = {
        name: locator.name,
        channel,
        ...createVolumeAndMuteStore(channel),
      };

      return {
        channel: track,
        trackLoaded,
      };
    });

    return songTracks;
  }

  function createVolumeAndMuteStore(channel: Channel) {
    const volume = createVolumeStore(channel as unknown as Volume);
    const mute = createMuteStore(volume, channel as unknown as Volume);

    return { volume, mute };
  }

  function createClickTrack(): TrackModel {
    const clickChannel = new Channel()
      .set({ volume: -18 })
      .connect(masterVolume);

    const clickOsc = new Oscillator().connect(clickChannel).start();

    const loop = new Loop(
      (time) => clickOsc.start(time).stop(time + 0.05),
      "4n"
    ).start(0);

    const clickTrack: TrackModel = {
      name: "Metronom",
      channel: clickChannel,
      ...createVolumeAndMuteStore(clickChannel),
    };
    return clickTrack;
  }

  onMount(initializePlayer);
</script>

{#if song}
  <h1>{song.name}</h1>
{/if}
<TracksManager {tracks} />
<!-- <Track track={masterTrack} hideMuteSolo={true} /> -->
<TransportControls {tracksLoaded} />
