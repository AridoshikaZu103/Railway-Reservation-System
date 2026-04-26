import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Train, Users, Calendar, Search, LayoutDashboard } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/search', label: 'Search Trains', icon: <Search size={18} /> },
    { path: '/trains', label: 'Trains', icon: <Train size={18} /> },
    { path: '/passengers', label: 'Passengers', icon: <Users size={18} /> },
    { path: '/reservations', label: 'Reservations', icon: <Calendar size={18} /> },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Train className="logo-icon" size={28} />
          <h2>RailSync</h2>
        </div>
        <p className="role-badge">{isAdmin ? 'Admin Portal' : 'Passenger Portal'}</p>
      </div>

      <div className="sidebar-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user.full_name.charAt(0)}</div>
          <div className="details">
            <span className="name">{user.full_name}</span>
            <span className="email">{user.email}</span>
          </div>
        </div>
        <button onClick={logout} className="logout-btn" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
