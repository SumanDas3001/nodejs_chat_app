// Connet socket server
const socket = io('http://localhost:8000')

// Get DOM elements in respective JS variables
const form = document.getElementById("send-container")
const messageInput = document.getElementById("messageInp")
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving message
var audio = new Audio('sound.mp3');

// Function which will append event info to the container
const append = (message, possition) => {
  const messageElement = document.createElement('div')
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(possition);
  messageContainer.append(messageElement);
  if (possition == 'left') {
    audio.play();
  }
}

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name)

// if a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
  append(`${name} joined the chat`, 'right')
})

// If the server sends a mesage, receive it.
socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left')
})

// If the user leaves the chat, append the info to the container.
socket.on('left', name => {
  append(`${name} left`, 'left')
})

// If the form gets submited, send server the message.
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message)
  messageInput.value = ''
})