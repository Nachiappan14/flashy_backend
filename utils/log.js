// Import.
const fs = require('fs');

// const config = require("../config.js");


/**
 * Append zero to length.
 * @param {string} value Value to append zero.
 * @param {number} length Needed length.
 * @returns {string} String with appended zeros id need it.
 */
function appendZeroToLength(value, length) {
	return `${value}`.padStart(length, '0');
}

/**
 * Get date as text.
 * @returns {string} Date as ISO String, Sample: "2022-05-01T07:21:58.480Z"
 */
function getDateAsText() {
	const now = new Date();
	const nowText = appendZeroToLength(now.getUTCFullYear(), 4) + '.'
		+ appendZeroToLength(now.getUTCMonth() + 1, 2) + '.'
		+ appendZeroToLength(now.getUTCDate(), 2) + ', '
		+ appendZeroToLength(now.getUTCHours(), 2) + ':'
		+ appendZeroToLength(now.getUTCMinutes(), 2) + ':'
		+ appendZeroToLength(now.getUTCSeconds(), 2) + '.'
		+ appendZeroToLength(now.getUTCMilliseconds(), 4) + ' UTC';
	// return nowText;
	return now.toISOString();
}

/**
 * Log to file.
 * @param {string} text Text to log.
 * @param {string} [file] Log file path. Default: `default.log`.
 * @param {string} [delimiter] Delimiter. Default: `\n`.
 */
function logtofile(text, file = 'default.log', delimiter = '\n') {
	// Define log text.
	const logText = getDateAsText() + ' ' + text + delimiter;

	// Save log to file.
	fs.appendFile(file, logText, 'utf8', function (error) {
		if (error) {
			// If error - show in console.
			console.log(getDateAsText() + ' ' + error);
		}
	});
}

const flog = (str) => {
	logtofile(str, process.env.LOG_FILE_NAME || "backend.log");
};

module.exports = flog;