import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoadingProvider } from './contexts/LoadingContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import './styles/global.css';

function App() {
  return (
    <LoadingProvider>
      <ReportsProvider>
        <LoadingOverlay />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ReportsProvider>
    </LoadingProvider>
  );
}

export default App;
