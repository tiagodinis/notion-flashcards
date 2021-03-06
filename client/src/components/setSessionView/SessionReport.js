import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { useRef, useState, useContext } from "react";
import { lerp } from "../../utilities/math";
import ArrowHead1SVG from "../svg/ArrowHead1SVG";
import SessionReportButtons from "./SessionReportButtons";
import { FadeContext } from "../../utilities/components/FadeContainer";
import ErrorAlert from "../../utilities/components/ErrorAlert";

export default function SessionReport({ setID, setName, flashcards, retry }) {
  const { startFade } = useContext(FadeContext);
  const correctRef = useRef();
  const incorrectRef = useRef();
  const avglvlRef = useRef();
  const [avglvlArrowUp, setAvglvlArrowUp] = useState(false);
  const [singleArrow, setSingleArrow] = useState(false);
  const updatedFlashcardExpirations = useRef();
  const avgLvlArrowsControls = useAnimation();
  const [error, setError] = useState("");

  function handleVisibleReport(variantName) {
    if (variantName !== "visible") return;

    const { correct, incorrect, avgLvl } = evalSession();

    // Play number counters animation
    animateResultValue(correctRef.current, 0, correct, 1500, false);
    animateResultValue(incorrectRef.current, 0, incorrect, 1500, false);
    setTimeout(
      () => animateResultValue(avglvlRef.current, 0, avgLvl, 1300, true),
      200
    );

    // Play avgLvlArrows animation
    if (avgLvl !== 0) {
      setSingleArrow(Math.abs(avgLvl) < 0.5);
      setAvglvlArrowUp(avgLvl > 0);
      avgLvlArrowsControls.set({ opacity: 0, y: avgLvl >= 0 ? 50 : -50 });
      setTimeout(playAvgLvlArrowsAnim, 1500);
    }
  }

  function evalSession() {
    let sessionResults = { correct: 0, incorrect: 0, avgLvl: 0 };

    let clonedFlashcards = JSON.parse(JSON.stringify(flashcards)); // (!) JSON obj, it's ok

    updatedFlashcardExpirations.current = clonedFlashcards.map((f) => {
      let currentLvlMaxExpiration = 2 ** f.lvl;
      let remainingPercentage = f.expired_in / currentLvlMaxExpiration;

      if (f.sessionResult) {
        sessionResults.correct++;
        if (remainingPercentage < 0.33) {
          // Lvl up only possible with 2/3 of expiration elapsed
          sessionResults.avgLvl++;
          f.lvl++;
          // New expiration adjusted for answer anticipation
          f.expired_in = 2 ** f.lvl * (1 - remainingPercentage);
        } else f.expired_in = currentLvlMaxExpiration;
      } else {
        sessionResults.incorrect++;
        sessionResults.avgLvl--;
        f.lvl = f.lvl > 0 ? f.lvl - 1 : 0;
        f.expired_in = 0;
      }

      return { id: f.id, lvl: f.lvl, expired_in: f.expired_in };
    });

    sessionResults.avgLvl /= clonedFlashcards.length;

    return sessionResults;
  }

  function animateResultValue(obj, start, end, duration, show2Decimals) {
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;

      const elapsedTime = timestamp - startTimestamp;
      const elapsedPercentage = Math.min(elapsedTime / duration, 1);
      const lerpedNewValue = lerp(elapsedPercentage, start, end);
      if (show2Decimals) obj.innerHTML = parseFloat(lerpedNewValue.toFixed(2));
      else obj.innerHTML = Math.floor(lerpedNewValue);

      if (elapsedPercentage < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  function playAvgLvlArrowsAnim() {
    avgLvlArrowsControls.start({
      opacity: 1,
      y: 0,
      transition: {
        opacity: { delay: 0.1, ease: "linear", duration: 0.4 },
        y: { ease: "backOut", duration: 0.5 },
      },
    });
  }

  async function saveResults() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFlashcardExpirations.current),
    };

    let response;
    try {
      response = await fetch("/api/flashcards/" + setID, requestOptions);
    } catch (err) {
      return setError(err);
    }
    if (!response.ok) return setError(response);

    const data = await response.json();
    if (data.updateSuccess) startFade("/");
  }

  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        delay: 0.5,
      },
    },
  };

  const frameVariants = {
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
      transition: { duration: 0.9, ease: "anticipate" },
    },
  };

  return (
    <Overlay
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {error && <ErrorAlert error={error} />}
      {!error && (
        <Frame
          variants={frameVariants}
          onAnimationComplete={handleVisibleReport}
        >
          <Title>Session results</Title>
          <SessionName>
            for <i>{setName}</i>
          </SessionName>
          <Details>
            <Row>
              <Label>Correct:</Label>
              <Value ref={correctRef}>0</Value>
            </Row>
            <Row>
              <Label>Incorrect:</Label>
              <Value ref={incorrectRef}>0</Value>
            </Row>
            <Row>
              <AvgValueLabel singleArrow={singleArrow}>
                Avg. lvl delta:
              </AvgValueLabel>
              <AvgValueContainer>
                <motion.div ref={avglvlRef}>0</motion.div>
                <SelectArrowContainer
                  upArrow={avglvlArrowUp}
                  singleArrow={singleArrow}
                  initial={{ opacity: 0 }}
                  animate={avgLvlArrowsControls}
                >
                  <ArrowHead1SVG
                    dim="22"
                    color={avglvlArrowUp ? "#58b55b" : "#c93d36"}
                  />
                  <ArrowHead1SVG
                    dim="22"
                    color={
                      singleArrow
                        ? "transparent"
                        : avglvlArrowUp
                        ? "#58b55b"
                        : "#c93d36"
                    }
                  />
                </SelectArrowContainer>
              </AvgValueContainer>
            </Row>
          </Details>
          <SessionReportButtons
            saveCallback={saveResults}
            retryCallback={retry}
            singleArrow={singleArrow}
          />
        </Frame>
      )}
    </Overlay>
  );
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
`;

const Frame = styled(motion.div)`
  position: absolute;
  border-radius: 5px;
  width: 290px;
  height: 350px;
  margin: auto;

  background-color: #fff;
  z-index: 1000;
`;

const Title = styled.div`
  font-size: 30px;
  text-align: center;
  margin-top: 20px;
`;

const SessionName = styled.div`
  text-align: center;
  font-size: 14px;
  color: grey;
`;

const Details = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Label = styled.div`
  width: 100%;
  height: fit-content;
  margin-bottom: 5px;
  margin-right: 10px;
  text-align: right;
`;

const Value = styled.div`
  width: 100%;
  font-size: 32px;
`;

const AvgValueLabel = styled(Label)`
  margin-bottom: ${(props) => (props.singleArrow ? 15 : 12)}px;
`;

const AvgValueContainer = styled(Value)`
  display: flex;
`;

const SelectArrowContainer = styled(motion.div)`
  width: fit-content;

  position: relative;
  left: 4px;
  top: 4px;

  margin-top: ${(props) => (props.singleArrow ? 3 : 0)}px;

  display: flex;
  flex-direction: column;

  svg {
    transform: rotate(${(props) => (props.upArrow ? 180 : 0)}deg);
  }

  svg:last-child {
    position: relative;
    bottom: 14px;
  }
`;
