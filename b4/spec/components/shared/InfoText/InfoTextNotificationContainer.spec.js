import React from 'react';
import { act } from 'react-dom/test-utils';
import { mountWithTheme } from '../themeMock';
import { InfoTextNotificationContainer }
  from '../../../../src/components/shared/InfoText/InfoTextNotification/InfoTextNotificationContainer';
import  InfoTextNotification
  from '../../../../src/components/shared/InfoText/InfoTextNotification/InfoTextNotification';
import  { InfoTextList }
  from '../../../../src/components/shared/InfoText/InfoTextList';
import { withServicesProvider } from '../../../../src/components/shared/withServices';

const translateMock = jest.fn((key) => key);
const mockServices = () => ({ translationService: { translate: translateMock } });

const TestComponent = withServicesProvider(mockServices)(InfoTextNotificationContainer);

describe('InfoTextNotificationContainer', () => {
  const defaultProps = {
    content: '',
    onDismiss: ()=>{},
    translationService: { translate: () => 'translated label' },
    shouldClearUI: false,
    setShouldClearUI: () => {}
  };

  beforeEach(() => {
    const mountPointContainer = global.document.createElement('div');
    mountPointContainer.setAttribute('id', 'trainer-overlay-mount-point');
    global.document.querySelector('body').appendChild(mountPointContainer);
  });

  it('should start empty', () => {
    const wrappedComponent = mountWithTheme(<TestComponent {...defaultProps} />);
    expect(wrappedComponent.find(InfoTextNotification)).toHaveLength(0);
  });

  it('should do nothing if InfoText is empty', () => {
    const props = Object.assign({}, defaultProps, { content: 'info' });
    const wrappedComponent = mountWithTheme(<TestComponent {...props} />);

    act(()=> wrappedComponent.find(InfoTextNotification).props().dismiss());
    wrappedComponent.setProps({ content: '' });
    wrappedComponent.update();

    expect(wrappedComponent.find(InfoTextNotification)).toHaveLength(0);
  });


  describe('when content changes', () => {
    let wrappedComponent;

    beforeEach(() => {
      wrappedComponent = mountWithTheme(<TestComponent {...defaultProps} />);
      /* eslint-disable jest/no-standalone-expect */
      expect(wrappedComponent.find(InfoTextNotification)).toHaveLength(0);
      wrappedComponent.setProps({ content: 'salut' });
      wrappedComponent.update();
    });


    it('should display a notification style info text', () => {
      expect(wrappedComponent.find(InfoTextNotification)).toHaveLength(1);
    });

    it('should display a list of previous info texts', () => {
      act(()=> wrappedComponent.find(InfoTextNotification).props().showList());
      wrappedComponent.update();
      expect(wrappedComponent.find(InfoTextList)).toHaveLength(1);
    });

    it('dismiss the main notification', () => {
      act(()=> wrappedComponent.find(InfoTextNotification).props().showList());
      wrappedComponent.update();
      expect(wrappedComponent.find(InfoTextNotification)).toHaveLength(0);
    });
  });
});
