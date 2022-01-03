import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  StyledLink
} from './InfoTextNotification/styles';
import Text from '../Text';
import CrossIcon from '../icons/CrossIcon';

const StyledWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: auto;

  background-color: ${(props) => props.theme.cascada.pastelElectric};

  border-radius: 0.25rem;

  padding: 0.8rem;
`;

const StyledContentWrapper = styled.div`
  display: flex;
`;

const StyledCloseLink = styled.a`
  display: inline-flex;
  align-self: flex-start;

  padding: 0.25rem;

  color: ${(props) => props.theme.cascada.spaceGrayW15};
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

const StyledText = styled(Text)`
  flex: 1 1 auto;
  align-self: center;
`;

const InfoText = ({ infoText, translations, onClose, onSeeAll }) =>(
  <StyledWrapper data-selector="info-text">
    <StyledContentWrapper>
      <StyledText
        fontFamily="fontMilliardBook"
        color="spaceGray"
        fontSize="small"
        textAlign="left"
        dangerouslySetInnerHTML={{ __html: infoText }}>
      </StyledText>
      { onClose && <StyledCloseLink
        onMouseDown={e => e.preventDefault()} // Prevents focus change
        onClick={onClose}
        data-selector="dismiss-info-texts"
        tabIndex="0">
        <CrossIcon fillColor={'currentColor'} />
      </StyledCloseLink> }
    </StyledContentWrapper>
    { onSeeAll && <StyledLink
      color="storm"
      fontSize="base"
      fontFamily="fontMilliardSemi"
      textAlign="center"
      onClick={onSeeAll}
      data-selector="view-all-info-texts"
    >
      {translations.seeAll}
    </StyledLink> }
  </StyledWrapper>
);

InfoText.propTypes = {
  infoText: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    seeAll: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func,
  onSeeAll: PropTypes.func
};

export default InfoText;
