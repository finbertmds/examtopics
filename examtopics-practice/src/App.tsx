import type { ReactNode } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ManageExamsPage from './components/ManageExamsPage';
import AuthCallback from './components/AuthCallback';
import ExamPage from './components/ExamPage';
import Home from './components/Home';
import OfflineIndicator from './components/OfflineIndicator';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './toast.css';

const SessionReady = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        {t('loading')}
      </div>
    );
  }

  return children;
};

const ToastContainerWithTheme = () => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      limit={3}
      toastClassName="font-medium"
      closeButton={true}
    />
  );
};

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <SessionReady>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/exam/:examId" element={<ExamPage />} />
                  <Route path="/create-exam" element={<ManageExamsPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </SessionReady>
              <ToastContainerWithTheme />
              <OfflineIndicator />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
