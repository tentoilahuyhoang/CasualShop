import db from "../utils/connection-pool.js";

const makeQuery = (query) => {
	return db.makeQuery(query);
};
export default {
	product: () => {
		const query = `CREATE TABLE product (
            id int PRIMARY KEY AUTO_INCREMENT,
            name varchar(255),
            imgSrc varchar(255),
            description MEDIUMTEXT,
            price DECIMAL(4,2),
            category ENUM ('gods', 'creatures', 'items', 'notebook', 'novel', 'key_chain', 'backpack_wallet', 'necklace'),
            material ENUM ('clay', 'metal', 'wood', 'glass', 'plastic'),
            origin ENUM ('vietnam', 'america', 'china', 'england', 'italy', 'france', 'japan', 'india', 'brazil', 'argentina', 'canada'),
            discountId int,
            inventory int DEFAULT 0,
            quantitySold int DEFAULT 0,
            likeCount int DEFAULT 0,
            createAt timestamp
          );`;

		makeQuery(query);
	},

	discount: async () => {
		const query = `CREATE TABLE discount (
            id int PRIMARY KEY AUTO_INCREMENT,
            name varchar(255),
            rate int DEFAULT 0,
            createAt timestamp
          );`;

		makeQuery(query);
	},

	category: () => {
		const query = `CREATE TABLE product_category (
            id int AUTO_INCREMENT,
            name varchar(255),
            subCategory ENUM ('gods', 'creatures', 'items', 'notebook', 'novel', 'keyChain', 'backpackWallet', 'necklace'),
            PRIMARY KEY (id, subCategory)
          );`;

		makeQuery(query);
	},
	userLike: () => {
		const query = `CREATE TABLE user_like (
            userId int,
            productId int,
            PRIMARY KEY (userId, productId),
            FOREIGN KEY (productId) REFERENCES product (id)
          );`;
		makeQuery(query);
	},
	userRating: () => {
		const query = `CREATE TABLE user_rating (
            userId int,
            productId int,
            rating ENUM('1','2','3','4','5'),
            PRIMARY KEY (userId, productId)
          )`;

		makeQuery(query);
	},
};
