import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  motion,
  useIsPresent,
  useMotionValue,
  useTransform,
} from "framer-motion";
import styled from "styled-components";
import CustomScroller from "react-custom-scroller";
import csStyles from "../../CustomScroller.module.css";
import { clamp, getPercentage, lerp } from "../../utilities/math";
import useWindowSize from "../../utilities/custom_hooks/useWindowSize";

export default function Flashcard(props) {
  const [isDraggingScroller, setIsDraggingScroller] = useState(false);
  const [isRecovered, setIsRecovered] = useState(true);
  const [overlayMsg, setOverlayMsg] = useState("");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragElastic = 0.3;
  const isPresent = useIsPresent();

  const xOverlayLimit = 50;
  const yOverlayLimit = 40;
  const overlayStart = 15;
  const xRange = [-xOverlayLimit, -overlayStart, overlayStart, xOverlayLimit];
  const yRange = [-yOverlayLimit, -overlayStart, overlayStart, yOverlayLimit];
  const overlayTransparency = (props) =>
    props.pos === 0 ? [0.7, 0, 0, 0.7] : [0, 0, 0, 0];
  const overlayXTransparency = useTransform(
    x,
    xRange,
    overlayTransparency(props)
  );
  const overlayYTransparency = useTransform(
    y,
    yRange,
    overlayTransparency(props)
  );
  // (!) Transparency instead of opacity so it is clickable
  const overlayBackgroundColor = useTransform(
    [overlayXTransparency, overlayYTransparency],
    (arr) => "rgba(0, 0, 0, " + (arr[0] + arr[1]) + ")"
  );

  const stampOpacityRange = (props) =>
    props.pos === 0 ? [1, 0, 0, 1] : [0, 0, 0, 0];
  const stampXOpacity = useTransform(x, xRange, stampOpacityRange(props));
  const stampYOpacity = useTransform(y, yRange, stampOpacityRange(props));
  const stampOpacity = useTransform(
    [stampXOpacity, stampYOpacity],
    (arr) => arr[0] + arr[1]
  );

  const xRotLimit = 80;
  const yRotLimit = 70;
  const maxXRot = lerp(getPercentage(props.height, 500, 820), 15, 5);
  const maxYRot = lerp(getPercentage(props.height, 500, 820), 10, 5);
  const rotateZByX = useTransform(
    x,
    [-xRotLimit, xRotLimit],
    props.drag ? [-maxXRot, maxXRot] : [0, 0]
  );
  const rotateZByY = useTransform(
    y,
    [-yRotLimit, yRotLimit],
    props.drag ? [maxYRot, -maxYRot] : [0, 0]
  );
  const rotateZ = useTransform(
    [rotateZByX, rotateZByY],
    (arr) => arr[0] + arr[1]
  );

  const maxFontSize = 80;
  const minFontSize = 16;
  const outerContentEl = useRef();
  const frontInnerContentEl = useRef();
  const backInnerContentEl = useRef();
  const [frontFontSize, setFrontFontSize] = useState(maxFontSize);
  const [backFontSize, setBackFontSize] = useState(maxFontSize);
  const { width, height } = useWindowSize();

  useLayoutEffect(() => {
    setFrontFontSize(maxFontSize);
    setBackFontSize(maxFontSize);
  }, [width, height]);

  useLayoutEffect(() => {
    if (frontFontSize === minFontSize) return;

    const outerRect = outerContentEl.current.getBoundingClientRect();
    const frontInner = frontInnerContentEl.current.getBoundingClientRect();
    if (frontInner.height > outerRect.height)
      setFrontFontSize(frontFontSize - 2);
    else if (frontInner.width > outerRect.width - 16)
      setFrontFontSize(frontFontSize - 2);
  }, [frontFontSize]);

  useLayoutEffect(() => {
    if (
      !props.isFlipped ||
      !backInnerContentEl.current ||
      backFontSize === minFontSize
    )
      return;

    const outerRect = outerContentEl.current.getBoundingClientRect();
    const backInner = backInnerContentEl.current.getBoundingClientRect();
    if (backInner.height > outerRect.height) setBackFontSize(backFontSize - 2);
    else if (backInner.width > outerRect.width - 16)
      setBackFontSize(backFontSize - 2);
  }, [backFontSize, props.isFlipped]);

  useEffect(() => {
    const unsubscribeX = x.onChange(() => {
      if (x.get() === 0) setIsRecovered(true);
    });
    const unsubscribeY = y.onChange(() => {
      if (y.get() === 0) setIsRecovered(true);
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, []);

  // (!) Combine drag and flip rotation transformation sequence (they use different defaults)
  function template({ x, y, rotateZ, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, ${y}, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`;
  }

  function handleDrag(event, info) {
    // (!) Confirm react is not actually setting a new state every frame
    // Clamp motion values and set overlay message
    if (y.get() === 0) {
      // Horizontal movement
      x.set(clamp(x.get(), -xRotLimit, xRotLimit));
      if (x.get() > 0) setOverlayMsg("Correct");
      else if (x.get() < 0) setOverlayMsg("Incorrect");
    } else if (x.get() === 0) {
      // Vertical movement
      y.set(clamp(y.get(), -yRotLimit, yRotLimit));
      if (y.get() > 0) setOverlayMsg("Skip");
      else if (y.get() < 0) setOverlayMsg("Undo");
    }
  }

  function handleDragEnd(event, info) {
    setIsRecovered(false);
    const xAnswerLimit = xOverlayLimit / dragElastic;
    const yAnswerLimit = yOverlayLimit / dragElastic;

    const mValues = { x: x.get(), y: y.get() };

    if (mValues.y === 0) {
      // Horizontal movement
      if (mValues.x <= -xOverlayLimit) {
        props.setExitX(-xAnswerLimit);
        props.setCardResult(false);
      } else if (mValues.x >= xOverlayLimit) {
        props.setExitX(xAnswerLimit);
        props.setCardResult(true);
      }
    } else if (mValues.x === 0) {
      // Vertical movement
      if (mValues.y <= -yOverlayLimit) {
        props.setExitX(0);
        console.log("undo");
      } else if (mValues.y >= yOverlayLimit) {
        props.setExitX(0);
        props.skip();
      }
    }
  }

  return (
    <FlashcardContainer
      isPresent={isPresent}
      onClick={() => {
        if (props.canFlip && !isDraggingScroller && isRecovered)
          props.setIsFlipped(!props.isFlipped);
      }}
      dragDirectionLock
      transformTemplate={template}
      drag={
        isDraggingScroller || !isPresent || !isRecovered ? false : props.drag
      }
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={dragElastic}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      style={{ x: x, y: y, rotateZ: rotateZ, rotateY: 0, scale: 1 }}
      initial={props.initial}
      animate={{ ...props.animate, rotateY: props.isFlipped ? 180 : 0 }}
      transition={{ duration: 0.4, ease: "backOut" }}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 0.75,
        transition: { duration: 0.2 },
      }}
      color={
        props.cardData.expired_in < 1
          ? ["#f7695f", "#f79e97", "#f8d4d1"][props.pos]
          : props.cardData.expired_in < 5
          ? ["#ffa166", "#fcc19c", "#fae2d3"][props.pos]
          : ["#8d7ed3", "#b4abe0", "#ddd9ef"][props.pos]
      }
    >
      <Side
        initial={{ rotateY: "0deg" }}
        isFlipped={props.isFlipped}
        ref={outerContentEl}
      >
        <CustomScroller
          className={csStyles.scroller}
          innerClassName={csStyles.content}
          onMouseDown={() => setIsDraggingScroller(true)}
          onMouseUp={() => setTimeout(() => setIsDraggingScroller(false), 1)}
        >
          <Test onMouseDown={(e) => e.stopPropagation()}>
            <InnerContent ref={frontInnerContentEl} fontSize={frontFontSize}>
              {props.cardData.front.replaceAll("\\n", "\n")}
            </InnerContent>
          </Test>
        </CustomScroller>
      </Side>
      <Side initial={{ rotateY: 180 }} isFlipped={props.isFlipped}>
        {props.isFlipped && ( // (!) Fixes CustomController scroll ambiguity problem
          <CustomScroller
            className={csStyles.scroller}
            innerClassName={csStyles.content}
            onMouseDown={() => setIsDraggingScroller(true)}
            onMouseUp={() => setTimeout(() => setIsDraggingScroller(false), 1)}
          >
            <Test onMouseDown={(e) => e.stopPropagation()}>
              <InnerContent ref={backInnerContentEl} fontSize={backFontSize}>
                {props.cardData.back.replaceAll("\\n", "\n")}
              </InnerContent>
            </Test>
          </CustomScroller>
        )}
      </Side>
      <Overlay style={{ backgroundColor: overlayBackgroundColor }}>
        <OverlayContentOuter
          isFlipped={props.isFlipped}
          overlayMsg={overlayMsg}
          style={{ opacity: stampOpacity }}
        >
          <OverlayContentInner overlayMsg={overlayMsg}>
            {overlayMsg}
          </OverlayContentInner>
        </OverlayContentOuter>
      </Overlay>
    </FlashcardContainer>
  );
}

const FlashcardContainer = styled(motion.div)`
  position: absolute;
  width: calc(min(100vw - 30px, 460px));
  height: calc(min(100vh - 160px, 660px));
  border-radius: 25px;
  background-color: ${(props) => props.color};

  font-family: "Rubik", sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;
  user-select: none;

  transform-style: preserve-3d;

  z-index: ${(props) => (!props.isPresent ? 100 : 0)};
`;

const Side = styled(motion.div)`
  position: absolute;
  backface-visibility: hidden;

  margin-top: 25px;
  margin-left: ${(props) => (props.isFlipped ? -16 : 16)}px;
  width: calc(min(100vw - 74px, 416px));
  height: calc(min(100vh - 210px, 610px));
`;

const InnerContent = styled(motion.div)`
  height: fit-content;
  width: fit-content;
  white-space: pre-wrap;

  font-size: ${(props) => props.fontSize}px;
  text-align: ${(props) => (props.fontSize === 16 ? "left" : "center")};
`;

const Test = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  width: calc(min(100vw - 30px, 460px));
  height: calc(min(100vh - 160px, 660px));
  border-radius: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlayContentOuter = styled(motion.div)`
  transform: rotate(${(props) => (props.isFlipped ? 50 : -50)}deg)
    rotateY(${(props) => (props.isFlipped ? 180 : 0)}deg);
  font-size: 64px;
  padding: 5px;
  border-radius: 50px;
  border: 3px dashed
    ${(props) =>
      props.overlayMsg === "Correct"
        ? "#4bb543"
        : props.overlayMsg === "Incorrect"
        ? "#ca0b00"
        : props.overlayMsg === "Skip"
        ? "#f0d500"
        : "#a670db"};
  pointer-events: none; /* (!) Avoid capturing events */
`;

const OverlayContentInner = styled(motion.div)`
  padding: 0 16px;
  border-radius: 50px;
  color: ${(props) =>
    props.overlayMsg === "Correct"
      ? "#4bb543"
      : props.overlayMsg === "Incorrect"
      ? "#ca0b00"
      : props.overlayMsg === "Skip"
      ? "#f0d500"
      : "#a670db"};
`;
