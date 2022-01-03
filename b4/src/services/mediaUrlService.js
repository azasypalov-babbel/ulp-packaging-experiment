import MediaServiceClient from '@lessonnine/media-service-client.js';
import { getMyEnv } from '@lessonnine/my.js';

const { baseSoundsUrl, baseImagesUrl } = getMyEnv();

let mediaServiceClient = null;

const getMediaServiceClient = () => {
  mediaServiceClient = mediaServiceClient ||
  new MediaServiceClient({
    baseImageUrl: baseImagesUrl,
    baseSoundUrl: baseSoundsUrl
  });

  return mediaServiceClient;
};

export default {
  imageURL: function(imageId, dimension = '500x500', format, shape = 'square') {
    const [width, height] = dimension.split('x').map((n) => parseInt(n, 10));

    return getMediaServiceClient().imageUrl(imageId, shape, { width, height }, format);
  },

  soundURL: function(soundId, format = 'mp3') {
    return getMediaServiceClient().soundUrl(soundId, 'normal', format);
  }
};
