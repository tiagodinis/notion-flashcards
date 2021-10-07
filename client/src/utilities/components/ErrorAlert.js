import styled from "styled-components";

export default function ErrorAlert({ error }) {
  return (
    <Alert>
      <h2>Server Error</h2>
      {error instanceof window.Response ? (
        <p>
          <b>{error.status}</b> on <b>{error.url}</b>
          <br />
          <small>{error.statusText}</small>
        </p>
      ) : (
        <p>
          <code>{error.toString()}</code>
        </p>
      )}
    </Alert>
  );
}

const Alert = styled.div`
  --width: clamp(236px, 70vw, 500px);
  --padding: 32px;

  position: absolute;
  left: calc(50% - var(--width) * 0.5 - var(--padding));
  top: var(--padding);
  border: 1px solid #ba211c;

  width: var(--width);
  padding: var(--padding);
  border-radius: 20px;
  background-color: #fff6f6;
  color: #ba211c;
`;
