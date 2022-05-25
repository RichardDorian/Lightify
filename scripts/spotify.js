const _Spotify = {
  logger: new Logger('Spotify', '#1ed860'),
  /** @type {WebPlaybackPlayer} */
  player: null,
  async init() {
    Spotify.Player;

    let token;
    while (!token) {
      token = prompt('Please enter your Spotify token');
    }

    const player = new Spotify.Player({
      name: 'Lightify',
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.2,
    });

    _Spotify.player = player;

    for (const key in _Spotify.events) {
      player.addListener(key, _Spotify.events[key]);
    }

    await player.connect();

    // Update UI every second
    setInterval(async () => {
      const currentState = await player.getCurrentState();

      if (!currentState) return;

      _Spotify.updateUI(currentState);
    }, 1000);
  },
  events: {
    ready({ device_id }) {
      _Spotify.logger.log('Ready with Device ID', device_id);
    },
    not_ready(event) {
      _Spotify.logger.error('Device ID has gone offline', event);
    },
    initialization_error(event) {
      _Spotify.logger.error('There was an error initializing', event);
    },
    authentication_error(event) {
      _Spotify.logger.error('There was an error during authentication', event);
    },
    account_error(event) {
      _Spotify.logger.error('There was an error during account', event);
    },
    player_state_changed(event) {
      _Spotify.logger.log('Player state changed', event);
      _Spotify.mediaSession.update();
    },
    autoplay_failed() {
      _Spotify.logger.log(
        'Autoplay is not allowed by the browser autoplay rules'
      );
    },
  },
  updateUI(data) {
    document.getElementById('track').innerText =
      data.track_window.current_track.name;

    document.getElementById('artist').innerText =
      data.track_window.current_track.artists
        .map((artist) => artist.name)
        .join(', ');

    document.getElementsByTagName('img')[0].src =
      data.track_window.current_track.album.images.find(
        (v) => v.size === 'LARGE'
      ).url;

    document.querySelector('label[for="toggle"]').innerText = `Current state: ${
      data.paused ? 'Paused' : 'Playing'
    }`;

    document.querySelector('#track-progress').value =
      Math.round((data.position / data.duration) * 100 * 100) / 100;
  },
  mediaSession: {
    iframe: () => document.querySelector('iframe#spotify-iframe'),
    postMessage(message) {
      _Spotify.mediaSession.iframe().contentWindow.postMessage(message);
    },
    async update() {
      const state = await _Spotify.player.getCurrentState();

      _Spotify.mediaSession.postMessage({
        type: 'mediaSessionUpdate',
        mediaMetadata: {
          title: state.track_window.current_track.name,
          album: state.track_window.current_track.album.name,
          artist: state.track_window.current_track.artists
            .map((a) => a.name)
            .join(', '),
          artwork: state.track_window.current_track.album.images.map((i) => ({
            src: i.url,
            sizes: `${i.width}x${i.height}`,
            type: 'image/png',
          })),
        },
      });
    },
  },
};

window.onSpotifyWebPlaybackSDKReady = _Spotify.init;
