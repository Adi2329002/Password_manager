import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const RAW_URL = import.meta.env.VITE_API_URL;
      const API_URL = RAW_URL ? `https://${RAW_URL}` : 'http://127.0.0.1:8000';
      const response = await fetch(`${API_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData));
      }

      // If successful, redirect to login
      alert("Registration Successful! Please login.");
      navigate('/login');

    } catch (err) {
      setError("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🚀 Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
        <button className="btn-primary" style={{ marginTop: '10px' }}>Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px', color: '#94a3b8' }}>
        Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link>
      </p>
    </div>
  );
}