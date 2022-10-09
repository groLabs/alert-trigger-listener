const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf, errors } = format;
require("winston-daily-rotate-file");

const logFolder = "./logs";
const isConsoleOpen = true;

const projectName = process.env.NODE_ENV ? process.env.NODE_ENV : "";
const logMsgFormat = printf(({ level, message, timestamp, stack }: any) => {
  if (stack) {
    return `${timestamp} ${level}: ${message} - ${stack}`;
  }
  return `${timestamp} ${level}: ${message}`;
});

const listenerLogger = createLogger({
  format: combine(errors({ stack: true }), timestamp(), logMsgFormat),
  transports: [
    new transports.DailyRotateFile({
      filename: `${projectName}ListenerTrigger-error-%DATE%.log`,
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logFolder}/logs`,
      auditFile: `${projectName}ListenerTrigger-error-audit.json`,
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
    new transports.DailyRotateFile({
      filename: `${projectName}ListenerTrigger-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      dirname: `${logFolder}/logs`,
      auditFile: `${projectName}ListenerTrigger-audit.json`,
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: `${projectName}ListenerTrigger-exception-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      dirname: `${logFolder}/logs`,
      auditFile: `${projectName}ListenerTrigger-exception-audit.json`,
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename: `${projectName}ListenerTrigger-rejection-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      dirname: `${logFolder}/logs`,
      auditFile: `${projectName}ListenerTrigger-rejection-audit.json`,
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
  exitOnError: false,
});

if (isConsoleOpen) {
  listenerLogger.add(
    new transports.Console({
      format: logMsgFormat,
    })
  );
}

module.exports = listenerLogger;
