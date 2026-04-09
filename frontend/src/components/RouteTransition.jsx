import { motion } from 'framer-motion';

const transition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
};

const MotionDiv = motion.div;

const RouteTransition = ({ children }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition }}
      exit={{ opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: 0.16, ease: 'easeInOut' } }}
    >
      {children}
    </MotionDiv>
  );
};

export default RouteTransition;
