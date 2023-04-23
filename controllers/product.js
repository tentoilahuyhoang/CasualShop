import asyncWrapper from "../middlewares/async.js";
import db from "../utils/connection-pool.js";
import { pool } from "../utils/connection-pool.js";

export default {
	getAll: asyncWrapper(async (req, res, next) => {
		const { uid } = req.query;
		await pool
			.promise()
			.query(
				"SELECT a.id, a.name, a.imgSrc, a.description, a.price, a.category as subCategory, a.material, a.origin, a.discountId, a.inventory, a.quantitySold, a.createAt, a.likeCount, b.rating FROM (SELECT product.id, product.name, product.imgSrc, product.description, product.price, product.category, product.material, product.origin, product.discountId, product.inventory, product.quantitySold, product.createAt, b.likeCount FROM product LEFT JOIN (SELECT productId, COUNT(userId) as likeCount FROM user_like GROUP BY productId) b ON product.id = b.productId) a LEFT JOIN (SELECT productId, AVG(rating) as rating FROM user_rating GROUP BY productId) b ON a.id = b.productId;"
			)
			.then(async (result) => {
				let data = result[0];

				if (uid) {
					const [rows, fields] = await pool
						.promise()
						.query(`SELECT * FROM user_like WHERE userId = ${uid};`);
					const userLiked = rows.map((item) => item.productId);

					data = data.map((item) => {
						return {
							...item,
							isLiked: userLiked.includes(item.id) ? true : false,
						};
					});
				}
				res.status(200).json({ message: "Success", data });
			})
			.catch((err) => {
				console.log(err);
			});
	}),
	getById: asyncWrapper(async (req, res, next) => {
		const { uid } = req.query;
		await pool
			.promise()
			.query(
				`SELECT a.id, a.name, a.imgSrc, a.description, a.price, a.category as subCategory, a.material, a.origin, a.discountId, a.inventory, a.quantitySold, a.createAt, a.likeCount, b.rating FROM (SELECT product.id, product.name, product.imgSrc, product.description, product.price, product.category, product.material, product.origin, product.discountId, product.inventory, product.quantitySold, product.createAt, b.likeCount FROM product LEFT JOIN (SELECT productId, COUNT(userId) as likeCount FROM user_like GROUP BY productId) b ON product.id = b.productId) a LEFT JOIN (SELECT productId, AVG(rating) as rating FROM user_rating GROUP BY productId) b ON a.id = b.productId WHERE id=${req.params.id};`
			)
			.then(async (result) => {
				let data = result[0];
				if (uid) {
					const [rows, fields] = await pool
						.promise()
						.query(
							`SELECT * FROM user_like WHERE userId = ${uid} AND productId = ${req.params.id};`
						);
					const userLiked = rows;
					data = {
						...data[0],
						isLiked: userLiked.length === 0 ? false : true,
					};
				}
				res.status(200).json({ message: "Success", data });
			})
			.catch((err) => {
				console.log(err);
			});
	}),
	likeProduct: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) {
				console.log(err);
				throw err;
			}
			con.query(
				`INSERT IGNORE INTO user_like(userId, productId) VALUES (${req.body.uid}, ${req.params.id});`,
				(err, data) => {
					if (err) {
						console.log(err);
						throw err;
					}
					res.status(200).json({ message: "Success" });
					con.release();
				}
			);
		});
	}),
	unlikeProduct: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) {
				console.log(err);
				throw err;
			}
			con.query(
				`DELETE FROM user_like WHERE userId = ${req.body.uid} AND productId = ${req.params.id};`,
				(err, data) => {
					if (err) {
						console.log(err);
						throw err;
					}
					res.status(200).json({ message: "Success" });
					con.release();
				}
			);
		});
	}),

	soldProduct: asyncWrapper((req, res, next) => {
		db.getConnection((err, con) => {
			if (err) {
				console.log(err);
				throw err;
			}
			con.query(
				`UPDATE product SET inventory = inventory - 1, quantitySold = quantitySold + 1 WHERE id = ${req.params.id};`,
				(err, data) => {
					if (err) {
						console.log(err);
						throw err;
					}
					res.status(200).json({ message: "Success" });
					con.release();
				}
			);
		});
	}),

	rateProduct: asyncWrapper((req, res, next) => {
		const productId = req.params.id;
		const { uid, rating } = req.body;
		db.getConnection((err, con) => {
			if (err) {
				console.log(err);
				throw err;
			}
			con.query(
				`INSERT INTO user_rating(userId, productId, rating) VALUES (${uid},${productId},'${rating}') ON DUPLICATE KEY UPDATE rating='${rating}';`,
				(err, data) => {
					if (err) {
						console.log(err);
						throw err;
					}
					res.status(200).json({ message: "Success" });
					con.release();
				}
			);
		});
	}),
	getProductBySubCategory: asyncWrapper(async (req, res, next) => {
		const { uid } = req.query;
		const category = req.params.subcategory;

		await pool
			.promise()
			.query(
				`SELECT a.id, a.name, a.imgSrc, a.description, a.price, a.category AS subCategory, a.material, a.origin, a.discountId, a.inventory, a.quantitySold, a.createAt, a.likeCount, b.rating FROM (SELECT product.id, product.name, product.imgSrc, product.description, product.price, product.category, product.material, product.origin, product.discountId, product.inventory, product.quantitySold, product.createAt, b.likeCount FROM product LEFT JOIN (SELECT productId, COUNT(userId) as likeCount FROM user_like GROUP BY productId) b ON product.id = b.productId) a LEFT JOIN (SELECT productId, AVG(rating) as rating FROM user_rating GROUP BY productId) b ON a.id = b.productId WHERE category='${category}';`
			)
			.then(async (result) => {
				let data = result[0];
				if (uid) {
					const [rows, fields] = await pool
						.promise()
						.query(
							`SELECT * FROM user_like WHERE userId = ${uid} AND productId = ${req.params.id};`
						);
					const userLiked = rows;
					data = {
						...data[0],
						isLiked: userLiked.length === 0 ? false : true,
					};
				}
				res.status(200).json({ message: "Success", data });
			})
			.catch((err) => {
				console.log(err);
			});
	}),
	getProductByCategory: asyncWrapper(async (req, res, next) => {
		const { uid } = req.query;
		const category = req.params.category;
		await pool
			.promise()
			.query(
				`SELECT * FROM (SELECT a.id, a.name, a.imgSrc, a.description, a.price, a.category as subCategory, a.material, a.origin, a.discountId, a.inventory, a.quantitySold, a.createAt, a.likeCount, b.rating FROM (SELECT product.id, product.name, product.imgSrc, product.description, product.price, product.category, product.material, product.origin, product.discountId, product.inventory, product.quantitySold, product.createAt, b.likeCount FROM product LEFT JOIN (SELECT productId, COUNT(userId) as likeCount FROM user_like GROUP BY productId) b ON product.id = b.productId) a LEFT JOIN (SELECT productId, AVG(rating) as rating FROM user_rating GROUP BY productId) b ON a.id = b.productId) a RIGHT JOIN (SELECT subCategory, name as category FROM product_category WHERE name='${category}') b ON a.subCategory = b.subCategory;`
			)
			.then(async (result) => {
				let data = result[0];
				if (uid) {
					const [rows, fields] = await pool
						.promise()
						.query(
							`SELECT * FROM user_like WHERE userId = ${uid} AND productId = ${req.params.id};`
						);
					const userLiked = rows;
					data = {
						...data[0],
						isLiked: userLiked.length === 0 ? false : true,
					};
				}
				res.status(200).json({ message: "Success", data });
			})
			.catch((err) => {
				console.log(err);
			});
	}),
};
