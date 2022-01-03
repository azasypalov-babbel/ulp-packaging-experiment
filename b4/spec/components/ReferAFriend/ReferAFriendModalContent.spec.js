import React from 'react';
import { mountWithTheme } from '../shared/themeMock';
import ReferAFriendModalContent from '../../../src/components/ReferAFriend/ReferAFriendModalContent';


describe('ReferAFriendModalContent', () => {
  let component;
  let onCtaClick;

  beforeEach(() => {
    onCtaClick = jest.fn();
    const defaultProps = {
      title: 'RAF pop up title',
      description: 'RAF pop up description',
      cta: 'RAF CTA text',
      talkableUrl: '/refer-a-friend?traffic_source=lesson-end',
      onCtaClick
    };
    component = mountWithTheme(<ReferAFriendModalContent {...defaultProps} />);
  });

  it('renders', () => {
    expect(component).toMatchSnapshot();
  });

  it('calls onCtaClick when CTA clicked', () => {
    component.find('button').simulate('click');
    expect(onCtaClick).toHaveBeenCalled();
  });
});
