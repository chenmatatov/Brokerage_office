import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import RealEstateLogo from './RealEstateLogo';
import PropertiesPage from './pages/PropertiesPage';
import SliderPage from './pages/SliderPage';
import StatsPage from './pages/StatsPage';
import MapPage from './pages/MapPage';
import MortgagePage from './pages/MortgagePage';
import ContactsPage from './pages/ContactsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    const logout = () => { localStorage.clear(); navigate('/login'); };

    if (!role) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <RealEstateLogo size={38} />
                <span>נדל"ן</span>
            </Link>
            <div className="navbar-links">
                <Link to="/">דירות</Link>
                <Link to="/map">🗺️ מפה</Link>
                <Link to="/slider">🎬 מצגת</Link>
                <Link to="/stats">📊 סטטיסטיקות</Link>
                <Link to="/mortgage">🏦 משכנתא</Link>
                {(role === 'ADMIN' || role === 'AGENT') && (
                    <Link to="/contacts">📬 פניות</Link>
                )}
            </div>
            <div className="navbar-user-area">
                <span className="navbar-user">👤 {email}</span>
                <button className="navbar-logout" onClick={logout}>התנתק</button>
            </div>
        </nav>
    );
}

function PrivateRoute({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<PrivateRoute><PropertiesPage /></PrivateRoute>} />
                <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
                <Route path="/slider" element={<PrivateRoute><SliderPage /></PrivateRoute>} />
                <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
                <Route path="/mortgage" element={<PrivateRoute><MortgagePage /></PrivateRoute>} />
                <Route path="/contacts" element={<PrivateRoute><ContactsPage /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
