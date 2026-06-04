import { useEffect, useState, useMemo, useRef } from 'react';
import { getAllProperties, searchProperties, getPropertiesByPriceRange, getPropertiesByRooms, getPropertiesByCity, deleteProperty } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import AddPropertyModal from '../components/AddPropertyModal';
import './PropertiesPage.css';

function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ city: '', rooms: '', minPrice: '', maxPrice: '', search: '' });
    const [showFavorites, setShowFavorites] = useState(false);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
    const [showAddModal, setShowAddModal] = useState(false);
    const role = localStorage.getItem('role');
    const timerRef = useRef(null);

    const fetchProperties = async (f) => {
        try {
            let res;
            if (f.search) res = await searchProperties(f.search);
            else if (f.city) res = await getPropertiesByCity(f.city);
            else if (f.rooms) res = await getPropertiesByRooms(Number(f.rooms));
            else if (f.minPrice || f.maxPrice) res = await getPropertiesByPriceRange(f.minPrice || 0, f.maxPrice || 999999999);
            else res = await getAllProperties();
            setProperties(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties({ city: '', rooms: '', minPrice: '', maxPrice: '', search: '' });
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => fetchProperties(newFilters), 500);
    };

    const allCities = useMemo(() => {
        const all = properties.map(p => p.address.split(',')[1]?.trim()).filter(Boolean);
        return [...new Set(all)];
    }, [properties]);

    const toggleFavorite = (id) => {
        const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    const handleDelete = (id) => {
        if (window.confirm('למחוק את הדירה?'))
            deleteProperty(id).then(() => fetchProperties(filters));
    };

    const displayed = showFavorites ? properties.filter(p => favorites.includes(p.id)) : properties;

    if (loading) return <div className="loading">טוען דירות...</div>;

    return (
        <div className="properties-page">
            <div className="properties-hero">
                <h1>🏠 מצא את הדירה שלך</h1>
                <p>{properties.length} נכסים מובחרים מחכים לך</p>
                <div className="hero-search">
                    <input
                        placeholder="🔍 חפש לפי כתובת או תיאור..."
                        value={filters.search}
                        onChange={e => handleFilterChange({ city: '', rooms: '', minPrice: '', maxPrice: '', search: e.target.value })}
                    />
                </div>
            </div>

            <div className="filters-bar">
                <select value={filters.city} onChange={e => handleFilterChange({ ...filters, city: e.target.value, search: '', rooms: '', minPrice: '', maxPrice: '' })}>
                    <option value="">כל הערים</option>
                    {allCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select value={filters.rooms} onChange={e => handleFilterChange({ ...filters, rooms: e.target.value, search: '', city: '', minPrice: '', maxPrice: '' })}>
                    <option value="">כל החדרים</option>
                    {[1, 2, 3, 4, 5, 6].map(r => <option key={r} value={r}>{r} חדרים</option>)}
                </select>

                <input type="number" placeholder="מחיר מינימום ₪"
                    value={filters.minPrice} onChange={e => handleFilterChange({ ...filters, minPrice: e.target.value, search: '', city: '', rooms: '' })} />

                <input type="number" placeholder="מחיר מקסימום ₪"
                    value={filters.maxPrice} onChange={e => handleFilterChange({ ...filters, maxPrice: e.target.value, search: '', city: '', rooms: '' })} />

                <button
                    className={`fav-btn ${showFavorites ? 'active' : ''}`}
                    onClick={() => setShowFavorites(!showFavorites)}>
                    ❤️ מועדפים ({favorites.length})
                </button>

                <button className="clear-btn" onClick={() => {
                    const empty = { city: '', rooms: '', minPrice: '', maxPrice: '', search: '' };
                    setFilters(empty);
                    setShowFavorites(false);
                    fetchProperties(empty);
                }}>נקה הכל</button>

                {role === 'ADMIN' && (
                    <button className="add-btn" onClick={() => setShowAddModal(true)}>+ הוסף דירה</button>
                )}
            </div>

            <div className="results-count">{displayed.length} נכסים נמצאו</div>

            <div className="properties-grid-main">
                {displayed.map(p => (
                    <PropertyCard
                        key={p.id}
                        property={p}
                        isFavorite={favorites.includes(p.id)}
                        onToggleFavorite={toggleFavorite}
                        onDelete={role === 'ADMIN' ? handleDelete : null}
                        onSaved={() => fetchProperties(filters)}
                    />
                ))}
            </div>

            {showAddModal && (
                <AddPropertyModal
                    onClose={() => setShowAddModal(false)}
                    onSaved={() => fetchProperties(filters)}
                />
            )}
        </div>
    );
}

export default PropertiesPage;
