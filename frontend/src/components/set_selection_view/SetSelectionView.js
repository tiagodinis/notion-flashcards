import { useState, useEffect, useRef, useContext } from "react"
import { motion, useAnimation } from "framer-motion"
import { FadeContext } from "../utilities/FadeContainer"
import { AnimatePresence } from "framer-motion"
import styled from "styled-components"
import SearchBar from "./SearchBar"
import Set from "./Set"
import UpButton from "./UpButton"
import RefreshCircleSVG from "../svg/RefreshCircleSVG"

export default function SetSelectionView() {
  const sets = useRef([])
  const [refreshing, setRefreshing] = useState(false)
  const [visibleSets, setVisibleSets] = useState([])
  const [searchStr, setSearchStr] = useState("")
  const [sortMetric, setSortMetric] = useState("A-Z")
  const [error, setError] = useState("")
  const startFade = useContext(FadeContext)

  function refresh() {
    setRefreshing(true)
    fetch("/api/syncedSets")
      .then(res => {
        if (!res.ok) throw Error("Could not fetch data for that resource")
        return res.json()
      })
      .then(data => {
        sets.current = data
        filterAndSort()
        setRefreshing(false)
      })
      .catch(err => setError(err.message))
  }

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
        refreshing={refreshing}
      />

      {/* <NotionOptions>
        <div onClick={refresh}>Refresh server data</div>
        <div>Reset demo</div>
      </NotionOptions> */}

      {/* <SetGrid>
        <AnimatePresence>
          {visibleSets.map((s, i) =>
            <Set key={s.id} set={s} gridIndex={i}
              onSetSelected={() => startFade("flashcards/" + s.id)}
            />
          )}
        </AnimatePresence>
      </SetGrid> */}

      <UpButton/>
    </>
  )
}

const NotionOptions = styled.div`
  width: fit-content;
  margin: 10px auto 0px auto;
  margin-top: 10px;

  display: flex;
  justify-content: center;
  font-size: 12px;
  font-family: "Rubik", sans-serif;
  color: hsl(240, 5%, 50%);

  div:first-child {
    margin-right: 20px;
  }

  div {
    cursor: pointer;
  }

  div:hover {
    color: hsl(240, 5%, 30%);
  }
`

const SetGrid = styled.div`
  --item-width: 350px;
  --grid-gap: 30px;
  margin: 50px auto 60px auto;
  width: calc(var(--item-width) * 3 + var(--grid-gap) * 2);
  ${'' /* width: calc(var(--item-width) * 2 + var(--grid-gap) * 1);
  width: calc(var(--item-width) * 1 + var(--grid-gap) * 0); */}
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--item-width), 1fr));
  gap: var(--grid-gap);
`

