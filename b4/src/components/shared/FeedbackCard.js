import styled, { css } from 'styled-components';
import { rem } from 'polished';
import Card from './Card';

const positiveFeedbackStyles = css`
  background-color: ${(props) => props.theme.cascada.pastelTeal};
  border: 1px solid ${(props) => props.theme.cascada.teal};
`;

const negativeFeedbackStyles = css`
  background-color: ${(props) => props.theme.cascada.pastelRose};
  border: 1px solid ${(props) => props.theme.cascada.red};
`;

const FeedbackCard = styled(Card)`
  display: flex;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: ${rem(460)};
  min-width: ${rem(280)};

  align-content: start;

  & > div:nth-child(2) {
    margin-left: 1rem;

    @media (min-width: 768px) {
      margin-left: 1.5rem;
    }
  }
  @media (min-width: 375px) {
    min-width: ${rem(300)};
  }

  @media (min-width: 768px) {
    padding: 2rem;
    max-width: ${rem(700)};
    min-height: ${rem(120)};
  }

  ${({ positive }) => positive && positiveFeedbackStyles}
  ${({ negative }) => negative && negativeFeedbackStyles}
`;

export default FeedbackCard;
