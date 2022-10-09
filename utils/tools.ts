import config from "config";
const logger = require("../logger");

export function getConfig(key: string, existCheck: boolean = true): any {
  if (config.has(key)) return config.get(key);

  if (existCheck) {
    const err = new Error(`Config: ${key} not set.`);
    logger.error(err);
    throw err;
  }

  return undefined;
}
