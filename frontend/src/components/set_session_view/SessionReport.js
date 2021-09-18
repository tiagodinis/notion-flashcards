import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000e1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Frame = styled(motion.div)`
  position: absolute;
  ${'' /* position: fixed; */}
  width: clamp(50%, 500px, 90%);
  height: min(50%, 300px);
  margin: auto;
  ${'' /* top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%); */}
  background-color: #FFF;
  z-index: 1000;
`

export default function SessionReport({setID, flashcards, redo}) {
  let history = useHistory()

  function handleSubmit() {
    history.push("/")
    return null

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

  return (
    <>
      <Overlay
        variants={overlay}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Frame variants={frame}>
          <div>Session Report</div>
          <div>Session Report</div>
          <button onClick={handleSubmit}>Save results</button>
          <button onClick={redo}>Redo</button>
        </Frame>
      </Overlay>
    </>
  )
}

const overlay = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
  },
}

const frame = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
}