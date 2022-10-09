import { ChainHelper } from "./ChainHelper";
import { RetryWrap } from "../utils/RetryWrap";
const logger = require("../logger");

export class AlertCheckService {
  private static _alertCheckService: AlertCheckService;
  private _chainHelper: ChainHelper;

  private constructor() {
    this._chainHelper = ChainHelper.getEthereumChainHelper();
  }

  public static getAlertCheckServiceInstance() {
    if (!AlertCheckService._alertCheckService) {
      AlertCheckService._alertCheckService = new AlertCheckService();
    }
    return AlertCheckService._alertCheckService;
  }

  public async checkSystemAssets() {
    const assets = await this._getChainData(
      "factor",
      "0xF0a93d4994B3d98Fb5e3A2F90dBc2d69073Cb86b",
      {}
    );
    logger.info(`assets: ${assets}`);
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
