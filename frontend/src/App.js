import { Switch, Route } from "react-router-dom"
import FadeContainer from "./utilities/components/FadeContainer"
import SetSessionView from "./components/set_session_view/SetSessionView"
import SetSelectionView from "./components/set_selection_view/SetSelectionView"

export default function App() {
  return (
    <Switch>
      <Route path="/flashcards/:setID">
        <FadeContainer>
          <SetSessionView/>
        </FadeContainer>
      </Route>
      <Route path="/">
        {/* <FadeContainer> */}
          <SetSelectionView/>
        {/* </FadeContainer> */}
      </Route>
    </Switch> 
  )
}