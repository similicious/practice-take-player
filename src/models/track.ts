import type { Channel } from "tone";
import type { MuteStore } from "../stores/mute-state";
import type { VolumeStore } from "../stores/volume-state";

export interface TrackModel {
  name: string;
  channel: Channel;
  volume: VolumeStore;
  mute: MuteStore;
}
