import { derived } from "svelte/store";
import { type PlaybackState, Transport } from "tone";
import { TonejsStoreBase } from "./tonejs-store";

class PlaybackStateStore extends TonejsStoreBase<PlaybackState> {
  getValue(): PlaybackState {
    return Transport.state;
  }

  setupEvents() {
    Transport.on("start", this.boundEmitValue);
    Transport.on("stop", this.boundEmitValue);
    Transport.on("pause", this.boundEmitValue);
  }

  removeEvents() {
    Transport.off("start", this.boundEmitValue);
    Transport.off("stop", this.boundEmitValue);
    Transport.off("pause", this.boundEmitValue);
  }
}

export const playbackState = new PlaybackStateStore();

export const isPlaying = derived(playbackState, (s) => s === "started");
