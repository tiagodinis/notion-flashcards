import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import ArrowHead1SVG from "../svg/ArrowHead1SVG";

export default function Test({ upArrow }) {
  const avgLvlArrowsControls = useAnimation();

  function playAvgLvlArrowsAnim() {
    avgLvlArrowsControls.start({
      opacity: 1,
      y: 0,
      transition: {
        opacity: { delay: 0.1, ease: "linear", duration: 0.4 },
        y: { ease: "backOut", duration: 0.5 },
      },
    });
  }

  useEffect(() => playAvgLvlArrowsAnim(), []);

  return (
    <AvgLvlArrowsContainer
      upArrow={upArrow}
      initial={{ opacity: 0, y: upArrow ? 50 : -50 }}
      animate={avgLvlArrowsControls}
      // animate={{
      //   opacity: 1,
      //   y: 0,
      //   transition: {
      //     opacity: { delay: 0.1, ease: "linear", duration: 0.4 },
      //     y: { ease: "backOut", duration: 0.5 },
      //   },
      // }}
    >
      <ArrowHead1SVG dim="22" color="#242337" />
      <ArrowHead1SVG dim="22" color="#242337" />
    </AvgLvlArrowsContainer>
  );
}

const AvgLvlArrowsContainer = styled(motion.div)`
  width: fit-content;
  display: flex;
  flex-direction: column;

  svg:last-child {
    position: relative;
    bottom: 14px;
  }

  svg {
    transform: rotate(${(props) => (props.upArrow ? 180 : 0)}deg);
  }
`;
