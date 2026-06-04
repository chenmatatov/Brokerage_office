import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import './Auth.css';

function RegisterPage() {
    const [form, setForm] = useState({ email: '', password: '', role: 'USER', agentId: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                email: form.email,
                password: form.password,
                role: form.role,
                agentId: form.role === 'AGENT' && form.agentId ? Number(form.agentId) : null
            };
            const res = await register(payload);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('agentId', res.data.agentId);
            navigate('/');
        } catch (err) {
            setError('ההרשמה נכשלה, ייתכן שהאימייל כבר קיים');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🏠</div>
                <h2 className="auth-title">הרשמה</h2>
                <p className="auth-subtitle">צרו חשבון חדש</p>

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

                    <div className="form-group">
                        <label>סוג משתמש</label>
                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="USER">משתמש רגיל</option>
                            <option value="AGENT">סוכן</option>
                        </select>
                    </div>

                    {form.role === 'AGENT' && (
                        <div className="form-group">
                            <label>מספר סוכן (ID)</label>
                            <input
                                type="number"
                                placeholder="הכנס את ה-ID שלך"
                                value={form.agentId}
                                onChange={e => setForm({ ...form, agentId: e.target.value })}
                            />
                        </div>
                    )}

                    <button type="submit" className="auth-btn">הרשמה</button>
                </form>

                <div className="auth-switch">
                    כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
