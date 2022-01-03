import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { rem } from 'polished';
import styled from 'styled-components';

import { withServices } from '../../shared/withServices';

const StyledImage = styled.img`
  display: none;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;

  width: ${rem(160)};
  height: ${rem(160)};

  margin-left: ${rem(48)};

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    display: flex;
  }
`;

export const TrainerImage = ({ imageId, mediaUrlService }) => {
  const imageUrl = imageId ? mediaUrlService.imageURL(imageId, '200x200') : null;

  return (
    <>
      {imageUrl &&
        <div><StyledImage src={imageUrl} /></div>
      }
    </>
  );
};

TrainerImage.propTypes = {
  imageId: PropTypes.string,
  mediaUrlService: PropTypes.any.isRequired
};

export default compose(withServices(['mediaUrlService']))(TrainerImage);
