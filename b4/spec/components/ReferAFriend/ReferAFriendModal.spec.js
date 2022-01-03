import React from 'react';
import { mountWithTheme } from '../shared/themeMock';
import ReferAFriendModal from '../../../src/components/ReferAFriend/ReferAFriendModal';

jest.mock('../../../src/components/ReferAFriend/ReferAFriendModalContent', () => 'ReferAFriendModalContent');

describe('ReferAFriendModal', () => {
  let component;
  let onRender;
  let contentComponent;
  const defaultProps = {
    title: 'RAF title',
    description: 'RAF description',
    cta: 'RAF CTA text',
    talkableUrl: 'https://home.babbel.cn/invite',
    onCtaClick: jest.fn()
  };

  beforeEach(() => {
    onRender = jest.fn();
    component = mountWithTheme(<ReferAFriendModal {...defaultProps } onRender={onRender} />);
    contentComponent = component.find('ReferAFriendModalContent');
  });

  it('renders portal', () => {
    expect(component.find('PortalWithState')).toHaveLength(1);
  });

  it('renders modal', () => {
    expect(component.find('Modal')).toHaveLength(1);
  });

  it('renders content', () => {
    expect(contentComponent).toHaveLength(1);
  });

  it('calls onRender when component mounts', () => {
    expect(onRender).toHaveBeenCalled();
  });

  it('onCtaClick passed to modal content calls onCtaClick from own props', () => {
    contentComponent.props().onCtaClick();
    expect(defaultProps.onCtaClick).toHaveBeenCalled();
  });
});
