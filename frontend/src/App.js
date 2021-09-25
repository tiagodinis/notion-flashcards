import { Switch, Route } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import FadeContainer from "./components/utilities/FadeContainer"
import SetSessionView from "./components/set_session_view/SetSessionView"
import SetSelectionView from "./components/set_selection_view/SetSelectionView"

export default function App() {
  return (
    <>
      <GlobalStyle/>
      <Switch>
        <Route path="/flashcards/:setID">
          <FadeContainer>
            <SetSessionView/>
          </FadeContainer>
        </Route>
        <Route path="/">
          <FadeContainer>
            <SetSelectionView/>
          </FadeContainer>
        </Route>
      </Switch> 
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
  }
`