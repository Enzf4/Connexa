import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  socket: null,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    
    case 'ADD_NOTIFICATION':
      const newNotification = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
        auth: { token },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
      });

      socket.on('disconnect', () => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      });

      socket.on('notification', (notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });

      dispatch({ type: 'SET_SOCKET', payload: socket });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const markAsRead = (notificationId) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const removeNotification = (notificationId) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const sendNotification = (type, message, data = {}) => {
    if (state.socket) {
      state.socket.emit('send_notification', {
        type,
        message,
        data,
      });
    }
  };

  const value = {
    ...state,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    sendNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
