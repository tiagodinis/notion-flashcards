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
        <RefreshCircleSVG color="#A79E9E"/>
      </RefreshCircle>
      <MagnifyingGlass animate={magnifyingControls}>
        <MagnifyingGlassSVG color="#A79E9E"/>
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
            <ArrowHead1SVG dim="11" color="#242337"/>
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

const SearchBarContainer = styled.div`
  @media (min-width: 768px) {
    max-width: 500px;
    margin: 50px auto 0px auto;

    border-radius: 10px;
  }

  width: calc(100% - 20px);
  max-width: 450px;
  margin: 10px auto 0 auto;

  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 7.5px;
  background-color: white;
  
  display: flex;
  align-items: center;

  &:hover {
    @media (min-width: 768px) {
      box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
    }

    cursor: text;
    border-color: transparent;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, .1);
  }

  svg {
    @media (min-width: 768px) {
      margin: 20px 0px 20px 24px;
    }

    margin: 10px 0px 10px 14px;
  }

  input {
    @media (min-width: 768px) {
      bottom: 1px;
      margin-left: 20px;
      margin-right: 18px;
      font-size: 16px;
    }

    position: relative;
    bottom: 0px;
    margin-left: 10px;
    margin-right: 13px;
    min-width: 0px; /* (!) Can be collapsed, sorter options more important*/
    flex-grow: 1;
    border: 0;
    outline: none;
    font-size: 12px;
    color: #242337;
  }

  input::placeholder {
    color: #797986;
  }
`

const RefreshCircle = styled(motion.div)`
  @media (min-width: 768px) {
    transform-origin: 32px;
  }

  position: absolute;
  transform-origin: 22px;
  width: fit-content;
  display: flex;
`

const MagnifyingGlass = styled(motion.div)`
  width: fit-content;
  display: flex;
`

const VerticalDivider = styled.div`
  @media (min-width: 768px) {
    height: 32px;
  }

  height: 24px;
  border-left: 2px solid #e7e7e9;
`

const Sorter = styled.div`
  @media (min-width: 768px) {
    height: 56px;
    font-size: 16px;
  }

  height: 36px;
  padding-left: 20px;
  cursor: pointer;

  font-size: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SortMetric = styled(motion.div)`
  color: #242337;
  font-family: "Rubik", sans-serif;
  user-select: none;
`

const SelectArrowContainer = styled(motion.div)`
  @media (min-width: 768px) {
    height: 18px;
    margin: 0px 17px 0px 12px;
  }

  width: 11px;
  height: 14px;
  margin: 0px 15px 0px 10px;

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
    background-color: #E7E9E7;
  }

  div:first-child {
    margin-top: 8px;
  }

  div:last-child {
    margin-bottom: 8px;
  }
`