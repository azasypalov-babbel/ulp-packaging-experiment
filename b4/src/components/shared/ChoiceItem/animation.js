
export const poseConfig = {
  enter: {
    delay: (props) => props.animationDelayOffset * 60,
    opacity: 1,
    transform: 'translateY(0rem)',
    transition: {
      opacity: {
        ease: 'easeOut',
        delay: 20,
        from: 0,
        duration: 200
      },
      transform: {
        ease: 'easeOut',
        from: 'translateY(2rem)',
        duration: 200
      }
    }
  },
  exit: {
    duration: 100,
    opacity: 0,
    transition: {
      duration: 150
    }
  }
};
