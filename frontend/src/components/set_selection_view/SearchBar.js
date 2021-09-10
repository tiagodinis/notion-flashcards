import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import OutsideAlerter from "../utilities/OutsideAlerter"
import styled from "styled-components"
import MagnifyingGlassSVG from "../svg/MagnifyingGlassSVG"
import RefreshCircleSVG from "../svg/RefreshCircleSVG"
import ArrowHead1SVG from "../svg/ArrowHead1SVG"

export default function SearchBar(props) {
  const [openSortMenu, setOpenSortMenu] = useState(false)
  const [sortMenuDims, setSortMenuDims] = useState({bottom: 0, left: 0, width: 0})
  const inputEl = useRef()
  const magnifyingControls = useAnimation()
  const circleControls = useAnimation()
  const refreshing = useRef(false)

  useEffect(() => {
    if (props.refreshing) (async () => {
      refreshing.current = true
      await magnifyingControls.start({opacity: 0, transition: {duration: 0.15, ease: "easeOut"}})
      await circleControls.start({opacity: 1, transition: {duration: 0.15, ease: "easeIn"}})
      while (refreshing.current) {
        await circleControls.start({
          rotate: 180, transition: {duration: 0.6, ease: "easeInOut"}})
        circleControls.set({rotate: 0})
      }
      await circleControls.start({opacity: 0, transition: {duration: 0.15, ease: "easeOut"}})
      magnifyingControls.start({opacity: 1, transition: {duration: 0.15, ease: "easeIn"}})
    })()
    else refreshing.current = false
  }, [props.refreshing])

  // Update sort menu dimensions when Sorter changes
  const measureRef = useCallback(node => {
    if (node === null) return
    const rect = node.getBoundingClientRect()
    setSortMenuDims({bottom: rect.bottom + window.pageYOffset, left: rect.x, width: rect.width})
  }, [openSortMenu])

  function selectSortMetric(newSortMetric) {
    props.setSortMetric(newSortMetric)
    setOpenSortMenu(false)
  }

  return (
    <SearchBarContainer onClick={() => inputEl.current.focus()}>
      <RefreshCircle initial={{opacity: 0}} animate={circleControls}>
        <RefreshCircleSVG color="rgb(158, 158, 167)"/>
      </RefreshCircle>
      <MagnifyingGlass animate={magnifyingControls}>
        <MagnifyingGlassSVG color="rgb(158, 158, 167)"/>
      </MagnifyingGlass>

      <input ref={inputEl} type="text" value={props.searchStr} placeholder="Search..."
        onChange={e => props.setSearchStr(e.target.value)}
      />
      <VerticalDivider/>
      <OutsideAlerter onOutsideClick={() => setOpenSortMenu(false)}>
        <Sorter ref={measureRef}
          onClick={e => {e.stopPropagation(); setOpenSortMenu(!openSortMenu)}}
        >
          <SortMetric>{props.sortMetric}</SortMetric>
          <SelectArrowContainer initial={{rotate: 0}} animate={{rotate: openSortMenu ? 180 : 0}}>
            <ArrowHead1SVG dim="14" color="#242337"/>
          </SelectArrowContainer>
          <AnimatePresence>
            {openSortMenu &&
              <SortMenu
                sortMenuDims={sortMenuDims}
                initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                transition={{duration: 0.2}}
              >
                {props.sortMetricList.map(sm =>
                  <div key={sm} onClick={() => selectSortMetric(sm)}>{sm}</div>
                )}
              </SortMenu>
            }
          </AnimatePresence>
        </Sorter>
      </OutsideAlerter>
    </SearchBarContainer>)
}

const RefreshCircle = styled(motion.div)`
  position: absolute;
  transform-origin: 32px;
  width: fit-content;
  display: flex;
`

const MagnifyingGlass = styled(motion.div)`
  width: fit-content;
  display: flex;
`

const SearchBarContainer = styled.div`
  width: 500px;
  margin: 50px auto 0px auto;

  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 10px;
  background-color: white;
  
  &:hover {
    cursor: text;
    border-color: transparent;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
  }

  display: flex;
  align-items: center;

  svg {
    margin: 20px 0px 20px 24px;
  }

  input {
    position: relative;
    bottom: 1px;
    margin-left: 20px;
    margin-right: 18px;
    flex-grow: 1;
    border: 0;
    outline: none;
    font-size: 1rem;
    color: #242337;
  }

  input::placeholder {
    color: hsl(240, 5%, 50%);
  }
`

const VerticalDivider = styled.div`
  height: 32px;
  border-left: 2px solid #e7e7e9;
`

const Sorter = styled.div`
  height: 56px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SortMetric = styled(motion.div)`
  margin-left: 20px;
  color: #242337;
  font-family: "Rubik", sans-serif;
  user-select: none;
`

const SelectArrowContainer = styled(motion.div)`
  margin: 0px 15px 0px 10px;
  width: 14px;
  height: 14px;

  svg {
    margin: 0px;
  }
`

const SortMenu = styled(motion.div)`
  position: absolute;
  top: ${props => props.sortMenuDims.bottom + 10}px;
  left: ${props => props.sortMenuDims.left}px;
  width: ${props => props.sortMenuDims.width}px;
  z-index: 1;

  font-family: "Rubik", sans-serif;

  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 10px;
  box-shadow: 0px 3px 5px rgba(0,0,0,0.04);
  background-color: white;

  div {
    padding: 6px 10px;
  }

  div:hover {
    background-color: rgb(231, 231, 233);
  }

  div:first-child {
    margin-top: 8px;
  }

  div:last-child {
    margin-bottom: 8px;
  }
`