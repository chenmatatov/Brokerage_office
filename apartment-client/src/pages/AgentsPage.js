import { useEffect, useState } from 'react';
import { getAllAgents, getAgentById } from '../api/agentApi';
import { getPropertiesByAgent } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';

function AgentRow({ agent }) {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        getPropertiesByAgent(agent.id).then(res => setProperties(res.data));
    }, [agent.id]);

    return (
        <div className="agent-card">
            <div className="agent-header">
                <div className="agent-avatar">{agent.name.charAt(0)}</div>
                <div className="agent-info">
                    <h3>{agent.name}</h3>
                    <p>📧 {agent.email} &nbsp;|&nbsp; 📞 {agent.phone}</p>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="no-properties">אין דירות לסוכן זה</div>
            ) : (
                <div className="properties-grid">
                    {properties.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
            )}
        </div>
    );
}

function AgentsPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');
    const agentId = localStorage.getItem('agentId');

    useEffect(() => {
        if (role === 'AGENT' && agentId && agentId !== 'null') {
            getAgentById(agentId).then(res => {
                setAgents([res.data]);
                setLoading(false);
            });
        } else {
            getAllAgents().then(res => {
                setAgents(res.data);
                setLoading(false);
            });
        }
    }, [role, agentId]);

    if (loading) return <div className="loading">טוען...</div>;

    return (
        <div className="page">
            <h2 className="page-title">סוכני נדל"ן</h2>
            {agents.map(a => <AgentRow key={a.id} agent={a} />)}
        </div>
    );
}

export default AgentsPage;
