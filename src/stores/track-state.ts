import { writable, type Readable } from "svelte/store";
import type { Channel } from "tone";

interface ChannelState {
  volume: number;
  mute: boolean;
}

interface ChannelActions {
  mute: () => void;
  unmute: () => void;
  setVolume: (volume: number) => void;
}

export type ChannelStore = Readable<ChannelState> & ChannelActions;

export function createChannelStore(channel: Channel): ChannelStore {
  const { subscribe, set, update } = writable<ChannelState>({
    volume: Math.round(channel.volume.value),
    mute: channel.muted,
  });

  const mute = () => {
    channel.set({ mute: true });
    set({ volume: Math.round(channel.volume.value), mute: true });
  };

  const unmute = () => {
    channel.set({ mute: false });
    set({ volume: Math.round(channel.volume.value), mute: false });
  };

  const setVolume = (volume: number) => {
    channel.set({ volume });
    update((state) => ({ ...state, volume }));
  };

  return {
    subscribe,
    mute,
    unmute,
    setVolume,
  };
}
