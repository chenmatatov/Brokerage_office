import { useState, useEffect } from 'react';
import { createProperty, updateProperty } from '../api/propertyApi';
import { getAllAgents } from '../api/agentApi';
import api from '../api/axios';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import './AddPropertyModal.css';

function AddPropertyModal({ onClose, onSaved, property }) {
    const isEdit = !!property;
    const [agents, setAgents] = useState([]);
    const [form, setForm] = useState(
        isEdit
            ? { address: property.address, price: property.price, rooms: property.rooms, description: property.description, agentId: property.agentId }
            : { address: '', price: '', rooms: '', description: '', agentId: '' }
    );
    const [imageUrls, setImageUrls] = useState(['']);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAllAgents().then(res => setAgents(res.data));
    }, []);

    const addImageField = () => setImageUrls([...imageUrls, '']);
    const removeImageField = (i) => setImageUrls(imageUrls.filter((_, idx) => idx !== i));
    const updateImageUrl = (i, val) => {
        const updated = [...imageUrls];
        updated[i] = val;
        setImageUrls(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let savedId;
            if (isEdit) {
                await updateProperty({ ...form, id: property.id, price: Number(form.price), rooms: Number(form.rooms), agentId: Number(form.agentId) });
                savedId = property.id;
            } else {
                const res = await createProperty({ ...form, price: Number(form.price), rooms: Number(form.rooms), agentId: Number(form.agentId) });
                // שלוף את ה-ID של הדירה החדשה
                const all = await api.get('/properties/getAll');
                savedId = all.data[all.data.length - 1].id;
            }
            // שמור תמונות
            const validUrls = imageUrls.filter(u => u.trim() !== '');
            await Promise.all(validUrls.map(url =>
                api.post(`/properties/addImage/${savedId}?imageUrl=${encodeURIComponent(url)}`)
            ));
            onSaved();
            onClose();
        } catch {
            setError('שגיאה בשמירה, נסה שוב');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h3 className="add-modal-title">{isEdit ? '✏️ עריכת דירה' : '➕ הוסף דירה חדשה'}</h3>

                {error && <div className="add-error">{error}</div>}

                <form className="add-form" onSubmit={handleSubmit}>
                    <input placeholder="כתובת מלאה" value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })} required />

                    <div className="add-row">
                        <input type="number" placeholder="מחיר ₪" value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })} required />
                        <input type="number" placeholder="מספר חדרים" value={form.rooms}
                            onChange={e => setForm({ ...form, rooms: e.target.value })} required />
                    </div>

                    <textarea placeholder="תיאור הדירה" value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />

                    <select value={form.agentId} onChange={e => setForm({ ...form, agentId: e.target.value })} required>
                        <option value="">בחר סוכן</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>

                    {!isEdit && (
                        <div className="images-section">
                            <div className="images-label">
                                🖼️ תמונות
                                <button type="button" className="add-image-btn" onClick={addImageField}>
                                    <FiPlus size={14} /> הוסף תמונה
                                </button>
                            </div>
                            {imageUrls.map((url, i) => (
                                <div key={i} className="image-url-row">
                                    <input
                                        placeholder="הדבק קישור לתמונה..."
                                        value={url}
                                        onChange={e => updateImageUrl(i, e.target.value)}
                                    />
                                    {imageUrls.length > 1 && (
                                        <button type="button" className="remove-image-btn" onClick={() => removeImageField(i)}>
                                            <FiTrash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="add-submit-btn" disabled={saving}>
                        {saving ? 'שומר...' : isEdit ? 'עדכן דירה ✓' : 'שמור דירה ✓'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddPropertyModal;
