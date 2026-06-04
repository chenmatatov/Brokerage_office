import { useEffect, useState } from 'react';
import { getAllAgents, getAgentStats } from '../api/agentApi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import './StatsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function StatsPage() {
    const [agentStats, setAgentStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllAgents().then(res => {
            const agents = res.data;
            Promise.all(agents.map(a => getAgentStats(a.id).then(r => r.data)))
                .then(stats => {
                    setAgentStats(stats);
                    setLoading(false);
                });
        });
    }, []);

    if (loading) return <div className="loading">טוען...</div>;

    const totalProperties = agentStats.reduce((sum, s) => sum + s.totalProperties, 0);
    const allAvg = Math.round(agentStats.reduce((sum, s) => sum + s.averagePrice * s.totalProperties, 0) / totalProperties);
    const globalMax = Math.max(...agentStats.map(s => s.maxPrice));
    const globalMin = Math.min(...agentStats.filter(s => s.minPrice > 0).map(s => s.minPrice));
    const topAgent = agentStats.reduce((a, b) => a.totalProperties > b.totalProperties ? a : b);

    const barAvgData = {
        labels: agentStats.map(s => s.agentName),
        datasets: [{
            label: 'מחיר ממוצע ₪',
            data: agentStats.map(s => Math.round(s.averagePrice)),
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
            borderColor: '#2563eb',
            borderWidth: 2,
            borderRadius: 8,
        }]
    };

    const doughnutData = {
        labels: agentStats.map(s => s.agentName),
        datasets: [{
            data: agentStats.map(s => s.totalProperties),
            backgroundColor: ['#2563eb', '#38bdf8', '#7c3aed', '#059669', '#0ea5e9'],
            borderWidth: 0,
        }]
    };

    const barMinMaxData = {
        labels: agentStats.map(s => s.agentName),
        datasets: [
            {
                label: 'מחיר מקסימום ₪',
                data: agentStats.map(s => s.maxPrice),
                backgroundColor: 'rgba(124, 58, 237, 0.7)',
                borderRadius: 8,
            },
            {
                label: 'מחיר מינימום ₪',
                data: agentStats.map(s => s.minPrice),
                backgroundColor: 'rgba(5, 150, 105, 0.7)',
                borderRadius: 8,
            }
        ]
    };

    return (
        <div className="stats-page">
            <div className="stats-hero">
                <h1>📊 סטטיסטיקות שוק הנדל"ן</h1>
                <p>ניתוח מקיף לפי סוכנים</p>
            </div>

            <div className="stats-content">
                <div className="kpi-grid">
                    <div className="kpi-card blue">
                        <div className="kpi-icon">🏠</div>
                        <div className="kpi-value">{totalProperties}</div>
                        <div className="kpi-label">סה"כ נכסים</div>
                    </div>
                    <div className="kpi-card green">
                        <div className="kpi-icon">💰</div>
                        <div className="kpi-value">₪{allAvg.toLocaleString()}</div>
                        <div className="kpi-label">מחיר ממוצע כולל</div>
                    </div>
                    <div className="kpi-card purple">
                        <div className="kpi-icon">📈</div>
                        <div className="kpi-value">₪{globalMax.toLocaleString()}</div>
                        <div className="kpi-label">הנכס היקר ביותר</div>
                    </div>
                    <div className="kpi-card teal">
                        <div className="kpi-icon">🏆</div>
                        <div className="kpi-value">{topAgent.agentName}</div>
                        <div className="kpi-label">סוכן מוביל ({topAgent.totalProperties} נכסים)</div>
                    </div>
                </div>

                <div className="agent-stats-grid">
                    {agentStats.map(s => (
                        <div key={s.agentId} className="agent-stat-card">
                            <div className="agent-stat-avatar">{s.agentName.charAt(0)}</div>
                            <div className="agent-stat-name">{s.agentName}</div>
                            <div className="agent-stat-row">
                                <span>נכסים</span><strong>{s.totalProperties}</strong>
                            </div>
                            <div className="agent-stat-row">
                                <span>ממוצע</span><strong>₪{Math.round(s.averagePrice).toLocaleString()}</strong>
                            </div>
                            <div className="agent-stat-row">
                                <span>מקסימום</span><strong>₪{s.maxPrice.toLocaleString()}</strong>
                            </div>
                            <div className="agent-stat-row">
                                <span>מינימום</span><strong>₪{s.minPrice.toLocaleString()}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="charts-grid">
                    <div className="chart-card wide">
                        <h3>מחיר ממוצע לפי סוכן</h3>
                        <Bar data={barAvgData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                    </div>

                    <div className="chart-card">
                        <h3>התפלגות נכסים לפי סוכן</h3>
                        <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </div>

                    <div className="chart-card wide">
                        <h3>טווח מחירים לפי סוכן</h3>
                        <Bar data={barMinMaxData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsPage;
