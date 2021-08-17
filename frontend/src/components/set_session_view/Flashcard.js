import { motion } from "framer-motion"
import { useState } from "react"
import styled from "styled-components"

export default function Flashcard({ cardData }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
<></>


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

// OLD ----------------------------------------------------------------------------------------------------

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