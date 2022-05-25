/**
 * @file mediaSession.js
 * @description This file is loaded inside the Spotify iframe
 */

const _MediaSession = {
  logger: new Logger('MediaSession', '#ffffff'),
  isAvailable: false,
  init() {
    if (!('mediaSession' in navigator))
      return _MediaSession.logger.warn('MediaSession is not available');

    _MediaSession.isAvailable = true;

    window.addEventListener('message', _MediaSession.messageHandler);

    navigator.mediaSession.setActionHandler('previoustrack', () =>
      window.postMessage({
        type: 'SP_MESSAGE',
        body: { topic: 'PREV_TRACK' },
      })
    );
    navigator.mediaSession.setActionHandler('nexttrack', () =>
      window.postMessage({ type: 'SP_MESSAGE', body: { topic: 'NEXT_TRACK' } })
    );
  },
  currentMediaSession: null,
  /**
   * @param {MessageEvent} message
   */
  messageHandler(message) {
    if (
      (typeof message.data !== 'object') |
      (typeof message.data.type !== 'string') |
      !_MediaSession.isAvailable
    )
      return;

    switch (message.data.type) {
      case 'mediaSessionUpdate':
        /** @type {MediaMetadataInit} */
        const mediaMetadata = message.data.mediaMetadata;

        if (mediaMetadata == _MediaSession.currentMediaSession) return; // Only update if data is different
        _MediaSession.currentMediaSession = mediaMetadata;

        navigator.mediaSession.metadata = new MediaMetadata(mediaMetadata);
        _MediaSession.logger.log('Updated media session');
        break;

      default:
        break;
    }
  },
};

_MediaSession.init();
