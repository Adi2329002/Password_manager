import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="hero">
      <h1>Your Secrets, Secured by Math.</h1>
      <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem'}}>
        A Zero-Knowledge password manager powered by Rust and WebAssembly. 
        We can't see your passwords even if we wanted to.
      </p>
      <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
        <Link to="/register" className="btn-primary" style={{width: 'auto', textDecoration: 'none', padding: '12px 24px'}}>
          Get Started
        </Link>
        <Link to="/login" className="btn-outline">
          Access Vault
        </Link>
      </div>
    </div>
  );
}