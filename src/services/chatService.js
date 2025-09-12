import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinGroup(groupId) {
    if (this.socket) {
      this.socket.emit('join_group', groupId);
    }
  }

  leaveGroup(groupId) {
    if (this.socket) {
      this.socket.emit('leave_group', groupId);
    }
  }

  sendMessage(groupId, message) {
    if (this.socket) {
      this.socket.emit('send_message', {
        groupId,
        message,
        timestamp: new Date(),
      });
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  onStopTyping(callback) {
    if (this.socket) {
      this.socket.on('stop_typing', callback);
    }
  }

  emitTyping(groupId) {
    if (this.socket) {
      this.socket.emit('typing', groupId);
    }
  }

  emitStopTyping(groupId) {
    if (this.socket) {
      this.socket.emit('stop_typing', groupId);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const chatService = new ChatService();
