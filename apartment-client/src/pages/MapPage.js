import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAllProperties } from '../api/propertyApi';
import PropertyModal from '../components/PropertyModal';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CITY_COORDS = {
    'תל אביב': [32.0853, 34.7818],
    'חיפה': [32.7940, 34.9896],
    'ירושלים': [31.7683, 35.2137],
    'באר שבע': [31.2530, 34.7915],
    'רמת גן': [32.0684, 34.8248],
    'נתניה': [32.3215, 34.8532],
    'ראשון לציון': [31.9730, 34.7895],
};

function getCoords(address) {
    const city = Object.keys(CITY_COORDS).find(c => address.includes(c));
    if (!city) return [31.7683, 35.2137];
    const [lat, lng] = CITY_COORDS[city];
    return [lat + (Math.random() - 0.5) * 0.02, lng + (Math.random() - 0.5) * 0.02];
}

function MapPage() {
    const [properties, setProperties] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getAllProperties().then(res => setProperties(res.data));
    }, []);

    return (
        <div className="map-page">
            <div className="map-header">
                <h2>🗺️ מפת נכסים</h2>
                <p>{properties.length} נכסים על המפה - לחץ על סיכה לפרטים</p>
            </div>

            <MapContainer center={[32.0, 34.9]} zoom={8} className="map-container">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {properties.map(p => (
                    <Marker key={p.id} position={getCoords(p.address)}>
                        <Popup>
                            <div className="map-popup" dir="rtl">
                                {p.imageUrls?.[0] && (
                                    <img src={p.imageUrls[0]} alt={p.address} className="popup-image" />
                                )}
                                <div className="popup-address">{p.address}</div>
                                <div className="popup-price">₪{p.price.toLocaleString()}</div>
                                <div className="popup-rooms">{p.rooms} חדרים</div>
                                <button className="popup-btn" onClick={() => setSelected(p)}>
                                    לפרטים מלאים ←
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {selected && <PropertyModal property={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

export default MapPage;
