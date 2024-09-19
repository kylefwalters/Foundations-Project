const { format, transports, createLogger } = require('winston');

const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
    transports: [new transports.Console(), new transports.File({ filename: "app.log" })]
});

function logInfo(message) {
    logger.info(message);
}

function logError(message) {
    logger.error(message);
}

module.exports = {
    logInfo,
    logError
}