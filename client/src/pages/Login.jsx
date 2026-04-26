import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Train } from 'lucide-react';
import '../styles/login.css';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('passenger');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (isLoginMode) {
      await login(email, password, role);
    } else {
      const success = await register(fullName, email, password, role);
      if (success) {
        // Switch to login mode and clear password
        setIsLoginMode(true);
        setPassword('');
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-circle">
            <Train size={32} />
          </div>
          <h1 className="text-gradient">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p>
            {isLoginMode 
              ? 'Sign in to Railway Reservation System' 
              : 'Register to book your next journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLoginMode && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required={!isLoginMode}
              />
            </div>
          )}

          <div className="form-group">
            <label>Login As</label>
            <select 
              className="form-control" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="passenger">Passenger</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Authenticating...' 
              : isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <p style={{ marginBottom: '1.5rem' }}>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          <p>Demo Admin: <code>admin@railway.com</code> / <code>admin123</code></p>
          <p>Demo Passenger: <code>passenger@railway.com</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
