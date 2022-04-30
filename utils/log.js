const flog = require("log-to-file");
const config = require("../config.js");

module.exports.log = function (str) {
	flog(str,config.LOG_FILE_NAME);
}
