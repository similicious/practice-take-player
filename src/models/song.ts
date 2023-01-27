export type SongIndex = Array<SongLocator>;

export interface SongLocator {
  name: string;
  url: string;
}

export interface Song {
  name: string;
  tempo: number;
  tracks: TrackLocator[];
}

export interface TrackLocator {
  name: string;
  url: string;
}
