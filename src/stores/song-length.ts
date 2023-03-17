import { derived, writable } from "svelte/store";

import { formatDuration } from "../utils";

export const songLength = writable(42);
export const songLengthReadble = derived(songLength, (length) =>
  formatDuration(length)
);
