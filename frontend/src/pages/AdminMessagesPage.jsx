import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

function AdminMessagesPage() {
  const { user, isAdmin } = useAuth();
  const [allConversations, setAllConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const getAuthToken = () => {
    return localStorage.getItem('token') || (user && user.token);
  };

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }

    const fetchAllConversations = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        // Get all conversations by fetching from all users
        // For admin, we'll need a special endpoint or fetch all users' conversations
        const response = await fetch(`${API_BASE_URL}/api/admin/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAllConversations(data.data);
          }
        } else if (response.status === 404) {
          // Endpoint doesn't exist yet, we'll create it
          console.log('Admin endpoint not found, will need to create it');
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllConversations();
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${API_BASE_URL}/api/messages/conversations/${selectedConversation.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.data.messages || []);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation?.id]);

  if (!isAdmin()) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be an administrator to access this page.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>👑 Admin - All Messages</h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
            View and manage all conversations across the platform
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading conversations...
            </div>
          ) : allConversations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
              <p>No conversations found.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Admin endpoint needs to be created on the backend.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              gap: '1rem',
              height: '600px',
              border: '1px solid var(--gray-200)',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                borderRight: '1px solid var(--gray-200)',
                overflowY: 'auto',
                padding: '1rem'
              }}>
                {allConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--gray-100)',
                      cursor: 'pointer',
                      backgroundColor: selectedConversation?.id === conv.id ? 'var(--gray-50)' : 'white'
                    }}
                  >
                    <div style={{ fontWeight: '600' }}>
                      {conv.buyerName} ↔ {conv.sellerName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {conv.listingName || 'General conversation'}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '1rem', overflowY: 'auto' }}>
                {selectedConversation ? (
                  <div>
                    <h3>Messages</h3>
                    {messages.map((msg) => (
                      <div key={msg.id} style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                        <strong>{msg.senderName}:</strong> {msg.content}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
                    Select a conversation to view messages
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMessagesPage;

