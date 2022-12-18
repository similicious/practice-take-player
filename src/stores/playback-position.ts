import { derived, type Updater, type Writable } from "svelte/store";

import * as Tone from "tone";
import { formatDuration } from "../utils";
import { TonejsStoreBase } from "./tonejs-store";

// ToDo: auf memory leaks testen
class PlaybackPostionStore
  extends TonejsStoreBase<number>
  implements Writable<number>
{
  playingEventId: number;

  setupEvents() {
    this.playingEventId = Tone.Transport.scheduleRepeat(
      this.boundEmitValue,
      "32n"
    );
    Tone.Transport.on("stop", this.boundEmitValue);
    Tone.Transport.on("pause", this.boundEmitValue);
  }

  removeEvents() {
    Tone.Transport.clear(this.playingEventId);
    Tone.Transport.off("stop", this.boundEmitValue);
    Tone.Transport.off("pause", this.boundEmitValue);
  }

  getValue(): number {
    const position = Tone.Transport.position;
    return Tone.Time(position).toSeconds();
  }

  set(playbackPosition: number) {
    Tone.Transport.position = playbackPosition;
    this.emitValue();
  }

  update(updater: Updater<number>): void {
    Tone.Transport.position = updater(this.getValue());
    this.emitValue();
  }
}

export const playbackPosition = new PlaybackPostionStore();
export const playbackPostitionBars = derived(playbackPosition, (pos) => {
  const [measure, beat] = Tone.Time(pos).toBarsBeatsSixteenths().split(":");
  return `${Number(measure) + 1}:${Number(beat) + 1}`;
});
export const playbackPositionReadble = derived(playbackPosition, (p) =>
  formatDuration(p)
);
