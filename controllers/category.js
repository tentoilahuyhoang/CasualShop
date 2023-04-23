import asyncWrapper from "../middlewares/async.js";
import db from "../utils/connection-pool.js";

export default {
	getAll: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) throw err;
			con.query("SELECT * FROM product_category", (err, data) => {
				if (err) throw err;
				const category = {
					figurines: [],
					books: [],
					accessories: [],
				};
				data.map((item) => {
					switch (item.name) {
						case "figurines":
							category.figurines.push(item.subCategory);
							break;
						case "books":
							category.books.push(item.subCategory);
							break;
						case "accessories":
							category.accessories.push(item.subCategory);
							break;
						default:
							break;
					}
				});
				res.status(200).json({ data: category });
				con.release();
			});
		});
	}),
	getById: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) throw err;
			con.query(
				`SELECT * FROM product_category WHERE id=${req.params.id})`,
				(err, data) => {
					if (err) throw err;
					res.status(200).json({ data });
					con.release();
				}
			);
		});
	}),
};
