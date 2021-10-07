import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import styled from "styled-components";
import useWindowSize from "../../utilities/custom_hooks/useWindowSize";
import ArrowHead2SVG from "../svg/ArrowHead2SVG";
// import QuestionsMarkSVG from "../svg/QuestionsMarkSVG";

export default function SessionHeader({ setName, setSize, onClick, progress }) {
  // const barBackgroundWidth = window.innerWidth > 940 ? 160 : 100;
  const [barBackgroundWidth, setBarBackgroundWidth] = useState(
    computeBarBackgroundWidth()
  );
  const startingWidth = useMotionValue(0);
  // (!) Clamp motionValue so it doesn't exceed background bar
  const barForegroundWidth = useTransform(
    startingWidth,
    [0, barBackgroundWidth],
    [0, barBackgroundWidth]
  );
  const { width } = useWindowSize();

  function computeBarBackgroundWidth() {
    return window.innerWidth > 940 ? 160 : 100;
  }

  useEffect(() => {
    setBarBackgroundWidth(computeBarBackgroundWidth());
    const controls = animate(startingWidth, progress * barBackgroundWidth, {
      type: "spring",
      stiffness: 80,
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, width]);

  return (
    <Header>
      <GoBackArrow
        onClick={onClick}
        initial={{ rotate: -90 }}
        whileHover={{ x: -3 }}
      >
        <ArrowHead2SVG color="rgb(158, 158, 167)" />
      </GoBackArrow>

      <HeaderDataContainer>
        <SetName>{setName}</SetName>
        <ProgressContainer>
          <SetSize>{setSize} cards</SetSize>
          <ProgressBar barBackgroundWidth={barBackgroundWidth}>
            <div />
            <motion.div style={{ width: barForegroundWidth }} />{" "}
          </ProgressBar>
        </ProgressContainer>
      </HeaderDataContainer>

      {/* <QuestionMark whileHover={{ rotate: 10, scale: 1.2 }}>
        <QuestionsMarkSVG dim="18" color="rgb(158, 158, 167)" />
      </QuestionMark> */}
    </Header>
  );
}

const Header = styled.header`
  height: 100px;
  margin: 0px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GoBackArrow = styled(motion.nav)`
  padding: 10px;
  cursor: pointer;
`;

const HeaderDataContainer = styled.div`
  margin-left: 10px;
  flex-grow: 1;
`;

const SetName = styled.div`
  @media (min-width: 940px) {
    font-size: 32px;
  }

  font-size: 20px;
  font-weight: bold;
  color: #232039;

  max-height: 48px;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  white-space: normal;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  display: flex;
`;

const SetSize = styled.div`
  color: #858391;
`;

const ProgressBar = styled(motion.div)`
  div:first-child {
    margin-left: 10px;
    position: relative;
    height: 8px;
    border-radius: 8px;
    top: 6px;
    background-color: #e2e2e2;
    width: ${(props) => props.barBackgroundWidth}px;
  }

  div:last-child {
    margin-left: 10px;
    position: relative;
    height: 8px;
    border-radius: 8px;
    top: -2px;
    background-color: #47c690;
  }
`;

// const QuestionMark = styled(motion.div)`
//   padding: 10px;
//   cursor: pointer;
// `;
