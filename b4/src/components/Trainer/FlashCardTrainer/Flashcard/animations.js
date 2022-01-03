const transition =  {
  duration: 300,
  ease: [0.25, 0.1, 0.25, 1]
};

export const poseConfig = {
  preEnter: {
    opacity: 0,
    scale: 0.9,
    y: 10
  },
  enter: {
    transition,
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    rotate: 0
  },
  exit: {
    transition,
    opacity: 0,
    y: 20,
    x: ({ animationExitLeft }) => (animationExitLeft ? -1 : 1) *  20,
    rotate: ({ animationExitLeft }) => animationExitLeft ? -1 : 1,
    applyAtEnd: { position: 'relative', zIndex: 1 },
    applyAtStart: { position: 'absolute', width: '100%', zIndex: 2 }
  }
};
