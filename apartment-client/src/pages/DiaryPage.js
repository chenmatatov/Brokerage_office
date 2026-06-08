import { useEffect, useState, useMemo } from 'react';
import { getNotesByAgent, createNote, deleteNote } from '../api/notesApi';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './DiaryPage.css';

const EMPTY_CLIENT = { clientName: '', clientPhone: '', clientEmail: '' };
const EMPTY_UPDATE = { meetingDate: '', propertyOffered: '', notes: '', status: 'פתוח' };
const STATUS_COLORS = { 'פתוח': '#2563eb', 'בטיפול': '#d97706', 'סגור': '#059669' };

function DiaryPage() {
    const [notes, setNotes] = useState([]);
    const [showNewClient, setShowNewClient] = useState(false);
    const [clientForm, setClientForm] = useState(EMPTY_CLIENT);
    const [updateForm, setUpdateForm] = useState(EMPTY_UPDATE);
    const [expandedClient, setExpandedClient] = useState(null);
    const [addingUpdateFor, setAddingUpdateFor] = useState(null);
    const agentId = localStorage.getItem('agentId');
    const role = localStorage.getItem('role');

    const refreshNotes = () => {
        if (agentId && agentId !== 'null')
            getNotesByAgent(agentId).then(res => setNotes(res.data));
    };

    useEffect(() => { refreshNotes(); }, [agentId]);

    // קיבוץ לפי שם לקוח
    const clients = useMemo(() => {
        const map = {};
        notes.forEach(n => {
            if (!map[n.clientName]) {
                map[n.clientName] = {
                    clientName: n.clientName,
                    clientPhone: n.clientPhone,
                    clientEmail: n.clientEmail,
                    updates: []
                };
            }
            map[n.clientName].updates.push(n);
        });
        return Object.values(map);
    }, [notes]);

    // הוספת לקוח חדש עם עדכון ראשון
    const handleNewClient = async (e) => {
        e.preventDefault();
        await createNote({ ...clientForm, ...updateForm, agentId: Number(agentId) });
        setShowNewClient(false);
        setClientForm(EMPTY_CLIENT);
        setUpdateForm(EMPTY_UPDATE);
        refreshNotes();
    };

    // הוספת עדכון ללקוח קיים
    const handleAddUpdate = async (e, client) => {
        e.preventDefault();
        await createNote({
            clientName: client.clientName,
            clientPhone: client.clientPhone,
            clientEmail: client.clientEmail,
            ...updateForm,
            agentId: Number(agentId)
        });
        setAddingUpdateFor(null);
        setUpdateForm(EMPTY_UPDATE);
        refreshNotes();
    };

    const handleDelete = async (id) => {
        if (window.confirm('למחוק עדכון זה?')) {
            await deleteNote(id);
            refreshNotes();
        }
    };

    if (role === 'USER') return <div className="loading">אין לך הרשאה לדף זה</div>;

    return (
        <div className="diary-page">
            <div className="diary-hero">
                <h1>📓 יומן לקוחות</h1>
                <p>עקוב אחר המשא ומתן עם כל לקוח</p>
            </div>

            <div className="diary-content">
                <div className="diary-toolbar">
                    <span className="diary-count">{clients.length} לקוחות | {notes.length} עדכונים</span>
                    <button className="diary-add-btn" onClick={() => { setShowNewClient(true); setClientForm(EMPTY_CLIENT); setUpdateForm(EMPTY_UPDATE); }}>
                        <FiPlus /> לקוח חדש
                    </button>
                </div>

                {showNewClient && (
                    <div className="diary-form-card">
                        <h3>➕ לקוח חדש</h3>
                        <form className="diary-form" onSubmit={handleNewClient}>
                            <div className="diary-form-section-title">פרטי לקוח</div>
                            <div className="diary-form-row">
                                <input placeholder="שם לקוח *" value={clientForm.clientName}
                                    onChange={e => setClientForm({ ...clientForm, clientName: e.target.value })} required />
                                <input placeholder="טלפון" value={clientForm.clientPhone}
                                    onChange={e => setClientForm({ ...clientForm, clientPhone: e.target.value })} />
                            </div>
                            <input type="email" placeholder="אימייל" value={clientForm.clientEmail}
                                onChange={e => setClientForm({ ...clientForm, clientEmail: e.target.value })} />

                            <div className="diary-form-section-title">עדכון ראשון</div>
                            <div className="diary-form-row">
                                <input type="date" value={updateForm.meetingDate}
                                    onChange={e => setUpdateForm({ ...updateForm, meetingDate: e.target.value })} />
                                <select value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                                    <option>פתוח</option>
                                    <option>בטיפול</option>
                                    <option>סגור</option>
                                </select>
                            </div>
                            <input placeholder="נכס שהוצע" value={updateForm.propertyOffered}
                                onChange={e => setUpdateForm({ ...updateForm, propertyOffered: e.target.value })} />
                            <textarea placeholder="הערות..." value={updateForm.notes}
                                onChange={e => setUpdateForm({ ...updateForm, notes: e.target.value })} rows={3} />

                            <div className="diary-form-btns">
                                <button type="submit" className="diary-save-btn">שמור ✓</button>
                                <button type="button" className="diary-cancel-btn" onClick={() => setShowNewClient(false)}>ביטול</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="diary-list">
                    {clients.length === 0 && !showNewClient && (
                        <div className="diary-empty">אין לקוחות עדיין - הוסף את הראשון!</div>
                    )}

                    {clients.map(client => (
                        <div key={client.clientName} className="diary-client-card">
                            <div className="diary-card-header" onClick={() => setExpandedClient(expandedClient === client.clientName ? null : client.clientName)}>
                                <div className="diary-avatar">{client.clientName?.charAt(0)}</div>
                                <div className="diary-client-info">
                                    <div className="diary-client-name">{client.clientName}</div>
                                    <div className="diary-client-contact">
                                        {client.clientPhone && <span>📞 {client.clientPhone}</span>}
                                        {client.clientEmail && <span>✉️ {client.clientEmail}</span>}
                                    </div>
                                </div>
                                <div className="diary-card-actions">
                                    <span className="diary-updates-count">{client.updates.length} עדכונים</span>
                                    <span className="diary-status" style={{ background: STATUS_COLORS[client.updates[0]?.status] + '20', color: STATUS_COLORS[client.updates[0]?.status], border: `1px solid ${STATUS_COLORS[client.updates[0]?.status]}40` }}>
                                        {client.updates[0]?.status}
                                    </span>
                                    {expandedClient === client.clientName ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                            </div>

                            {expandedClient === client.clientName && (
                                <div className="diary-updates">
                                    <div className="diary-timeline">
                                        {client.updates.map((u, i) => (
                                            <div key={u.id} className="diary-timeline-item">
                                                <div className="diary-timeline-dot" style={{ background: STATUS_COLORS[u.status] }} />
                                                <div className="diary-timeline-content">
                                                    <div className="diary-timeline-header">
                                                        {u.meetingDate && <span className="diary-date">📅 {new Date(u.meetingDate).toLocaleDateString('he-IL')}</span>}
                                                        <span className="diary-status small" style={{ background: STATUS_COLORS[u.status] + '20', color: STATUS_COLORS[u.status] }}>{u.status}</span>
                                                        <button className="diary-icon-btn delete small" onClick={() => handleDelete(u.id)}><FiTrash2 size={12} /></button>
                                                    </div>
                                                    {u.propertyOffered && <div className="diary-meta">🏠 {u.propertyOffered}</div>}
                                                    {u.notes && <div className="diary-notes">{u.notes}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {addingUpdateFor === client.clientName ? (
                                        <form className="diary-update-form" onSubmit={e => handleAddUpdate(e, client)}>
                                            <div className="diary-form-row">
                                                <input type="date" value={updateForm.meetingDate}
                                                    onChange={e => setUpdateForm({ ...updateForm, meetingDate: e.target.value })} />
                                                <select value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                                                    <option>פתוח</option>
                                                    <option>בטיפול</option>
                                                    <option>סגור</option>
                                                </select>
                                            </div>
                                            <input placeholder="נכס שהוצע" value={updateForm.propertyOffered}
                                                onChange={e => setUpdateForm({ ...updateForm, propertyOffered: e.target.value })} />
                                            <textarea placeholder="הערות על העדכון..." value={updateForm.notes}
                                                onChange={e => setUpdateForm({ ...updateForm, notes: e.target.value })} rows={2} />
                                            <div className="diary-form-btns">
                                                <button type="submit" className="diary-save-btn small">הוסף עדכון ✓</button>
                                                <button type="button" className="diary-cancel-btn" onClick={() => setAddingUpdateFor(null)}>ביטול</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button className="diary-add-update-btn" onClick={() => { setAddingUpdateFor(client.clientName); setUpdateForm(EMPTY_UPDATE); }}>
                                            <FiPlus size={14} /> הוסף עדכון
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DiaryPage;
