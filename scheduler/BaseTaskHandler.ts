import { CheckResult, AlertingLevel } from "../utils/interface";
import { RetryWrap } from "../utils/RetryWrap";
import { ChainHelper } from "../chainUtils/ChainHelper";
const logger = require("../utils/logger");

export class BaseTaskHandler {
  protected readonly _config: any;
  protected _chainHelper: ChainHelper;

  constructor(config: any) {
    this._config = config;
    this._chainHelper = ChainHelper.getEthereumChainHelper();
  }

  async check(): Promise<CheckResult> {
    return new Promise((resolve) => {
      const checkResult: CheckResult = {
        level: AlertingLevel.None,
        message: "None",
        timestamp: Date.now(),
      };
      resolve(checkResult);
    });
  }

  protected async _getChainData(
    functionName: string,
    contractAddress: string,
    options: any
  ): Promise<any | undefined> {
    const result = await RetryWrap.retry({
      fn: this._chainHelper.getChainData,
      thisObj: this._chainHelper,
      params: [functionName, contractAddress, options],
    }).catch((error) => {
      logger.error(error);
      return undefined;
    });
    return result;
  }
}
