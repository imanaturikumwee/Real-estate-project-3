import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { Server as SocketIOServer } from 'socket.io';

function socketIoPlugin(): Plugin {
  return {
    name: 'socket-io-plugin',
    configureServer(server) {
      if (server.httpServer) {
        const io = new SocketIOServer(server.httpServer, {
          cors: { origin: '*' },
        });

        io.on('connection', (socket) => {
          socket.on('chat:send', (msg) => {
            socket.broadcast.emit('chat:message', msg);
          });

          socket.on('property:new', (prop) => {
            io.emit('notification', {
              title: 'New Rwandan Estate Listed',
              message: `${prop.title} in ${prop.district} added to the digital estate.`,
              type: 'system',
            });
          });
        });
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), socketIoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
