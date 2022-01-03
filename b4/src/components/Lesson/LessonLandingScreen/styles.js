import styled from 'styled-components';
import Text from '../../shared/Text';
import Button from '../../shared/Button/Button';

export const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledHeroImage = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: auto;
  flex: 0 1 70%;
  background: center / cover no-repeat url(${(props) => props.src});
  z-index: 1;
`;

export const StyledWrapper = styled.div`
  flex: 1 0 30%;
  box-shadow: 0 0 0.15rem 0.08rem ${(props) => props.theme.cascada.silver};
`;

export const StyledTextWrapper = styled.div`
  max-width: 1024px;
  margin: auto;
  padding: 2.5rem 1.5rem;
  box-sizing: border-box;
`;

export const StyledFlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const StyledH3 = styled(Text)`
  margin-bottom: 1.6rem;
`;

StyledH3.defaultProps = {
  as: 'h3'
};

export const StyledH1 = styled(Text)`
  margin-bottom: 0.4rem;
`;

StyledH3.defaultProps = {
  as: 'h1'
};

export const StyledParagraph = styled(Text)`
  line-height: 1.6;
`;

StyledParagraph.defaultProps = {
  as: 'p'
};

export const StyledButton = styled(Button)`
  margin-top: 1rem;
`;
