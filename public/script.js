const socket = io('https://chat-server-abg9.onrender.com');

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?');
appendMessage('You joined');

/* Appena il client si connette, invia al server l’evento new-user con il nome dell’utente.
Questo serve per far sapere al server chi sei. */
socket.on('connect', () => {
    socket.emit('new-user', name);
})

/* ➡️ Quando ricevi un evento chat-message 
(proveniente da altri client via server), mostri chi ha scritto e il messaggio.*/
socket.on('chat-message', data => {
	appendMessage(`${data.name}: ${data.message}`);
})

// Mostra un messaggio quando un altro utente si collega (notifica generata dal server con broadcast).
socket.on('user-connected', name => {
	appendMessage(`${name} connected`);
})

socket.on('user-disconnected', name => {
	appendMessage(`${name} disconnected`);
})

/*
➡️ Quando l’utente invia un messaggio:
1. Previene il refresh del form.
2. Aggiunge il messaggio nella propria chat (You: messaggio).
3. Invia il messaggio al server con evento send-chat-message.
4. Pulisce il campo input.
*/
messageForm.addEventListener('submit', e => {
	e.preventDefault();
	const message = messageInput.value;
	appendMessage(`You: ${message}`);
	socket.emit('send-chat-message', message);
	messageInput.value = '';
})

function appendMessage(message) {
	const messageElement = document.createElement('div');
	messageElement.innerText = message;
	messageContainer.append(messageElement);
}