import React from 'react';
import { shallow } from 'enzyme';
import { MicGenericMessage } from
  '../../../../src/components/shared/Messages/MicGenericMessage';

describe('<MicGenericMessage />', () => {
  const mockTrack = jest.fn();
  const props = {
    setMicSettings: jest.fn(),
    navigationService: {
      reload: jest.fn()
    },
    locale: 'en',
    learnLanguageAlpha3: 'DEU',
    track: mockTrack,
    isReview: false,
    translations: {
      errorGenericReview: {
        title: 'speech_recognition.error_generic_review.title',
        body: 'speech_recognition.error_generic_review.body',
        cta: 'speech_recognition.error_generic_review.cta'
      },
      errorGenericLesson: {
        title: 'speech_recognition.error_generic_lesson.title',
        body: 'speech_recognition.error_generic_lesson.body',
        cta: 'speech_recognition.error_generic_lesson.cta'
      }
    }
  };

  test('tracks gui:shown', () => {
    shallow(<MicGenericMessage {...props} />);

    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
  });

  test('renders', () => {
    const wrapper = shallow(<MicGenericMessage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('tracks gui:interacted on click', () => {
    const wrapper = shallow(<MicGenericMessage {...props} />);
    const ctaButton = wrapper.find('[data-selector="cta-button"]');
    mockTrack.mockClear();
    ctaButton.simulate('click');

    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
  });

  test('page gets reloaded', () => {
    const wrapper = shallow(<MicGenericMessage {...props} />);
    const ctaButton = wrapper.find('[data-selector="cta-button"]');
    ctaButton.simulate('click');

    expect(props.navigationService.reload).toHaveBeenCalledTimes(1);
  });
});
