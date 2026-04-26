import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchTrains = () => {
  const [allTrains, setAllTrains] = useState([]);
  const [searchParams, setSearchParams] = useState({ source: '', destination: '' });
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all trains to populate the dropdowns
  useEffect(() => {
    api.get('/trains')
      .then(res => setAllTrains(res.data.data))
      .catch(() => toast.error('Failed to load train data'));
  }, []);

  // Extract unique options for dropdowns
  const uniqueSources = [...new Set(allTrains.map(t => t.source))].sort();
  const uniqueDestinations = [...new Set(allTrains.map(t => t.destination))].sort();


  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchParams.source && !searchParams.destination) {
      toast.error('Please select at least one search criteria');
      return;
    }
    
    setIsSearching(true);
    
    // Perform local filtering since we already have all trains
    setTimeout(() => {
      let filtered = allTrains;
      if (searchParams.source) filtered = filtered.filter(t => t.source === searchParams.source);
      if (searchParams.destination) filtered = filtered.filter(t => t.destination === searchParams.destination);

      
      setResults(filtered);
      setHasSearched(true);
      setIsSearching(false);
    }, 400); // Simulate network delay for UI consistency
  };

  const handleReset = () => {
    setSearchParams({ source: '', destination: '' });
    setHasSearched(false);
    setResults([]);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Find a Train</h1>
          <p>Search availability across routes and trains</p>
        </div>
        <button className="btn-clear-advanced" onClick={handleReset}>
          <XCircle size={16} /> Clear Search
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Source City</label>
            <select 
              className="form-control" 
              value={searchParams.source} 
              onChange={e => setSearchParams({...searchParams, source: e.target.value})}
            >
              <option value="">-- Any Source --</option>
              {uniqueSources.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Destination City</label>
            <select 
              className="form-control" 
              value={searchParams.destination} 
              onChange={e => setSearchParams({...searchParams, destination: e.target.value})}
            >
              <option value="">-- Any Destination --</option>
              {uniqueDestinations.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>



          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '200px', justifyContent: 'center' }} disabled={isSearching}>
              <Search size={18} /> {isSearching ? 'Searching...' : 'Search Trains'}
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="search-results">
          <h3 style={{ marginBottom: '1.5rem' }}>Search Results ({results.length})</h3>
          
          {results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No trains found matching your search criteria. Try different options.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {results.map(t => (
                <div key={t.train_id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ color: 'var(--accent)', marginBottom: '0.25rem' }}>{t.train_number} - {t.train_name}</h2>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t.source} &rarr; {t.destination}</p>
                    <p style={{ color: 'var(--text-muted)' }}>
                      Departure: {t.departure_time} | Arrival: {t.arrival_time}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>₹{t.fare}</h2>
                    <p style={{ marginBottom: '1rem' }}>
                      <span className={`badge ${t.available_seats > 0 ? 'confirmed' : 'cancelled'}`}>
                        {t.available_seats} Seats Available
                      </span>
                    </p>
                    {t.available_seats > 0 && (
                      <button className="btn-primary" onClick={() => window.location.href='/reservations'}>
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTrains;
