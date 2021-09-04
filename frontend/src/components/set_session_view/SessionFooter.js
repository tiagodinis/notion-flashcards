import { useState } from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
// import repeat from "./images/repeat.svg"

export default function SessionFooter(props) {
  return (
    <FooterContainer>
      <div>Front</div>
      <div>
        {/* <img src={`${process.env.PUBLIC_URL}/images/repeat.svg`} alt="Hourglass" width="19"/> */}
        <div>8 days</div>
      </div>
      <div>Lvl. {props.cardData.lvl}</div>
    </FooterContainer>
  )
}

const FooterContainer = styled.div`
  width: 300px;

  position: absolute;
  bottom: 25px;
  left: calc(50% - 150px);

  display: flex;
  justify-content: space-between;
  /* border: 1px solid black; */

  font-family: "Rubik", sans-serif;


`