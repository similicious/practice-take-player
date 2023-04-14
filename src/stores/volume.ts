import { writable, type Updater, type Writable } from "svelte/store";
import type { ChannelLight } from "../models";

export type VolumeStore = Writable<number>;

export function createVolumeStore(channel: ChannelLight): VolumeStore {
  const { set, subscribe } = writable(Math.round(channel.volume.value));

  const setVolume = (volumeToSet: number) => {
    channel.volume.value = Math.round(volumeToSet);
    set(volumeToSet);
  };

  const updateVolume = (updater: Updater<number>) => {
    const newValue = updater(channel.volume.value);
    setVolume(newValue);
  };

  return {
    subscribe,
    set: setVolume,
    update: updateVolume,
  };
}
