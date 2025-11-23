import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_URL}/api-token-auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      // We force a page reload or state update to trigger the App router check
      window.location.href = "/vault"; 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>🔐 Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{color: '#ef4444', textAlign: 'center'}}>{error}</p>}
        <button className="btn-primary" style={{marginTop: '10px'}}>Login</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '15px', color: '#94a3b8'}}>
        Don't have an account? <Link to="/register" style={{color: '#3b82f6'}}>Register</Link>
      </p>
    </div>
  );
}