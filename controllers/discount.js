import asyncWrapper from "../middlewares/async.js";
import db from "../utils/connection-pool.js";

export default {
	getAll: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) {
				console.log(err);
				throw err;
			}
			con.query("SELECT * FROM discount", (err, data) => {
				if (err) {
					console.log(err);
					throw err;
				}
				res.status(200).json({ message: "Success", data });
				con.release();
			});
		});
	}),
	getById: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) {
				console.log(err);
				throw err;
			}
			con.query(
				`SELECT * FROM discount WHERE id=${req.params.id}`,
				(err, data) => {
					if (err) {
						console.log(err);
						throw err;
					}
					res.status(200).json({ message: "Success", data });
					con.release();
				}
			);
		});
	}),
};
