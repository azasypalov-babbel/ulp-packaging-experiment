import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as features from '../../lib/features';

const fontFamily = ({ fontFamily, theme }) =>
  theme.cascada[fontFamily] || theme.cascada.fontMilliardBook;

const color = ({ color, theme }) =>
  theme.cascada[color] || 'inherit';

const textAlign = ({ textAlign }) =>
  textAlign || 'inherit';

const getFontSize = (theme, sizeName) =>
  theme.size.font[sizeName] || 'inherit';

const Text = styled.span`
  font-size: ${({ fontSize = {}, theme }) => {
    const fontSizeName = typeof fontSize === 'string'
      ? fontSize
      : fontSize.mobile;
    return getFontSize(theme, fontSizeName);
  }};
  font-family: ${fontFamily};
  color: ${color};
  font-weight: normal;
  line-height: 1.25;
  letter-spacing: 0.031rem;
  text-align: ${textAlign};
  ${() => {
    if (features.isWebview()) {
      return 'user-select: none;';
    }
  }};
  ${({ fontSize, theme }) => {
    if (fontSize && fontSize.desktop) {
      return `
        @media (min-width: 768px) {
          font-size: ${getFontSize(theme, fontSize.desktop)};
        }`;
    }
  }}

  & > strong,
  & > b {
    font-family: ${(props) => props.theme.cascada.fontMilliardSemi};
    font-weight: normal;
  }

  & > em,
  & > i {
    font-family: ${(props) => props.theme.cascada.fontMilliardItalic};
    font-weight: normal;
    font-style: normal;
  }

  & > strong em,
  & > b i {
    font-family: ${(props) => props.theme.cascada.fontMilliardMediumItalic};
    font-weight: normal;
  }
`;

const fontSizeNames = [
  'xsmall',
  'small',
  'base',
  'medium',
  'big',
  'large',
  'xlarge',
  'grand'
];

Text.propTypes = {
  fontSize: PropTypes.oneOfType([
    PropTypes.oneOf(fontSizeNames),
    PropTypes.shape({
      desktop: PropTypes.oneOf(fontSizeNames),
      mobile: PropTypes.oneOf(fontSizeNames).isRequired
    })
  ]),
  fontFamily: PropTypes.oneOf([
    'fontMilliardSemi',
    'fontMilliardBook',
    'fontMilliardMedium',
    'fontLeituraBold'
  ]),
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  color: PropTypes.string,
  verticalAlign: PropTypes.string
};

export default Text;
