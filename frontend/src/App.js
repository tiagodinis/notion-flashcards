import { Switch, Route } from "react-router-dom";
import FadeContainer from "./utilities/components/FadeContainer";
import SetSessionView from "./components/setSessionView/SetSessionView";
import SetSelectionView from "./components/setSelectionView/SetSelectionView";

// (!) Using FadeContainer instead of AnimatePresence
// AnimatePresence needs to always exist while its *direct descendants* are dependent on some state
// But, if Route is its parent, then AnimatePresence would be dependent on the current route
// And it can't go up the tree, as it would stop being the *direct parent* of motion children

export default function App() {
  return (
    <Switch>
      <Route path="/flashcards/:setID">
        <FadeContainer>
          <SetSessionView />
        </FadeContainer>
      </Route>
      <Route path="/">
        <FadeContainer>
          <SetSelectionView />
        </FadeContainer>
      </Route>
    </Switch>
  );
}
