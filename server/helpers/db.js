const mongoose = require("mongoose");

const connectDB = () => {
	mongoose.connect(process.env.MONGO_URI, () => {
		console.log("Connected to database".yellow);
	});
};

module.exports = connectDB;
