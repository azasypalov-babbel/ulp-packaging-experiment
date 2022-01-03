import styled from 'styled-components';

import Text from '../../shared/Text';
import TrainerTitle from '../shared/TrainerTitle';

export const StyledWrapper = styled.div`
  padding: 0 1.5rem;
  max-width: 600px;
  box-sizing: content-box;
  margin: 0 auto;
  @media (max-width: ${({ theme }) => theme.viewports.breakpoints.xxsmall}) {
    padding: 0 1rem;
  }
`;

export const ComprehensionTrainerTitle = styled(TrainerTitle)`
  margin-bottom: 1rem;
  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xxsmall}) {
    margin-bottom: 1rem;
  }
  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    margin-bottom: 1.5rem;
  }
`;

export const StyledDescriptionWrapper = styled.div`
  margin-bottom: 2rem;
  @media (max-width: ${({ theme }) => theme.viewports.breakpoints.xxsmall}) {
    margin-bottom: 1.5rem;
  }
`;

export const StyledText = styled(Text)`
  line-height: 1.5;
`;

StyledText.propTypes = Text.propTypes;
