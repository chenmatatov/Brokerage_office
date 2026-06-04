function RealEstateLogo({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* בית ראשי */}
            <polygon points="18,4 32,16 32,32 4,32 4,16" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <polygon points="18,4 32,16 4,16" fill="white" fillOpacity="0.9"/>
            {/* קירות */}
            <rect x="5.5" y="16" width="25" height="16" fill="white" fillOpacity="0.85"/>
            {/* דלת */}
            <rect x="14" y="22" width="8" height="10" rx="1" fill="#2563eb"/>
            <circle cx="21" cy="27" r="0.8" fill="white"/>
            {/* חלון */}
            <rect x="7" y="19" width="5" height="4" rx="0.5" fill="#2563eb" fillOpacity="0.7"/>
            <rect x="24" y="19" width="5" height="4" rx="0.5" fill="#2563eb" fillOpacity="0.7"/>
        </svg>
    );
}

export default RealEstateLogo;
