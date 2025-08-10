import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ExamPage from './components/ExamPage';
import Home from './components/Home';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam/:examId" element={<ExamPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
