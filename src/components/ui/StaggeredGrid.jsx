import { Children } from "react";
import { motion, useReducedMotion } from "motion/react";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
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
      animate={shouldReduceMotion ? "visible" : undefined}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.12 }}
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
