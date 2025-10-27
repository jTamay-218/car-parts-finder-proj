import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--gray-50)',
          padding: '2rem'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <div style={{ padding: '3rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
              <h1 style={{ color: 'var(--gray-800)', marginBottom: '1rem' }}>
                Something went wrong
              </h1>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                An error occurred in the application. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details style={{
                  marginBottom: '2rem',
                  textAlign: 'left',
                  backgroundColor: 'var(--gray-100)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--gray-700)'
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Error Details
                  </summary>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflow: 'auto',
                    maxHeight: '300px'
                  }}>
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-primary"
                >
                  🔄 Refresh Page
                </button>
                <button 
                  onClick={() => this.setState({ hasError: false, error: null })} 
                  className="btn btn-outline"
                >
                  🔙 Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


