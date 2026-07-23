import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import Modal from '../components/Modal';

const initialListener = { displayName: '', email: '', password: '', confirm: '', birthDate: '', gender: 'female', privacy: false };
const initialArtist = { stageName: '', email: '', password: '', samples: '' };

export default function AuthPage() {
  const { login, registerListener, registerArtist } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [signupType, setSignupType] = useState('listener');
  const [listener, setListener] = useState(initialListener);
  const [artist, setArtist] = useState(initialArtist);
  const [loginData, setLoginData] = useState({ email: 'sara@example.com', password: '123456' });
  const [error, setError] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const afterLogin = (user) => {
    if (user.role === 'support' || user.role === 'admin') navigate('/dashboard');
    else if (user.role === 'artist' && user.status === 'approved') navigate('/studio');
    else if (user.role === 'artist') navigate('/notifications');
    else navigate('/');
  };

  const submitLogin = (e) => {
    e.preventDefault();
    const result = login(loginData.email, loginData.password);
    if (!result.ok) return setError(result.message);
    setError('');
    afterLogin(result.user);
  };

  const submitListener = (e) => {
    e.preventDefault();
    if (listener.password.length < 6) return setError('Password must be at least 6 characters long.');
    if (listener.password !== listener.confirm) return setError('Password and confirmation do not match.');
    if (!listener.privacy) return setError('You must accept the privacy policy.');
    const result = registerListener(listener);
    if (!result.ok) return setError(result.message);
    setError('');
    navigate('/');
  };

  const submitArtist = (e) => {
    e.preventDefault();
    if (artist.password.length < 6) return setError('Password must be at least 6 characters long.');
    if (!artist.samples.trim()) return setError('A portfolio link or description is required.');
    const result = registerArtist(artist);
    if (!result.ok) return setError(result.message);
    setError('');
    setPendingOpen(true);
    setArtist(initialArtist);
  };

  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-logo"><span>♪</span> Spotune</div>
        <div className="vinyl"><div /></div>
        <h1>Music, closer than ever.</h1>
        <p>Phase 1 frontend mock with four user roles, three subscription tiers, a complete player, and role-specific dashboards.</p>
      </div>

      <div className="auth-panel">
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>Sign up</button>
        </div>

        {mode === 'login' ? (
          <>
            <div className="auth-title"><h2>Welcome</h2><p>Sign in with any demo role.</p></div>
            <form onSubmit={submitLogin} className="form-stack">
              <label>Email<input type="email" required value={loginData.email} onChange={(e) => setLoginData((v) => ({ ...v, email: e.target.value }))} /></label>
              <label>Password<input type="password" required value={loginData.password} onChange={(e) => setLoginData((v) => ({ ...v, password: e.target.value }))} /></label>
              <button type="button" className="text-button align-start" onClick={() => setForgotOpen(true)}>Forgot password</button>
              {error && <div className="form-error">{error}</div>}
              <button className="primary-button" type="submit">Sign in to Spotune</button>
            </form>
            <div className="demo-box">
              <strong>Demo accounts</strong>
              <div className="demo-grid">
                {[
                  ['Basic listener', 'sara@example.com'],
                  ['Silver listener', 'mina@example.com'],
                  ['Gold listener', 'gold@example.com'],
                  ['Verified artist', 'nima@artist.com'],
                  ['Support', 'support@example.com'],
                  ['Admin', 'admin@example.com'],
                ].map(([label, email]) => <button key={email} onClick={() => setLoginData({ email, password: '123456' })}><span>{label}</span><small>{email}</small></button>)}
              </div>
              <small>Password for all demo accounts: 123456</small>
            </div>
          </>
        ) : (
          <>
            <div className="signup-type">
              <button className={signupType === 'listener' ? 'active' : ''} onClick={() => setSignupType('listener')}>Listener</button>
              <button className={signupType === 'artist' ? 'active' : ''} onClick={() => setSignupType('artist')}>Artist</button>
            </div>

            {signupType === 'listener' ? (
              <form onSubmit={submitListener} className="form-stack">
                <label>Display name<input required value={listener.displayName} onChange={(e) => setListener((v) => ({ ...v, displayName: e.target.value }))} /></label>
                <label>Email<input type="email" required value={listener.email} onChange={(e) => setListener((v) => ({ ...v, email: e.target.value }))} /></label>
                <div className="form-two"><label>Password<input type="password" required value={listener.password} onChange={(e) => setListener((v) => ({ ...v, password: e.target.value }))} /></label><label>Confirm password<input type="password" required value={listener.confirm} onChange={(e) => setListener((v) => ({ ...v, confirm: e.target.value }))} /></label></div>
                <div className="form-two"><label>Birth date<input type="date" required value={listener.birthDate} onChange={(e) => setListener((v) => ({ ...v, birthDate: e.target.value }))} /></label><label>Gender<select value={listener.gender} onChange={(e) => setListener((v) => ({ ...v, gender: e.target.value }))}><option value="female">Female</option><option value="male">Male</option><option value="other">Other / Prefer not to say</option></select></label></div>
                <label className="checkbox-line"><input type="checkbox" checked={listener.privacy} onChange={(e) => setListener((v) => ({ ...v, privacy: e.target.checked }))} /><span>I agree to the <button type="button" className="inline-link" onClick={() => setPrivacyOpen(true)}>Privacy Policy</button>.</span></label>
                {error && <div className="form-error">{error}</div>}
                <button className="primary-button" type="submit">Create listener account</button>
              </form>
            ) : (
              <form onSubmit={submitArtist} className="form-stack">
                <label>Stage name<input required value={artist.stageName} onChange={(e) => setArtist((v) => ({ ...v, stageName: e.target.value }))} /></label>
                <label>Email<input type="email" required value={artist.email} onChange={(e) => setArtist((v) => ({ ...v, email: e.target.value }))} /></label>
                <label>Password<input type="password" required value={artist.password} onChange={(e) => setArtist((v) => ({ ...v, password: e.target.value }))} /></label>
                <label>Portfolio<textarea required rows="4" placeholder="SoundCloud/GitHub/Drive link or portfolio description" value={artist.samples} onChange={(e) => setArtist((v) => ({ ...v, samples: e.target.value }))} /></label>
                <p className="info-note">After submission, the account enters Pending Review and a support agent or admin can review it.</p>
                {error && <div className="form-error">{error}</div>}
                <button className="primary-button" type="submit">Submit artist request</button>
              </form>
            )}
          </>
        )}
      </div>

      <Modal open={privacyOpen} title="Privacy Policy" onClose={() => setPrivacyOpen(false)}>
        <div className="prose"><p>This is an educational frontend mock. Entered data is stored only in the browser Local Storage and is not sent to a server.</p><p>In Phase 2, passwords, account data, and media must be handled by a secure backend with proper access controls.</p><p>By registering, the user consents to storing the settings, profile information, and interaction history required by the application.</p></div>
      </Modal>

      <Modal open={forgotOpen} title="Account recovery" onClose={() => setForgotOpen(false)}>
        <form className="form-stack" onSubmit={(e) => { e.preventDefault(); setForgotOpen(false); alert('A recovery link was simulated in the mock application.'); }}>
          <label>Account email<input type="email" required placeholder="name@example.com" /></label>
          <p className="info-note">Email delivery is mocked in Phase 1 and will be implemented by the backend in Phase 2.</p>
          <button className="primary-button">Send recovery link</button>
        </form>
      </Modal>

      <Modal open={pendingOpen} title="Request submitted" onClose={() => { setPendingOpen(false); setMode('login'); }}>
        <div className="center-message"><div className="success-mark">✓</div><p>The artist account request was submitted successfully and is now pending review.</p><button className="primary-button" onClick={() => { setPendingOpen(false); setMode('login'); }}>Back to login</button></div>
      </Modal>
    </div>
  );
}
