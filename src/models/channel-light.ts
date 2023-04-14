import type { Volume } from "tone";

export type ChannelLight = Pick<Volume, "volume" | "mute">;
