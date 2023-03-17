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

  import TransportControls from "./TransportControls.svelte";
  import TracksManager from "./TracksManager.svelte";
  import Track from "./Track.svelte";
  import { songLength } from "./stores";
  import { createChannelStore } from "./stores/track-state";

  let tracks: TrackModel[] = [];
  let tracksLoaded: Promise<any> = Promise.resolve();
  let song: Song;

  const masterChannel = new Tone.Channel().connect(
    new Tone.Limiter(0).toDestination()
  );

  const masterTrack: TrackModel = {
    name: "Master",
    channel: masterChannel,
    channelStore: createChannelStore(masterChannel),
  };

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
      const channel = new Tone.Channel().connect(masterChannel);
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

      const track: TrackModel = {
        name: locator.name,
        channel,
        channelStore: createChannelStore(channel),
      };

      return {
        channel: track,
        trackLoaded,
      };
    });

    return songTracks;
  }

  function createClickTrack(): TrackModel {
    const clickChannel = new Tone.Channel()
      .set({ volume: -18 })
      .connect(masterChannel);

    const clickOsc = new Tone.Oscillator().connect(clickChannel).start();

    const loop = new Tone.Loop(
      (time) => clickOsc.start(time).stop(time + 0.05),
      "4n"
    ).start(0);

    const clickTrack: TrackModel = {
      name: "Metronom",
      channel: clickChannel,
      channelStore: createChannelStore(clickChannel),
    };
    return clickTrack;
  }

  onMount(initializePlayer);
</script>

{#if song}
  <h1>{song.name}</h1>
{/if}
<TracksManager {tracks} />
<Track track={masterTrack} hideMuteSolo={true} />
<TransportControls {tracksLoaded} />
