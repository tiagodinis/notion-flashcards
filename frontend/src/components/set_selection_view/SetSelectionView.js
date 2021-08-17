import { useState, useEffect, useRef, useContext } from "react"
import { FadeContext } from "../utilities/FadeContainer"
import { AnimatePresence } from "framer-motion"
import styled from "styled-components"
import SearchBar from "./SearchBar"
import Set from "./Set"
import UpButton from "./UpButton"

export default function SetSelectionView() {
  const sets = useRef([])
  const [visibleSets, setVisibleSets] = useState([])
  const [searchStr, setSearchStr] = useState("")
  const [sortMetric, setSortMetric] = useState("A-Z")
  const [error, setError] = useState("")
  const startFade = useContext(FadeContext)

  // Fetch and show set data
  useEffect(() => {
    fetch("/api/sets")
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        sets.current = data
        filterAndSort()
      })
      .catch(err => setError(err.message))
  }, [])

  // Update visible sets on search term or sort metric change
  useEffect(filterAndSort, [searchStr, sortMetric])

  function filterAndSort() {
    const lcSearchStr = searchStr.toLowerCase()
    const filteredSets = sets.current.filter(s => s.name.toLowerCase().includes(lcSearchStr))
    setVisibleSets(sortMap[sortMetric](filteredSets))
  }

  const sortMap = {
    "A-Z": sets => sets.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    "Z-A": sets => sets.sort((b, a) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    "Stalest": sets => sets.sort((a, b) => a.avg_expiration - b.avg_expiration),
    "Freshest": sets => sets.sort((b, a) => a.avg_expiration - b.avg_expiration),
  }

  return (
    <>
      {error && <div>{error}</div>}

      <SearchBar
        searchStr={searchStr}
        setSearchStr={newStr => setSearchStr(newStr)}
        sortMetric={sortMetric}
        setSortMetric={newSortMetric => setSortMetric(newSortMetric)}
        sortMetricList={Object.keys(sortMap)}
      />

      <SetGrid>
        <AnimatePresence>
          {visibleSets.map((s, i) =>
            <Set key={s.id} set={s} gridIndex={i}
              onSetSelected={() => startFade("flashcards/" + s.id)}
            />
          )}
        </AnimatePresence>
      </SetGrid>

      <UpButton/>
    </>
  )
}

const SetGrid = styled.div`
  --item-width: 350px;
  --grid-gap: 30px;
  margin: 60px auto;
  width: calc(var(--item-width) * 3 + var(--grid-gap) * 2);
  /* width: calc(var(--item-width) * 1 + var(--grid-gap) * 0); */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--item-width), 1fr));
  gap: var(--grid-gap);
`

