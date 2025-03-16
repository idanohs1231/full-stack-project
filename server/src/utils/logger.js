const winston = require("winston");
const path = require("path");

// יצירת לוגר עם רמות שונות
const logger = winston.createLogger({
  level: "info", // ברירת מחדל - info ומעלה (error, warn, info)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/server.log"),
      level: "info",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/errors.log"),
      level: "error",
    }),
  ],
});

// אם אנחנו בסביבת פיתוח - הצגת הלוגים גם בקונסול
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
