const { ErrorHandler } = require("./error-handler");
const { UNAUTHORIZED } = require("./status-codes");

const checkAuth = user => {
	if (!user || user.isAuth !== true) throw new ErrorHandler(UNAUTHORIZED, "Unauthorized");
};

const checkUserType = (user, types) => {
	if (user.department) {
		if (!types.includes(user.department)) throw new ErrorHandler(UNAUTHORIZED, "Unauthorized");
	} else if (!types.includes(user.userType)) throw new ErrorHandler(UNAUTHORIZED, "Unauthorized");
};

module.exports = {
	checkAuth,
	checkUserType,
};
