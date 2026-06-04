import { useEffect, useState } from 'react';
import { getContactsByAgent, getAllContacts } from '../api/contactApi';
import './ContactsPage.css';

function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');
    const agentId = localStorage.getItem('agentId');

    useEffect(() => {
        if (role === 'ADMIN') {
            getAllContacts().then(res => {
                setContacts(res.data);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else if (role === 'AGENT' && agentId && agentId !== 'null') {
            getContactsByAgent(agentId).then(res => {
                setContacts(res.data);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [role, agentId]);

    if (loading) return <div className="loading">טוען פניות...</div>;

    return (
        <div className="contacts-page">
            <div className="contacts-hero">
                <h1>📬 פניות נכנסות</h1>
                <p>{contacts.length} פניות {role === 'ADMIN' ? 'במערכת' : 'אליך'}</p>
            </div>

            <div className="contacts-content">
                {contacts.length === 0 ? (
                    <div className="no-contacts">אין פניות עדיין</div>
                ) : (
                    <div className="contacts-list">
                        {contacts.map(c => (
                            <div key={c.id} className="contact-card">
                                <div className="contact-header">
                                    <div className="contact-avatar">{c.senderName?.charAt(0)}</div>
                                    <div className="contact-sender-info">
                                        <div className="contact-name">{c.senderName}</div>
                                        <div className="contact-date">
                                            {new Date(c.createdAt).toLocaleDateString('he-IL', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    {role === 'ADMIN' && (
                                        <div className="contact-agent-badge">👤 {c.agentName}</div>
                                    )}
                                </div>

                                <div className="contact-property">
                                    📍 {c.propertyAddress}
                                </div>

                                <div className="contact-message">{c.message}</div>

                                <div className="contact-footer">
                                    <a href={`mailto:${c.senderEmail}`} className="contact-action email">
                                        ✉️ {c.senderEmail}
                                    </a>
                                    {c.senderPhone && (
                                        <a href={`tel:${c.senderPhone}`} className="contact-action phone">
                                            📞 {c.senderPhone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContactsPage;
