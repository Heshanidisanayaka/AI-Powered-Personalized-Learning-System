import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PerformanceManagement from './pages/PerformanceManagement';
import './index.css';

function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) return null;

  return (
    <nav className="navbar">
      <div className="heading-md" style={{ margin: 0, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        AI EduTrack
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/manage" className={`nav-link ${location.pathname === '/manage' ? 'active' : ''}`}>Performance Management</Link>
        <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage" element={<PerformanceManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
