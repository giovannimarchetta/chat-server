const port = process.env.PORT || 3000;

const io = require("socket.io")(port, {
	cors: {
		origin: "https://frisiawards.altervista.org",
		methods: ["GET", "POST"]
	}
});

const users = {};

console.log(`Socket.IO server running on port ${port}`);
console.log("Edited using VSC")

io.on("connection", socket => {
	console.log(`Nuovo client connesso: ${socket.id}`);

	socket.on("new-user", name => {
		users[socket.id] = name;
		console.log(`Utente connesso: ${name} (ID: ${socket.id})`);
		socket.broadcast.emit("user-connected", name);
	});

	socket.on("send-chat-message", message => {
		console.log(`Messaggio ricevuto da ${users[socket.id]}: ${message}`);
		socket.broadcast.emit("chat-message", { message, name: users[socket.id] });
	});

	socket.on("disconnect", () => {
		console.log(`Utente disconnesso: ${users[socket.id]} (ID: ${socket.id})`);
		socket.broadcast.emit("user-disconnected", users[socket.id]);
		delete users[socket.id];
	});
});
