import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
// Import pages only once!
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Vault from './pages/Vault';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* This is where we "call" the components using the element prop */}
        <Route path="/" element={<Landing />} />
        
        {/* Logic: If no token, show Login. If token exists, redirect to Vault. */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/vault" />} />
        
        <Route path="/register" element={<Register />} />
        
        {/* Logic: If token exists, show Vault. If not, redirect to Login. */}
        <Route path="/vault" element={token ? <Vault /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;