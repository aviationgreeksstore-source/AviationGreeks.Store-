import { Variants } from "framer-motion";

// Custom easing mimicking aircraft rotation: smooth pull, linear climb, instant level off
export const takeoffEasing = [0.25, 1, 0.5, 1] as const;

export const takeoffVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: takeoffEasing 
    } 
  }
};

export const hudRevealVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    } 
  }
};

export const approachStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};
