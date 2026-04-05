import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiLogin, getToken, setToken } from '../api';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) navigate('/timer', { replace: true });
  }, [navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token,user } = await apiLogin(email.trim(), password);
      setToken(token);
      if (user && user._id) {
        localStorage.setItem('userId', user._id);
      }
      navigate('/timer', { replace: true });
    } catch (err) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__bg" aria-hidden />
      <div className="login__card">
        <div className="login__logo" aria-hidden>
          <span className="login__logo-mark">T</span>
        </div>
        <h1 className="login__title">Timorize&apos;ye hoş geldiniz</h1>
        <p className="login__subtitle">Zamanınızı planlayın, odaklanın</p>

       
        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label" htmlFor="email">
            E-posta
          </label>
          <div className="login__field-wrap">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="login__input"
              placeholder="E-posta adresinizi girin…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="login__label" htmlFor="password">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="login__input"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error ? <p className="login__error">{error}</p> : null}

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor…' : 'E-posta ile giriş yap'}
          </button>
        </form>

        <p className="login__footer">
          <Link to="/register">Hesap oluştur</Link>
          <span className="login__dot"> · </span>
          <span className="login__muted">Kurumsal SSO (yakında)</span>
        </p>
      </div>
    </div>
  );
}
