import { css } from 'styled-components';

const circleSize = '6rem';

const commonCircleStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${circleSize};
  width: ${circleSize};
  border-radius: 50%;
`;

export default commonCircleStyles;
