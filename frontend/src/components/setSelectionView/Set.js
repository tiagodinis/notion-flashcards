import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import RepeatSVG from "../svg/RepeatSVG";

export default function Set({ set, gridIndex, onSetSelected }) {
  const [hovered, setHovered] = useState(false);
  const [bgColor, setBGColor] = useState(computeBGColor());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setBGColor(computeBGColor()), [set]);

  function computeBGColor() {
    if (set.avg_expiration < 1)
      return {
        base: "hsl(4, 90%, 70%)",
        highlight: "hsl(4, 90%, 63%)",
        shadow: "hsl(4 90% 30% / 0.2)",
      };
    else if (set.avg_expiration < 5)
      return {
        base: "hsl(23, 100%, 70%)",
        highlight: "hsl(23, 100%, 63%)",
        shadow: "hsl(23 100% 30% / 0.2)",
      };
    else
      return {
        base: "hsl(251, 49%, 66%)",
        highlight: "hsl(251, 49%, 58%)",
        shadow: "hsl(251 49% 30% / 0.2)",
      };
  }

  const setVariants = {
    hidden: (data) => ({
      opacity: 0,
      backgroundColor: data.bgColor,
      transition: {
        duration: 0.2,
      },
    }),
    show: (data) => ({
      opacity: 1,
      backgroundColor: data.bgColor,
      transition: {
        delay: data.gridIndex * 0.06,
      },
    }),
  };

  return (
    <OuterSet
      key={set.id}
      layout
      variants={setVariants}
      custom={{ gridIndex: gridIndex, bgColor: bgColor.base }}
      initial={"hidden"}
      animate={"show"}
      exit={"hidden"}
      whileHover={{
        y: window.innerWidth > 1140 ? -6 : -3,
        backgroundColor: bgColor.highlight,
      }}
      shadowColor={bgColor.shadow}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onSetSelected}
    >
      <InnerSet>
        <SetDetails hovered={hovered}>
          <div>
            {set.flashcards.length +
              (set.flashcards.length === 1 ? " card" : " cards")}
          </div>
          <ExpirationContainer>
            <RepeatSVG dim={19} />
            <div>
              {(set.avg_expiration || 0) +
                (set.avg_expiration === 1 ? " day" : " days")}
            </div>
          </ExpirationContainer>
        </SetDetails>
        <SetTitle>{set.name}</SetTitle>
      </InnerSet>
    </OuterSet>
  );
}

const OuterSet = styled(motion.div)`
  @media (min-width: 1140px) {
    width: 350px;
    height: 200px;
    border-radius: 20px;

    box-shadow: ${(props) =>
      "2px 4px 8px " +
      props.shadowColor +
      ", 4px 8px 16px " +
      props.shadowColor};
    &:hover {
      box-shadow: ${(props) =>
        "4px 8px 8px " +
        props.shadowColor +
        ", 8px 16px 16px " +
        props.shadowColor};
    }
    transition: box-shadow 0.1s ease-in-out;
  }

  width: 300px;
  height: 150px;

  border-radius: 15px;
  color: white;

  cursor: pointer;
  display: flex;
`;

const InnerSet = styled(motion.div)`
  @media (min-width: 1140px) {
    width: 290px;
    height: 158px;
  }

  position: relative;
  width: 277px;
  height: 130px;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

const SetDetails = styled(motion.div)`
  @media (min-width: 1140px) {
    font-size: 16px;
  }

  font-size: 14px;
  margin: 0px 2px;
  display: flex;
  justify-content: space-between;
  opacity: ${(props) => (props.hovered ? 0.65 : 0.5)};
`;

const ExpirationContainer = styled(motion.div)`
  display: flex;

  div {
    margin-left: 6px;
  }
`;

const SetTitle = styled(motion.div)`
  @media (min-width: 1140px) {
    font-size: 37px;
  }

  position: relative;
  bottom: 1px;
  margin: auto;
  font-size: 28px;
  text-align: center;

  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
  white-space: normal;
  overflow: hidden;
`;
