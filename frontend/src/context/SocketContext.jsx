import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../services/api';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if we have a token (user is logged in)
    const token = localStorage.getItem('token');
    
    if (token) {
      const newSocket = io(SOCKET_URL, {
        auth: { token }, // Can be used by backend to identify user/role
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      newSocket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []); // Reconnect logic could be added if token changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
