const errorHandler = (error, req, res, next) => {
	console.log(error);

	console.log("Status code", res.statusCode);

	if (res.statusCode === 200) {
		res.status(500);
	}

	res.json({ success: false, error: error.message });
	next();
};
module.exports = errorHandler;
