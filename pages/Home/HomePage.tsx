import { StyledH2 } from '@styles/header';
import styled from 'styled-components';
import { TranscriptTable } from './TranscriptTable/TranscriptTable';
import { TranscriptGroupTable } from './TranscriptGroupTable/TranscriptGroupTable';
import { TranscriptGroupsProvider } from '@hooks/useTranscriptGroups';
import useTitle from '@hooks/useTitle';

const StyledHomePage = styled.div`
  margin-top: 110px;
  .btn-container {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
  }
  .input-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
`;

const HomePage = () => {
  useTitle('Deposition Insight TM');
  return (
    <StyledHomePage data-testid="home-page">
      <StyledH2>Witnesses</StyledH2>
      <TranscriptGroupsProvider>
        <TranscriptTable />
        <TranscriptGroupTable />
      </TranscriptGroupsProvider>
    </StyledHomePage>
  );
};

export default HomePage;
