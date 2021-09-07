import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import styled from "styled-components"

import CustomScroller from "react-custom-scroller"
import styles from "../../Example.module.css";

export default function Flashcard(props) {
  const [isDraggingScroller, setIsDraggingScroller] = useState(false)
  const isDragging = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xLimit = 102
  const yLimit = 70
  const rotateZByX = useTransform(x, [-xLimit, xLimit], props.drag ? [-15, 15] : [0, 0])
  const rotateZByY = useTransform(y, [-yLimit, yLimit], props.drag ? [10, -10] : [0, 0])
  const rotateZ = useTransform([rotateZByX, rotateZByY], arr => arr[0] + arr[1])
  
  // Compute color
  let cardColor
  if (props.cardData.expired_in < 1)
    cardColor = ["#f7695f", "#f79e97", "#f8d4d1"][props.pos]
  else if (props.cardData.expired_in < 5)
    cardColor = ["#ffa166", "#fcc19c", "#fae2d3"][props.pos]
  else cardColor = ["#8d7ed3", "#b4abe0", "#ddd9ef"][props.pos]

  // (!) Combine drag and flip rotation transformation sequence (they use different defaults)
  function template({ x, y, rotateZ, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, ${y}, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`
  }

  function handleDragElastic(event, info) {
    function easedClamp(offset, limit, mValue) {
      if (offset < -limit) mValue.set(-limit * 0.3)
      else if (offset > limit) mValue.set(limit * 0.3)
    }

    if (y.get() === 0) easedClamp(info.offset.x, xLimit, x) // Horizontal movement
    else if (x.get() === 0) easedClamp(info.offset.y, yLimit, y) // Vertical movement
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
            <div onMouseDown={e => e.stopPropagation()}>
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
    </FlashcardContainer>
  )
}

const FlashcardContainer = styled(motion.div)`
  position: absolute;
  width: 310px;
  height: 380px;
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

const Side = styled(motion.div)`
  position: absolute;
  backface-visibility: hidden;
`

const Content = styled(motion.div)`
  margin-top: 25px;
  margin-left: 13px;
  width: 266px;
  height: 330px;
  overflow: hidden;
`

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          
// Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.

// Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.