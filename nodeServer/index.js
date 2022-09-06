// Node server which will handle sicket IO connections
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5500"
    // methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  // Socket codes...
});
io.listen(8000);

const users = {}

io.on('connection', socket => {
  // If any new user joins, let other users connected to the server know!
  socket.on('new-user-joined', name => {
    console.log('New user', name)
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  // If someone sends a message, broadcast it to others
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
  });

  // If someone leaves the chat, let others know
  socket.on('disconnect', name => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  })
})