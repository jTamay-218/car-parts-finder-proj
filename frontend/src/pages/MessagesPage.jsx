import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) return token;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.token;
    }
    return null;
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setConversations(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages for selected conversation
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
            setSelectedConversation({
              ...selectedConversation,
              ...data.data
            });
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: newMessage })
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages([...messages, data.data]);
          setNewMessage('');
          // Refresh conversations to update last message
          const convResponse = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (convResponse.ok) {
            const convData = await convResponse.json();
            if (convData.success) {
              setConversations(convData.data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please log in to view messages</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '1rem',
          height: 'calc(100vh - 200px)',
          backgroundColor: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Conversations List */}
          <div style={{
            borderRight: '1px solid var(--gray-200)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--gray-200)',
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                💬 Messages
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                <p>No conversations yet</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Start a conversation from a product listing
                </p>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    style={{
                      padding: '1rem 1.5rem',
                      borderBottom: '1px solid var(--gray-100)',
                      cursor: 'pointer',
                      backgroundColor: selectedConversation?.id === conv.id ? 'var(--gray-50)' : 'white',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: 'var(--gray-50)'
                      }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '1.25rem',
                        flexShrink: 0
                      }}>
                        {conv.otherUser?.firstName?.[0] || 'U'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.25rem'
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--gray-800)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {conv.otherUser?.firstName} {conv.otherUser?.lastName}
                          </h3>
                          {conv.unreadCount > 0 && (
                            <span style={{
                              backgroundColor: 'var(--primary-color)',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        {conv.listing && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--gray-500)',
                            marginBottom: '0.25rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            📦 {conv.listing.name}
                          </div>
                        )}
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'var(--gray-600)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {conv.lastMessageContent || 'No messages yet'}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--gray-400)',
                          marginTop: '0.25rem'
                        }}>
                          {formatTime(conv.lastMessageAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {selectedConversation ? (
              <>
                {/* Header */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--gray-200)',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '1.25rem'
                    }}>
                      {selectedConversation.otherUser?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                        {selectedConversation.otherUser?.firstName} {selectedConversation.otherUser?.lastName}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        {selectedConversation.otherUser?.username}
                      </p>
                    </div>
                  </div>
                  {selectedConversation.listing && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      {selectedConversation.listing.image && (
                        <img
                          src={selectedConversation.listing.image}
                          alt={selectedConversation.listing.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '0.5rem'
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                          {selectedConversation.listing.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                          ${parseFloat(selectedConversation.listing.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.5rem',
                  backgroundColor: 'var(--gray-50)'
                }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === (user?.id || user?.userId);
                      return (
                        <div
                          key={message.id}
                          style={{
                            display: 'flex',
                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                            marginBottom: '1rem'
                          }}
                        >
                          <div style={{
                            maxWidth: '70%',
                            backgroundColor: isOwn ? 'var(--primary-color)' : 'white',
                            color: isOwn ? 'white' : 'var(--gray-800)',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}>
                            {!isOwn && (
                              <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem',
                                opacity: 0.9
                              }}>
                                {message.senderName || message.senderUsername}
                              </div>
                            )}
                            <div style={{ marginBottom: '0.25rem' }}>
                              {message.content}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              opacity: 0.7,
                              textAlign: 'right'
                            }}>
                              {formatTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--gray-200)',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '2rem',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="btn btn-primary"
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '2rem',
                        border: 'none',
                        cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
                        opacity: (!newMessage.trim() || sending) ? 0.5 : 1
                      }}
                    >
                      {sending ? '⏳' : '📤'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--gray-500)',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <div>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                  <h3>Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;

