import { createContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

export const FadeContext = createContext();

export default function FadeContainer({ children }) {
  const [opacityTarget, setOpacityTarget] = useState(1);
  const targetPath = useRef("/");
  const history = useHistory();

  function startFade(newPath) {
    targetPath.current = newPath;
    setOpacityTarget(0);
  }

  function onFadeOutComplete() {
    if (opacityTarget === 0) {
      history.push(targetPath.current);
      setOpacityTarget(1);
    }
  }

  return (
    <FadeContext.Provider value={startFade}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opacityTarget }}
        onAnimationComplete={onFadeOutComplete}
      >
        {children}
      </motion.div>
    </FadeContext.Provider>
  );
}
