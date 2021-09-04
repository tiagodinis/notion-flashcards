import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import styled from "styled-components"

import CustomScroller from "react-custom-scroller"
import styles from "../../Example.module.css";

export default function Flashcard(props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDraggingScroller, setIsDraggingScroller] = useState(false)
  const isDragging = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateZByX = useTransform(x, [-110, 110], props.drag ? [-15, 15] : [0, 0])
  const rotateZByY = useTransform(y, [-30, 30], props.drag ? [10, -10] : [0, 0])
  const rotateZ = useTransform([rotateZByX, rotateZByY], arr => arr[0] + arr[1])
  
  // (!) Combine drag and flip rotation transformation sequence (they use different defaults)
  function template({ x, y, rotateZ, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, ${y}, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`
  }

  console.log(props.cardData)

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
      onClick={() => {if (props.canFlip && !isDragging.current) setIsFlipped(!isFlipped)}}
      transformTemplate={template}
      dragDirectionLock
      drag={isDraggingScroller ? {} : props.drag}
      dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={() => isDragging.current = true}
      onDragEnd={handleDragEnd}
      whileDrag={{cursor: "grabbing"}}
      style={{x: x, y: y, rotateZ: rotateZ, rotateY: 0, scale: 1}}
      initial={props.initial}
      animate={{...props.animate, rotateY: isFlipped ? 180 : 0}}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 0.75,
        transition: { duration: 0.2 },
      }}
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
        {/* <Footer>
          <div>Front</div>
          <div>8 days</div>
          <div>Lvl. {props.cardData.lvl}</div>
        </Footer> */}
      </Side>
      {/* <Side initial={{rotateY: 180}}>
        <Content>
          <CustomScroller className={styles.scroller} innerClassName={styles.content}>
          {props.cardData.back}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </CustomScroller>
        </Content>
      </Side> */}
    </FlashcardContainer>
  )
}

const FlashcardContainer = styled(motion.div)`
  position: absolute;
  width: 310px;
  height: 420px;
  border-radius: 25px;
  background-color: grey;
  ${'' /* background-color: white; */}
  ${'' /* box-shadow: 0 0 50px 1px rgba(0,0,0,.2); */}

  font-family: "Rubik", sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;
  user-select: none;
`

const Side = styled(motion.div)`
  position: absolute;
  backface-visibility: hidden;
`

const Content = styled(motion.div)`
  margin-top: 25px;
  margin-left: 13px;
  width: 266px;
  height: 370px;
  overflow: hidden;

  /* overflow-y: scroll;
  scrollbar-color: #676767 transparent;
  scrollbar-width: thin;
  scrollbar-gutter: stable;

  &:hover {
    scrollbar-color: #676767 transparent;
  } */
`

const Footer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  /* margin: 16px 13px 0px 13px; */

  div {
    margin: 0px 10px;
  }
`

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          
// Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.

// Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.