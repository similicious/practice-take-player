<script lang="ts">
  import { onMount } from "svelte";

  import * as Tone from "tone";
  import WaveSurfer from "wavesurfer.js";
  import type { TrackModel } from "./models/track";

  import MasterTrack from "./MasterTrack.svelte";
  import TransportControls from "./TransportControls.svelte";
  import TracksManager from "./TracksManager.svelte";
  import { songLength, playbackPosition } from "./stores";

  let tracks: TrackModel[] = [];
  let tracksLoaded: Promise<any> = Promise.resolve();

  const masterVolume = new Tone.Volume().connect(
    new Tone.Limiter(0).toDestination()
  );

  function initializePlayer() {
    Tone.Transport.set({ bpm: 86 });

    const songTracks = createSongTracks();
    const clickTrack = createClickTrack();

    tracksLoaded = Promise.all(songTracks.map((t) => t.trackLoaded));
    tracks = [...songTracks.map((t) => t.channel), clickTrack];

    fetch("/songs/take-stock-of-what-i-have/Sopran.mp3")
      .then((res) => res.blob())
      .then((res) => {
        const wavesurfer = WaveSurfer.create({
          container: "#waveform",
          scrollParent: true,
          normalize: true,
          responsive: true,
        });
        wavesurfer.loadBlob(res);

        wavesurfer.on("seek", (e) => {
          playbackPosition.set(e * $songLength);
        });

        Tone.Transport.scheduleRepeat(
          (s) => wavesurfer.seekAndCenter($playbackPosition / $songLength),
          "32n"
        );
      });
  }

  function createSongTracks() {
    const trackUrls = [
      "/songs/take-stock-of-what-i-have/Sopran.mp3",
      "/songs/take-stock-of-what-i-have/Mezzo.mp3",
      "/songs/take-stock-of-what-i-have/Alt.mp3",
      "/songs/take-stock-of-what-i-have/Tenor.mp3",
      "/songs/take-stock-of-what-i-have/Bass.mp3",
    ];

    const songTracks = trackUrls.map((trackUrl) => {
      const channel = new Tone.Channel().connect(masterVolume);
      const trackLoaded = new Promise<void>((resolve) => {
        const player = new Tone.Player(trackUrl, () => {
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
          name: trackUrl.split("/")[3].replace(".mp3", ""),
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

<TracksManager {tracks} />
<MasterTrack volume={masterVolume} />
<TransportControls {tracksLoaded} />
