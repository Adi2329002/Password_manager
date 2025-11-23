import { useState, useEffect } from 'react';
import init, { derive_key, encrypt, decrypt } from "my_crypto_lib";
import { Plus, Shield, Eye, EyeOff } from 'lucide-react';

export default function Vault() {
  const [secrets, setSecrets] = useState([]);
  const [masterKey, setMasterKey] = useState(null);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visibleID, setVisibleID] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const unlockVault = (username, masterPass) => {
    try {
      // In a real app, use a unique salt. Here we use username for simplicity.
      const key = derive_key(masterPass, username);
      setMasterKey(key);
      fetchSecrets(key);
    } catch (e) {
      alert("Error generating key");
    }
  };

  const fetchSecrets = async (key) => {
    const token = localStorage.getItem('token');
    const RAW_URL = import.meta.env.VITE_API_URL;
    const API_URL = RAW_URL ? `https://${RAW_URL}` : 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_URL}/api/secrets/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const data = await res.json();

      const decrypted = data.map(s => {
        try {
          // We decrypt the JSON string: "{email: '...', pass: '...'}"
          const rawJson = decrypt(key, s.ciphertext);
          // If decryption fails (wrong key), it returns a string starting with 🔒 or ❌
          if (rawJson.startsWith('❌') || rawJson.startsWith('🔒')) {
            throw new Error("Decryption failed");
          }
          return { ...s, ...JSON.parse(rawJson) };
        } catch (e) {
          return { ...s, email: '???', pass: '⚠️ Decryption Failed' };
        }
      });
      setSecrets(decrypted);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!masterKey) return alert("Vault locked!");

    // 1. Pack data into JSON
    const payload = JSON.stringify({ email, pass: password });

    // 2. Encrypt the JSON blob
    const blob = encrypt(masterKey, payload);

    // 3. Send
    const token = localStorage.getItem('token');
    const RAW_URL = import.meta.env.VITE_API_URL;
    const API_URL = RAW_URL ? `https://${RAW_URL}` : 'http://127.0.0.1:8000';

    await fetch(`${API_URL}/api/secrets/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
      body: JSON.stringify({ name: service, ciphertext: blob })
    });

    setIsAdding(false);
    fetchSecrets(masterKey);
    setService(''); setEmail(''); setPassword('');
  };

  // If locked, show mini unlock screen
  if (!masterKey) {
    return (
      <div className="auth-container">
        <h2 style={{ textAlign: 'center' }}>🔓 Unlock Vault</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#94a3b8' }}>
          Enter your Master Encryption Password to decrypt your data.
        </p>
        <form onSubmit={(e) => {
          e.preventDefault();
          unlockVault(e.target.user.value, e.target.pass.value);
        }}>
          <div className="form-group">
            <label>Username</label>
            <input name="user" placeholder="Username" required />
          </div>
          <div className="form-group">
            <label>Master Encryption Password</label>
            <input name="pass" type="password" placeholder="Key" required style={{ border: '1px solid #3b82f6' }} />
          </div>
          <button className="btn-primary" style={{ marginTop: '10px' }}>Decrypt & Open</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Passwords</h2>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Plus size={18} /> Add New
        </button>
      </div>

      {isAdding && (
        <div className="auth-container" style={{ maxWidth: '600px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Add New Password</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Service Name</label>
              <input placeholder="e.g. Netflix" value={service} onChange={e => setService(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email / Username</label>
              <input placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Secret Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="btn-primary">Encrypt & Save</button>
          </form>
        </div>
      )}

      <div className="vault-grid">
        {secrets.length === 0 ? <p style={{ color: '#94a3b8' }}>No passwords found.</p> : secrets.map(s => (
          <div key={s.id} className="secret-card">
            <div className="secret-header">
              <h3 style={{ margin: 0 }}>{s.name}</h3>
              <Shield size={20} color="#3b82f6" />
            </div>
            <div style={{ marginBottom: '10px', color: '#94a3b8', fontSize: '0.9rem' }}>{s.email}</div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
              <div className="secret-value" style={{ flex: 1, border: 'none', background: 'transparent', padding: 0 }}>
                {visibleID === s.id ? s.pass : '••••••••••••'}
              </div>
              <button onClick={() => setVisibleID(visibleID === s.id ? null : s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                {visibleID === s.id ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}