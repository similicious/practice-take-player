import { writable, type Updater, type Writable } from "svelte/store";
import type { Volume } from "tone";

export type VolumeStore = Writable<number>;

export function createVolumeStore(volume: Volume): VolumeStore {
  const { set, subscribe } = writable(Math.round(volume.volume.value));

  const setVolume = (volumeToSet: number) => {
    volume.set({ volume: Math.round(volumeToSet) });
    set(volumeToSet);
  };

  const updateVolume = (updater: Updater<number>) => {
    const newValue = updater(volume.volume.value);
    setVolume(newValue);
  };

  return {
    subscribe,
    set: setVolume,
    update: updateVolume,
  };
}
