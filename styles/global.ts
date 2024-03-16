import { FC } from 'react';
import { createGlobalStyle } from 'styled-components';
import { colors } from './colors';

const Global = createGlobalStyle`
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', 'Roboto',
      'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
        font-style: inherit;
        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        max-width: 100%;
    }

    body {
        font-style: normal;
        font-weight: 400;
        font-size: inherit;
        line-height: 18px;
    }

    button {
        background-color: transparent;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 0;
        cursor: pointer;
        &:disabled {
            cursor: auto;
        }
    }

    
    .small-txt {
        color: #6e7172;
        font-size: 14px;
        line-height: 16.41px;
    }
    a {
        text-decoration: none;
    }
`;

export default Global as unknown as FC;
