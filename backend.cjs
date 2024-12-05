// 1. Init and install:
// > npm init -y && npm install express socket.io body-parser

// 2. Run server:
// > node backend.js

// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = 3000;

let tokenRate = 100; // Initial token rate
let orders = [];

// Emit current token rate every 5 seconds
setInterval(() => {
  // Update token rate randomly
  tokenRate = (tokenRate * (0.95 + Math.random() * 0.1)).toFixed(2);
  io.emit('tokenRate', tokenRate);
}, 5000);

// Handle new client connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send current token rate to the new client
  socket.emit('tokenRate', tokenRate);

  // Send current list of orders
  socket.emit('orderList', orders);
});

// Create a new order
app.post('/orders', (req, res) => {
  const { amountTokens, amountDollars } = req.body;

  const newOrder = {
    id: orders.length + 1,
    amountTokens,
    amountDollars,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // Emit event about the new order
  io.emit('newOrder', newOrder);

  // Set a timer to update the order status
  setTimeout(
    () => {
      newOrder.status = 'Completed';
      io.emit('orderUpdated', newOrder);
    },
    Math.random() * 10000 + 5000,
  ); // Update status in 5-15 seconds

  res.status(201).json(newOrder);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
