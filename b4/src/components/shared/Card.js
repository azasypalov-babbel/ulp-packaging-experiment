import { transparentize, rem } from 'polished';
import styled, { css } from 'styled-components';

const Card = styled.div`
  box-sizing: border-box;
  overflow: hidden;

  background: ${(props) => props.theme.cascada.white};

  border-radius: ${rem('4px')};

  transition: box-shadow 0.3s ease;

  box-shadow: 0 ${rem('2px')} ${rem('20px')} 0 ${(props) => transparentize(0.9, props.theme.cascada.spaceGrayW15)};

  outline: none;

  ${(props) => Boolean(props.onClick) && css`

    cursor: pointer;

    &:hover, &:focus {
      box-shadow: 0 ${rem('8px')} ${rem('40px')} 0 ${(props) => transparentize(0.8, props.theme.cascada.spaceGrayW15)};
    }

    &:active {
      box-shadow: 0 ${rem('2px')} ${rem('10px')} 0 ${(props) => transparentize(0.7, props.theme.cascada.spaceGrayW15)};
    }
  `}
`;

export default Card;
