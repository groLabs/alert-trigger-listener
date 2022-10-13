import { ChainHelper } from "../chainUtils/ChainHelper";
import { RetryWrap } from "../utils/RetryWrap";
import {
  plus,
  sub,
  divide,
  removeDecimals,
  percentToBPS,
} from "../utils/tools";
import { MessageTemplate } from "../utils/MessageTemplate";
import { sendMessage } from "../utils/messageService";
const BN = require("bignumber.js");
const logger = require("../utils/logger");

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

  public async checkGVaultSystemAssets(eventData: any, options: any) {
    logger.info(`options: ${JSON.stringify(options)}`);
    const { blockNumber, transactionHash, contractAddress, args } = eventData;
    const { contractName, eventName } = options;
    const { assets, shares } = args;
    logger.info(`assets: ${assets}`);
    logger.info(`shares: ${shares}`);
    logger.info(`eventName: ${eventName}`);
    const depositOrWithdrawAssets =
      eventName === "Deposit" ? BN(assets.toString()) : BN(`-${assets}`);
    const depositOrWithdrawSupply =
      eventName === "Deposit" ? BN(shares.toString()) : BN(`-${shares}`);

    const currentTotalAssets = await this._getChainData(
      "realizedTotalAssets",
      contractAddress,
      {
        blockNumber,
      }
    );
    const currentTotalSupply = await this._getChainData(
      "totalSupply",
      contractAddress,
      {
        blockNumber,
      }
    );
    const currentPricePerShare = await this._getChainData(
      "pricePerShare",
      contractAddress,
      {
        blockNumber,
      }
    );
    const currentLockedProfit = await this._getChainData(
      "lockedProfit",
      contractAddress,
      {
        blockNumber,
      }
    );
    logger.info(`currentTotalAssets: ${currentTotalAssets}`);
    logger.info(`currentTotalSupply: ${currentTotalSupply}`);
    logger.info(`currentPricePerShare: ${currentPricePerShare}`);
    logger.info(`currentLockedProfit: ${currentLockedProfit}`);
    const previousBlockNumber = blockNumber - 1;
    const previousTotalAssets = await this._getChainData(
      "realizedTotalAssets",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousTotalSupploy = await this._getChainData(
      "totalSupply",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousPricePerShare = await this._getChainData(
      "pricePerShare",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousLockedProfit = await this._getChainData(
      "lockedProfit",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    logger.info(`previousTotalAssets: ${previousTotalAssets}`);
    logger.info(`previousTotalSupploy: ${previousTotalSupploy}`);
    logger.info(`previousPricePerShare: ${previousPricePerShare}`);
    logger.info(`previousLockedProfit: ${previousLockedProfit}`);

    // check total assets
    const expectedTotalAssets = plus([
      previousTotalAssets,
      depositOrWithdrawAssets,
    ]);
    logger.info(`expectedTotalAssets: ${expectedTotalAssets}`);
    if (currentTotalAssets.toString() !== expectedTotalAssets.toString()) {
      const changeAssets = sub(currentTotalAssets, [expectedTotalAssets]);
      logger.info(`changeAssets: ${changeAssets}`);

      const totalAssetAlertMsg = MessageTemplate.getTotalAssetAlertMsg({
        alertLeval: "WARN",
        blockNumber,
        changeTotal: changeAssets,
      });
      sendMessage("alert.alerting", totalAssetAlertMsg);
    }

    // check total supply
    const expectedTotalSupply = plus([
      previousTotalSupploy,
      depositOrWithdrawSupply,
    ]);
    logger.info(`expectedTotalSupply: ${expectedTotalSupply}`);
    if (currentTotalSupply.toString() !== expectedTotalSupply.toString()) {
      const changeSupply = sub(currentTotalSupply, [expectedTotalSupply]);
      logger.info(`changeSupply: ${changeSupply}`);
      const totalSupplyAlertMsg = MessageTemplate.getTotalSupplyAlertMsg({
        alertLeval: "WARN",
        blockNumber,
        changeTotal: changeSupply,
      });
      sendMessage("alert.alerting", totalSupplyAlertMsg);
    }

    // check price per share
    this._checkPricePerShare(
      currentPricePerShare,
      previousPricePerShare,
      blockNumber
    );

    // check locked profit

    if (currentLockedProfit.toString() !== previousLockedProfit.toString()) {
      const changeLockedProfit = sub(currentLockedProfit, [
        previousLockedProfit,
      ]);
      const msg = MessageTemplate.getLockedProfitAlertMsg({
        alertLeval: "WARN",
        blockNumber,
        changeTotal: changeLockedProfit,
      });
      logger.info(`alert message: ${msg}`);
      sendMessage("alert.alerting", msg);
    }
  }

  public async checkGVaultHarvestEvent(eventData: any, options: any) {
    logger.info(`options: ${JSON.stringify(options)}`);
    const { blockNumber, transactionHash, contractAddress, args } = eventData;
    const { contractName, eventName } = options;
    const { strategy, gain, loss, lockedProfit } = args;
    logger.info(
      `strategy: ${strategy}\ngain: ${gain}\nloss: ${loss}\nlockedProfit: ${lockedProfit}`
    );
    const currentTotalAssets = await this._getChainData(
      "realizedTotalAssets",
      contractAddress,
      {
        blockNumber,
      }
    );
    const currentTotalSupply = await this._getChainData(
      "totalSupply",
      contractAddress,
      {
        blockNumber,
      }
    );
    const currentPricePerShare = await this._getChainData(
      "pricePerShare",
      contractAddress,
      {
        blockNumber,
      }
    );
    const currentLockedProfit = await this._getChainData(
      "lockedProfit",
      contractAddress,
      {
        blockNumber,
      }
    );
    logger.info(`currentTotalAssets: ${currentTotalAssets}`);
    logger.info(`currentTotalSupply: ${currentTotalSupply}`);
    logger.info(`currentPricePerShare: ${currentPricePerShare}`);
    logger.info(`currentLockedProfit: ${currentLockedProfit}`);
    const previousBlockNumber = blockNumber - 1;
    const previousTotalAssets = await this._getChainData(
      "realizedTotalAssets",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousTotalSupploy = await this._getChainData(
      "totalSupply",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousPricePerShare = await this._getChainData(
      "pricePerShare",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousLockedProfit = await this._getChainData(
      "lockedProfit",
      contractAddress,
      {
        blockNumber: previousBlockNumber,
      }
    );
    logger.info(`previousTotalAssets: ${previousTotalAssets}`);
    logger.info(`previousTotalSupploy: ${previousTotalSupploy}`);
    logger.info(`previousPricePerShare: ${previousPricePerShare}`);
    logger.info(`previousLockedProfit: ${previousLockedProfit}`);

    const profit =
      loss.toString() === "0" ? BN(gain.toString()) : BN(`-${loss}`);
    logger.info(`profit: ${profit}`);

    const expectedTotalAssets = plus([previousTotalAssets, profit]);
    logger.info(`expectedTotalAssets: ${expectedTotalAssets}`);

    const changeAssets = sub(currentTotalAssets, [expectedTotalAssets]);
    logger.info(`changeAssets: ${changeAssets}`);

    const assetChangePercent = divide(changeAssets, expectedTotalAssets);
    logger.info(`assetChangePercent: ${assetChangePercent}`);

    // check total supply
    const changeSupply = sub(currentTotalSupply, [previousTotalSupploy]);
    logger.info(`changeSupply: ${changeSupply}`);
    if (changeSupply !== "0") {
      const totalSupplyAlertMsg = MessageTemplate.getTotalSupplyAlertMsg({
        alertLeval: "WARN",
        blockNumber,
        changeTotal: changeSupply,
      });
      sendMessage("alert.alerting", totalSupplyAlertMsg);
    }

    // check total assets
    this._sendTotalAssetsAlertMessage(percentToBPS(assetChangePercent), {
      blockNumber,
      changeAssets,
    });

    // check price per share
    this._checkPricePerShare(
      currentPricePerShare,
      previousPricePerShare,
      blockNumber
    );

    // check locked profit
    this._checkLockedProfit(
      currentLockedProfit,
      previousLockedProfit,
      blockNumber
    );
  }

  private _checkPricePerShare(
    currentPricePerShare: any,
    previousPricePerShare: any,
    blockNumber: number
  ) {
    const changePricePerShare = sub(currentPricePerShare, [
      previousPricePerShare,
    ]);
    logger.info(`changePricePerShare: ${changePricePerShare}`);
    if (changePricePerShare === "0") return;

    const pricePerShareChangeBPS = percentToBPS(
      divide(changePricePerShare, previousPricePerShare)
    );
    if (pricePerShareChangeBPS >= 1) {
      const msg = MessageTemplate.getPricePerShareAlertMsg({
        alertLeval: "EMERG",
        blockNumber,
        changeTotal: changePricePerShare,
        changeBPS: pricePerShareChangeBPS,
        baseBPS: 1,
      });
      logger.info(`alert message: ${msg}`);
      sendMessage("alert.emergency", msg);
    }
  }

  private _checkLockedProfit(
    currentLockedProfit: any,
    previousLockedProfit: any,
    blockNumber: number
  ) {
    const changeLockedProfit = sub(currentLockedProfit, [previousLockedProfit]);
    logger.info(`ChangeLockedProfit: ${changeLockedProfit}`);
    if (changeLockedProfit === "0") return;

    const changeLockedProfitBPS = percentToBPS(
      divide(changeLockedProfit, previousLockedProfit)
    );
    const msg = MessageTemplate.getLockedProfitAlertMsg({
      alertLeval: "WARN",
      blockNumber,
      changeTotal: changeLockedProfit,
      changeBPS: changeLockedProfitBPS,
    });
    logger.info(`alert message: ${msg}`);
    sendMessage("alert.alerting", msg);
  }

  private async _getChainData(
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

  private _sendTotalAssetsAlertMessage(changeBPS: number, options: any) {
    const warningLevel = 25;
    const criticalLevel = 50;
    const emergencyLevel = 100;
    logger.info(`changeBPS: ${changeBPS}`);
    if (changeBPS < warningLevel) return;

    const { blockNumber, changeAssets } = options;
    const changeTotal = removeDecimals(changeAssets, 18);

    let msg, msgRouting;
    if (changeBPS < criticalLevel) {
      // warning message
      msgRouting = "alert.alerting";
      msg = MessageTemplate.getTotalAssetAlertMsg({
        alertLeval: "WARN",
        blockNumber,
        changeTotal,
        changeBPS,
        baseBPS: warningLevel,
      });
    } else if (changeBPS < emergencyLevel) {
      // critical  message
      msgRouting = "alert.critical";
      msg = MessageTemplate.getTotalAssetAlertMsg({
        alertLeval: "CRIT",
        blockNumber,
        changeTotal,
        changeBPS,
        baseBPS: criticalLevel,
      });
    } else {
      // emergency message
      msgRouting = "alert.emergency";
      msg = MessageTemplate.getTotalAssetAlertMsg({
        alertLeval: "EMERG",
        blockNumber,
        changeTotal,
        changeBPS,
        baseBPS: emergencyLevel,
      });
    }
    logger.info(`alert message: ${msg}`);
    sendMessage(msgRouting, msg);
  }

  private _getExpectedTotal(
    beforeTotalAssets: any,
    moveAssets: any,
    eventName: string
  ) {
    switch (eventName) {
      case "Deposit":
        return plus([beforeTotalAssets, moveAssets]);
      case "Withdraw":
        return sub(beforeTotalAssets, [moveAssets]);
      default:
        logger.info(`Not fund totalAssets handler for ${eventName}`);
    }
  }

  private _getChangedTotalSupply(
    currentTotalSupply: any,
    beforeTotalSupply: any,
    moveShares: any,
    eventName: string
  ) {
    switch (eventName) {
      case "Deposit":
        return sub(currentTotalSupply, [beforeTotalSupply, moveShares]);
      case "Withdraw":
        return sub(beforeTotalSupply, [currentTotalSupply, moveShares]);
      default:
        logger.info(`Not fund totalAssets handler for ${eventName}`);
    }
  }
}
