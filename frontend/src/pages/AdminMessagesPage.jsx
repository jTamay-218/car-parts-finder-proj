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
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Admin endpoint error:', errorData);
          if (response.status === 403) {
            alert('You do not have admin privileges. Please log in as an admin user.');
          }
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
          `${API_BASE_URL}/api/admin/conversations/${selectedConversation.id}`,
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
            setSelectedConversation(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation?.id]);

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation? This will delete all messages in it.')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/api/admin/conversations/${conversationId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setAllConversations(allConversations.filter(conv => conv.id !== conversationId));
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
        alert('Conversation deleted successfully');
      } else {
        alert('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/api/admin/messages/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        alert('Message deleted successfully');
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const refreshConversations = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
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
      }
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ margin: 0 }}>👑 Admin - All Messages</h1>
              <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem', marginBottom: 0 }}>
                View and manage all conversations across the platform
              </p>
            </div>
            <button
              className="btn btn-outline"
              onClick={refreshConversations}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading conversations...
            </div>
          ) : allConversations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <p>No conversations found.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                There are no conversations in the system yet.
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
                padding: '1rem',
                backgroundColor: 'white'
              }}>
                {allConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--gray-100)',
                      cursor: 'pointer',
                      backgroundColor: selectedConversation?.id === conv.id ? 'var(--gray-50)' : 'white',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedConversation?.id !== conv.id) {
                        e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedConversation?.id !== conv.id) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {conv.buyerName} ↔ {conv.sellerName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                      📦 {conv.listingName || 'General conversation'}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '1rem',
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginTop: '0.25rem'
                      }}>
                        {conv.unreadCount} unread
                      </div>
                    )}
                    {conv.lastMessageContent && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--gray-500)',
                        marginTop: '0.5rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conv.lastMessageContent}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      className="btn btn-danger btn-sm"
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ padding: '1rem', overflowY: 'auto', backgroundColor: 'white' }}>
                {selectedConversation ? (
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid var(--gray-200)'
                    }}>
                      <div>
                        <h3 style={{ margin: 0 }}>Conversation Details</h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                          <div><strong>Buyer:</strong> {selectedConversation.buyerName} ({selectedConversation.buyerEmail})</div>
                          <div><strong>Seller:</strong> {selectedConversation.sellerName} ({selectedConversation.sellerEmail})</div>
                          {selectedConversation.listingName && (
                            <div><strong>Listing:</strong> {selectedConversation.listingName}</div>
                          )}
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteConversation(selectedConversation.id)}
                      >
                        🗑️ Delete Conversation
                      </button>
                    </div>
                    
                    <h4 style={{ marginBottom: '1rem' }}>Messages ({messages.length})</h4>
                    {messages.length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
                        No messages in this conversation
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          style={{ 
                            marginBottom: '1rem', 
                            padding: '1rem',
                            backgroundColor: 'var(--gray-50)',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--gray-200)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <div>
                              <strong style={{ color: 'var(--gray-800)' }}>{msg.senderName || msg.senderUsername}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginLeft: '0.5rem' }}>
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteMessage(msg.id)}
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            >
                              🗑️
                            </button>
                          </div>
                          <div style={{ color: 'var(--gray-700)' }}>{msg.content}</div>
                          {msg.readAt && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                              ✓ Read at {new Date(msg.readAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))
                    )}
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

