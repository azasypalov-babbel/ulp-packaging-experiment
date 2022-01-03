import React from 'react';
import { shallow } from 'enzyme';
import { ReplaceInline } from '../../../src/components/shared/ReplaceInline';

const Test = () => <div>Some Component</div>;

const defaultProps = {
  symbol: '[*]',
  replacement: <Test />
};

describe('ReplaceInline', () => {
  it('should replace symbol with react component', () => {
    const wrapper = shallow(<ReplaceInline {...defaultProps}>Render [*] instead of the symbol</ReplaceInline>);
    expect(wrapper.find(Test)).toHaveLength(1);
  });

  it('should not modify string without symbol', () => {
    const wrapper = shallow(<ReplaceInline {...defaultProps}>Render with no symbol</ReplaceInline>);
    expect(wrapper.children().text()).toEqual('Render with no symbol');
  });
});
