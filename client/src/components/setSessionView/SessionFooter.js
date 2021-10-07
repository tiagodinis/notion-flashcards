import styled from "styled-components";
import RepeatSVG from "../svg/RepeatSVG";
import LevelIndicatorSVG from "../svg/LevelIndicatorSVG";
import RotateSVG from "../svg/RotateSVG";
import { useEffect, useState } from "react";
import useWindowSize from "../../utilities/custom_hooks/useWindowSize";

export default function SessionFooter(props) {
  const [isBigScreen, setIsBigScreen] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => setIsBigScreen(width > 499 && height > 899), [width, height]);

  return (
    <Footer>
      <IconLabelPair>
        <RotateSVG dim={isBigScreen ? 40 : 30} color="rgb(158, 158, 167)" />
        <div>{props.isFlipped ? "Back" : "Front"}</div>
      </IconLabelPair>
      <IconLabelPair>
        <RepeatSVG dim={isBigScreen ? 27 : 19} color="rgb(158, 158, 167)" />
        <div>
          {props.cardData.expired_in +
            (props.cardData.expired_in === 1 ? " day" : " days")}
        </div>
      </IconLabelPair>
      <IconLabelPair>
        <LevelIndicatorSVG
          dim={isBigScreen ? 27 : 19}
          color="rgb(158, 158, 167)"
        />
        <div>Lvl. {props.cardData.lvl}</div>
      </IconLabelPair>
    </Footer>
  );
}

const Footer = styled.footer`
  @media (min-width: 500px) and (min-height: 900px) {
    width: 545px;
    left: 0;
    left: calc(50% - 230px);
    font-size: 24px;
  }

  width: 290px;
  position: absolute;
  bottom: 20px;
  left: calc(50% - 134px);
  display: flex;
  justify-content: flex-start;

  div:first-child > svg {
    position: relative;
    bottom: 5px;
    margin-bottom: -19px;
  }
`;

const IconLabelPair = styled.div`
  @media (min-height: 800px) {
    width: 180px;
  }

  width: 100px;
  display: flex;

  div {
    margin-left: 6px;
  }
`;
