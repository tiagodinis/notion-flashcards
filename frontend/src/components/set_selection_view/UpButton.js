import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import ArrowHead2SVG from "../svg/ArrowHead2SVG"

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
          <ArrowHead2SVG dim="24" color="rgba(255, 255, 255, 0.75)"/>
        </UpButtonContainer>
      }
    </AnimatePresence>)
}

const UpButtonContainer = styled(motion.div)`
  @media (min-width: 1140px) {
    right: 25px;
    bottom: 20px;
    padding: 16px;
  }

  position: fixed;
  right: 15px;
  bottom: 10px;
  padding: 10px;

  border-radius: 200px;
  background-color: rgba(120, 120, 120, 0.5);

  &:hover{
    background-color: rgba(120, 120, 120, 0.85);
    cursor: pointer;
  }
`