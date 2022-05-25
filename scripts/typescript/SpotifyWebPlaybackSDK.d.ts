declare const Spotify: {
  Player: typeof WebPlaybackPlayer;
};

declare class WebPlaybackPlayer {
  constructor(options: {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume: number;
  });

  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event_name: WebPlaybackEvent, callback: (data: any) => any): void;
  removeListener(
    event_name: WebPlaybackEvent,
    callback: (data: any) => any
  ): boolean;
  getCurrentState(): Promise<WebPlaybackState | null>;
  setName(name: string): Promise<void>;
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  togglePlay(): Promise<void>;
  seek(position_ms: number): Promise<void>;
  previousTrack(): Promise<void>;
  nextTrack(): Promise<void>;
  activateElement(): Promise<void>;
}

declare type WebPlaybackEvent =
  | 'ready'
  | 'not_ready'
  | 'player_state_changed'
  | 'autoplay_failed'
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

declare interface WebPlaybackPlayer {
  device_id: string;
}

declare interface WebPlaybackTrack {
  uri: string;
  id: string;
  type: 'track' | 'episode' | 'ad';
  media_type: 'audio' | 'video';
  name: string;
  album: {
    uri: string;
    name: string;
    images: {
      url: string;
      size: 'UNKNOWN' | 'SMALL' | 'LARGE';
      height: number;
      width: number;
    }[];
  };
  artists: { uri: string; name: string }[];
}

declare interface WebPlaybackState {
  context: {
    uri: string;
    metadata: {};
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: 0 | 1 | 2;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack;
    next_tracks: WebPlaybackTrack[];
    previous_tracks: WebPlaybackTrack[];
  };
}
