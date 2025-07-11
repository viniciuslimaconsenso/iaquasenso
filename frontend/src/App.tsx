import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { LoadingProvider } from './contexts/LoadingContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import './styles/global.css';

function App() {
  return (
    <Router>
      <LoadingProvider>
        <ReportsProvider>
          <LoadingOverlay />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/cadastrar" element={<Register />} />
          </Routes>
        </ReportsProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;
