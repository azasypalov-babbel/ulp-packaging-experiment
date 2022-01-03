import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ imageId, imageUrl, noBubble, noFrame }) => {
  const frameClassName = noFrame ? '' : 'image-frame';
  const bubbleClassName = noBubble ? '' : 'image-frame-bubble';
  const className = `${frameClassName} ${bubbleClassName}`;

  return (
    <div className={className}>
      {imageId && <img alt="" src={imageUrl} />}
    </div>
  );
};

Image.propTypes = {
  imageId: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  noBubble: PropTypes.bool,
  noFrame: PropTypes.bool
};

export default Image;
