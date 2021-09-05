import { motion, animate, useMotionValue, useTransform } from "framer-motion"
import { useEffect } from "react"
import styled from "styled-components"
import ArrowHead2SVG from "../svg/ArrowHead2SVG"
import QuestionsMarkSVG from "../svg/QuestionsMarkSVG"

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
        <ArrowHead2SVG color="rgb(158, 158, 167)"/>
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
        <QuestionsMarkSVG dim="18" color="rgb(158, 158, 167)"/>
      </QuestionMark>
    </SessionHeaderContainer>
  )
}

const SessionHeaderContainer = styled.div`
  margin: 25px 15px 30px 15px;
  font-family: "Rubik", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${'' /* border: 1px solid black; */}
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
  font-size: 20px;
  font-weight: bold;
  color: #232039;

  max-height: 48px;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  white-space: normal;
  overflow: hidden;

  /* white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis; */
  /* border: 1px solid black; */
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
