let users = [];

const onConnection = io => socket => {
	console.log("Connected");

	socket.on("online", userId => {
		if (!users.includes(userId)) {
			users.push(userId);
		}
		socket.roomId = userId;
		socket.join(userId);
		console.log("User online");
		console.log(users);
	});

	socket.on("disconnect", () => {
		console.log(`User ${socket.id} disconected`);
		users = users.filter(user => user !== socket.roomId);
		console.log(users);
	});

	socket.on("private message", data => {
		const receiver = data.receiver;
		const message = data.text;
		console.log("Sending private message", data);
		console.log("Current users:", users);
		io.to(receiver).emit("private message", message);
	});
};

module.exports = onConnection;
