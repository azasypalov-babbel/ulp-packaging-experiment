import React from 'react';
import ItemPlaybackCard from '../../../src/components/shared/ItemPlaybackCard';
import { shallow } from 'enzyme';

import { stripParantheses } from '../../../src/lib/markupFormatter';
import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  convertFormattingToHtml,
  stripCurlyBracesAndContent
} from '@lessonnine/babbel-markup-helper.js';

jest.mock('../../../src/lib/markupFormatter', () => ({
  stripParantheses: jest.fn((s) => s)
}));
jest.mock('@lessonnine/babbel-markup-helper.js', () => ({
  formatParentheses: jest.fn((s) => s),
  getFirstCorrectSolution: jest.fn((s) => s),
  removeGapFormatting: jest.fn((s) => s),
  convertFormattingToHtml: jest.fn((s) => s),
  stripCurlyBracesAndContent: jest.fn((s) => s)
}));

describe('<ItemPlaybackCard />', () => {
  let component;

  const defaultProps = {
    learnLanguageText: 'Der kleine ((Stapel)) **Karten** "gehört" mir!',
    displayLanguageText: '(Tante) The small stack of "cards" is **mine** (lit. belongs to me)!'
  };

  beforeEach(() => {
    stripParantheses.mockClear();
    formatParentheses.mockClear();
    getFirstCorrectSolution.mockClear();
    removeGapFormatting.mockClear();
    convertFormattingToHtml.mockClear();
    stripCurlyBracesAndContent.mockClear();

    component = shallow(<ItemPlaybackCard {...defaultProps} />);
  });

  test('it renders', () => {
    expect(component).toMatchSnapshot();
  });

  test('calls formatting methods', () => {
    expect(stripParantheses).toHaveBeenCalled();
    expect(formatParentheses).toHaveBeenCalled();
    expect(getFirstCorrectSolution).toHaveBeenCalled();
    expect(removeGapFormatting).toHaveBeenCalled();
    expect(convertFormattingToHtml).toHaveBeenCalled();
    expect(stripCurlyBracesAndContent).toHaveBeenCalled();
  });
});
