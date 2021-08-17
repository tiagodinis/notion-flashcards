import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
// import Flashcard from "./Flashcard"

import CustomScroller from "react-custom-scroller"
import styles from "../../Example.module.css";

export default function SetSessionView() {
  const flashcards = useRef([])
  const setName = useRef("")
  const [currentFlashcard, setCurrentFlashcard] = useState(null)
  const [error, setError] = useState("")
  let { setID } = useParams()

  // Fetch and show session data
  useEffect(() => {
    fetch("/api/flashcards/" + setID)
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        flashcards.current = data.flashcards
        setName.current = data.setName
        console.log(data.setName)
        setCurrentFlashcard(0)
        setError("")
      })
      .catch(err => setError(err.message))
  }, [])

  return (
    <>
      {/* {error && <div>{error}</div>} */}

      {/* {currentFlashcard !== null && 
        <Flashcard cardData={flashcards.current[currentFlashcard]}/>
      } */}

      <SessionHeader>
        <GoBackArrow>...</GoBackArrow>
        <HeaderDataContainer>
          <SetName>{setName.current}</SetName>
          <ProgressContainer>
            <ProgressCardNr>25 cards</ProgressCardNr>
            <ProgressBar>
              <ProgressBarBackground/>
              <ProgressBarForeground/>
            </ProgressBar>
          </ProgressContainer>
        </HeaderDataContainer>
        <QuestionMark>??</QuestionMark>
      </SessionHeader>

      <Flashcard>
        <CardHeader>
          <CardSide>
            Front
          </CardSide>
          <CardLvl>
            Lvl. 3
          </CardLvl>
        </CardHeader>
        <Content>
          <CustomScroller className={styles.scroller} innerClassName={styles.content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            
            Amet consectetur adipiscing elit ut aliquam purus. Ut diam quam nulla porttitor massa id. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Tempus egestas sed sed risus pretium quam. Aliquam etiam erat velit scelerisque. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Quam nulla porttitor massa id neque. Fermentum et sollicitudin ac orci phasellus. Eget mauris pharetra et ultrices neque ornare. Nullam non nisi est sit amet. Magna etiam tempor orci eu lobortis elementum nibh tellus.
            
            Ut sem nulla pharetra diam sit amet nisl suscipit. Tortor pretium viverra suspendisse potenti nullam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Risus nec feugiat in fermentum posuere urna. Nullam eget felis eget nunc. Nibh mauris cursus mattis molestie. Magna eget est lorem ipsum dolor sit amet consectetur. Sit amet commodo nulla facilisi nullam. Diam vulputate ut pharetra sit amet aliquam id diam maecenas. Id leo in vitae turpis massa. Lacus viverra vitae congue eu consequat ac felis donec. Duis at consectetur lorem donec. Pellentesque nec nam aliquam sem. Orci sagittis eu volutpat odio facilisis. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique.
          </CustomScroller>
        </Content>
        <CardFooter>
          Click to flip
        </CardFooter>
      </Flashcard>
    </>
  )
}

const SessionHeader = styled.div`
  font-family: "Rubik", sans-serif;
  display: flex;
  border: 1px solid black;
`

const GoBackArrow = styled.div`
  margin-left: 10px;
  border: 1px solid black;
`

const HeaderDataContainer = styled.div`
  border: 1px solid black;
`

const SetName = styled.div`
  border: 1px solid black;
`

const ProgressContainer = styled.div`
  display: flex;
  border: 1px solid black;
`

const ProgressCardNr = styled.div`
  border: 1px solid black;
`

const ProgressBar = styled.div`
  border: 1px solid black;
`

const ProgressBarBackground = styled.div`
  position: relative;
  top: 6px;
  width: 100px;
  height: 8px;
  background-color: #e2e2e2;
  border-radius: 8px;
`

const ProgressBarForeground = styled.div`
  position: relative;
  top: -2px;
  width: 80px;
  height: 8px;
  background-color: #47c690;
  border-radius: 8px;
`

const QuestionMark = styled.div`
  flex-grow: 1;
  border: 1px solid black;
`

const Flashcard = styled.div`
  position: absolute;
  left: calc(50% - 160px);
  top: 100px;

  width: 300px;
  /* width: 240px; */
  height: 385px;
  border-radius: 25px;
  background-color: white;
  box-shadow: 0 0 50px 1px rgba(0,0,0,.2);

  font-family: "Rubik", sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const CardHeader = styled.div`
  width: 210px;
  height: 16px;
  margin: 20px 0px;

  display: flex;
  justify-content: space-between;
`

const CardSide = styled.div`
`

const CardLvl = styled.div`
`

const Content = styled.div`
  height: 300px;
  width: 210px;
`

const CardFooter = styled.div`
  margin-top: 5px;
  width: 210px;
  font-size: 12px;
  text-align: center;
`