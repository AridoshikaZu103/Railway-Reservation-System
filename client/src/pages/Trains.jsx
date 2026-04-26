import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Trains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    train_number: '', train_name: '', source: '', destination: '', total_seats: '', departure_time: '', arrival_time: '', fare: ''
  });

  const fetchTrains = async () => {
    try {
      const res = await api.get('/trains');
      setTrains(res.data.data);
    } catch (error) {
      toast.error('Failed to load trains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trains', formData);
      toast.success('Train added successfully');
      setShowForm(false);
      fetchTrains();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding train');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this train? This cannot be undone.")) return;
    try {
      await api.delete(`/trains/${id}`);
      toast.success("Train deleted successfully");
      fetchTrains();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting train");
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Train Fleet</h1>
          <p>Manage routes and schedules</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Train'}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Add New Train</h3>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>💡 Guidance: Complete Train Profiles for Testing</h4>
            <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', color: 'var(--text-muted)', paddingLeft: '1.5rem' }}>
              <li><strong>12951 - Rajdhani Express:</strong> New Delhi &rarr; Mumbai | Seats: 120 | Fare: ₹2500 | Dep: 16:30 | Arr: 08:15</li>
              <li><strong>12004 - Shatabdi Express:</strong> New Delhi &rarr; Lucknow | Seats: 72 | Fare: ₹1200 | Dep: 06:15 | Arr: 12:40</li>
              <li><strong>12627 - Karnataka Exp:</strong> Bengaluru &rarr; New Delhi | Seats: 250 | Fare: ₹1800 | Dep: 19:20 | Arr: 10:30</li>
              <li><strong>12801 - Purushottam Exp:</strong> Puri &rarr; New Delhi | Seats: 300 | Fare: ₹1550 | Dep: 21:45 | Arr: 04:00</li>
              <li><strong>12229 - Lucknow Mail:</strong> Lucknow &rarr; New Delhi | Seats: 150 | Fare: ₹950 | Dep: 22:00 | Arr: 06:55</li>
              <li><strong>12301 - Howrah Rajdhani:</strong> Howrah &rarr; New Delhi | Seats: 180 | Fare: ₹2800 | Dep: 16:50 | Arr: 10:05</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Train Number</label>
              <input type="text" className="form-control" required value={formData.train_number} onChange={e => setFormData({...formData, train_number: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Train Name</label>
              <input type="text" className="form-control" required value={formData.train_name} onChange={e => setFormData({...formData, train_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Source Station</label>
              <input type="text" className="form-control" required value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Destination Station</label>
              <input type="text" className="form-control" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Total Seats</label>
              <input type="number" className="form-control" required value={formData.total_seats} onChange={e => setFormData({...formData, total_seats: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Fare (₹)</label>
              <input type="number" className="form-control" required step="0.01" value={formData.fare} onChange={e => setFormData({...formData, fare: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Departure Time</label>
              <input type="time" className="form-control" required value={formData.departure_time} onChange={e => setFormData({...formData, departure_time: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Arrival Time</label>
              <input type="time" className="form-control" required value={formData.arrival_time} onChange={e => setFormData({...formData, arrival_time: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn-primary">Save Train Route</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container glass-panel">
        <table>
          <thead>
            <tr>
              <th>Train</th>
              <th>Route</th>
              <th>Schedule</th>
              <th>Seats (Avail/Total)</th>
              <th>Fare</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {trains.map(t => (
              <tr key={t.train_id}>
                <td>
                  <strong>{t.train_number}</strong><br/>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.train_name}</span>
                </td>
                <td>
                  {t.source} <br/> <span style={{ color: 'var(--primary)' }}>↓</span> <br/> {t.destination}
                </td>
                <td>
                  Dep: {t.departure_time}<br/>
                  Arr: {t.arrival_time}
                </td>
                <td>
                  <span className={`badge ${t.available_seats > 0 ? 'confirmed' : 'cancelled'}`}>
                    {t.available_seats} / {t.total_seats}
                  </span>
                </td>
                <td style={{ color: 'var(--accent)', fontWeight: 'bold' }}>₹{t.fare}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(t.train_id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {trains.length === 0 && (
              <tr><td colSpan={isAdmin ? "6" : "5"} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No trains found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trains;
