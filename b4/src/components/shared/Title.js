import PropTypes from 'prop-types';
import Text from './Text';
import styled from 'styled-components';

const Title = styled(Text)`
  margin-bottom: 2rem;

  & > b, 
  & > i {
    font-family: ${(props) => props.theme.cascada.fontMilliardMediumItalic};
  }
`;

Title.defaultProps = {
  fontFamily: 'fontMilliardSemi',
  fontSize: 'large',
  color: 'spaceGray',
  textAlign: 'center',
  as: 'h1'
};

Title.propTypes = {
  children: PropTypes.any
};

Title.displayName = 'Title';

export default Title;
