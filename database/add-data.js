import db from "../utils/connection-pool.js";
import fs from "fs";
import path from "path";

const makeQuery = (query, dataFile) => {
	fs.readFile(path.resolve(__dirname, `${dataFile}`), "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		db.makeQuery(`${query} ${data}`);
	});
};
export default {
	product: () => {
		const query = `INSERT INTO product (name, imgSrc, description, price, category, material, origin, discountId, inventory, quantitySold, createAt)
        VALUES`;
		makeQuery(query, "./product.txt");
	},
	discount: () => {
		const query = `INSERT INTO discount (name, rate, createAt)
        VALUES`;
		makeQuery(query, "./discount.txt");
	},
	category: () => {
		const query = `INSERT INTO product_category (name, subCategory) 
        VALUES`;
		makeQuery(query, "./category.txt");
	},
};
