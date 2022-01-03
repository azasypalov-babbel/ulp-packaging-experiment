import mediaUrlService from '../../src/services/mediaUrlService';

const mockMediaImageUrl = 'https://path/to/image';
const mockMediaSoundUrl = 'https://path/to/sound';
const mockImageUuid = '1212121';

const mockMediaImageUrlFn = jest.fn(() => mockMediaImageUrl);
const mockMediaSoundUrlFn = jest.fn(() => mockMediaSoundUrl);

jest.mock('@lessonnine/media-service-client.js', () => {
  return jest.fn(() => {
    return {
      imageUrl: mockMediaImageUrlFn,
      soundUrl: mockMediaSoundUrlFn
    };
  });
});

describe('Media API Client', () => {
  beforeEach(() => {
    mockMediaImageUrlFn.mockClear();
    mockMediaSoundUrlFn.mockClear();
  });

  describe('#imageURL', () => {
    test(
      'returns the URL for the given image id, dimension and format in the Babbel media service',
      () => {
        const url = mediaUrlService.imageURL(mockImageUuid, '450x450', 'jpeg');
        expect(mockMediaImageUrlFn).toHaveBeenCalledWith(mockImageUuid, 'square', { width: 450, height: 450 }, 'jpeg');
        expect(url).toBe(mockMediaImageUrl);
      }
    );

    describe('when no "dimension" is given', () => {
      test('uses "500x500" as the resolution', () => {
        mediaUrlService.imageURL(mockImageUuid, undefined, 'jpeg');
        expect(mockMediaImageUrlFn).toHaveBeenCalledWith(mockImageUuid, 'square', { width: 500, height: 500 }, 'jpeg');
      });
    });
  });

  describe('#soundURL', () => {
    test('sets mp3 format as default if none specified', () => {
      const url = mediaUrlService.soundURL(mockImageUuid);
      expect(mockMediaSoundUrlFn).toHaveBeenCalledWith(mockImageUuid, 'normal', 'mp3');
      expect(url).toBe(mockMediaSoundUrl);
    });

    test(
      'returns the URL for the given sound id and format in the Babbel media service',
      () => {
        const url = mediaUrlService.soundURL(mockImageUuid, 'mp3');
        expect(mockMediaSoundUrlFn).toHaveBeenCalledWith(mockImageUuid, 'normal', 'mp3');
        expect(url).toBe(mockMediaSoundUrl);
      }
    );
  });
});
