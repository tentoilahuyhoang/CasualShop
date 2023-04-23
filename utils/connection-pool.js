import mysql from "mysql2";
export const pool = mysql.createPool({
	connectionLimit: 20,
	host: process.env.MYSQLHOST,
	port: process.env.MYSQLPORT,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPASSWORD,
	database: process.env.MYSQLDATABASE,
	// user: "root",
	// password: "123456",
	// database: "mydb",
	multipleStatements: true,
	waitForConnections: true,
});

export default {
	getConnection: (callback) => pool.getConnection(callback),
	makeQuery: (query) => {
		pool.getConnection((err, conn) => {
			if (err) {
				console.log(err.message);
			}
			conn.query(query, (err, data) => {
				if (err) {
					console.log(err.message);
				}
				console.log(data);
			});
			conn.release();
		});
	},
};
