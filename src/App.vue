<template>
  <h1>{{ song.name }}</h1>

  <input
    type="range"
    :value="playbackPositionPercent"
    min="0"
    max="100"
    step="1"
    @change="setPosition(($event.target as HTMLInputElement).valueAsNumber)"
  />
  <span>{{ playbackPositionFormat }}</span>
  <br />
  <button @click="play(playbackPosition)" :disabled="playing">Play</button>
  <button @click="pause" :disabled="!playing">Pause</button>
  <button @click="stop" :disabled="!playing">Stop</button>

  <section v-for="track in song.tracks" :key="track.name">
    {{ track.name }}
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      @change="
        setVolume(track, ($event.target as HTMLInputElement).valueAsNumber)
      "
    />
    <button @click="toggleMute(track)">
      {{ track.muted ? 'Unmute' : 'Mute' }}
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Song {
  name: string
  tracks: Track[]
}

interface Track {
  name: string
  url: string
  source: AudioBufferSourceNode | null
  gain: GainNode | null
  buffer: AudioBuffer | null
  muted: boolean
}

export default defineComponent({
  data() {
    return {
      audioContext: new AudioContext(),
      playbackStartTime: 0,
      playbackStartOffset: 0,
      playbackPosition: 0,
      playing: false,
      intervalId: 0,
      song: {
        name: 'Take Stock Of What I Have',
        tracks: [
          {
            name: 'Sopran',
            url: 'media/Sopran.mp3',
            source: null,
            gain: null,
            buffer: null,
            muted: false,
          },

          {
            name: 'Mezzo',
            url: 'media/Mezzo.mp3',
            source: null,
            gain: null,
            buffer: null,
            muted: false,
          },
          {
            name: 'Alt',
            url: 'media/Alt.mp3',
            source: null,
            gain: null,
            buffer: null,
            muted: false,
          },

          {
            name: 'Tenor',
            url: 'media/Tenor.mp3',
            source: null,
            gain: null,
            buffer: null,
            muted: false,
          },
          {
            name: 'Bass',
            url: 'media/Bass.mp3',
            source: null,
            gain: null,
            buffer: null,
            muted: false,
          },
        ],
      } as Song,
    }
  },
  async mounted() {
    const trackPromises = this.song.tracks.map((track) =>
      fetch(track.url).then((res) =>
        res
          .arrayBuffer()
          .then((buf) => this.audioContext.decodeAudioData(buf))
          .then((audioData) => {
            const trackGainNode = this.audioContext.createGain()
            trackGainNode.connect(this.audioContext.destination)
            return {
              ...track,
              gain: trackGainNode,
              buffer: audioData,
            }
          })
      )
    )
    this.intervalId = setInterval(() => this.updatePlaybackPosition(), 250)

    this.song.tracks = await Promise.all(trackPromises)
  },

  unmounted() {
    clearInterval(this.intervalId)
  },
  computed: {
    playbackPositionPercent() {
      if (!this.song.tracks[0].buffer) {
        return 0
      }
      const songDuration = this.song.tracks[0].buffer.duration
      return (this.playbackPosition / songDuration) * 100
    },
    playbackPositionFormat() {
      const minutes = String(Math.floor(this.playbackPosition / 60)).padStart(
        2,
        '0'
      )
      const seconds = String(Math.floor(this.playbackPosition % 60)).padStart(
        2,
        '0'
      )
      return `${minutes}:${seconds}`
    },
  },
  methods: {
    play(pos: number) {
      if (this.playing) {
        this.song.tracks.forEach((track) => track.source?.stop())
      }
      this.playing = true
      this.playbackStartTime = this.audioContext.currentTime
      this.playbackStartOffset = pos
      this.createBufferSourceForAllTracks()
      this.song.tracks.forEach((track) => track.source?.start(0, pos))
    },
    pause() {
      this.playing = false
      this.song.tracks.forEach((track) => track.source?.stop())
    },
    stop() {
      this.pause()
      this.playbackPosition = 0
    },
    toggleMute(track: Track) {
      if (track.muted) {
        track.gain?.gain.setValueAtTime(1, this.audioContext.currentTime)
      } else {
        track.gain?.gain.setValueAtTime(0, this.audioContext.currentTime)
      }
      track.muted = !track.muted
    },
    setVolume(track: Track, volume: number) {
      track.gain?.gain.setValueAtTime(volume, this.audioContext.currentTime)
    },
    createBufferSourceForAllTracks() {
      this.song.tracks = this.song.tracks.map((track) =>
        this.createBufferSource(track)
      )
    },
    setPosition(positionPercent: number) {
      const duration = this.song.tracks[0].buffer?.duration ?? 0
      this.play(duration * (positionPercent / 100))
    },
    createBufferSource(track: Track) {
      if (!track.gain) {
        throw new Error('No gain node is present on track.')
      }
      const trackBufferSource = this.audioContext.createBufferSource()
      trackBufferSource.buffer = track.buffer
      trackBufferSource.connect(track.gain)
      return {
        ...track,
        source: trackBufferSource,
      }
    },
    updatePlaybackPosition() {
      if (!this.playing) {
        return 0
      }

      const currentTime = this.audioContext.currentTime
      const playbackStartTime = this.playbackStartTime
      const playbackStartOffset = this.playbackStartOffset

      this.playbackPosition =
        currentTime - playbackStartTime + playbackStartOffset
    },
  },
})
</script>
