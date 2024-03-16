import Sidebar from '@common/SideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@pages/Home/HomePage';
import StatisticsPage from '@pages/Statistics/StatisticsPage';
import TranscriptsExplorerPage from '@pages/TranscriptsExplorer/TranscriptsExplorerPage';
import SummaryPage from '@pages/Summary/SummaryPage';
import ContradictionsPage from '@pages/Contradictions/ContradictionsPage';
import styled from 'styled-components';
import LoginForm from '@pages/Login/LoginPage';
import ProtectedRoutes from '@common/PrivateRoutes';
import ForgotPassword from '@pages/ForgotPassword/ForgotPassword';
import { Wrapper } from 'wrapper';
import UserIcon from '@common/UserIcon';
import useTitle from '@hooks/useTitle';
import SignupPage from '@pages/Signup/SignupPage';
import useSessionTimeout from '@hooks/useSessionTimeout';
import { usePageTracking } from '@hooks/usePageTracking';

const StyledMain = styled.main`
  margin-left: 279px;
  margin-top: 40px;
  margin-right: 20px;
`;

function App() {
  useSessionTimeout();
  useTitle('Deposition Insight');
  return (
    <Wrapper>
      <Routing />
    </Wrapper>
  );
}

const Routing = () => {
  usePageTracking();
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        element={
          <>
            <Sidebar />
            <StyledMain>
              <UserIcon />
              <ProtectedRoutes />
            </StyledMain>
          </>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/statistics/:type/:id" element={<StatisticsPage />} />
        <Route path="/explorer" element={<TranscriptsExplorerPage />} />
        <Route
          path="/explorer/:type/:id"
          element={<TranscriptsExplorerPage />}
        />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/summary/:id" element={<SummaryPage />} />
        <Route path="/contradictions" element={<ContradictionsPage />} />
        <Route
          path="/contradictions/:type/:id"
          element={<ContradictionsPage />}
        />
      </Route>
      <Route path="*" element={<Navigate to={'/'} />} />
    </Routes>
  );
};

export default App;
