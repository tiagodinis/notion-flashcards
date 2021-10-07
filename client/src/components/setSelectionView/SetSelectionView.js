import { useState, useEffect, useRef, useContext } from "react";
import { FadeContext } from "../../utilities/components/FadeContainer";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import Set from "./Set";
import UpButton from "./UpButton";
import ErrorAlert from "../../utilities/components/ErrorAlert";
import { GlobalStyle } from "../../GlobalStyle";

export default function SetSelectionView() {
  const sets = useRef([]);
  const [visibleSets, setVisibleSets] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  const [sortMetric, setSortMetric] = useState("A-Z");
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const { startFade, setFadeOpacityTarget } = useContext(FadeContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchSets("api/sets", false), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(filterAndSort, [searchStr, sortMetric]);

  function fetchSets(path, useAnim) {
    function onError(err) {
      if (useAnim) setRefreshing(false);
      setError(err);
    }

    (async () => {
      if (useAnim) setRefreshing(true);
      let response;
      try {
        response = await fetch(path);
      } catch (err) {
        return onError(err);
      }
      if (!response.ok) return onError(response);

      sets.current = await response.json();
      filterAndSort();
      if (useAnim) setRefreshing(false);
      setFadeOpacityTarget(1);
    })();
  }

  function filterAndSort() {
    const lcSearchStr = searchStr.toLowerCase();
    const filteredSets = sets.current.filter((s) =>
      s.name.toLowerCase().includes(lcSearchStr)
    );
    setVisibleSets(sortMap[sortMetric](filteredSets));
  }

  const sortMap = {
    "A-Z": (sets) =>
      sets.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
    "Z-A": (sets) =>
      sets.sort((b, a) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
    Stalest: (sets) => sets.sort((a, b) => a.avg_expiration - b.avg_expiration),
    Freshest: (sets) =>
      sets.sort((b, a) => a.avg_expiration - b.avg_expiration),
  };

  return (
    <>
      <GlobalStyle />
      {error && <ErrorAlert error={error} />}
      {!error && (
        <>
          <SearchBar
            searchStr={searchStr}
            setSearchStr={(newStr) => setSearchStr(newStr)}
            sortMetric={sortMetric}
            setSortMetric={(newSortMetric) => setSortMetric(newSortMetric)}
            sortMetricList={Object.keys(sortMap)}
            isRefreshing={isRefreshing}
          />

          <NotionOptions>
            <div onClick={() => fetchSets("api/recached-sets", true)}>
              Refresh server data
            </div>
            <div onClick={() => fetchSets("api/reset-demo", true)}>
              Reset demo
            </div>
          </NotionOptions>

          <SetGrid>
            <AnimatePresence>
              {visibleSets.map((s, i) => (
                <Set
                  key={s.id}
                  set={s}
                  gridIndex={i}
                  onSetSelected={() => startFade("flashcards/" + s.id)}
                />
              ))}
            </AnimatePresence>
          </SetGrid>

          <UpButton />
        </>
      )}
    </>
  );
}

const NotionOptions = styled.div`
  @media (min-width: 470px) {
    margin: 6px auto 0px auto;
  }

  @media (min-width: 940px) {
    margin: 10px auto 0px auto;
    font-size: 12px;
  }

  width: fit-content;
  margin: 6px auto 0px calc(-294px + 95.65%);

  display: flex;
  justify-content: center;
  font-size: 10px;
  color: #797986;

  div {
    cursor: pointer;
  }

  div:hover {
    color: #494950;
  }

  div:first-child {
    margin-right: 20px;
  }
`;

const SetGrid = styled.div`
  @media (min-width: 630px) {
    width: calc(var(--item-width) * 2 + var(--grid-gap) * 1);
  }

  @media (min-width: 940px) {
    margin: 50px auto 60px auto;
    width: calc(var(--item-width) * 3 + var(--grid-gap) * 2);
  }

  @media (min-width: 1140px) {
    --item-width: 350px;
    --grid-gap: 30px;
  }

  --item-width: 300px;
  --grid-gap: 10px;
  margin: 25px auto 30px auto;
  width: calc(var(--item-width));
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--item-width), 1fr));
  gap: var(--grid-gap);
`;
