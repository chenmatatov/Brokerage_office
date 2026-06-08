import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import './Auth.css';

function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('agentId', res.data.agentId);
            navigate('/');
        } catch (err) {
            setError('אימייל או סיסמה שגויים');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🏠</div>
                <h2 className="auth-title">ברוכים הבאים</h2>
                <p className="auth-subtitle">התחברו לחשבונכם</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label>אימייל</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>סיסמה</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">התחברות</button>
                </form>

                <div className="auth-switch">
                    אין לך חשבון? <Link to="/register">הירשם כאן</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
