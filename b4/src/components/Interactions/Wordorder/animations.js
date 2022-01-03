import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const shakeAnimation = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(0.2rem)' },
  { transform: 'translateX(-0.4rem)' },
  { transform: 'translateX(0.4rem)' },
  { transform: 'translateX(-0.2rem)' },
  { transform: 'translateX(0)' }
];

export const Shake = forwardRef(({ children }, ref) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const animationRef = useRef();
  const animate = () => {
    if (animationRef.current) {
      setIsAnimating(true);
      const animation = animationRef.current.animate(shakeAnimation, { duration: 500 });
      const handleFinish = () => {
        setIsAnimating(false);
      };
      animation.addEventListener('finish', handleFinish, { once: true });
    }
  };

  useImperativeHandle(ref, () => ({ animate }));

  return (
    <div ref={animationRef} >
      {children({ isAnimating })}
    </div>
  );
});

Shake.displayName = 'Shake';

Shake.propTypes = {
  children: PropTypes.func.isRequired
};
