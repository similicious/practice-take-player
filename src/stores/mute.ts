import { writable, type Updater, type Writable } from "svelte/store";
import type { VolumeStore } from "./volume";
import type { ChannelLight } from "../models";

export type MuteStore = Writable<boolean>;

export function createMuteStore(
  volumeStore: VolumeStore,
  channel: ChannelLight
): MuteStore {
  const { set, subscribe } = writable(channel.mute);

  let unmutedVolume = channel.volume.value;

  const setMute = (muted: boolean) => {
    // Save volume before mute
    if (muted) {
      unmutedVolume = Math.round(channel.volume.value);
    }

    channel.mute = muted;
    volumeStore.set(muted ? channel.volume.value : unmutedVolume);
    set(muted);
  };

  const updateMute = (updater: Updater<boolean>) => {
    const newValue = updater(channel.mute);
    setMute(newValue);
  };

  return {
    subscribe,
    set: setMute,
    update: updateMute,
  };
}
