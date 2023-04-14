import { writable, type Updater, type Writable } from "svelte/store";
import type { Volume } from "tone";
import type { VolumeStore } from "./volume";

export type MuteStore = Writable<boolean>;

export function createMuteStore(
  volumeStore: VolumeStore,
  volume: Volume
): MuteStore {
  const { set, subscribe } = writable(volume.mute);

  let unmutedVolume = volume.volume.value;

  const setMute = (muted: boolean) => {
    // Save volume before mute
    if (muted) {
      unmutedVolume = Math.round(volume.volume.value);
    }

    volume.mute = muted;
    volumeStore.set(muted ? volume.volume.value : unmutedVolume);
    set(muted);
  };

  const updateMute = (updater: Updater<boolean>) => {
    const newValue = updater(volume.mute);
    setMute(newValue);
  };

  return {
    subscribe,
    set: setMute,
    update: updateMute,
  };
}
