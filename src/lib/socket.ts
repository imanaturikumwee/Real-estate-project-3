import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    // Connect to current origin (Vite dev server or Express server)
    socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Connected to Real-Time Estate Concierge Hub:', socketInstance?.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('⚡ Disconnected from Real-Time Hub');
    });
  }
  return socketInstance;
};
