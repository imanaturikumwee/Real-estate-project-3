import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory synced state for properties & inquiries
let synchronizedProperties = [
  {
    id: 'prop-1',
    title: 'Kigali View Heights',
    price: 450000,
    district: 'Rebero',
    location: 'Rebero District, Kigali',
    type: 'House',
    status: 'Active',
    aiPropertyScore: 94,
    growthPotential: '+12.4% /yr',
  },
  {
    id: 'prop-2',
    title: 'The Nyarutarama Heights',
    price: 1250000,
    district: 'Nyarutarama',
    location: 'Nyarutarama, Kigali',
    type: 'Villa',
    status: 'Active',
    aiPropertyScore: 96,
    growthPotential: '+14.1% /yr',
  },
];

// REST API Endpoints
app.get('/api/properties', (req, res) => {
  res.json({ success: true, data: synchronizedProperties });
});

app.post('/api/properties', (req, res) => {
  const newProp = req.body;
  synchronizedProperties.push(newProp);
  // Broadcast via socket to all sessions
  io.emit('property:new', newProp);
  res.status(201).json({ success: true, data: newProp });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Emma & Dany Real Estate Engine',
  });
});

// Real-time bidirectional WebSocket events
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client session connected: ${socket.id}`);

  // Handle live chat messages
  socket.on('chat:send', (message) => {
    // Broadcast to other sessions
    socket.broadcast.emit('chat:message', message);
  });

  // Handle live typing events
  socket.on('chat:typing', (status) => {
    socket.broadcast.emit('chat:typing', status);
  });

  // Handle new property broadcast
  socket.on('property:new', (property) => {
    socket.broadcast.emit('property:new', property);
    io.emit('notification', {
      title: 'New Luxury Estate Available',
      message: `${property.title} in ${property.district} was just listed.`,
      type: 'system',
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client session disconnected: ${socket.id}`);
  });
});

// Serve frontend static files if built
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`[Emma & Dany Engine] Server running on port ${PORT}`);
});
