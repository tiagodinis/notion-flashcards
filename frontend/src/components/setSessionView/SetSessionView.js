import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { FadeContext } from "../../utilities/components/FadeContainer";
import { motion, AnimatePresence } from "framer-motion";
import { getPercentage, lerp } from "../../utilities/math";
import { GlobalStyle } from "../../GlobalStyle";
import styled from "styled-components";
import SessionHeader from "./SessionHeader";
import Flashcard from "./Flashcard";
import SessionFooter from "./SessionFooter";
import SessionReport from "./SessionReport";
import useWindowSize from "../../utilities/custom_hooks/useWindowSize";

export default function SetSessionView() {
  const flashcards = useRef([]);
  const setName = useRef("");
  const [showable, setShowable] = useState(null);
  const [exitX, setExitX] = useState("100%");
  const [progress, setProgress] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  let { setID } = useParams();
  const startFade = useContext(FadeContext);
  const { width, height } = useWindowSize();

  // Fetch and show session data
  useEffect(() => {
    fetch("/api/flashcards/" + setID)
      .then((res) => {
        if (!res.ok) throw Error("Could not fetch data for that resource");
        return res.json();
      })
      .then((data) => {
        flashcards.current = data.flashcards;
        setName.current = data.setName;
        setShowable(getShowableCardsFromIndex(0));
      });
  }, []);

  // Max 3 untested cards from given index forward (looping the array)
  function getShowableCardsFromIndex(from) {
    const length = flashcards.current.length;
    let result = [];

    for (let i = 0; result.length < 3 && i < length; ++i) {
      const currentIndex = (from + i) % length;
      if (flashcards.current[currentIndex].sessionResult === undefined)
        result.push(currentIndex);
    }

    return result;
  }

  function setCardResult(isCorrect) {
    flashcards.current[showable[0]].sessionResult = isCorrect;
    setShowable(getShowableCardsFromIndex(showable[0]));
    setIsFlipped(false);
    const isAnswered = (acc, f) =>
      acc + (f.sessionResult === undefined ? 0 : 1);
    const newProgress =
      flashcards.current.reduce(isAnswered, 0) / flashcards.current.length;
    setProgress(newProgress);
    if (newProgress === 1) setResultModalOpen(true);
  }

  function skip() {
    if (showable.length > 1) {
      setShowable(getShowableCardsFromIndex(showable[1]));
      setIsFlipped(false);
    }
  }

  function resetSession() {
    flashcards.current.map((f) => delete f.sessionResult);
    setShowable(getShowableCardsFromIndex(0));
    setProgress(0);
    setResultModalOpen(false);
  }

  return (
    <>
      <GlobalStyle hideScrollbar />

      {setName && (
        <SessionHeader
          setName={setName.current}
          setSize={flashcards.current.length}
          onGoBack={() => startFade("/")}
          progress={progress}
        />
      )}

      {showable && showable.length > 0 && (
        <SessionFooter
          cardData={flashcards.current[showable[0]]}
          isFlipped={isFlipped}
        />
      )}

      {showable !== null && (
        <CardStack>
          <AnimatePresence>
            {showable.length > 2 && (
              <Flashcard
                key={showable[2]}
                pos={2}
                cardData={flashcards.current[showable[2]]}
                initial={false}
                animate={{
                  scale: 0.9,
                  x: lerp(getPercentage(width, 320, 490), 28, 39),
                }}
              />
            )}
            {showable.length > 1 && (
              <Flashcard
                key={showable[1]}
                pos={1}
                cardData={flashcards.current[showable[1]]}
                initial={false}
                animate={{
                  scale: 0.96,
                  x: lerp(getPercentage(width, 320, 490), 12, 17),
                }}
              />
            )}
            {showable.length > 0 && (
              <Flashcard
                key={showable[0]}
                pos={0}
                cardData={flashcards.current[showable[0]]}
                exitX={exitX}
                setExitX={setExitX}
                skip={skip}
                setCardResult={setCardResult}
                animate={{ scale: 1, x: 0 }}
                drag
                canFlip
                width={width}
                height={height}
                isFlipped={isFlipped}
                setIsFlipped={(newFlipState) => setIsFlipped(newFlipState)}
              />
            )}
          </AnimatePresence>
        </CardStack>
      )}

      <AnimatePresence initial={false}>
        {resultModalOpen && (
          <SessionReport
            setID={setID}
            flashcards={flashcards.current}
            retry={resetSession}
          />
        )}
      </AnimatePresence>

      {/* TODO: help modal */}
    </>
  );
}

const CardStack = styled(motion.div)`
  @media (min-height: 820px) {
    top: calc(100px + (100vh - 820px) * 0.4);
  }

  position: absolute;
  --width: calc(min(100vw - 20px, 470px));
  left: calc(50vw - var(--width) * 0.5);
  width: var(---width);

  display: flex;
`;
