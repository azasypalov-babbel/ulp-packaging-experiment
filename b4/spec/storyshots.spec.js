import { createElement } from 'react';
import initStoryshots, { renderWithOptions } from '@storybook/addon-storyshots';
import Modal from '@lessonnine/react-ui-components.js/lib/Modal';
import {
  useTransliterationProvider
} from '../src/components/Interactions/shared/Transliteration/transliterationProvider';
import { mount } from 'enzyme';
import { useMapUsedTokens } from '../src/components/Interactions/shared/Write/useMapUsedTokens';
import { useSoundPlayer } from '../src/components/Trainer/shared/useSoundPlayer';
import mockSoundService from '../src/services/soundService';

/**
 * When mounting such large portions of the applicaton in an enzyme environment
 * we need to mock several parts of the app.
 */
jest.mock('@lessonnine/my.js');
jest.mock('howler');
jest.mock('@lessonnine/react-ui-components.js/lib/Modal', () => jest.fn());
jest.mock('../src/components/Interactions/shared/Transliteration/transliterationProvider');
jest.mock('../src/components/Interactions/shared/Write/useMapUsedTokens');
jest.mock('../src/components/Trainer/shared/useSoundPlayer');
jest.mock('../src/services/soundService');

useSoundPlayer.mockImplementation(() => mockSoundService.getInstance());

Modal.mockImplementation(() => (createElement('Modal')));
useMapUsedTokens.mockImplementation(() => () => []);
useTransliterationProvider.mockImplementation(() => ({
  isLoading: false,
  entries: [],
  detransliterate: (k) => k,
  transliterate: (k) => k
}));

initStoryshots({
  framework: 'react',
  test: renderWithOptions({
    renderer: mount
  })
});
