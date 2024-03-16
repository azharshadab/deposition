import styled from 'styled-components';

export const Dropzone = styled.div`
  height: 200px;
  width: 200px;
  border: 1px dashed #000;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 1rem auto;
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #000;
  }

  &:not(:empty)::before {
    margin-right: 0.5em;
  }

  &:not(:empty)::after {
    margin-left: 0.5em;
  }
`;

export const StyledFileForm = styled.form`
  padding: 10px;
  .bottom-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    label {
      display: flex;
      align-items: baseline;
    }
    ul {
      padding-top: 10px;
    }
  }
`;
