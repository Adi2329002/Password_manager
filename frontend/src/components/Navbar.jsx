import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Quick reset of state
  };

  return (
    <nav className="navbar">
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <Shield color="#3b82f6" size={32} />
        <span style={{fontWeight: 'bold', fontSize: '1.5rem'}}>ZeroVault</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{color: '#10b981'}}>Register</Link>
          </>
        ) : (
          <a href="#" onClick={handleLogout} style={{color: '#ef4444'}}>Logout</a>
        )}
      </div>
    </nav>
  );
}