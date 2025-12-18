import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
        // updated 11/08
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.user.id);
        
        const from = location.state?.from || "/profile";
        navigate(from);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--gray-50)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ padding: '2rem' }}>
          <div className="text-center mb-6">
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'var(--primary-color)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 1rem'
            }}>
              🔧
            </div>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: 'var(--gray-800)',
              marginBottom: '0.5rem'
            }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Sign in to your CarParts Pro account
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>🔄</span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>🔑</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            backgroundColor: 'var(--gray-100)',
            padding: '1rem',
            borderRadius: '0.75rem',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: 'var(--gray-700)'
            }}>
              Demo Credentials:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', lineHeight: '1.4' }}>
              <div><strong>Seller:</strong> seller@example.com / seller123</div>
              <div><strong>Buyer:</strong> buyer@example.com / buyer123</div>
              <div><strong>Admin:</strong> admin@example.com / admin123</div>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              Don't have an account?{' '}
              <button 
                style={{ 
                  color: 'var(--primary-color)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={() => alert('Registration coming soon!')}
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;