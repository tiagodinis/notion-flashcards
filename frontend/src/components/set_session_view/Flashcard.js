import { useState, useRef, useLayoutEffect } from "react"
import { motion, useIsPresent, useMotionValue, useTransform } from "framer-motion"
import styled from "styled-components"

import CustomScroller from "react-custom-scroller"
import styles from "../../Example.module.css";

export default function Flashcard(props) {
  const [isDraggingScroller, setIsDraggingScroller] = useState(false)
  const isDragging = useRef(false)
  const [overlayMsg, setOverlayMsg] = useState("")
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const dragElastic = 0.3
  const xOverlayLimit = 50
  const yOverlayLimit = 40
  const overlayXTransparency = useTransform(x, [-xOverlayLimit, -7, 7, xOverlayLimit], props.pos === 0 ? [0.7, 0, 0, 0.7] : [0, 0, 0, 0])
  const overlayYTransparency = useTransform(y, [-yOverlayLimit, -7, 7, yOverlayLimit], props.pos === 0 ? [0.7, 0, 0, 0.7] : [0, 0, 0, 0])
  const overlayBackgroundColor = useTransform([overlayXTransparency, overlayYTransparency], arr => "rgba(0, 0, 0, " + (arr[0] + arr[1]) + ")")

  const stampXOpacity = useTransform(x, [-xOverlayLimit, -7, 7, xOverlayLimit], props.pos === 0 ? [1, 0, 0, 1] : [0, 0, 0, 0])
  const stampYOpacity = useTransform(y, [-yOverlayLimit, -7, 7, yOverlayLimit], props.pos === 0 ? [1, 0, 0, 1] : [0, 0, 0, 0])
  const stampOpacity = useTransform([stampXOpacity, stampYOpacity], arr => arr[0] + arr[1])

  const xRotLimit = 80
  const yRotLimit = 70
  const rotateZByX = useTransform(x, [-xRotLimit, xRotLimit], props.drag ? [-15, 15] : [0, 0])
  const rotateZByY = useTransform(y, [-yRotLimit, yRotLimit], props.drag ? [10, -10] : [0, 0])
  const rotateZ = useTransform([rotateZByX, rotateZByY], arr => arr[0] + arr[1])

  const isPresent = useIsPresent()

  const baseFontSize = 80
  const outerContentEl = useRef()
  const frontInnerContentEl = useRef()
  const backInnerContentEl = useRef()
  const [frontFontSize, setFrontFontSize] = useState(baseFontSize)
  const [backFontSize, setBackFontSize] = useState(baseFontSize)

  useLayoutEffect(() => {
    if (frontFontSize === 16) return
    const outerRect = outerContentEl.current.getBoundingClientRect()
    const frontInner = frontInnerContentEl.current.getBoundingClientRect()
    if (frontInner.height > outerRect.height) setFrontFontSize(frontFontSize - 2)
    else if (frontInner.width > 400) setFrontFontSize(frontFontSize - 2)
  }, [frontFontSize])

  useLayoutEffect(() => {
    if (!props.isFlipped || !backInnerContentEl.current || backFontSize === 16) return

    const outerRect = outerContentEl.current.getBoundingClientRect()
    const backInner = backInnerContentEl.current.getBoundingClientRect()
    if (backInner.height > outerRect.height) setBackFontSize(backFontSize - 2)
    else if (backInner.width > (outerRect.width - 16)) setBackFontSize(backFontSize - 2)
  }, [backFontSize, props.isFlipped])

  // (!) Combine drag and flip rotation transformation sequence (they use different defaults)
  function template({ x, y, rotateZ, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, ${y}, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`
  }

  function handleDragElastic(event, info) {
    // Clamp x and y motion values
    function clampMValue(mValue, offset, limit) {
      if (offset < -limit) mValue.set(-limit * dragElastic)
      else if (offset > limit) mValue.set(limit * dragElastic)
    }
    if (y.get() === 0) clampMValue(x, info.offset.x, xRotLimit / dragElastic) // Horizontal movement
    else if (x.get() === 0) clampMValue(y, info.offset.y, yRotLimit / dragElastic) // Vertical movement

    // Set overlay message
    if (y.get() === 0) { // Horizontal movement
      if (info.offset.x > 0) setOverlayMsg("Correct")
      else if (info.offset.x < 0) setOverlayMsg("Incorrect")
    }
    else if (x.get() === 0) { // Vertical movement
      if (info.offset.y > 0) setOverlayMsg("Skip")
      else if (info.offset.y < 0) setOverlayMsg("Undo")
    }
  }

  function handleDragEnd(event, info) {
    setTimeout(() => isDragging.current = false, 1) // (!) Avoid triggering flip
    const xAnswerLimit = xOverlayLimit / dragElastic
    const yAnswerLimit = yOverlayLimit / dragElastic

    if (y.get() === 0) { // Horizontal movement
      if (info.offset.x < -xAnswerLimit) {
        props.setExitX(-xAnswerLimit)
        props.setCardResult(false)
      }
      else if (info.offset.x > xAnswerLimit) {
        props.setExitX(xAnswerLimit)
        props.setCardResult(true)
      }
    }
    else if (x.get() === 0) { // Vertical movement
      if (info.offset.y < -yAnswerLimit) {
        props.setExitX(0)
        console.log("undo")
      }
      else if (info.offset.y > yAnswerLimit) {
        props.setExitX(0)
        props.skip()
      }
    }
  }
  

  return (
    <FlashcardContainer
      isPresent={isPresent}
      onClick={() => {if (props.canFlip && !isDragging.current) props.setIsFlipped(!props.isFlipped)}}
      dragDirectionLock
      transformTemplate={template}
      drag={(isDraggingScroller || !isPresent) ? {} : props.drag}
      dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}}
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDrag={handleDragElastic}
      onDragStart={() => isDragging.current = true}
      onDragEnd={handleDragEnd}
      whileDrag={{cursor: "grabbing"}}
      style={{x: x, y: y, rotateZ: rotateZ, rotateY: 0, scale: 1}}
      initial={props.initial}
      animate={{...props.animate, rotateY: props.isFlipped ? 180 : 0}}
      transition={{duration: 0.4, ease: "backOut"}}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 0.75,
        transition: { duration: 0.2 },
      }}
      color={props.cardData.expired_in < 1 ? ["#f7695f", "#f79e97", "#f8d4d1"][props.pos]
        : props.cardData.expired_in < 5 ? ["#ffa166", "#fcc19c", "#fae2d3"][props.pos]
        : ["#8d7ed3", "#b4abe0", "#ddd9ef"][props.pos]
      }
    >
      <Side initial={{rotateY: "0deg"}}>
        <OuterContent ref={outerContentEl}>
          <CustomScroller className={styles.scroller} innerClassName={styles.content}
            onMouseDown={() => setIsDraggingScroller(true)}
            onMouseUp={() => setIsDraggingScroller(false)}
          >
            <Test onMouseDown={e => e.stopPropagation()}>
              <InnerContent ref={frontInnerContentEl} fontSize={frontFontSize}>
              {props.cardData.front.replaceAll("\\n", "\n")}
              // Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          
// Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.

// Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.
              </InnerContent>
            </Test>
          </CustomScroller>
        </OuterContent>
      </Side>
      <Side initial={{rotateY: 180}}>
        {props.isFlipped && // (!) Fixes CustomController scroll ambiguity problem
          <OuterContent>
            <CustomScroller className={styles.scroller} innerClassName={styles.content}
              onMouseDown={() => setIsDraggingScroller(true)}
              onMouseUp={() => setIsDraggingScroller(false)}
            >
              <Test onMouseDown={e => e.stopPropagation()}>
                <InnerContent ref={backInnerContentEl} fontSize={backFontSize}>
                  {props.cardData.back.replaceAll("\\n", "\n")}
                </InnerContent>
              </Test>
            </CustomScroller>
          </OuterContent>
        }
      </Side>
      <Overlay style={{backgroundColor: overlayBackgroundColor}}>
        <OverlayContentOuter isFlipped={props.isFlipped} overlayMsg={overlayMsg} style={{opacity: stampOpacity}}>
          <OverlayContentInner overlayMsg={overlayMsg}>
            {overlayMsg}
          </OverlayContentInner>
        </OverlayContentOuter>
      </Overlay>
    </FlashcardContainer>
  )
}

const FlashcardContainer = styled(motion.div)`
  position: absolute;
  width: calc(min(100vw - 30px, 460px));
  height: calc(min(100vh - 160px, 660px));
  border-radius: 25px;
  background-color: ${props => props.color};

  font-family: "Rubik", sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;
  user-select: none;

  transform-style: preserve-3d;

  z-index: ${props => !props.isPresent ? 50 : 0};
`

const Side = styled(motion.div)`
  position: absolute;
  backface-visibility: hidden;
`

const OuterContent = styled(motion.div)`
  margin-top: 25px;
  margin-left: 16px;
  width: calc(min(100vw - 74px, 416px));
  height: calc(min(100vh - 210px, 410px));
`

const InnerContent = styled(motion.div)`
  height: fit-content;
  width: fit-content;
  white-space: pre-wrap;

  font-size: ${props => props.fontSize}px;
  text-align: ${props => props.fontSize === 16 ? "left" : "center"};
`

const Test = styled.div`
  display: flex;
  align-items: center;
`

const Overlay = styled(motion.div)`
  width: calc(min(100vw - 30px, 460px));
  height: calc(min(100vh - 160px, 660px));
  border-radius: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
`

const OverlayContentOuter = styled(motion.div)`
  transform: rotate(${props => props.isFlipped ? 50 : -50}deg) rotateY(${props => props.isFlipped ? 180 : 0}deg);
  font-size: 64px;
  padding: 5px;
  border-radius: 50px;
  border: 3px dashed ${props => props.overlayMsg === "Correct" ? "#4bb543"
    : props.overlayMsg === "Incorrect" ? "#ca0b00"
    : props.overlayMsg === "Skip" ? "#f0d500" : "#a670db"
  };
  pointer-events: none; /* (!) Avoid capturing events */
`

const OverlayContentInner = styled(motion.div)`
  padding: 0 16px;
  border-radius: 50px;
  color: ${props => props.overlayMsg === "Correct" ? "#4bb543"
    : props.overlayMsg === "Incorrect" ? "#ca0b00"
    : props.overlayMsg === "Skip" ? "#f0d500" : "#a670db"
  };
`

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          
// Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.

// Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.