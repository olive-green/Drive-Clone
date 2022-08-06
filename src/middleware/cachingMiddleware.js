const redisClient = require("../redis/redisServer");

const cache = (req, res, next) => {
	// console.log(req);

	const queryString = req.params.query;
	const userId = req.user._id;

	console.log(`${queryString + userId}`);

	redisClient.get(`${queryString + userId}`, (error, data) => {
		if (error) {
			throw error;
		}
		if (data) {
			const jsonData = JSON.parse(data);
			res.status(200).send({
				success: true,
				data: jsonData,
				redis: true,
			});
		} else {
			next();
		}
	});
};

module.exports = cache;
