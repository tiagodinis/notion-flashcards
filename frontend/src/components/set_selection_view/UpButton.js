import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"

export default function UpButton() {
  const [visibleUpButton, setVisibleUpButton] = useState(false)

  useEffect(() => {
    const showOnScroll = () => setVisibleUpButton(window.pageYOffset > 100)
    window.addEventListener("scroll", showOnScroll)
    return () => window.removeEventListener("scroll", showOnScroll)
  }, []);

  return (
    <AnimatePresence>
      {visibleUpButton &&
        <UpButtonContainer
          initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
          onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
        >
          <img src="images/up-arrow.svg" alt="Hourglass" width="32"/>
        </UpButtonContainer>
      }
    </AnimatePresence>)
}

const UpButtonContainer = styled(motion.div)`
  position: fixed;
  right: 320px;
  bottom: 10px;
  padding: 16px;

  border-radius: 200px;
  background-color: rgba(150, 150, 150, 0.25);

  &:hover{
    background-color: rgba(150, 150, 150, 0.35);
    cursor: pointer;
  }
`