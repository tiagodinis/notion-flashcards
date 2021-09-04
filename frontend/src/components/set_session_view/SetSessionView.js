import { useState, useEffect, useRef, useContext } from "react"
import { useParams } from "react-router-dom"
import { FadeContext } from "../utilities/FadeContainer"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import SessionHeader from "./SessionHeader"
import Flashcard from "./Flashcard"
import SessionFooter from "./SessionFooter"

export default function SetSessionView() {
  const flashcards = useRef([])
  const setName = useRef("")
  const [showable, setShowable] = useState(null)
  const [exitX, setExitX] = useState("100%")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  let { setID } = useParams()
  const startFade = useContext(FadeContext)

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
    setProgress(flashcards.current.reduce((acc, f) => acc + (f.sessionResult !== undefined ? 1 : 0), 0) / flashcards.current.length)
    // TODO: If all cards tested, show session report
  }

  function skip() {
    if (showable.length > 1)
      setShowable(getShowableCardsFromIndex(showable[1]))
  }

  return (
    <>
      {/* {error && <div>{error}</div>} */}

      {setName &&
        <SessionHeader
          setName={setName.current}
          setSize={flashcards.current.length}
          onGoBack={() => startFade("/")}
          progress={progress}
        />
      }

      {showable !== null &&
        <CardStack>
          <AnimatePresence>
            {showable.length > 2 &&
              <Flashcard
                key={showable[2]} cardData={flashcards.current[showable[2]]}
                // initial={{scale: 0.9, x: 28, opacity: 0}}
                animate={{scale: 0.9, x: 28, opacity: 0.25}}
              />
            }
            {showable.length > 1 &&
              <Flashcard
                key={showable[1]} cardData={flashcards.current[showable[1]]}
                // initial={{scale: 0.9, x: 24, opacity: 0.25}}
                animate={{scale: 0.96, x: 12, opacity: 0.5}}
              />
            }
            {showable.length > 0 &&
              <Flashcard
                key={showable[0]} cardData={flashcards.current[showable[0]]}
                exitX={exitX} setExitX={setExitX}
                skip={skip} setCardResult={setCardResult}
                animate={{scale: 1, x: 0, opacity: 1}}
                drag canFlip
              />
            }
          </AnimatePresence>
        </CardStack>
      }

      {showable && showable.length > 0 &&
        <SessionFooter cardData={flashcards.current[showable[0]]}/>
      }
    </>
  )
}

const CardStack = styled(motion.div)`
  position: relative;
  left: calc(50% - 160px);
  width: 330px;

  display: flex;
`