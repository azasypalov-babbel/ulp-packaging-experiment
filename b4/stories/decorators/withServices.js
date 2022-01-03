import React from 'react';
import { withServicesProvider } from '../../src/components/shared/withServices';
import translationService from '../../src/services/translationService';
import soundService from '../../src/services/soundService';

const { translate, init } = translationService;
init({ locale: 'en' });

const getMockServices = () => ({
  translationService: { translate },
  soundService: soundService,
  mediaUrlService: {
    imageURL: () => 'https://placekitten.com/200/300',
    soundURL: (id) => `https://sounds.babbel.com/v1.0.0/sounds/${id}/normal.mp3`
  }
});

const WithServices = withServicesProvider(getMockServices)(({ children }) => (children));

export const withMockServicesProvider =
  (getStory, context) => <WithServices>{getStory(context)}</WithServices>;
