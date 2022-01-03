import React from 'react';
import Card from '../../../../src/components/Review/ReviewEndScreen/Card';
import { mount } from 'enzyme';

jest.mock('../../../../src/components/Review/ReviewEndScreen/ReviewItem', () => 'mock-ReviewItem');

const defaultProps = {
  itemsList: [
    { learnLanguageText: 'die Straße', sound: { id: '100afffb3' } },
    { learnLanguageText: 'die Adresse', sound: { id: '101afffb3' } },
    { learnLanguageText: 'die Nationalität', sound: { id: '102afffb3' } }
  ],
  onItemClick: () => {},
  title: 'Correct/Incorrect'
};

jest.useFakeTimers();

describe('<Card />', () => {
  test('Incorrect - it renders with delay', () => {
    const props = Object.assign({}, defaultProps, { type: 'incorrect' });
    const component = mount(
      <Card {...props} />
    );

    jest.runAllTimers();
    component.update();

    expect(component).toMatchSnapshot();
    expect(component.state().currentIndex).toEqual(defaultProps.itemsList.length);
  });

  test('Correct - it renders with delay', () => {
    const props = Object.assign({}, defaultProps, { type: 'correct' });
    const component = mount(
      <Card {...props} />
    );

    jest.runAllTimers();
    component.update();

    expect(component).toMatchSnapshot();
    expect(component.state().currentIndex).toEqual(defaultProps.itemsList.length);
  });
});
