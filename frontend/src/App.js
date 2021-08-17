import { Switch, Route } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import FadeContainer from "./components/utilities/FadeContainer"
import OLD_SetSessionView from "./components/set_session_view/OLD_SetSessionView"
import SetSessionView from "./components/set_session_view/SetSessionView"
import SetSelectionView from "./components/set_selection_view/SetSelectionView"
import Example from "./Example"

export default function App() {
  return (
    <>
      <GlobalStyle/>
      <Switch>
        <Route path="/flashcards/:setID">
          <FadeContainer>
            {/* <OLD_SetSessionView/> */}
            <SetSessionView/>
          </FadeContainer>
        </Route>
        <Route path="/">
          <FadeContainer>
            <SetSelectionView/>
            {/* <Example/> */}
          </FadeContainer>
        </Route>
      </Switch> 
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f9f9f9;
  }
`