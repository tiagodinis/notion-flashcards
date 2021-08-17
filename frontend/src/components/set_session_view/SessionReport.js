import { useHistory } from "react-router-dom"
import styled from "styled-components"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .7);
  /* z-index: 1000; */
`

const Frame = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  background-color: #FFF;
  z-index: 1000;
`

export default function SessionReport({setID, flashcards, open}) {
  let history = useHistory()

  if (!open) return null

  function handleSubmit() {
    const updatedFlashcardExpirations = flashcards.map(f => {
      let currentLvlMaxExpiration = 2 ** f.lvl
      let remainingPercentage = f.expired_in / currentLvlMaxExpiration

      if (f.sessionResult) {
        if (remainingPercentage < 0.35) {
          f.lvl++
          // New expiration is interpolated (shorter the earlier it was answered)
          f.expired_in = (2 ** f.lvl) * (1 - remainingPercentage) 
        }
        else f.expired_in = currentLvlMaxExpiration
      }
      else {
        f.lvl--
        if (f.lvl < 0) f.lvl = 0
        f.expired_in = 0
      }

      return { id: f.id, lvl: f.lvl, expired_in: f.expired_in }
    })

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFlashcardExpirations)
    };

    fetch("/api/flashcards/" + setID, requestOptions)
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        if (data.updateSuccess) history.push("/")
        // TODO: if success change to sets
        // data.updateSuccess
      })
  }

  function redo() {
    console.log("redo")
  }

  return (
    <>
      <Overlay/>
      <Frame>
        <div>Session Report</div>
        <div>Session Report</div>
        <button onClick={handleSubmit}>Save results</button>
        <button onClick={redo}>Redo</button>
      </Frame>
    </>
  )
}