import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    passenger_name: '', age: '', gender: 'Male', contact: '', email: ''
  });

  const fetchPassengers = async () => {
    try {
      const res = await api.get('/passengers');
      setPassengers(res.data.data);
    } catch (error) {
      toast.error('Failed to load passengers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/passengers', formData);
      toast.success('Passenger added successfully');
      setShowForm(false);
      setFormData({ passenger_name: '', age: '', gender: 'Male', contact: '', email: '' });
      fetchPassengers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding passenger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this passenger?')) return;
    try {
      await api.delete(`/passengers/${id}`);
      toast.success('Passenger deleted');
      fetchPassengers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting passenger');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Passenger Directory</h1>
          <p>Manage passenger records</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Passenger'}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Add New Passenger</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" required value={formData.passenger_name} onChange={e => setFormData({...formData, passenger_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-control" required min="1" max="150" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" className="form-control" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn-primary">Save Passenger</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container glass-panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age/Gender</th>
              <th>Contact</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {passengers.map(p => (
              <tr key={p.passenger_id}>
                <td>#{p.passenger_id}</td>
                <td style={{ fontWeight: 500 }}>{p.passenger_name}</td>
                <td>{p.age} Yrs • {p.gender}</td>
                <td>{p.contact}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(p.passenger_id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {passengers.length === 0 && (
              <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No passengers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Passengers;
