import type { Channel, Player } from "tone";
import type { ChannelStore } from "../stores/track-state";

export interface TrackModel {
  name: string;
  channel: Channel;
  channelStore: ChannelStore;
}
