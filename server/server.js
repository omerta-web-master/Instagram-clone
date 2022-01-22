const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./helpers/db");
const errorHandler = require("./middleware/errorHandler");
const onConnection = require("./socket/main");

// Base config
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: "*",
});
dotenv.config();
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Make static folder
app.use(express.static("uploads"));

// Route files
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const followRouter = require("./routes/follow");
const conversationsRouter = require("./routes/conversations");
const messagesRouter = require("./routes/messages");

// Mount routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/followhandler", followRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);

app.get("/", (req, res) => {
	res.send("Api running");
});

// Socket io connection
io.on("connection", onConnection(io));

// Error handler
app.use(errorHandler);

httpServer.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`.blue);
});
