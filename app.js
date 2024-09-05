const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const messages = []; // In-memory array to store messages (replace with database)

app.use(express.static(__dirname + '/public')); // Serve static files from public directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send all existing messages to the connected user
  socket.emit('allMessages', messages);

  socket.on('chat message', (msg) => {
    messages.push({ text: msg, username: socket.id }); // Use socket ID as username (replace with actual username)
    io.emit('chat message', msg); // Broadcast message to all connected users
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
