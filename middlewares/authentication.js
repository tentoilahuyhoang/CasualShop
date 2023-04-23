import { verify } from "jsonwebtoken";
import asyncWrapper from "../middlewares/async";
import { UnauthenticatedError } from "../errors";

const auth = asyncWrapper((req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new UnauthenticatedError("No token provided");
	}
	const token = authHeader.split(" ")[1];
	try {
		const decode = verify(token, process.env.JWT_SECRET);
		// in case you sign _id and username
		const { _id, username } = decode;
		req.user = {
			_id,
			username,
		};
		next();
	} catch (err) {
		throw new UnauthenticatedError("No authorized to access this route");
	}
});

export default auth;
