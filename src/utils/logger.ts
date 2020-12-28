import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "rTerm.io" },
  transports: [new transports.Console(), new transports.File({ filename: "./logs/combined.log" })],
});

export = logger;
