import styled from 'styled-components';
import PropTypes from 'prop-types';

const Icon = styled.svg`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
`;

Icon.propTypes = {
  size: PropTypes.string
};

Icon.defaultProps = {
  size: '1rem'
};

export default Icon;
