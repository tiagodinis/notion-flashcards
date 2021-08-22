import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import Flashcard from "./Flashcard"

export default function SetSessionView() {
  const flashcards = useRef([])
  const setName = useRef("")
  const [showable, setShowable] = useState(null)
  const [exitX, setExitX] = useState("100%")
  const [error, setError] = useState("")
  let { setID } = useParams()

  // Fetch and show session data
  useEffect(() => {
    fetch("/api/flashcards/" + setID)
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        flashcards.current = data.flashcards
        setName.current = data.setName
        setShowable(getShowableCardsFromIndex(0))
        setError("") // FIXME: what is this?
      })
      .catch(err => setError(err.message))
  }, [])

  // Max 3 untested cards from given index forward (looping the array)
  function getShowableCardsFromIndex(from) {
    const length = flashcards.current.length
    let result = []

    for (let i = 0; result.length < 3 && i < length; ++i) {
      const currentIndex = (from + i) % length
      if (flashcards.current[currentIndex].sessionResult === undefined)
        result.push(currentIndex)
    }

    return result
  }

  function setCardResult(isCorrect) {
    flashcards.current[showable[0]].sessionResult = isCorrect
    setShowable(getShowableCardsFromIndex(showable[0]))
    // TODO: If all cards tested, show session report
  }

  function skip() {
    if (showable.length > 1)
      setShowable(getShowableCardsFromIndex(showable[1]))
  } 

  return (
    <>
      {/* {error && <div>{error}</div>} */}

      <SessionHeader>
        <GoBackArrow>...</GoBackArrow>
        <HeaderDataContainer>
          <SetName>{setName.current}</SetName>
          <ProgressContainer>
            <ProgressCardNr>25 cards</ProgressCardNr>
            <ProgressBar>
              <ProgressBarBackground/>
              <ProgressBarForeground/>
            </ProgressBar>
          </ProgressContainer>
        </HeaderDataContainer>
        <QuestionMark>??</QuestionMark>
      </SessionHeader>

      {showable !== null &&
        <CardStack>
          <AnimatePresence>
            {showable.length > 2 &&
              <Flashcard
                key={showable[2]} cardData={flashcards.current[showable[2]]}
                initial={{scale: 0, x: 30, opacity: 0}}
                animate={{scale: 0.9, x: 28, opacity: 0.25}}
              />
            }
            {showable.length > 1 &&
              <Flashcard
                key={showable[1]} cardData={flashcards.current[showable[1]]}
                initial={{scale: 0.9, x: 24, opacity: 0.25}}
                animate={{scale: 0.96, x: 12, opacity: 0.5}}
              />
            }
            {showable.length > 0 &&
              <Flashcard
                key={showable[0]} cardData={flashcards.current[showable[0]]}
                exitX={exitX} setExitX={setExitX}
                setCardResult={setCardResult}
                drag="x"
                animate={{scale: 1, x: 0, opacity: 1}}
                canFlip
              />
            }
          </AnimatePresence>
        </CardStack>
      }

      <button onClick={skip}>Skip</button>
      <button>Undo</button>
    </>
  )
}

const SessionHeader = styled.div`
  font-family: "Rubik", sans-serif;
  display: flex;
  border: 1px solid black;
`

const GoBackArrow = styled.div`
  margin-left: 10px;
  border: 1px solid black;
`

const HeaderDataContainer = styled.div`
  border: 1px solid black;
`

const SetName = styled.div`
  border: 1px solid black;
`

const ProgressContainer = styled.div`
  display: flex;
  border: 1px solid black;
`

const ProgressCardNr = styled.div`
  border: 1px solid black;
`

const ProgressBar = styled.div`
  border: 1px solid black;
`

const ProgressBarBackground = styled.div`
  position: relative;
  top: 6px;
  width: 100px;
  height: 8px;
  background-color: #e2e2e2;
  border-radius: 8px;
`

const ProgressBarForeground = styled.div`
  position: relative;
  top: -2px;
  width: 80px;
  height: 8px;
  background-color: #47c690;
  border-radius: 8px;
`

const QuestionMark = styled.div`
  flex-grow: 1;
  border: 1px solid black;
`

const CardStack = styled(motion.div)`
  position: absolute;
  left: calc(50% - 160px);
  top: 100px;
  width: 330px;

  display: flex;
`