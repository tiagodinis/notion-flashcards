import { motion, animate, useMotionValue, useTransform } from "framer-motion"
import { useEffect } from "react"
import styled from "styled-components"

export default function SessionHeader({ setName, setSize, onGoBack, progress }) {
  const barMaxWidth = 100;
  // (!) Clamp motionValue so it doesn't exceed background bar
  const startingWidth = useMotionValue(0)
  const width = useTransform(startingWidth, [0, barMaxWidth], [0, barMaxWidth]) 
  useEffect(() => {
    const controls = animate(startingWidth, progress * barMaxWidth, {
      type: "spring",
      stiffness: 50,
      onComplete: v => {}
    })
    return controls.stop
  }, [progress])

  return (
    <SessionHeaderContainer>
      <GoBackArrow onClick={onGoBack} initial={{rotate: -90}} whileHover={{x: -3}}>
        <img src={`${process.env.PUBLIC_URL}/images/up-arrow.svg`} alt="Hourglass" width="16"/>
      </GoBackArrow>

      <HeaderDataContainer>
        <SetName>{setName}</SetName>
        <ProgressContainer>
          <SetSize>{setSize} cards</SetSize>
          <ProgressBar maxWidth={barMaxWidth}>
            <div/>
            <motion.div style={{width}}/>
          </ProgressBar>
        </ProgressContainer>
      </HeaderDataContainer>

      <QuestionMark whileHover={{rotate: 10}}>
        <img src={`${process.env.PUBLIC_URL}/images/question-mark.svg`} alt="Question mark" width="18"/>
      </QuestionMark>
    </SessionHeaderContainer>
  )
}

const SessionHeaderContainer = styled.div`
  margin: 25px 15px 0px 15px;
  font-family: "Rubik", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const GoBackArrow = styled(motion.div)`
  padding: 10px;
  cursor: pointer;
`

const HeaderDataContainer = styled.div`
  margin-left: 10px;
  flex-grow: 1;
`

const SetName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #232039;
`

const ProgressContainer = styled.div`
  display: flex;
`

const SetSize = styled.div`
  color: #858391;
`

const ProgressBar = styled(motion.div)`
  --max-width: 200px;

  div:first-child {
    margin-left: 10px;
    position: relative;
    height: 8px;
    border-radius: 8px;
    top: 6px;
    background-color: #e2e2e2;
    width: ${props => props.maxWidth}px;
  }

  div:last-child {
    margin-left: 10px;
    position: relative;
    height: 8px;
    border-radius: 8px;
    top: -2px;
    background-color: #47c690;
  }
`

const QuestionMark = styled(motion.div)`
  padding: 10px;
  cursor: pointer;
`
