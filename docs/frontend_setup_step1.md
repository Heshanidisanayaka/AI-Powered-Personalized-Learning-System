# Frontend Setup Step 1: Initial Setup, Layout & Login

Welcome to the frontend phase of your project! We are going to build the React application step-by-step, starting with the absolute core foundation.

---

### Step 1.1: React Project Setup
Since we are using Vite for a lightning-fast modern React setup, open your terminal (make sure you are in the root directory, not inside the `backend` folder) and run:

```bash
# 1. Initialize the React app
npx create-vite@latest frontend --template react

# 2. Go into the folder
cd frontend

# 3. Install core dependencies (Routing, Charts, and Icons)
npm install
npm install react-router-dom recharts lucide-react
```

---

### Step 1.2: Folder Structure
Inside your new `frontend/src` directory, you need to create the standard folder structure we discussed earlier. 

Create the following folders inside `frontend/src`:
- `components/` (For Sidebar, Navbar, etc.)
- `pages/` (For Login, Dashboard, etc.)
- `assets/` (For images/css)
- `services/` (For API calls later)

---

### Step 1.3: Basic Layout (Sidebar & Navbar)
We need a layout that wraps around our pages. Let's create the components.

**1. Create file:** `src/components/Sidebar.jsx`
```jsx
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, User, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar" style={{ width: '250px', background: '#1e293b', height: '100vh', padding: '20px', color: 'white' }}>
      <h2 style={{ marginBottom: '30px', color: '#3b82f6' }}>AI EduTrack</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/" style={{ color: location.pathname === '/' ? '#3b82f6' : 'white', textDecoration: 'none', display: 'flex', gap: '10px' }}>
          <Home size={20} /> Dashboard
        </Link>
        <Link to="/profile" style={{ color: location.pathname === '/profile' ? '#3b82f6' : 'white', textDecoration: 'none', display: 'flex', gap: '10px' }}>
          <User size={20} /> Profile
        </Link>
      </nav>
    </div>
  );
}
```

**2. Create file:** `src/components/Layout.jsx`
```jsx
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Simple Top Navbar */}
        <header style={{ padding: '20px', background: '#1e293b', color: 'white', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #334155' }}>
          <span>Welcome, Student!</span>
        </header>
        {/* Main Page Content */}
        <main style={{ padding: '20px', flex: 1, color: 'white' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### Step 1.4: Login Page

**1. Create file:** `src/pages/Login.jsx`
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      navigate('/'); // Redirect to Dashboard on success
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', color: 'white', border: '1px solid #334155' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#3b82f6' }}>AI EduTrack Login</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### Step 1.5: Routing (Connecting it all)
Finally, we need to set up `react-router-dom` in your `App.jsx` to switch between pages.

**1. Update file:** `src/App.jsx`
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';

// A temporary placeholder for the Dashboard
const Dashboard = () => <h2>Student Dashboard (Coming in Step 2)</h2>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        
        {/* Fallback to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

> [!IMPORTANT]
> **Awaiting Your Confirmation**
> 
> Follow these steps to set up the frontend files. Then, run `npm run dev` in the terminal to start the development server. 
> 
> Open `http://localhost:5173/login` in your browser. You should see a professional, dark-mode login screen with a loading state when you click the button!
> 
> **Let me know when you have verified this works, and we will move to Step 2 (Register, Dashboard, and AI Recommendation cards)!**
