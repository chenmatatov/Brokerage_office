import { useState } from 'react';
import { sendContact } from '../api/contactApi';
import './PropertyModal.css';

function PropertyModal({ property, onClose }) {
    const [activeImage, setActiveImage] = useState(
        property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null
    );
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await sendContact({
                senderName: form.name,
                senderEmail: form.email,
                senderPhone: form.phone,
                message: form.message,
                propertyId: property.id
            });
            setSent(true);
        } catch {
            setSent(true); // כרגע דמה
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-content">
                    <div className="modal-left">
                        <div className="modal-main-image">
                            {activeImage
                                ? <img src={activeImage} alt="property" />
                                : <div className="modal-no-image">🏢</div>
                            }
                        </div>
                        {property.imageUrls && property.imageUrls.length > 1 && (
                            <div className="modal-thumbnails">
                                {property.imageUrls.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`thumb-${i}`}
                                        className={`modal-thumb ${activeImage === url ? 'active' : ''}`}
                                        onClick={() => setActiveImage(url)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-right">
                        <h2 className="modal-address">📍 {property.address}</h2>

                        <div className="modal-tags">
                            <span className="modal-tag price">₪{property.price.toLocaleString()}</span>
                            <span className="modal-tag">🛏 {property.rooms} חדרים</span>
                            <span className="modal-tag agent">👤 {property.agentName}</span>
                        </div>

                        <div className="modal-divider" />

                        <p className="modal-desc">{property.description}</p>

                        <div className="modal-divider" />

                        <div className="contact-section">
                            <h4 className="contact-title">📩 פנה לסוכן</h4>

                            {sent ? (
                                <div className="contact-success">
                                    ✅ פנייתך נשלחה! הסוכן {property.agentName} יצור איתך קשר בקרוב.
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleSend}>
                                    <input
                                        placeholder="שמך המלא"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="האימייל שלך"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="טלפון"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="הודעה לסוכן..."
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        rows={3}
                                    />
                                    <button type="submit" className="contact-btn" disabled={sending}>
                                        {sending ? 'שולח...' : 'שלח פנייה ←'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyModal;
