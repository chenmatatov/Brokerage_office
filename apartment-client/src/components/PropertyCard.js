import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import PropertyModal from './PropertyModal';
import AddPropertyModal from './AddPropertyModal';
import './PropertyCard.css';

function PropertyCard({ property, isFavorite, onToggleFavorite, onDelete, onSaved }) {
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const mainImage = property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null;

    return (
        <>
            <div className="prop-card">
                <div className="prop-image-wrap" onClick={() => setShowModal(true)}>
                    {mainImage
                        ? <img src={mainImage} alt={property.address} className="prop-image" />
                        : <div className="prop-no-image">🏢</div>
                    }
                    <div className="prop-rooms-badge">{property.rooms} חדרים</div>
                    {property.imageUrls && property.imageUrls.length > 1 && (
                        <div className="prop-image-count">📷 {property.imageUrls.length}</div>
                    )}
                    <button
                        className={`fav-heart ${isFavorite ? 'active' : ''}`}
                        onClick={e => { e.stopPropagation(); onToggleFavorite(property.id); }}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>

                <div className="prop-body" onClick={() => setShowModal(true)}>
                    <div className="prop-price">₪{property.price.toLocaleString()}</div>
                    <div className="prop-address">📍 {property.address}</div>
                    <div className="prop-description">{property.description}</div>
                    <div className="prop-footer">
                        <span className="prop-agent">👤 {property.agentName}</span>
                        <span className="prop-cta">לפרטים ←</span>
                    </div>
                </div>

                {onDelete && (
                    <div className="admin-btns">
                        <button className="edit-prop-btn" title="ערוך" onClick={() => setShowEdit(true)}><FiEdit2 size={16} /></button>
                        <button className="delete-prop-btn" title="מחק" onClick={() => onDelete(property.id)}><FiTrash2 size={16} /></button>
                    </div>
                )}
            </div>

            {showModal && <PropertyModal property={property} onClose={() => setShowModal(false)} />}
            {showEdit && <AddPropertyModal property={property} onClose={() => setShowEdit(false)} onSaved={onSaved} />}
        </>
    );
}

export default PropertyCard;
