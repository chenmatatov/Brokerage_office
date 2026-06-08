import { useEffect, useState, useRef } from 'react';
import { getAllProperties } from '../api/propertyApi';
import PropertyModal from '../components/PropertyModal';
import './SliderPage.css';

function SliderPage() {
    const [properties, setProperties] = useState([]);
    const [propIndex, setPropIndex] = useState(0);
    const [imgIndex, setImgIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        getAllProperties().then(res => setProperties(res.data));
    }, []);

    useEffect(() => {
        if (properties.length === 0 || paused) return;
        intervalRef.current = setInterval(() => {
            const p = properties[propIndex];
            const totalImages = p.imageUrls?.length || 1;
            if (imgIndex < totalImages - 1) {
                setImgIndex(prev => prev + 1);
            } else {
                setImgIndex(0);
                setPropIndex(prev => (prev + 1) % properties.length);
            }
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, [properties, propIndex, imgIndex, paused]);

    const goToProperty = (i) => {
        setPropIndex(i);
        setImgIndex(0);
    };

    if (properties.length === 0) return <div className="loading">טוען...</div>;

    const p = properties[propIndex];
    const currentImage = p.imageUrls?.[imgIndex] || null;
    const totalImages = p.imageUrls?.length || 0;

    return (
        <div className="slider-page">
            <div className="slider-header">
                <h2>🏠 נכסים מובחרים</h2>
                <p>לחץ על הדירה לפרטים נוספים</p>
            </div>

            <div
                className="slider-main"
                onClick={() => setSelected(p)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="slider-image-wrap">
                    {currentImage
                        ? <img src={currentImage} alt={p.address} className="slider-image" key={currentImage} />
                        : <div className="slider-no-image">🏢</div>
                    }
                    <div className="slider-overlay">
                        <div className="slider-badge">{p.rooms} חדרים</div>
                        <div className="slider-price">₪{p.price.toLocaleString()}</div>
                    </div>
                    {totalImages > 1 && (
                        <div className="slider-img-counter">{imgIndex + 1} / {totalImages}</div>
                    )}
                </div>

                <div className="slider-info">
                    <h3 className="slider-address">📍 {p.address}</h3>
                    <p className="slider-description">{p.description}</p>
                    <div className="slider-agent">👤 סוכן: {p.agentName}</div>

                    {totalImages > 1 && (
                        <div className="slider-img-dots">
                            {p.imageUrls.map((_, i) => (
                                <span
                                    key={i}
                                    className={`img-dot ${i === imgIndex ? 'active' : ''}`}
                                    onClick={e => { e.stopPropagation(); setImgIndex(i); }}
                                />
                            ))}
                        </div>
                    )}

                    <button className="slider-btn">לפרטים נוספים ←</button>
                </div>
            </div>

            <div className="slider-dots">
                {properties.map((_, i) => (
                    <span
                        key={i}
                        className={`dot ${i === propIndex ? 'active' : ''}`}
                        onClick={() => goToProperty(i)}
                    />
                ))}
            </div>

            <div className="slider-thumbs">
                {properties.map((prop, i) => (
                    <div
                        key={prop.id}
                        className={`slider-thumb-card ${i === propIndex ? 'active' : ''}`}
                        onClick={() => goToProperty(i)}
                    >
                        {prop.imageUrls && prop.imageUrls.length > 0
                            ? <img src={prop.imageUrls[0]} alt={prop.address} />
                            : <div className="thumb-no-img">🏢</div>
                        }
                        <div className="thumb-info">
                            <div className="thumb-address">{prop.address.split(',')[0]}</div>
                            <div className="thumb-price">₪{prop.price.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {selected && <PropertyModal property={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

export default SliderPage;
