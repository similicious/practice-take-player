import { writable, type Readable } from "svelte/store";
import type { Channel } from "tone";

interface ChannelState {
  volume: number;
  muted: boolean;
  soloed: boolean;
}

interface ChannelActions {
  mute: () => void;
  unmute: () => void;
  solo: () => void;
  unsolo: () => void;
  setVolume: (volume: number) => void;
}

export type ChannelStore = Readable<ChannelState> & ChannelActions;

export function createChannelStore(channel: Channel): ChannelStore {
  const { subscribe, set, update } = writable<ChannelState>({
    volume: Math.round(channel.volume.value),
    muted: channel.muted,
    soloed: channel.solo,
  });

  const mute = () => {
    channel.set({ mute: true, solo: false });
    set({
      volume: Math.round(channel.volume.value),
      muted: true,
      soloed: false,
    });
  };

  const solo = () => {
    channel.set({ mute: false, solo: true });
    set({
      volume: Math.round(channel.volume.value),
      muted: false,
      soloed: true,
    });
  };

  const unmuteAndUnsolo = () => {
    channel.set({ mute: false, solo: false });
    set({
      volume: Math.round(channel.volume.value),
      muted: false,
      soloed: false,
    });
  };

  const setVolume = (volume: number) => {
    channel.set({ volume });
    update((state) => ({ ...state, volume }));
  };

  return {
    subscribe,
    mute,
    unmute: unmuteAndUnsolo,
    solo,
    unsolo: unmuteAndUnsolo,
    setVolume,
  };
}
