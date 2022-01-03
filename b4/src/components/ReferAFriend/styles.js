import styled from 'styled-components';
import Text from '../shared/Text';
import { rem, transparentize } from 'polished';

export const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 2000;
`;

export const StyledFlexWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: center;
`;

export const StyledModalBackdrop = styled.i`
  background: ${(props) => transparentize(0.6, props.theme.cascada.spaceGray)};
  content: '';
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
`;

export const StyledCascadaModal = styled.div`
  background-color: ${(props) => props.theme.cascada.white};
  border: none;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  z-index: 3000;

  @media (min-width: 1024px) {
    border-radius: ${rem(16)};
    max-height: 90%;
    max-width: ${rem(786)};
    height: auto;

    img { max-width: ${rem(768)}; }
  }

  .cascada-modal__close {
    cursor: pointer;
    position: absolute;
    top: ${rem(25)};
    right: ${rem(25)};
  }
`;

export const StyledTextWrapper = styled.div`
  margin: auto;
  text-align: center;
  padding: 0 ${rem(20)} ${rem(40)};
  max-width: ${rem(580)};
`;

export const StyledH1 = styled(Text)`
  color: ${({ theme }) => theme.color.edge.raw.grey.stone};
  display: block;
`;

export const StyledParagraph = styled(Text)`
  color: ${({ theme }) => theme.color.edge.raw.grey.stone};
  display: block;
  max-width: ${rem(416)};
  margin: ${rem(19)} auto ${rem(45)};
`;

export const StyledImage = styled.img`
  margin-top: ${rem(-14)};
`;
