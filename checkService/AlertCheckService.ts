import { ethers } from "ethers";
import { ChainHelper } from "../chainUtils/ChainHelper";
import { RetryWrap } from "../utils/RetryWrap";
import { Event } from "../utils/interface";
import {
  getConfig,
  plus,
  sub,
  divide,
  removeDecimals,
  addDecimals,
  percentToBPS,
} from "../utils/tools";
import { MessageTemplate } from "../utils/MessageTemplate";
import { sendMessage } from "../utils/messageService";
import { StrategyConfig } from "../utils/StrategyConfig";
const BN = require("bignumber.js");
const logger = require("../utils/logger");

const assetRatio = getConfig("strategyAssetRatio", false) || 10;

// aggregate curve balance change by stablecoins
// will trigger slippage check if the aggregated token change > than threshold
const curve3pool = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";
const curveBalanceDelta = [BN(0), BN(0), BN(0)];
const curveBalanceDecimals = [
  BN("1000000000000000000"),
  BN("1000000"),
  BN("1000000"),
];
const curveCheckDeltaThreshold = getConfig("deltaThreshold", false) || 1000000;
const deltaThreshold = BN(curveCheckDeltaThreshold);
const SlippageWarningThreshold = BN(200);
const SlippageCriticalThreshold = BN(400);

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

  public async checkGVaultSystemAssets(eventData: Event, options: any) {
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
        alertLevel: "WARN",
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
        alertLevel: "WARN",
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
        alertLevel: "WARN",
        blockNumber,
        changeTotal: changeLockedProfit,
      });
      logger.info(`alert message: ${msg}`);
      sendMessage("alert.alerting", msg);
    }
  }

  public async checkGVaultHarvestEvent(eventData: Event, options: any) {
    logger.info(`options: ${JSON.stringify(options)}`);
    const { blockNumber, transactionHash, contractAddress, args } = eventData;
    const { contractName, eventName } = options;
    const {
      strategy,
      gain,
      loss,
      debtPaid,
      debtAdded,
      lockedProfit,
      lockedProfitBeforeLoss,
    } = args;
    logger.info(
      `strategy: ${strategy}\ngain: ${gain}\nloss: ${loss}\ndebtPaid:${debtPaid}\ndebtAdded:${debtAdded}\nlockedProfit: ${lockedProfit}\nlockedProfitBeforeLoss: ${lockedProfitBeforeLoss}`
    );

    const profit =
      loss.toString() === "0" ? BN(gain.toString()) : BN(`-${loss}`);
    logger.info(`profit: ${profit}`);

    // send harvest message
    const harvestInfo = MessageTemplate.getStrategyHarvestInfoMsg({
      strategy,
      transactionHash,
      profit: profit.toFixed(),
      debtPaid,
      debtAdded,
      lockedProfit,
      lockedProfitBeforeLoss,
    });
    sendMessage("trade.info", harvestInfo);

    const previousBlockNumber = blockNumber - 1;
    const previousEstimatedTotalAssets = await this._getChainData(
      "strategyEstimatedTotalAssets",
      strategy,
      {
        blockNumber: previousBlockNumber,
      }
    );
    const previousTotalDebt = await this._getChainData(
      "strategyTotalDebt",
      contractAddress,
      {
        strategy,
        blockNumber: previousBlockNumber,
      }
    );

    logger.info(
      `previousEstimatedTotalAssets: ${previousEstimatedTotalAssets}`
    );
    logger.info(`previousTotalDebt: ${previousTotalDebt}`);

    const expectedProfit = sub(previousEstimatedTotalAssets, [
      previousTotalDebt,
    ]);
    logger.info(`expectedProfit: ${expectedProfit}`);

    const profitDifference = sub(expectedProfit, [profit]);
    logger.info(`profitDifference: ${profitDifference}`);

    // send harvest warning message
    const profitChangeBPS = percentToBPS(
      divide(profitDifference, expectedProfit)
    );
    logger.info(`profitChangeBPS: ${profitChangeBPS}`);
    if (profitChangeBPS >= 500) {
      const msg = MessageTemplate.getPricePerShareAlertMsg({
        alertLevel: "WARN",
        blockNumber,
        changeTotal: profitDifference,
        changeBPS: profitChangeBPS,
        baseBPS: 500,
      });
      logger.info(`alert message: ${msg}`);
      sendMessage("alert.alerting", msg);
    }
  }

  public async handleGRouterTradeMessage(eventData: Event, options: any) {
    const { blockNumber, transactionHash, contractAddress, args } = eventData;
    const { contractName, eventName } = options;
    const {
      sender,
      tokenAmount,
      tokenAmounts,
      tokenIndex,
      tranche,
      trancheAmount,
      calcAmount,
    } = args;
    let msg = "";
    switch (eventName) {
      case "LogDeposit":
      case "LogLegacyDeposit":
        msg = MessageTemplate.getUserDepositTradeMsg({
          transactionHash,
          sender,
          tokenAmount,
          tokenAmounts,
          tokenIndex,
          tranche,
          trancheAmount,
          calcAmount,
        });
        break;
      case "LogWithdrawal":
        msg = MessageTemplate.getUserWithdrewTradeMsg({
          transactionHash,
          sender,
          trancheAmount,
          tokenIndex,
          tranche,
          tokenAmount,
        });
        break;
    }
    sendMessage("trade.info", msg);
  }

  public async handleTrancheAssetChangeMessage(eventData: Event, options: any) {
    const { transactionHash, contractAddress } = eventData;
    const { eventName } = options;
    const logs = await this._getChainData(
      "logsInTransaction",
      contractAddress,
      {
        tx: transactionHash,
      }
    );
    const _interface = new ethers.utils.Interface([
      "event LogNewTrancheBalance(uint256[2] balances, uint256 utilization)",
    ]);
    const eventTopic = _interface.getEventTopic("LogNewTrancheBalance");
    for (let i = 0; i < logs.length; i++) {
      let log = logs[i];
      if (log.topics[0] === eventTopic) {
        const decodeData = _interface.parseLog(log);
        const action = eventName === "LogNewDeposit" ? "deposit" : "withdrew";
        const { balances, utilization } = decodeData.args;
        logger.info(`utilization: ${utilization}`);
        const msg = MessageTemplate.getGTranchAssetChangeMsg({
          transactionHash,
          action,
          gvtAmount: balances[0],
          pwrdAmount: balances[1],
          utilization,
        });
        sendMessage("trade.info", msg);
        break;
      }
    }
  }

  public async handleStopLossInitiatedMessage(eventData: Event) {
    const { transactionHash, args } = eventData;
    const { strategy } = args;
    console.log(`strategy: ${strategy}`);
    const msg = MessageTemplate.getStopLossInitiatedMsg({
      transactionHash,
      strategy,
    });
    sendMessage("alert.alerting", msg);
  }

  public async handleStopLossExecutedMessage(eventData: Event) {
    const { transactionHash, args } = eventData;
    const { strategy, success } = args;
    const msg = MessageTemplate.getStopLossExecutedMsg({
      transactionHash,
      strategy,
      isSuccess: success,
    });
    sendMessage("alert.alerting", msg);
  }

  public async handleStopLossEndedMessage(eventData: Event) {
    const { transactionHash, args } = eventData;
    const { strategy, active } = args;
    if (active) {
      const msg = MessageTemplate.getStopLossEndedMsg({
        transactionHash,
        strategy,
      });
      sendMessage("alert.alerting", msg);
    }
  }

  public async handleStrategyHarvestFailureMessage(eventData: Event) {
    const { transactionHash, args } = eventData;
    const { strategy, reason, lowLevelData } = args;

    const msg = MessageTemplate.getStrategyHarvestFailureMsg({
      transactionHash,
      strategy,
      reason,
      lowLevelData,
    });
    sendMessage("alert.alerting", msg);
  }

  public async checkG2MetaPoolTVL(eventData: Event, options: any) {
    const { blockNumber, transactionHash, contractAddress } = eventData;
    const { contractName, eventName } = options;
    logger.info(`contractName: ${contractName}, eventName:${eventName}`);
    const strategyAddr =
      StrategyConfig.getStrategyConfig().getStrategyByMetapool(contractAddress);
    if (!strategyAddr) {
      return;
    }

    const strategyInfo = StrategyConfig.getStrategyConfig();
    const rewardContractAddr =
      strategyInfo.getStrategyRewardContract(strategyAddr);
    const plToken = strategyInfo.getStrategyMetaPoolToken(strategyAddr);
    const tokenIndex = strategyInfo.getStrategyTokenIndex(strategyAddr);
    const metaPoolTotalSupply = await this._getChainData(
      "totalSupply",
      plToken,
      {
        blockNumber,
      }
    );
    const strategyPlToken = await this._getChainData(
      "balanceOf",
      rewardContractAddr,
      {
        blockNumber,
        account: strategyAddr,
      }
    );

    logger.info(
      `metaPoolTotalSupply:${metaPoolTotalSupply}, strategyPlToken: ${strategyPlToken}`
    );

    const ratioStr = divide(strategyPlToken, metaPoolTotalSupply);
    const ratio = parseFloat(addDecimals(ratioStr, 2, 2));
    logger.info(`ratioStr:${ratioStr}, ratio: ${ratio}`);
    if (ratio >= assetRatio) {
      const strategyTVL = removeDecimals(strategyPlToken, 18);
      const metapoolTVL = removeDecimals(metaPoolTotalSupply, 18);
      const msg = MessageTemplate.getMetapoolTVLAlertMsg({
        transactionHash,
        strategy: strategyAddr,
        metapoolName: contractName.toLowerCase(),
        metapoolTVL,
        strategyTVL,
        ratio: ratio.toString(),
      });
      sendMessage("alert.alerting", msg);
    }

    const result = [];
    let totalSlippageCheckFailed = true;
    for (let i = 0; i < 6; i++) {
      let block = blockNumber - i * 1287;
      const sp = await this._calculateMetaSlippage(
        contractAddress,
        strategyAddr,
        block,
        strategyPlToken
      );
      result.push(sp.totalSlippage);
      totalSlippageCheckFailed =
        totalSlippageCheckFailed && sp.totalSlippageAboveThreshold;
    }
    logger.info(`${contractName} - ${result.join("|")}`);
    const msg = MessageTemplate.getMetaPoolSlippageInfoMsg({
      strategy: strategyAddr,
      metapoolName: contractName.toLowerCase(),
      history: result.join("|"),
      threshold: 400,
    });
    if (totalSlippageCheckFailed) {
      sendMessage("slippage.alerting", msg);
    } else {
      sendMessage("slippage.info", msg);
    }
  }

  public async check3PoolSlippage(eventData: Event, options: any) {
    const { blockNumber, transactionHash, contractAddress, args } = eventData;
    const { contractName, eventName } = options;
    const amount = BN("1000000000000000000000000");
    const stableCoinName = ["DAI", "USDC", "USDT"];
    if (this._checkCurveBalanceDelta(eventData, options)) {
      for (let s = 0; s <= 2; s += 1) {
        const baseSlippageResult = [];
        let baseSlippageCheckAllFailed = true;
        let recentlyBaseSlippageCheckFailedCritical = false;
        let recentlyBaseSlippageCheckFailedWarning = false;
        for (let i = 0; i < 6; i++) {
          let block = blockNumber - i * 1287;
          const sp = await this._calculateSlippage(block, s);
          baseSlippageResult.push(sp.pool3crvSlippage);

          baseSlippageCheckAllFailed =
            baseSlippageCheckAllFailed &&
            sp.pool3crvSlippageAboveCriticalThreshold;
          if (i == 0 && sp.pool3crvSlippageAboveCriticalThreshold) {
            recentlyBaseSlippageCheckFailedCritical = true;
          }
          if (i == 0 && sp.pool3crvSlippageAboveWarningThreshold) {
            recentlyBaseSlippageCheckFailedWarning = true;
          }

          //   console.log(
          //     `token index ${s} blockidx ${i} sp ${sp.pool3crvSlippage} failed ${sp.pool3crvSlippageAboveCriticalThreshold} recentlyfailed ${recentlyBaseSlippageCheckFailedCritical}`
          //   );
        }

        logger.info(
          `${blockNumber} ${contractName} - ${baseSlippageResult.join("|")}`
        );
        const msgBaseSlippage = MessageTemplate.getCurvePoolSlippageInfoMsg({
          curvePool: curve3pool,
          stablecoinName: stableCoinName[s],
          history: baseSlippageResult.join("|"),
          threshold: 400,
        });
        if (recentlyBaseSlippageCheckFailedCritical) {
          sendMessage("slippage.alerting", msgBaseSlippage);
        } else {
          sendMessage("slippage.info", msgBaseSlippage);
        }
      }
    }
  }

  private _checkCurveBalanceDelta(eventData: Event, options: any) {
    const { blockNumber, transactionHash, contractAddress, args } = eventData;
    const { contractName, eventName } = options;
    if (eventName == "AddLiquidity") {
      const { tokenAmounts } = args;
      //   logger.info(`eventName:${eventName} tokenAmounts ${tokenAmounts}`);
      for (let index = 0; index < 3; index += 1) {
        curveBalanceDelta[index] = curveBalanceDelta[index].plus(
          BN(tokenAmounts[index].toString())
        );
      }
    } else if (
      eventName == "RemoveLiquidityImbalance" ||
      eventName == "RemoveLiquidity"
    ) {
      const { tokenAmounts } = args;
      logger.info(`eventName:${eventName} tokenAmounts ${tokenAmounts}`);
      for (let index = 0; index < 3; index += 1) {
        curveBalanceDelta[index] = curveBalanceDelta[index].minus(
          BN(tokenAmounts[index].toString())
        );
      }
    } else if (eventName == "RemoveLiquidityOne") {
      const { tokenAmount } = args;
      logger.info(`eventName:${eventName} tokenAmounts ${tokenAmount}`);
    } else if (eventName == "TokenExchange") {
      const { sold_id, tokens_sold, bought_id, tokens_bought } = args;
      //   logger.info(
      //     `eventName:${eventName} sold_id ${sold_id} tokens_sold ${tokens_sold} bought_id ${bought_id} tokens_bought ${tokens_bought}`
      //   );
      curveBalanceDelta[sold_id] = curveBalanceDelta[sold_id].minus(
        BN(tokens_sold.toString())
      );
      curveBalanceDelta[bought_id] = curveBalanceDelta[bought_id].plus(
        BN(tokens_bought.toString())
      );
    }
    let needReset = false;
    for (let index = 0; index < 3; index += 1) {
      const usdDelta = curveBalanceDelta[index].dividedBy(
        curveBalanceDecimals[index]
      );
      logger.info(`curveBalanceDelta ${index} ${usdDelta}`);
      if (usdDelta.abs().isGreaterThan(deltaThreshold)) {
        needReset = true;
        break;
      }
    }
    if (needReset) {
      logger.info("balance change is big enough! need to reset");
      for (let index = 0; index < 3; index += 1) {
        curveBalanceDelta[index] = BN(0);
      }
      return true;
    }
    return false;
  }

  private async _calculateSlippage(blockNumber: number, tokenIndex: number) {
    const DECIMALS = BN("1000000000000000000");
    const amount = BN("1000000000000000000000000");
    // slippage check
    let curveWithdrawOneCoin = await this._getChainData(
      "calcWithdrawOneCoin",
      curve3pool,
      {
        blockNumber,
        tokenAmount: amount,
        index: tokenIndex,
      }
    );

    curveWithdrawOneCoin = BN(curveWithdrawOneCoin);
    // adjust for usdc and usdt
    if (tokenIndex > 0) {
      curveWithdrawOneCoin = curveWithdrawOneCoin.dividedBy(BN("1000000"));
    } else {
      curveWithdrawOneCoin = curveWithdrawOneCoin.dividedBy(DECIMALS);
    }

    let virtualPrice = await this._getChainData("getVirtualPrice", curve3pool, {
      blockNumber,
    });
    virtualPrice = BN(virtualPrice).dividedBy(DECIMALS);

    const ONE = BN(1);
    // 1 - stableCoinAmount / 3crvAmount * virtualPrice
    const pool3crvSlippage = ONE.minus(
      curveWithdrawOneCoin.dividedBy(
        amount.div(DECIMALS).multipliedBy(virtualPrice)
      )
    );
    // console.log(
    //   `${blockNumber} ${tokenIndex} curveWithdrawOneCoin ${curveWithdrawOneCoin} virtualPrice ${virtualPrice} pool3crvSlippage ${pool3crvSlippage}`
    // );
    return {
      pool3crvSlippage: pool3crvSlippage.multipliedBy(BN(10000)).toFixed(2),
      pool3crvSlippageAboveWarningThreshold: pool3crvSlippage
        .multipliedBy(BN(10000))
        .isGreaterThan(SlippageWarningThreshold),
      pool3crvSlippageAboveCriticalThreshold: pool3crvSlippage
        .multipliedBy(BN(10000))
        .isGreaterThan(SlippageCriticalThreshold),
    };
  }

  private async _calculateMetaSlippage(
    contractAddress: string,
    strategyAddr: string,
    blockNumber: number,
    strategyLpToken: string
  ) {
    const indexOf3crvInMetapool = 1;
    const DECIMALS = BN("1000000000000000000");
    // slippage check
    let metaWithdrawOneCoin = await this._getChainData(
      "calcWithdrawOneCoin",
      contractAddress,
      {
        blockNumber,
        tokenAmount: strategyLpToken,
        index: indexOf3crvInMetapool,
      }
    );

    let metaVirtualPrice = await this._getChainData(
      "getVirtualPrice",
      contractAddress,
      {
        blockNumber,
        account: strategyAddr,
      }
    );

    metaWithdrawOneCoin = BN(metaWithdrawOneCoin).dividedBy(DECIMALS);
    metaVirtualPrice = BN(metaVirtualPrice).dividedBy(DECIMALS);

    let virtualPrice = await this._getChainData("getVirtualPrice", curve3pool, {
      blockNumber,
      account: strategyAddr,
    });
    virtualPrice = BN(virtualPrice).dividedBy(DECIMALS);
    const strategyLPToken = BN(strategyLpToken).dividedBy(DECIMALS);
    const expected = strategyLPToken.multipliedBy(metaVirtualPrice);

    const slippage = expected
      .minus(metaWithdrawOneCoin.multipliedBy(virtualPrice))
      .dividedBy(expected);

    const threshold = BN(400);
    return {
      totalSlippage: slippage.multipliedBy(BN(10000)).toFixed(2),
      totalSlippageAboveThreshold: slippage
        .multipliedBy(BN(10000))
        .isGreaterThan(threshold),
    };
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
        alertLevel: "EMERG",
        blockNumber,
        changeTotal: changePricePerShare,
        changeBPS: pricePerShareChangeBPS,
        baseBPS: 1,
      });
      logger.info(`alert message: ${msg}`);
      const msgWithId = `msg_id: GVault_Price_Per_Share ${msg}`;
      sendMessage("alert.emergency", msgWithId);
    }
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
}
