import create from "./create-tables.js";
import addData from "./add-data.js";

export default {
	initial: () => {
		create.category();
		create.product();
		create.discount();
		create.userLike();
		create.userRating();
		setTimeout(() => {
			addData.category();
			addData.discount();
			addData.product();
		}, 3000);
	},
};
