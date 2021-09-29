import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import DisketteSVG from "../svg/DisketteSVG"

import CancelSVG from "../svg/CancelSVG"
import ArrowHead2SVG from "../svg/ArrowHead2SVG"

export default function SessionReport({setID, flashcards, retry}) {
  let history = useHistory()
  const correct = 33
  const incorrect = 7
  const avgLvl = 0.72

  function handleSubmit() {
    history.push("/")
    return null

    const updatedFlashcardExpirations = flashcards.map(f => {
      let currentLvlMaxExpiration = 2 ** f.lvl
      let remainingPercentage = f.expired_in / currentLvlMaxExpiration

      if (f.sessionResult) {
        if (remainingPercentage < 0.35) {
          f.lvl++
          // New expiration is interpolated (shorter the earlier it was answered)
          f.expired_in = (2 ** f.lvl) * (1 - remainingPercentage) 
        }
        else f.expired_in = currentLvlMaxExpiration
      }
      else {
        f.lvl--
        if (f.lvl < 0) f.lvl = 0
        f.expired_in = 0
      }

      return { id: f.id, lvl: f.lvl, expired_in: f.expired_in }
    })

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFlashcardExpirations)
    };

    fetch("/api/flashcards/" + setID, requestOptions)
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        if (data.updateSuccess) history.push("/")
        // TODO: if success change to sets
        // data.updateSuccess
      })
  }

  return (
    <Overlay
      variants={overlay}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Frame variants={frame}>
        <Title>Session results</Title>
        <SessionName>for <i>Botanical names: daily fruits</i></SessionName>
        <Details>
          <Row>
            <Label>Correct:</Label>
            <Value>{correct}</Value>
          </Row>
          <Row>
            <Label>Incorrect:</Label>
            <Value>{incorrect}</Value>
          </Row>
          <Row>
            <Label>Avg. lvl:</Label>
            <Value>{avgLvl}</Value>
          </Row>
        </Details>
        <SaveBtn onClick={handleSubmit} whileHover={{y: -3}}>
          <SaveBtnContent>Save Results</SaveBtnContent>
        </SaveBtn>
        <RetryBtn onClick={retry}>retry session</RetryBtn>
      </Frame>
    </Overlay>
  )
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000000e1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Frame = styled(motion.div)`
  position: absolute;
  border-radius: 5px;
  /* width: clamp(50%, 500px, 90%); */
  /* height: min(90%, 500px); */
  width: 290px;
  height: 350px;
  margin: auto;

  background-color: #FFF;
  z-index: 1000;

  font-family: "Rubik";
`

const Title = styled(motion.div)`
  font-size: 30px;
  text-align: center;
  /* margin-top: 8px; */
  margin-top: 20px;
`

const SessionName = styled(motion.div)`
  text-align: center;
  font-size: 14px;
  color: grey;
`

const Details = styled(motion.div)`
margin-top: 20px;
display: flex;
flex-direction: column;
align-content: center;
`

const Row = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const Label = styled(motion.div)`
  width: 100%;
  height: fit-content;
  margin-bottom: 5px;
  margin-right: 10px;
  text-align: right;
`

const Value = styled(motion.div)`
  width: 100%;
  font-size: 32px;
`

const SaveBtn = styled(motion.div)`
  background-color: hsl(0 0% 24%);
  
  width: 200px;
  height: 60px;
  margin: auto;
  margin-top: 28px;

  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow:
    2px 4px 8px hsl(0 0% 20% / 0.4),
    4px 8px 16px hsl(0 0% 20% / 0.4);

  &:hover {
    background-color: hsl(0 0% 20%);
    box-shadow:
      4px 8px 16px hsl(0 0% 20% / 0.4),
      6px 12px 24px hsl(0 0% 20% / 0.4);

    cursor: pointer;
  }

  transition: background-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
`

const SaveBtnContent = styled(motion.div)`
  position: relative;
  bottom: 1px;
  font-size: 24px;
  color: white;
`

const RetryBtn = styled(motion.div)`
  font-size: 14px;
  width: fit-content;
  margin: auto;
  margin-top: 19px;

  color: #666666;

  &:hover {
    color: #222222;
    cursor: pointer;
  }

  transition: color 0.1s ease-in-out;
`

const overlay = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0.5
    }
  },
}

const frame = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
    transition: {duration: 0.9, ease: "anticipate"}
  },
}