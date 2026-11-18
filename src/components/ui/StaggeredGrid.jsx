import { Children } from "react";
import { motion, useReducedMotion } from "motion/react";

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] }
  }
};
const reducedItemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } }
};

const StaggeredGrid = ({ children, className = "", ...rest }) => {
  const shouldReduceMotion = useReducedMotion();
  return <motion.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: shouldReduceMotion ? 0 : 0.025,
            staggerChildren: shouldReduceMotion ? 0 : 0.045
          }
        }
      }}
      {...rest}
    >
      {Children.map(children, (child, index) => <motion.div
          key={child?.key ?? index}
          variants={shouldReduceMotion ? reducedItemVariants : itemVariants}
        >
          {child}
        </motion.div>)}
    </motion.div>;
};

export {
  StaggeredGrid
};
