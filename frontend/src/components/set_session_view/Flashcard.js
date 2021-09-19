import { useState, useRef } from "react"
import { motion, useDragControls, useMotionValue, useTransform } from "framer-motion"
import styled from "styled-components"

import CustomScroller from "react-custom-scroller"
import styles from "../../Example.module.css";

export default function Flashcard(props) {
  const [isDraggingScroller, setIsDraggingScroller] = useState(false)
  const isDragging = useRef(false)
  const [overlayMsg, setOverlayMsg] = useState("")
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xLimit = 102
  const yLimit = 70
  const overlayTransparency = useTransform(x, [-50, 0, 50], [0.8, 0, 0.8])
  const overlayBackgroundColor = useTransform(overlayTransparency, value => "rgba(0, 0, 0, "+value+")")
  const stampOpacity = useTransform(x, [-50, 0, 50], [1, 0, 1])
  const rotateZByX = useTransform(x, [-xLimit, xLimit], props.drag ? [-15, 15] : [0, 0])
  const rotateZByY = useTransform(y, [-yLimit, yLimit], props.drag ? [10, -10] : [0, 0])
  const rotateZ = useTransform([rotateZByX, rotateZByY], arr => arr[0] + arr[1])

  // Compute color
  let cardColor = ["#8d7ed3", "#b4abe0", "#ddd9ef"][props.pos]
  if (props.cardData.expired_in < 1)
    cardColor = ["#f7695f", "#f79e97", "#f8d4d1"][props.pos]
  else if (props.cardData.expired_in < 5)
    cardColor = ["#ffa166", "#fcc19c", "#fae2d3"][props.pos]

  // (!) Combine drag and flip rotation transformation sequence (they use different defaults)
  function template({ x, y, rotateZ, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, ${y}, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`
  }

  function handleDragElastic(event, info) {
    if (info.offset.x > 0) setOverlayMsg("Correct")
    else if (info.offset.x < 0) setOverlayMsg("Incorrect")
    
    // function easedClamp(offset, limit, mValue) {
    //   if (offset < -limit) mValue.set(-limit * 0.3)
    //   else if (offset > limit) mValue.set(limit * 0.3)
    // }

    // if (y.get() === 0) easedClamp(info.offset.x, xLimit, x) // Horizontal movement
    // else if (x.get() === 0) easedClamp(info.offset.y, yLimit, y) // Vertical movement
  }

  function handleDragEnd(event, info) {
    setTimeout(() => isDragging.current = false, 1) // (!) Avoid triggering flip
    if (y.get() === 0) { // Horizontal movement
      if (info.offset.x < -150) {
        props.setExitX(-250)
        props.setCardResult(false)
      }
      else if (info.offset.x > 150) {
        props.setExitX(250)
        props.setCardResult(true)
      }
    }
    else if (x.get() === 0) { // Vertical movement
      if (info.offset.y > 70) {
        props.skip()
      }
      if (info.offset.y < -70) {
        console.log("undo")
      }
    }
  }

  return (
    <FlashcardContainer
      onClick={() => {if (props.canFlip && !isDragging.current) props.setIsFlipped(!props.isFlipped)}}
      transformTemplate={template}
      dragDirectionLock
      drag={isDraggingScroller ? {} : props.drag}
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
      transition={{duration: 0.35, ease: "backOut"}}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 0.75,
        transition: { duration: 0.2 },
      }}
      color={cardColor}
    >
      <Side initial={{rotateY: "0deg"}}>
        <Content>
          <CustomScroller className={styles.scroller} innerClassName={styles.content}
            onMouseDown={() => setIsDraggingScroller(true)}
            onMouseUp={() => setIsDraggingScroller(false)}
          >
            <div onMouseDown={e => {console.log("here"); e.stopPropagation()}}>
            {props.cardData.front}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            
            Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.
            
            Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.
            </div>
          </CustomScroller>
        </Content>
      </Side>
      <Side initial={{rotateY: 180}}>
        {props.isFlipped && // (!) Fixes CustomController scroll ambiguity problem
          <Content>
            <CustomScroller className={styles.scroller} innerClassName={styles.content}
              onMouseDown={() => setIsDraggingScroller(true)}
              onMouseUp={() => setIsDraggingScroller(false)}
            >
            <div onMouseDown={e => e.stopPropagation()}>
              {props.cardData.back}
              Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.
              </div>
            </CustomScroller>
          </Content>
        }
      </Side>
      <Overlay style={{backgroundColor: overlayBackgroundColor}}>
        <OverlayContentOuter overlayMsg={overlayMsg} style={{opacity: stampOpacity}}>
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
  width: 290px;
  height: 340px;
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
`

const Overlay = styled(motion.div)`
  width: 290px;
  height: 340px;
  border-radius: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
`

const OverlayContentOuter = styled(motion.div)`
  transform: rotate(-50deg);
  font-size: 64px;
  padding: 5px;
  border-radius: 50px;
  border: 3px dashed ${props => props.overlayMsg === "Correct" ? "#4bb543" : "#ca0b00"};
  pointer-events: none; /* (!) Avoid capturing events */
  ${'' /* border: 3px dashed #f0d500; */}
  ${'' /* border: 3px dashed #ca0b00; */}
`

const OverlayContentInner = styled(motion.div)`
  padding: 0 16px;
  border-radius: 50px;
  color: ${props => props.overlayMsg === "Correct" ? "#4bb543" : "#ca0b00"};
  ${'' /* color: #f0d500; */}
  ${'' /* color: #ca0b00; */}
`

const Side = styled(motion.div)`
  position: absolute;
  backface-visibility: hidden;
`

const Content = styled(motion.div)`
  margin-top: 25px;
  margin-left: 13px;
  width: 246px;
  height: 290px;
  overflow: hidden;
`

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          
// Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.

// Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.