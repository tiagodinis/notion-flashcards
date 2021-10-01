import { Switch, Route } from "react-router-dom"
import FadeContainer from "./utilities/components/FadeContainer"
import SetSessionView from "./components/set_session_view/SetSessionView"
import SetSelectionView from "./components/set_selection_view/SetSelectionView"

// import { useEffect, useRef } from "react"
// import { ease, lerp } from "./utilities/math"

export default function App() {
  return (
    <Switch>
      <Route path="/flashcards/:setID">
        <FadeContainer>
          <SetSessionView/>
        </FadeContainer>
      </Route>
      <Route path="/">
      {/* <Test/> */}
        <FadeContainer>
          <SetSelectionView/>
        </FadeContainer>
      </Route>
    </Switch> 
  )
}


// export function Test() {
//   const testDiv1 = useRef()
//   const testDiv2 = useRef()

//   const values = [33, 7]
//   const inc = 20

//   function animateResultValue(obj, start, end, duration) {
//     let startTimestamp = null
//     let startSecond = false

//     function step(timestamp) {
//       if (!startTimestamp) startTimestamp = timestamp

//       const elapsedTime = timestamp - startTimestamp
//       const elapsedPercentage = Math.min(elapsedTime / duration, 1)
//       const easedPercentage = ease(elapsedPercentage, 0.5, 0)
//       obj.innerHTML = Math.floor(lerp(easedPercentage, start, end))
      
//       if (elapsedPercentage < 1) window.requestAnimationFrame(step)
//     }

//     window.requestAnimationFrame(step);
//   }

//   return (
//     <>
//       <div ref={testDiv1}
//         onClick={() => animateResultValue(testDiv1.current, 0, values[0], 500 + values[0] * inc)}
//       >0</div>
//       <div ref={testDiv2}
//         onClick={() => animateResultValue(testDiv2.current, 0, values[1], 500 + values[1] * inc)}
//       >0</div>
//     </>
//   )
// }


