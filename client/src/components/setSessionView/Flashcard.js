import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  motion,
  useIsPresent,
  useMotionValue,
  useTransform,
} from "framer-motion";
import styled from "styled-components";
import { clamp, getPercentage, lerp } from "../../utilities/math";
import useWindowSize from "../../utilities/custom_hooks/useWindowSize";

export default function Flashcard(props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isPresent = useIsPresent();
  const dragElastic = 0.3;

  // Overlay and stamp opacity while dragging
  const xOverlayLimit = 50;
  const yOverlayLimit = 40;
  const overlayStart = 15;
  const xRange = [-xOverlayLimit, -overlayStart, overlayStart, xOverlayLimit];
  const yRange = [-yOverlayLimit, -overlayStart, overlayStart, yOverlayLimit];
  const overlayOpacityRange = props.pos === 0 ? [0.7, 0, 0, 0.7] : [0, 0, 0, 0];
  const overlayXOpacity = useTransform(x, xRange, overlayOpacityRange);
  const overlayYOpacity = useTransform(y, yRange, overlayOpacityRange);
  const overlayBackgroundColor = useTransform(
    [overlayXOpacity, overlayYOpacity],
    (arr) => `rgba(0, 0, 0, ${arr[0] + arr[1]})`
  );
  const stampOpacityRange = props.pos === 0 ? [1, 0, 0, 1] : [0, 0, 0, 0];
  const stampXOpacity = useTransform(x, xRange, stampOpacityRange);
  const stampYOpacity = useTransform(y, yRange, stampOpacityRange);
  const stampOpacity = useTransform(
    [stampXOpacity, stampYOpacity],
    (arr) => arr[0] + arr[1]
  );

  // Card rotation while dragging
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

  // Drag and flip unlock after released card snaps into original position
  // (!) This small UX limitation "solves" many framer-motion edge cases
  const [isRecovered, setIsRecovered] = useState(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (!) Unify drag and flip rotation-translation order (they use different defaults!)
  function template({ x, y, rotateZ, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, ${y}, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`;
  }

  // Clamp motion values and set overlay message
  const [overlayMsg, setOverlayMsg] = useState("");
  function handleDrag(event, info) {
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

  // If > threshold, save card results and set appropriate exit target
  function handleDragEnd(event, info) {
    setIsRecovered(false); // Lock interactivity
    const xAnswerLimit = xOverlayLimit / dragElastic;

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

  // Side component font size adjustments
  const maxFontSize = 80;
  const minFontSize = 16;
  const [frontFSize, setFrontFSize] = useState(maxFontSize);
  const [backFSize, setBackFSize] = useState(maxFontSize);
  const [isFrontScrollbarVisible, setIsFrontScrollbarVisible] = useState(false);
  const [isBackScrollbarVisible, setIsBackScrollbarVisible] = useState(true);
  const outerEl = useRef();
  const frontEl = useRef();
  const backEl = useRef();
  const { width, height } = useWindowSize();
  const prevDims = useRef({ width: 0, height: 0 });

  useLayoutEffect(() => {
    // If available space increased, a bigger font size might be possible
    if (width > prevDims.current.width || height > prevDims.current.height) {
      setFrontFSize(maxFontSize);
      setBackFSize(maxFontSize);
    }
    prevDims.current = { width: width, height: height };

    const or = outerEl.current.getBoundingClientRect();
    const fr = frontEl.current.getBoundingClientRect();
    const br = backEl.current.getBoundingClientRect();
    adjustFSize(or, fr, frontFSize, setFrontFSize, setIsFrontScrollbarVisible);
    adjustFSize(or, br, backFSize, setBackFSize, setIsBackScrollbarVisible);

    function adjustFSize(oRect, rect, fontSize, setFontSize, setScrollbar) {
      const isOverflowing =
        rect.height > oRect.height ||
        rect.width > oRect.width - sideToContentDiff;
      if (fontSize === minFontSize) {
        setScrollbar(isOverflowing);
        return;
      } else if (isOverflowing) setFontSize(fontSize - 4);
      setScrollbar(false);
    }
  }, [frontFSize, backFSize, width, height]);

  const Side = ({ isFrontSide }) => (
    <SideContainer
      key={isFrontSide ? "front" : "back"}
      ref={isFrontSide ? outerEl : undefined}
      initial={{ rotateY: isFrontSide ? "0deg" : "180deg" }}
      isFlipped={props.isFlipped}
      scrollbarVisible={
        isFrontSide ? isFrontScrollbarVisible : isBackScrollbarVisible
      }
      color={getExpirationColor(props.cardData.expired_in, props.pos)}
    >
      <Content
        ref={isFrontSide ? frontEl : backEl}
        fontSize={isFrontSide ? frontFSize : backFSize}
        scrollbarVisible={
          isFrontSide ? isFrontScrollbarVisible : isBackScrollbarVisible
        }
      >
        {isFrontSide
          ? props.cardData.front.replaceAll("\\n", "\n")
          : props.cardData.back.replaceAll("\\n", "\n")}
      </Content>
    </SideContainer>
  );

  return (
    <FlashcardContainer
      isPresent={isPresent}
      onClick={() => {
        if (props.canFlip && isRecovered) props.setIsFlipped(!props.isFlipped);
      }}
      dragDirectionLock
      transformTemplate={template}
      drag={!isPresent || !isRecovered ? false : props.drag}
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
      color={getExpirationColor(props.cardData.expired_in, props.pos)}
    >
      <Side isFrontSide />
      <Side />
      <Overlay style={{ backgroundColor: overlayBackgroundColor }}>
        <StampContainer
          isFlipped={props.isFlipped}
          overlayMsg={overlayMsg}
          style={{ opacity: stampOpacity }}
        >
          <StampContent overlayMsg={overlayMsg}>{overlayMsg}</StampContent>
        </StampContainer>
      </Overlay>
    </FlashcardContainer>
  );
}

const basePadding = 30;
const baseMargin = 10;
const scrollbarWidth = 8;
const scrollbarLeftOffset = 10;
const sideToContentDiff = 2 * scrollbarLeftOffset + scrollbarWidth;

const FlashcardContainer = styled(motion.article)`
  position: absolute;
  width: calc(min(100vw - ${baseMargin * 2}px, 460px));
  height: calc(min(100vh - 160px, 660px));

  border-radius: 25px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  user-select: none;
  transform-style: preserve-3d;
  /* (!) Make sure exit animation stays on top of everything */
  z-index: ${(props) => (!props.isPresent ? 100 : 0)};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SideContainer = styled(motion.div)`
  position: absolute;
  top: ${basePadding}px;
  width: calc(min(100vw - ${(basePadding + baseMargin) * 2}px, 400px));
  height: calc(min(100vh - ${basePadding * 2 + 160}px, 600px));
  padding-left: ${scrollbarLeftOffset + scrollbarWidth}px;
  padding-right: ${scrollbarLeftOffset}px;
  backface-visibility: hidden;

  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #cdcdcd ${(props) => props.color};
  ::-webkit-scrollbar {
    width: ${scrollbarWidth}px;
  }
  ::-webkit-scrollbar-track {
    background: ${(props) => props.color};
    border-radius: 100vw;
  }
  ::-webkit-scrollbar-thumb {
    background: #cdcdcd;
    border-radius: 100vw;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #a6a6a6;
  }
  ::-webkit-scrollbar-thumb:active {
    background: #606060;
  }

  display: flex;
  justify-content: center;
  align-items: ${(props) => (props.scrollbarVisible ? "flex-start" : "center")};
`;

const Content = styled.div`
  /* (!) Only start breaking words when minFontSize is reached */
  width: ${(props) =>
    props.scrollbarVisible
      ? `calc(min(100vw - ${(basePadding + baseMargin) * 2}px, 400px))`
      : "auto"};
  overflow-wrap: break-word;
  font-size: ${(props) => props.fontSize}px;
  text-align: ${(props) => (props.fontSize === 16 ? "left" : "center")};
`;

const Overlay = styled(motion.div)`
  pointer-events: none; /* (!) Avoids event capture z fighting with Side */
  position: relative; /* (!) Stays on top of scrollbar track */
  width: 100%;
  height: 100%;
  border-radius: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StampContainer = styled(motion.div)`
  /* (!) Keep message tilt even if card is flipped */
  transform: rotate(${(props) => (props.isFlipped ? 50 : -50)}deg)
    rotateY(${(props) => (props.isFlipped ? 180 : 0)}deg);
  font-size: 64px;
  padding: 5px;
  border-radius: 50px;
  border: 3px dashed ${(props) => overlayMsgColorMap[props.overlayMsg]};
`;

const StampContent = styled.div`
  padding: 0 16px;
  border-radius: 50px;
  color: ${(props) => overlayMsgColorMap[props.overlayMsg]};
`;

const overlayMsgColorMap = {
  Correct: "#4bb543",
  Incorrect: "#ca0b00",
  Skip: "#f0d500",
  Undo: "#a670db",
};

function getExpirationColor(expiration, pos) {
  if (expiration < 1) return ["#f7695f", "#f79e97", "#f8d4d1"][pos];
  else if (expiration < 5) return ["#ffa166", "#fcc19c", "#fae2d3"][pos];
  else return ["#8d7ed3", "#b4abe0", "#ddd9ef"][pos];
}
