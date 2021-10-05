import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { ease as utilityEase } from "../../utilities/math";
import styled from "styled-components";

export default function SessionReportButtons({
  saveCallback,
  retryCallback,
  singleArrow,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const saveBtnControls = useAnimation();
  const retryBtnControls = useAnimation();
  const saveBtnStates = {
    idle: {
      y: 0,
      boxShadow:
        "2px 4px 8px hsl(0 0% 20% / 0.4), 4px 8px 16px hsl(0 0% 20% / 0.4)",
    },
    hovered: {
      y: -3,
      boxShadow:
        "4px 8px 16px hsl(0 0% 20% / 0.4), 6px 12px 24px hsl(0 0% 20% / 0.4)",
    },
    active: {
      y: 12,
      boxShadow:
        "1px 2px 4px hsl(0 0% 20% / 0.4), 2px 4px 8px hsl(0 0% 20% / 0.4)",
    },
  };

  function handleSubmit() {
    setIsSaving(true);
    saveBtnControls.start(saveBtnStates.active);
    retryBtnControls.start({
      opacity: 0,
      transition: { duration: 0.1 },
      transitionEnd: { display: "none" },
    });
    saveCallback();
  }

  return (
    <>
      <SaveBtn
        singleArrow={singleArrow}
        onClick={handleSubmit}
        onHoverStart={() => {
          if (!isSaving) saveBtnControls.start(saveBtnStates.hovered);
        }}
        onHoverEnd={() => {
          if (!isSaving) saveBtnControls.start(saveBtnStates.idle);
        }}
        initial={saveBtnStates.idle}
        animate={saveBtnControls}
      >
        <SaveBtnContent>
          <TextDrip isSaving={isSaving} />
        </SaveBtnContent>
      </SaveBtn>
      <RetryBtn onClick={retryCallback} animate={retryBtnControls}>
        retry session
      </RetryBtn>
    </>
  );
}

const RetryBtn = styled(motion.div)`
  font-size: 14px;
  width: fit-content;
  margin: auto;
  margin-top: 19px;

  color: #797986;

  &:hover {
    color: #494950;
    cursor: pointer;
  }

  transition: color 0.1s ease-in-out;
`;

const SaveBtn = styled(motion.div)`
  background-color: hsl(0 0% 24%);

  width: 200px;
  height: 60px;
  margin: auto;
  margin-top: ${(props) => (props.singleArrow ? 20 : 23)}px;

  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  transition: background-color 0.1s ease-in-out;
`;

const SaveBtnContent = styled.div`
  position: relative;
  bottom: 1px;
  font-size: 24px;
  color: white;
`;

// ------------------------------------------------------

function TextDrip({ isSaving }) {
  const textDripControls = useAnimation();
  const [dripFinished, setDripFinished] = useState(false);

  useEffect(() => {
    if (isSaving)
      setTimeout(
        () =>
          textDripControls
            .start((data) => ({
              y: "100%",
              transition: {
                duration: 0.4,
                delay: data.index * 0.02,
                ease: (t) => utilityEase(t, 0.7, 0.5),
              },
            }))
            .then(() => setDripFinished(true)),
        150
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  return (
    <ViewableContainer>
      <DripLine
        text="Saving..."
        delayIndexOffset={10}
        controls={textDripControls}
        dripFinished={dripFinished}
      />
      <DripLine
        text={"Save\xa0Results"}
        delayIndexOffset={0}
        controls={textDripControls}
        dripFinished={dripFinished}
      />
    </ViewableContainer>
  );
}

const ViewableContainer = styled.div`
  width: fit-content;
  height: 29px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

// ------------------------------------------------------

function DripLine({ text, delayIndexOffset, controls, dripFinished }) {
  return (
    <TextEntry>
      {[...text].map((character, index) => (
        <Letter
          key={Math.random()}
          animate={controls}
          custom={{ index: index + delayIndexOffset }}
          dripFinished={dripFinished}
        >
          {character}
        </Letter>
      ))}
    </TextEntry>
  );
}

const TextEntry = styled.div`
  width: fit-content;
  position: relative;
  bottom: 28px;
`;

const Letter = styled(motion.span)`
  display: inline-block;
  /* (!) TODO: figure out why I need this to stop DripLine reset on SessionReport startFade */
  transform: ${(props) =>
    props.dripFinished ? "translateY(100%)" : "translateY(0%)"};
`;
