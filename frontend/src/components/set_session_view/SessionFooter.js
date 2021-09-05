import styled from "styled-components"
import RepeatSVG from "../svg/RepeatSVG"
import LevelIndicatorSVG from "../svg/LevelIndicatorSVG"
import RotateSVG from "../svg/RotateSVG"

export default function SessionFooter(props) {
  return (
    <FooterContainer>
      <IconLabelPair>
        <RotateSVG dim={30} color="rgb(158, 158, 167)"/>
        <div>{props.isFlipped ? "Back" : "Front"}</div>
      </IconLabelPair>
      <IconLabelPair>
        <RepeatSVG dim="19" color="rgb(158, 158, 167)"/>
        <div>{props.cardData.expired_in + (props.cardData.expired_in === 1 ? " day" : " days")}</div>
      </IconLabelPair>
      <IconLabelPair>
        <LevelIndicatorSVG dim="19" color="rgb(158, 158, 167)"/>
        <div>Lvl. {props.cardData.lvl}</div>
      </IconLabelPair>
    </FooterContainer>
  )
}

const FooterContainer = styled.div`
  width: 300px;

  position: absolute;
  bottom: 20px;
  left: calc(50% - 136px);

  font-family: "Rubik", sans-serif;

  display: flex;
  justify-content: space-between;

  div:first-child > svg {
    position: relative;
    bottom: 5px;
    margin-bottom: -19px;
  }
`

const IconLabelPair = styled.div`
  width: 100px;
  display: flex;

  div {
    margin-left: 6px;
  }
`