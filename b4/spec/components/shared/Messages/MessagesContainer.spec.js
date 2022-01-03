import React from 'react';
import { shallow } from 'enzyme';
import { MessagesContainer } from '../../../../src/components/shared/Messages/MessagesContainer';
import GenericMessage from '../../../../src/components/shared/Messages/GenericMessage';
import { MESSAGE_KEYS } from '../../../../src/dux/messages/messageKeys';
import { mountWithTheme } from '../themeMock';

jest.mock('../../../../src/components/shared/withServices');
jest.mock('../../../../src/components/shared/Messages/MicGenericMessage', () => () => 'MIC_GENERIC');
jest.mock('../../../../src/components/shared/Messages/MicMutedMessage', () => () => 'MIC_MUTED');
jest.mock('../../../../src/components/shared/Messages/MicPermissionMessage', () => () => 'MIC_PERMISSIONS');
jest.mock('../../../../src/components/shared/Messages/GenericMessage', () => () => 'GENERIC');

describe('MessagesContainer', () => {
  const defaultProps = {
  };

  it('should not render if message null', () => {
    const wrapper = shallow(<MessagesContainer {...defaultProps} />);
    expect(wrapper.html()).toBeNull();
  });

  it('should render MIC_GENERIC', () => {
    const wrapper = shallow(<MessagesContainer {...defaultProps} message={MESSAGE_KEYS.MIC_GENERIC} />);
    expect(wrapper.children().html()).toEqual('MIC_GENERIC');
  });

  it('should render MIC_PERMISSIONS', () => {
    const wrapper = shallow(<MessagesContainer {...defaultProps} message={MESSAGE_KEYS.MIC_PERMISSIONS} />);
    expect(wrapper.children().html()).toEqual('MIC_PERMISSIONS');
  });

  it('should render MIC_MUTED', () => {
    const wrapper = shallow(<MessagesContainer {...defaultProps} message={MESSAGE_KEYS.MIC_MUTED} />);
    expect(wrapper.children().html()).toEqual('MIC_MUTED');
  });

  it('should render GENERIC', () => {
    const wrapper = shallow(<MessagesContainer {...defaultProps} message={MESSAGE_KEYS.GENERIC} />);
    expect(wrapper.children().html()).toEqual('GENERIC');
  });

  it('should render GENERIC message with isReload props for NETWORK error', () => {
    const wrapper = mountWithTheme(<MessagesContainer {...defaultProps} message={MESSAGE_KEYS.NETWORK} />);
    expect(wrapper.children().text()).toEqual('GENERIC');
    expect(wrapper.find(GenericMessage).props().isReload).toEqual(true);
    wrapper.unmount();
  });
});
