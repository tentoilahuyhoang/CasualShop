import { sign } from "jsonwebtoken";

const generateToken = (_id, username) => {
	sign({ _id, username }, process.env.JWT_SECRET, {
		expiresIn: "1d",
		algorithm: "HS256",
	});
};

export default generateToken;
