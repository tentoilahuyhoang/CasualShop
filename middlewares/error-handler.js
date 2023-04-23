import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom-error.js";

const errorHandler = (error, req, res, next) => {
	console.log(error);
	if (error instanceof CustomAPIError) {
		res.status(error.statusCode).json({ message: error.message });
	}
	res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.json({ message: "Something went wrong" });
};

export default errorHandler;
