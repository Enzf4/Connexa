import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { groupService } from '../services/groupService';
import { formatDateTime, getRelativeTime } from '../utils/validation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const Chat = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadGroup();
    setupChat();

    return () => {
      chatService.disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadGroup = async () => {
    try {
      const data = await groupService.getGroupById(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Erro ao carregar grupo:', error);
    }
  };

  const setupChat = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    chatService.connect(token);
    
    // Join group
    chatService.joinGroup(groupId);

    // Listen for messages
    chatService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for user joined
    chatService.onUserJoined((data) => {
      if (data.groupId === groupId) {
        // Add system message
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          message: `${data.user.name} entrou no grupo`,
          timestamp: new Date(),
        }]);
      }
    });

    // Listen for user left
    chatService.onUserLeft((data) => {
      if (data.groupId === groupId) {
        // Add system message
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          message: `${data.user.name} saiu do grupo`,
          timestamp: new Date(),
        }]);
      }
    });

    // Listen for typing
    chatService.onTyping((data) => {
      if (data.groupId === groupId && data.user.id !== user?.id) {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.id !== data.user.id);
          return [...filtered, data.user];
        });

        // Remove user from typing after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.id !== data.user.id));
        }, 3000);
      }
    });

    // Listen for stop typing
    chatService.onStopTyping((data) => {
      if (data.groupId === groupId) {
        setTypingUsers(prev => prev.filter(u => u.id !== data.user.id));
      }
    });

    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      chatService.sendMessage(groupId, messageText);
      
      // Add message to local state immediately for better UX
      const tempMessage = {
        id: Date.now(),
        user: user,
        message: messageText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, tempMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      chatService.emitTyping(groupId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatService.emitStopTyping(groupId);
    }, 1000);
  };

  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return messageTime.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Grupo não encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">Este grupo não existe ou você não tem acesso a ele.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">{group.subject}</h1>
            <p className="text-sm text-gray-500">{group.members?.length || 0} membros</p>
          </div>
          <div className="text-sm text-gray-500">
            {group.location}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma mensagem ainda</h3>
              <p className="mt-1 text-sm text-gray-500">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.user?.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'system' ? (
                  <div className="flex justify-center w-full">
                    <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {message.message}
                    </div>
                  </div>
                ) : (
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.user?.id === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.user?.id === user?.id ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      {message.user?.avatar ? (
                        <img
                          src={message.user.avatar}
                          alt={message.user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className={`text-xs font-medium ${
                          message.user?.id === user?.id ? 'text-primary-600' : 'text-gray-600'
                        }`}>
                          {message.user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className={`flex flex-col ${message.user?.id === user?.id ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2 rounded-lg ${
                        message.user?.id === user?.id 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {message.user?.id === user?.id ? 'Você' : message.user?.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-xs lg:max-w-md">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Digite sua mensagem..."
              className="flex-1 input-field"
              disabled={isSending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              loading={isSending}
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
