import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    passenger_id: '', train_id: '', travel_date: ''
  });

  const fetchData = async () => {
    try {
      const [resRes, passRes, trainRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/passengers'),
        api.get('/trains')
      ]);
      setReservations(resRes.data.data);
      setPassengers(passRes.data.data);
      setTrains(trainRes.data.data);
    } catch (error) {
      toast.error('Failed to load reservation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reservations', formData);
      toast.success('Ticket booked successfully!');
      setShowForm(false);
      setFormData({ passenger_id: '', train_id: '', travel_date: '' });
      fetchData(); // Refresh all data to update seat counts
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.patch(`/reservations/${id}/cancel`);
      toast.success('Reservation cancelled');
      fetchData(); // Refresh to update seat counts
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling reservation');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Booking Records</h1>
          <p>Manage passenger ticket reservations</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel Booking Form' : '+ Book Ticket'}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>New Reservation</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Select Passenger</label>
              <select className="form-control" required value={formData.passenger_id} onChange={e => setFormData({...formData, passenger_id: e.target.value})}>
                <option value="">-- Choose Passenger --</option>
                {passengers.map(p => (
                  <option key={p.passenger_id} value={p.passenger_id}>{p.passenger_name} ({p.contact})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Select Train</label>
              <select className="form-control" required value={formData.train_id} onChange={e => setFormData({...formData, train_id: e.target.value})}>
                <option value="">-- Choose Train --</option>
                {trains.filter(t => t.available_seats > 0).map(t => (
                  <option key={t.train_id} value={t.train_id}>
                    {t.train_number} - {t.train_name} ({t.source} to {t.destination})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Date of Travel</label>
              <input type="date" className="form-control" required value={formData.travel_date} onChange={e => setFormData({...formData, travel_date: e.target.value})} />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Confirm Booking</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container glass-panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Passenger</th>
              <th>Train</th>
              <th>Travel Date</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.reservation_id}>
                <td>#{r.reservation_id}</td>
                <td>
                  <strong>{r.passenger_name}</strong>
                </td>
                <td>
                  <strong>{r.train_number}</strong><br/>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.train_name}</span>
                </td>
                <td>
                  {new Date(r.travel_date).toLocaleDateString()}<br/>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Seat: {r.seat_number}</span>
                </td>
                <td>
                  <span className={`badge ${r.status}`}>{r.status}</span>
                </td>
                {isAdmin && (
                  <td>
                    {r.status === 'confirmed' && (
                      <button className="btn-danger" onClick={() => handleCancel(r.reservation_id)}>Cancel Ticket</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reservations found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservations;
