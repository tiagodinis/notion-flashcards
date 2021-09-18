import { createContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"

export const FadeContext = createContext()

export default function FadeContainer({ children }) {
  const [animationTarget, setAnimationTarget] = useState("visible")
  const history = useHistory()
  const targetPath = useRef("/")

  function onFadeOutComplete() {
    if (animationTarget === "hidden") {
      history.push(targetPath.current)
      setAnimationTarget("visible")
    }
  }

  function startFade(newPath) {
    targetPath.current = newPath
    setAnimationTarget("hidden")
  }

  return (
    <FadeContext.Provider value={startFade}>
      <motion.div
        variants={fadeStates}
        initial={"hidden"}
        animate={animationTarget}
        onAnimationComplete={onFadeOutComplete}
      >
        {children}
      </motion.div>
    </FadeContext.Provider>
  )
}

const fadeStates = {
  hidden: { opacity: 0},
  visible: { opacity: 1}
}