import { createGlobalStyle, css } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;

    ${props => props.hideScrollbar ? css`
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow: hidden;
      ` : ``
    }
  }
`