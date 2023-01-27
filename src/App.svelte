<script lang="ts">
  import { onMount } from "svelte";

  import * as Tone from "tone";

  import type {
    TrackModel,
    Song,
    TrackLocator,
    SongIndex,
    SongLocator,
  } from "./models";

  import MasterTrack from "./MasterTrack.svelte";
  import TransportControls from "./TransportControls.svelte";
  import TracksManager from "./TracksManager.svelte";
  import { songLength } from "./stores";

  let tracks: TrackModel[] = [];
  let tracksLoaded: Promise<any> = Promise.resolve();
  let song: Song;

  const masterVolume = new Tone.Volume().connect(
    new Tone.Limiter(0).toDestination()
  );

  async function initializePlayer() {
    const songIndex = await getSongIndex();
    song = await getSong(songIndex[0]);

    const trackLocators: TrackLocator[] = song.tracks.map((loc) => ({
      ...loc,
      url: `songs/${songIndex[0].url}/${loc.url}`,
    }));

    Tone.Transport.set({ bpm: song.tempo });

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
      const channel = new Tone.Channel().connect(masterVolume);
      const trackLoaded = new Promise<void>((resolve) => {
        const player = new Tone.Player(locator.url, () => {
          resolve();
          songLength.set(player.buffer.duration);
        })
          .sync()
          .start(0);
        player.fadeIn = 0.01;
        player.fadeOut = 0.01;

        player.connect(channel);
      });

      return {
        channel: {
          name: locator.name,
          channel,
        },
        trackLoaded,
      };
    });

    return songTracks;
  }

  function createClickTrack(): TrackModel {
    const clickChannel = new Tone.Channel()
      .set({ volume: -18 })
      .connect(masterVolume);
    const clickTrack: TrackModel = { name: "Metronom", channel: clickChannel };
    const clickOsc = new Tone.Oscillator().connect(clickChannel).start();

    Tone.Transport.scheduleRepeat((time) => {
      clickOsc.start(time).stop(time + 0.05);
    }, "4n");

    return clickTrack;
  }

  onMount(initializePlayer);
</script>

{#if song}
  <h1>{song.name}</h1>
{/if}
<TracksManager {tracks} />
<MasterTrack volume={masterVolume} />
<TransportControls {tracksLoaded} />
