import styled from 'styled-components';
import { Button } from '../Button/Button';
import { sizeStyles, paddingWithBorderStyles } from '../Button/commonButtonStyles';
import primaryButtonStyles from '../Button/primaryButtonStyles';

export const buttonBorderWidth = '1px';

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const ContentWrapper = styled.span`
  flex: 1 1 100%;
  margin-left: 0.5rem;
`;


export const StyledIconButton = styled(Button)`
  ${paddingWithBorderStyles('1px', '0.75rem')}

  ${sizeStyles}

  min-width: 2.5rem;

  color: ${(props) => props.theme.cascada.storm};

  &:active {
    color: ${(props) => props.theme.cascada.white};
  }

  ${({ primary }) => primary ? primaryButtonStyles : null}

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    min-width: 3rem;
  }
`;

export const StyledIconButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
