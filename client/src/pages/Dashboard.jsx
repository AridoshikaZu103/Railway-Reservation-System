import { useState, useEffect } from 'react';
import { Users, Train, Calendar, Ticket, Check } from 'lucide-react';
import api from '../api/axios';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    passengers: 0,
    trains: 0,
    reservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, tRes, rRes] = await Promise.all([
          api.get('/passengers'),
          api.get('/trains'),
          api.get('/reservations')
        ]);
        
        setStats({
          passengers: pRes.data.count,
          trains: tRes.data.count,
          reservations: rRes.data.count
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Passengers', value: stats.passengers, icon: <Users size={24} />, color: 'var(--primary)' },
    { title: 'Active Trains', value: stats.trains, icon: <Train size={24} />, color: 'var(--accent)' },
    { title: 'Total Reservations', value: stats.reservations, icon: <Ticket size={24} />, color: 'var(--success)' },
    { title: 'Schedules Today', value: 12, icon: <Calendar size={24} />, color: 'var(--warning)' }, // Mocked for UI
  ];

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Dashboard Overview</h1>
        <p>System metrics and quick actions</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card glass-panel">
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="glass-panel quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => window.location.href='/search'}>Search Trains</button>
            <button className="btn-primary" onClick={() => window.location.href='/reservations'}>Manage Bookings</button>
          </div>
        </div>
        
        <div className="glass-panel recent-activity">
          <h3>System Status</h3>
          <ul className="activity-list advanced-status">
            <li>
              <div className="custom-check"><Check size={14} strokeWidth={3} /></div>
              <span>Database Connection: Online</span>
            </li>
            <li>
              <div className="custom-check"><Check size={14} strokeWidth={3} /></div>
              <span>Auth Service: Active</span>
            </li>
            <li>
              <div className="custom-check"><Check size={14} strokeWidth={3} /></div>
              <span>Passenger Records: Synced</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
