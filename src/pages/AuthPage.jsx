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
    if (listener.password.length < 6) return setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
    if (listener.password !== listener.confirm) return setError('رمز عبور و تایید آن یکسان نیستند.');
    if (!listener.privacy) return setError('پذیرش سیاست حریم خصوصی الزامی است.');
    const result = registerListener(listener);
    if (!result.ok) return setError(result.message);
    setError('');
    navigate('/');
  };

  const submitArtist = (e) => {
    e.preventDefault();
    if (artist.password.length < 6) return setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
    if (!artist.samples.trim()) return setError('لینک یا توضیح نمونه‌کار الزامی است.');
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
        <h1>موسیقی، نزدیک‌تر از همیشه.</h1>
        <p>نسخه ماک فاز اول؛ چهار نقش کاربری، سه سطح اشتراک، پخش‌کننده کامل و داشبوردهای اختصاصی.</p>
      </div>

      <div className="auth-panel">
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>ورود</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>ثبت‌نام</button>
        </div>

        {mode === 'login' ? (
          <>
            <div className="auth-title"><h2>خوش آمدید</h2><p>با هر یک از نقش‌های دمو وارد شوید.</p></div>
            <form onSubmit={submitLogin} className="form-stack">
              <label>ایمیل<input type="email" required value={loginData.email} onChange={(e) => setLoginData((v) => ({ ...v, email: e.target.value }))} /></label>
              <label>رمز عبور<input type="password" required value={loginData.password} onChange={(e) => setLoginData((v) => ({ ...v, password: e.target.value }))} /></label>
              <button type="button" className="text-button align-start" onClick={() => setForgotOpen(true)}>رمز عبور را فراموش کرده‌ام</button>
              {error && <div className="form-error">{error}</div>}
              <button className="primary-button" type="submit">ورود به Spotune</button>
            </form>
            <div className="demo-box">
              <strong>حساب‌های دمو</strong>
              <div className="demo-grid">
                {[
                  ['شنونده پایه', 'sara@example.com'],
                  ['شنونده نقره‌ای', 'mina@example.com'],
                  ['شنونده طلایی', 'gold@example.com'],
                  ['هنرمند تاییدشده', 'nima@artist.com'],
                  ['پشتیبان', 'support@example.com'],
                  ['مدیر', 'admin@example.com'],
                ].map(([label, email]) => <button key={email} onClick={() => setLoginData({ email, password: '123456' })}><span>{label}</span><small>{email}</small></button>)}
              </div>
              <small>رمز همه حساب‌های دمو: 123456</small>
            </div>
          </>
        ) : (
          <>
            <div className="signup-type">
              <button className={signupType === 'listener' ? 'active' : ''} onClick={() => setSignupType('listener')}>کاربر عادی</button>
              <button className={signupType === 'artist' ? 'active' : ''} onClick={() => setSignupType('artist')}>هنرمند</button>
            </div>

            {signupType === 'listener' ? (
              <form onSubmit={submitListener} className="form-stack">
                <label>نام نمایشی<input required value={listener.displayName} onChange={(e) => setListener((v) => ({ ...v, displayName: e.target.value }))} /></label>
                <label>ایمیل<input type="email" required value={listener.email} onChange={(e) => setListener((v) => ({ ...v, email: e.target.value }))} /></label>
                <div className="form-two"><label>رمز عبور<input type="password" required value={listener.password} onChange={(e) => setListener((v) => ({ ...v, password: e.target.value }))} /></label><label>تایید رمز<input type="password" required value={listener.confirm} onChange={(e) => setListener((v) => ({ ...v, confirm: e.target.value }))} /></label></div>
                <div className="form-two"><label>تاریخ تولد<input type="date" required value={listener.birthDate} onChange={(e) => setListener((v) => ({ ...v, birthDate: e.target.value }))} /></label><label>جنسیت<select value={listener.gender} onChange={(e) => setListener((v) => ({ ...v, gender: e.target.value }))}><option value="female">زن</option><option value="male">مرد</option><option value="other">سایر/ترجیح می‌دهم نگویم</option></select></label></div>
                <label className="checkbox-line"><input type="checkbox" checked={listener.privacy} onChange={(e) => setListener((v) => ({ ...v, privacy: e.target.checked }))} /><span>با <button type="button" className="inline-link" onClick={() => setPrivacyOpen(true)}>سیاست حریم خصوصی</button> موافقم.</span></label>
                {error && <div className="form-error">{error}</div>}
                <button className="primary-button" type="submit">ساخت حساب شنونده</button>
              </form>
            ) : (
              <form onSubmit={submitArtist} className="form-stack">
                <label>نام هنری<input required value={artist.stageName} onChange={(e) => setArtist((v) => ({ ...v, stageName: e.target.value }))} /></label>
                <label>ایمیل<input type="email" required value={artist.email} onChange={(e) => setArtist((v) => ({ ...v, email: e.target.value }))} /></label>
                <label>رمز عبور<input type="password" required value={artist.password} onChange={(e) => setArtist((v) => ({ ...v, password: e.target.value }))} /></label>
                <label>نمونه‌کارها<textarea required rows="4" placeholder="لینک SoundCloud/GitHub/Drive یا توضیح نمونه‌کار" value={artist.samples} onChange={(e) => setArtist((v) => ({ ...v, samples: e.target.value }))} /></label>
                <p className="info-note">پس از ارسال درخواست، حساب در وضعیت «در انتظار تأیید» قرار می‌گیرد و پشتیبان/مدیر آن را بررسی می‌کند.</p>
                {error && <div className="form-error">{error}</div>}
                <button className="primary-button" type="submit">ارسال درخواست هنرمندی</button>
              </form>
            )}
          </>
        )}
      </div>

      <Modal open={privacyOpen} title="سیاست حریم خصوصی" onClose={() => setPrivacyOpen(false)}>
        <div className="prose"><p>این پروژه یک نسخه ماک آموزشی است. اطلاعات واردشده فقط در Local Storage مرورگر نگهداری می‌شوند و به سروری ارسال نمی‌شوند.</p><p>در نسخه واقعی فاز دوم، نگهداری رمز عبور، اطلاعات حساب و رسانه‌ها باید از طریق بک‌اند امن و سیاست‌های دسترسی مناسب انجام شود.</p><p>با ثبت‌نام، کاربر با ذخیره تنظیمات، اطلاعات نمایه و تاریخچه تعاملات مورد نیاز برای عملکرد سامانه موافقت می‌کند.</p></div>
      </Modal>

      <Modal open={forgotOpen} title="بازیابی حساب" onClose={() => setForgotOpen(false)}>
        <form className="form-stack" onSubmit={(e) => { e.preventDefault(); setForgotOpen(false); alert('در نسخه ماک، لینک بازیابی شبیه‌سازی شد.'); }}>
          <label>ایمیل حساب<input type="email" required placeholder="name@example.com" /></label>
          <p className="info-note">در فاز اول ارسال ایمیل شبیه‌سازی می‌شود؛ اتصال واقعی در بک‌اند انجام خواهد شد.</p>
          <button className="primary-button">ارسال لینک بازیابی</button>
        </form>
      </Modal>

      <Modal open={pendingOpen} title="درخواست ثبت شد" onClose={() => { setPendingOpen(false); setMode('login'); }}>
        <div className="center-message"><div className="success-mark">✓</div><p>درخواست حساب هنرمند با موفقیت ثبت شد و اکنون «در انتظار تأیید» است.</p><button className="primary-button" onClick={() => { setPendingOpen(false); setMode('login'); }}>بازگشت به ورود</button></div>
      </Modal>
    </div>
  );
}
