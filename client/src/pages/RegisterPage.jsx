import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRegister, getToken } from '../api';
import './LoginPage.css';

export function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) navigate('/timer', { replace: true });
  }, [navigate]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiRegister(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
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
        <h1 className="login__title">Hesap oluştur</h1>
        <p className="login__subtitle">Timorize&apos;ye katılın</p>

        <form className="login__form" onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          <label className="login__label" htmlFor="name">
            Ad
          </label>
          <input
            id="name"
            className="login__input"
            style={{ marginBottom: 16 }}
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="login__label" htmlFor="reg-email">
            E-posta
          </label>
          <input
            id="reg-email"
            type="email"
            className="login__input"
            style={{ marginBottom: 16 }}
            autoComplete="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login__label" htmlFor="reg-password">
            Şifre
          </label>
          <input
            id="reg-password"
            type="password"
            className="login__input"
            autoComplete="new-password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error ? <p className="login__error">{error}</p> : null}

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? 'Kaydediliyor…' : 'Kayıt ol'}
          </button>
        </form>

        <p className="login__footer">
          <Link to="/">Zaten hesabınız var mı? Giriş</Link>
        </p>
      </div>
    </div>
  );
}
