import { createContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

export const FadeContext = createContext();

export default function FadeContainer({ children }) {
  const [fadeOpacityTarget, setFadeOpacityTarget] = useState(1);
  const targetPath = useRef("/");
  const history = useHistory();

  function startFade(newPath) {
    targetPath.current = newPath;
    setFadeOpacityTarget(0);
  }

  return (
    <FadeContext.Provider value={{ startFade, setFadeOpacityTarget }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOpacityTarget }}
        onAnimationComplete={() => {
          if (fadeOpacityTarget === 0) history.push(targetPath.current);
        }}
      >
        {children}
      </motion.div>
    </FadeContext.Provider>
  );
}
