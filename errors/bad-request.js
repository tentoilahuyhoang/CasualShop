import customError from "./custom-error.js";
import { StatusCodes } from "http-status-codes";

class BadRequest extends customError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default BadRequest;
