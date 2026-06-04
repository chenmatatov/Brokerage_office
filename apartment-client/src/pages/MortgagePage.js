import { useState } from 'react';
import './MortgagePage.css';

function MortgagePage() {
    const [form, setForm] = useState({ price: '', percent: 75, rate: 4.5, years: 25 });
    const [result, setResult] = useState(null);

    const calculate = (e) => {
        e.preventDefault();
        const loan = (form.price * form.percent) / 100;
        const monthlyRate = form.rate / 100 / 12;
        const n = form.years * 12;
        const monthly = loan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        const total = monthly * n;
        setResult({ loan, monthly: Math.round(monthly), total: Math.round(total), interest: Math.round(total - loan) });
    };

    return (
        <div className="mortgage-page">
            <div className="mortgage-hero">
                <h1>🏦 מחשבון משכנתא</h1>
                <p>חשב את ההחזר החודשי שלך</p>
            </div>

            <div className="mortgage-content">
                <div className="mortgage-card">
                    <form className="mortgage-form" onSubmit={calculate}>
                        <div className="m-group">
                            <label>מחיר הדירה ₪</label>
                            <input type="number" placeholder="2,500,000" value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} required />
                        </div>

                        <div className="m-group">
                            <label>אחוז מימון: {form.percent}%</label>
                            <input type="range" min={10} max={75} value={form.percent}
                                onChange={e => setForm({ ...form, percent: Number(e.target.value) })} />
                            <div className="range-labels"><span>10%</span><span>75%</span></div>
                        </div>

                        <div className="m-group">
                            <label>ריבית שנתית: {form.rate}%</label>
                            <input type="range" min={1} max={10} step={0.1} value={form.rate}
                                onChange={e => setForm({ ...form, rate: Number(e.target.value) })} />
                            <div className="range-labels"><span>1%</span><span>10%</span></div>
                        </div>

                        <div className="m-group">
                            <label>תקופה: {form.years} שנים</label>
                            <input type="range" min={5} max={30} value={form.years}
                                onChange={e => setForm({ ...form, years: Number(e.target.value) })} />
                            <div className="range-labels"><span>5</span><span>30</span></div>
                        </div>

                        <button type="submit" className="m-btn">חשב משכנתא</button>
                    </form>
                </div>

                {result && (
                    <div className="mortgage-results">
                        <div className="result-main">
                            <div className="result-label">החזר חודשי</div>
                            <div className="result-value">₪{result.monthly.toLocaleString()}</div>
                        </div>
                        <div className="result-grid">
                            <div className="result-item">
                                <span className="r-label">סכום הלוואה</span>
                                <span className="r-value">₪{result.loan.toLocaleString()}</span>
                            </div>
                            <div className="result-item">
                                <span className="r-label">סה"כ תשלום</span>
                                <span className="r-value">₪{result.total.toLocaleString()}</span>
                            </div>
                            <div className="result-item">
                                <span className="r-label">סה"כ ריבית</span>
                                <span className="r-value red">₪{result.interest.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MortgagePage;
