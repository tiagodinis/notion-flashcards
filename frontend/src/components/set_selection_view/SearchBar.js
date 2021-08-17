import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import OutsideAlerter from "../utilities/OutsideAlerter"
import styled from "styled-components"

export default function SearchBar(props) {
  const [openSortMenu, setOpenSortMenu] = useState(false)
  const [sortMenuDims, setSortMenuDims] = useState({bottom: 0, left: 0, width: 0})
  const inputEl = useRef()

  // Update sort menu dimensions when Sorter changes
  const measureRef = useCallback(node => {
    if (node === null) return
    const rect = node.getBoundingClientRect()
    setSortMenuDims({bottom: rect.bottom, left: rect.x, width: rect.width})
  }, [openSortMenu])

  function selectSortMetric(newSortMetric) {
    props.setSortMetric(newSortMetric)
    setOpenSortMenu(false)
  }

  return (
    <SearchBarContainer onClick={() => inputEl.current.focus()}>
      <MagnifyingGlass/>
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
            <SelectArrow/>
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
    margin: 20px;
    margin-left: 24px;
  }

  input {
    position: relative;
    bottom: 1px;
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

function MagnifyingGlass() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="rgb(158, 158, 167)" role="img">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.6002 12.0498C9.49758 12.8568 8.13777 13.3333 6.66667 13.3333C2.98477 13.3333 0 10.3486 0 6.66667C0 2.98477 2.98477 0 6.66667 0C10.3486 0 13.3333 2.98477 13.3333 6.66667C13.3333 8.15637 12.8447 9.53194 12.019 10.6419C12.0265 10.6489 12.0338 10.656 12.0411 10.6633L15.2935 13.9157C15.6841 14.3063 15.6841 14.9394 15.2935 15.33C14.903 15.7205 14.2699 15.7205 13.8793 15.33L10.6269 12.0775C10.6178 12.0684 10.6089 12.0592 10.6002 12.0498ZM11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z"/>
  </svg>
}

function SelectArrow() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" role="img" fill="#242337">
    <path d="m4.585 10.468 7.415 7.532 7.415-7.532c.779-.792.779-2.081 0-2.873s-2.049-.792-2.829 0l-4.586 4.659-4.587-4.659c-.378-.384-.88-.595-1.414-.595s-1.036.211-1.414.595c-.78.792-.78 2.082 0 2.873z"></path>
  </svg>
}