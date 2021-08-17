import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

export default function Set({set, gridIndex, onSetSelected}) {
  const [hovered, setHovered] = useState(false)

  // Compute color
  let setColor = {base: "hsl(251, 49%, 66%)", highlight: "hsl(251, 49%, 58%)"}
  if (set.avg_expiration < 1)
    setColor = {base: "hsl(4, 90%, 70%)", highlight: "hsl(4, 90%, 63%)"}
  else if (set.avg_expiration < 5)
    setColor = {base: "hsl(23, 100%, 70%)", highlight: "hsl(23, 100%, 63%)"}

  return (
    <OuterSet key={set.id}
      layout
      variants={setVariants}
      custom={{gridIndex: gridIndex, setColor: setColor.base}}
      initial={"hidden"} animate={"show"} exit={"hidden"}
      whileHover={{y: -5, backgroundColor: setColor.highlight}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onSetSelected}
    >
      <InnerSet>
        <SetDetails hovered={hovered}>
          <div>{set.flashcards.length + (set.flashcards.length === 1 ? " card" : " cards")}</div>
          <ExpirationContainer>
            <img src="images/repeat.svg" alt="Hourglass"/>
            <div>{(set.avg_expiration || 0) + (set.avg_expiration === 1 ? " day" : " days")}</div>
          </ExpirationContainer>
        </SetDetails>
        <SetTitle>{set.name}</SetTitle>
      </InnerSet>
    </OuterSet>
  )
}

const OuterSet = styled(motion.div)`
  width: 350px;
  height: 200px;

  border-radius: 20px;
  /* border: 1px solid rgba(0, 0, 0, .1); */
  box-shadow: 0 0 50px 1px rgba(0, 0, 0, .2);

  cursor: pointer;
  display: flex;
  
  font-family: "Rubik", sans-serif;
  color: white;
`

const InnerSet = styled(motion.div)`
  position: relative;
  bottom: 2px;
  width: 290px;
  height: 158px;
  margin: auto;
  display: flex;
  flex-direction: column;
`

const SetDetails = styled(motion.div)`
  margin: 0px 2px;
  display: flex;
  justify-content: space-between;
  opacity: ${props => (props.hovered ? 0.65 : 0.5)};
`

const ExpirationContainer = styled(motion.div)`
  display: flex;

  img {
    width: 19px;
  }

  div {
    margin-left: 6px;
  }
`

const SetTitle = styled(motion.div)`
  margin: auto;
  font-size: 2.3rem;
  text-align: center;

  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis; 
`

const setVariants = {
  hidden: data => ({
    opacity: 0,
    backgroundColor: data.setColor,
    transition: {
      duration: 0.2
    }
  }),
  show: data => ({
    opacity: 1,
    transition: {
      delay: data.gridIndex * 0.05
    }
  })
}