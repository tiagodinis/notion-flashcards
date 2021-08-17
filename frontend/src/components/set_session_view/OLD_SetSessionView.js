import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import Flashcard from "./Flashcard"
import SessionReport from "./SessionReport"

export default function OLD_SetSessionView() {
  const flashcards = useRef([])
  const setName = useRef("")
  const [currentFlashcard, setCurrentFlashcard] = useState(null)
  // const [showReport, setShowReport] = useState(false)
  const [error, setError] = useState("")
  let { setID } = useParams()

  useEffect(() => {
    fetch("/api/flashcards/" + setID)
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        flashcards.current = data.flashcards
        setName.current = data.setName
        setCurrentFlashcard(0)
        setError("")
      })
      .catch(err => setError(err.message))
  }, [])

  // function setResult(isOk) {
  //   flashcards.current[currentFlashcard].sessionResult = isOk;
  //   console.log(flashcards.current)
  //   if (currentFlashcard === flashcards.current.length - 1) setShowReport(true)
  //   else setCurrentFlashcard(currentFlashcard + 1)
  // }

  return (
    <>
      {error && <div>{error}</div>}

      {/* <Top>
        <ProgressBar>
          <ProgressLabel>{(currentFlashcard ? currentFlashcard : 0) + "/" + flashcards.current.length}</ProgressLabel>
        </ProgressBar>
        <Header>{setName.current}</Header>
      </Top> */}

      {currentFlashcard !== null && 
        <Flashcard front={flashcards.current[currentFlashcard].front} back={flashcards.current[currentFlashcard].back}/>
      }

      {/* <Bottom>
        <ResultButton onClick={() => setResult(false)}/>
        <ResultButton isGreen={true} onClick={() => setResult(true)}/>
      </Bottom> */}

      {/* <SessionReport setID={setID} flashcards={flashcards.current}
        open={showReport} onClose={() => setShowReport(false)}/> */}
    </>
  )
}

// const Bottom = styled.div`
//   --height: 100px;

//   position: absolute;
//   top: calc(100% - var(--height));
//   width: 100%;
//   height: var(--height);
//   /* background-color: rgba(0, 0, 0, 0.05); */

//   display: flex;
//   justify-content: center;
//   align-items: center;
// `

// const ResultButton = styled.div`
//   margin: 15px;
//   width: 80px;
//   height: 80px;
//   box-shadow: 0 0 5px 2px rgba(0, 0, 0, .15);
  
//   border-radius: 40px;
//   background-color: ${props => props.isGreen ? "#74af4c" : "#4d434b" }
// `

// const Top = styled.div`
//   position: absolute;
//   width: 100%;
//   height: 120px;
//   /* background-color: rgba(0, 0, 0, 0.1); */

//   display: flex;
//   align-items: center;
// `

// const Header = styled.div`
//   font-family: "Rubik", sans-serif;
//   font-size: 2.9rem;
//   font-weight: 600;
//   /* border: 1px solid black; */
// `

// const ProgressBar = styled.div`
//   flex-shrink: 0;

//   margin: 0 20px 0 20px;
//   --radius: 34px;
//   width: calc(2 * var(--radius));
//   height: calc(2 * var(--radius));
//   border-radius: var(--radius);
//   border: 1px solid black;

//   display: flex;
//   justify-content: center;
//   align-items: center;
// `

// const ProgressLabel = styled.div`
//   /* border: 1px solid black; */
// `

// const Report = styled.div`
//   position: absolute;
//   top: calc(50% - 50px);
//   left: calc(50% - 50px);
//   width: 100px;
//   height: 100px;

//   border: 1px solid black;
// `