"use client";

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface SocketContextType {
  socket: typeof socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(NOTIFICATION_SOUND);

    if (user) {
      socket.connect();

      socket.on('connect', () => {
        console.log('Connected to socket server');
        socket.emit('join', `user_${user.uid}`);
      });

      socket.on('notification', (data: any) => {
        toast(data.message, {
          icon: '🔔',
          duration: 4000,
        });
        audioRef.current?.play().catch(err => console.log('Audio play blocked:', err));
      });

      socket.on('order_update', (data: any) => {
        toast.success(`Order Update: ${data.message}`);
        audioRef.current?.play().catch(err => console.log('Audio play blocked:', err));
      });

      return () => {
        socket.off('connect');
        socket.off('notification');
        socket.off('order_update');
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
