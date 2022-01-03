import React from 'react';
import styled, { keyframes }  from 'styled-components';
import BrandIcon from './icons/BrandIcon';

const loaderDashAnimation = keyframes`
  0% {
    stroke-dasharray: 0, 150;
    stroke-dashoffset: 0;
  }
  80% {
    stroke-dasharray: 130, 150;
    stroke-dashoffset: 0;
  }
`;

const loaderScaleAnimation = keyframes`
  0% { transform: scale(0.1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const loaderRotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(90deg); }
`;

const brandIconAnimation = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-30deg) scale(0);
  }
  15% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  85% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(30deg) scale(0);
  }
`;

const StyledLoader = styled.div`
  position: relative;
  height: 4.25rem;
  width: 4.25rem;
`;

const StyledSpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;

  animation: ${loaderRotateAnimation} 1.5s ease infinite alternate;
`;

const BrandIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  animation: ${brandIconAnimation} 3s ease infinite;
`;

const StyledSpinner = styled.svg`
  stroke-dasharray: 130, 150;
  stroke-dashoffset: 0;

  animation: ${loaderScaleAnimation} 1.5s ease infinite alternate;
`;

const StyledCircle = styled.circle`
  stroke: ${(props) => props.theme.cascada.pastelStorm};
`;

const StyledCirclePath = styled.circle`
  stroke: ${(props) => props.theme.cascada.storm};
  animation: ${loaderDashAnimation} 3s ease infinite;
`;

const Loader = () => (
  <StyledLoader>
    <BrandIconWrapper>
      <BrandIcon size="1rem" />
    </BrandIconWrapper>
    <StyledSpinnerWrapper>
      <StyledSpinner viewBox="0 0 50 50">
        <StyledCircle cx="25" cy="25" r="20" fill="none" strokeWidth="3" />
        <StyledCirclePath cx="25" cy="25" r="20" fill="none" strokeWidth="3" />
      </StyledSpinner>
    </StyledSpinnerWrapper>
  </StyledLoader>
);

export default Loader;
