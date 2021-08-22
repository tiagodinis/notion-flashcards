import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import styled from "styled-components"

import CustomScroller from "react-custom-scroller"
import styles from "../../Example.module.css";

export default function Flashcard(props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const isDragging = useRef(false)
  const x = useMotionValue(0)
  const rotateZ = useTransform(x, [-150, 150], props.drag ? [-15, 15] : [0, 0])

  // (!) Combine drag and flip rotation transformation sequence (they use different defaults)
  function template({ rotateZ, x, rotateY, scale }) {
    return `perspective(1000px) translate3d(${x}, 0px, 0px) rotateZ(${rotateZ}) rotateY(${rotateY}) scale(${scale})`
  }

  function handleDragEnd(event, info) {
    setTimeout(() => isDragging.current = false, 1) // (!) Avoid triggering flip
    if (info.offset.x < -100) {
      props.setExitX(-250)
      props.setCardResult(false)
    }
    else if (info.offset.x > 100) {
      props.setExitX(250)
      props.setCardResult(true)
    }
  }

  return (
    <FlashcardContainer
      onClick={() => {if (props.canFlip && !isDragging.current) setIsFlipped(!isFlipped)}}
      transformTemplate={template}
      drag={props.drag}
      dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}}
      onDragStart={() => isDragging.current = true}
      onDragEnd={handleDragEnd}
      whileDrag={{cursor: "grabbing"}}
      style={{x: x, rotateZ: rotateZ, rotateY: 0, scale: 1}}
      initial={props.initial}
      animate={{...props.animate, rotateY: isFlipped ? 180 : 0}}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 0.75,
        transition: { duration: 0.2 },
      }}
    >
      <Side>
        <CardHeader>
          <CardSide>Front</CardSide>
          <CardLvl>Lvl. {props.cardData.lvl}</CardLvl>
        </CardHeader>
        <Content>
          <CustomScroller className={styles.scroller} innerClassName={styles.content}>
            {props.cardData.front}
          </CustomScroller>
        </Content>
        <CardFooter>
          Click to flip
        </CardFooter>
      </Side>
    </FlashcardContainer>


      // <Card
      //   onClick={() => setIsFlipped(!isFlipped)}
      //   style={{transformPerspective: "600px"}}
      //   animate={{rotateX: isFlipped ? 180 : 0}}
      //   transition={{duration: 0.4}}
      // >
      //   {/* <Arrow/> */}
      //   <Content>
      //   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu
      //   </Content>
      //   {/* <Arrow/> */}
      //   <PageIndicator>
      //     <IndicatorBall />
      //     <IndicatorBall selected/>
      //     <IndicatorBall />
      //   </PageIndicator>
      //   {/* <Content initial={{rotateX: "0deg"}}>{cardData.front}</Content> */}
      //   {/* <Content initial={{rotateX: 180}}>{cardData.back}</Content> */}
      // </Card>
  )
}

const Side = styled(motion.div)`

`

const FlashcardContainer = styled(motion.div)`
  position: absolute;

  width: 300px;
  height: 385px;
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

const CardHeader = styled(motion.div)`
  width: 210px;
  height: 16px;
  margin: 20px 0px;

  display: flex;
  justify-content: space-between;
`

const CardSide = styled(motion.div)`
`

const CardLvl = styled(motion.div)`
`

const Content = styled(motion.div)`
  height: 300px;
  width: 210px;
`

const CardFooter = styled(motion.div)`
  margin-top: 5px;
  width: 210px;
  font-size: 12px;
  text-align: center;
`

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          
// Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.

// Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.

// OLD ---------------------------------------------------------------------------------------

// const Card = styled(motion.div)`
//   position: absolute;
//   left: calc(50% - 160px);
//   top: calc(60% - 100px);

//   width: 320px;
//   height: 200px;
//   border-radius: 20px;
//   box-shadow: 0 0 50px 1px rgba(0, 0, 0, .2);
//   background-color: hsl(251, 49%, 66%);

//   display: flex;
//   align-items: center;
//   justify-content: center;

//   cursor: pointer;
//   user-select: none;
// `

// const Content = styled(motion.div)`
//   position: relative;
//   bottom: 8px;
//   box-sizing: border-box;
//   padding: 0px 50px;
//   /* background-color: red;  */
//   font-family: "Rubik",sans-serif;
//   text-justify: center;
// `

// const Arrow = styled(motion.div)`
//   width: 20px;
//   height: 20px;
//   background-color: green;
// `

// const PageIndicator = styled(motion.div)`
//   position: absolute;
//   bottom: 15px;

//   /* width: 200px; */
//   /* height: 50px; */
//   /* border: 1px solid black; */

//   display: flex;
//   justify-content: center;
//   align-items: center;
// `

// const IndicatorBall = styled(motion.div)`
//   --radius: 8px;
//   width: var(--radius);
//   height: var(--radius);
//   border-radius: var(--radius);
//   margin: 3px;
//   background-color: rgba(255, 255, 255, ${props => props.selected ? 1 : 0.5});
// `


// // const Content = styled(motion.div)`
// //   position: absolute;
// //   backface-visibility: hidden;

// //   font-family: "Montserrat", sans-serif;
// // `