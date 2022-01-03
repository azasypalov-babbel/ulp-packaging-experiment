import React from 'react';
import { act } from 'react-dom/test-utils';
import { EventEmitter } from 'events';
import { mount } from 'enzyme';
import { OfflineQueueDispatcher } from '../../../src/components/NetworkStatus/OfflineQueueDispatcher';

const mockedEventHost = new EventEmitter();
mockedEventHost.addEventListener = mockedEventHost.addListener.bind(mockedEventHost);
mockedEventHost.removeEventListener = mockedEventHost.removeListener.bind(mockedEventHost);

describe('OfflineQueueDispatcher', () => {
  const mockSetOnline = jest.fn();
  const mockSetOffline = jest.fn();

  afterEach(() => {
    mockSetOnline.mockClear();
    mockSetOffline.mockClear();
  });

  test('renders', () => {
    const component = mount(
      <OfflineQueueDispatcher
        setOnline={mockSetOnline}
        setOffline={mockSetOffline}
        eventHost={mockedEventHost}
      />
    );
    expect(component).toBeTruthy();
    component.unmount();
  });

  describe('#dispatching', () => {
    let wrapper;

    beforeAll(() => {
      act(() => {
        wrapper = mount(
          <OfflineQueueDispatcher
            setOnline={mockSetOnline}
            setOffline={mockSetOffline}
            eventHost={mockedEventHost}
          />
        );
      });
    });

    afterAll(() => {
      wrapper.unmount();
    });

    test('calls setOffline on networkStatus change', () => {
      act(() => {
        mockedEventHost.emit('offline');
      });
      expect(mockSetOffline).toHaveBeenCalledTimes(1);
    });

    test('calls setOnline on networkStatus change', () => {
      act(() => {
        mockedEventHost.emit('online');
      });
      expect(mockSetOnline).toHaveBeenCalledTimes(1);
    });
  });
});
