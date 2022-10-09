import { getConfig } from "./tools";
const logger = require("../logger");

interface retryOptions {
  fn: any;
  thisObj: object;
  currentRetry?: number;
  params: any[];
}

export class RetryWrap {
  private static readonly _retryAttempts: number =
    getConfig("RetryAttempts", false) || 2;
  private static readonly _timeToWait: number =
    getConfig("TimeToWait", false) || 500;

  public static async retry(options: retryOptions) {
    const { fn, thisObj, currentRetry, params } = options;
    let result;
    let finalRetry = currentRetry || 0;
    try {
      await this._wait();
      result = await fn.apply(thisObj, params);
    } catch (error) {
      logger.error(`${fn.name} with params ${params} failed: ${error}`);
      if (finalRetry <= RetryWrap._retryAttempts) {
        RetryWrap.retry({
          fn,
          thisObj,
          params,
          currentRetry: finalRetry + 1,
        });
      } else {
        // TODO
      }
    }
    return result;
  }

  private static _wait() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0);
      }, RetryWrap._timeToWait);
    });
  }
}
