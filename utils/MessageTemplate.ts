import {
  MessageObj,
  GrouterTradeMsgObj,
  TokenInfo,
  GTrancheAssetChangeMsgObj,
  StopLossInitiatedOrEndedMsgObj,
  StopLossExecutedMsgObj,
  StrategyHarvestFailureMsgObj,
  metapoolTVLAlertMsgObj,
  curvepoolSlippageAlertMsgObj,
} from "../utils/interface";
import { shortTXHash, removeDecimals } from "../utils/tools";
import { StrategyErrors } from "../utils/constant";
import { StrategyConfig } from "../utils/StrategyConfig";

export class MessageTemplate {
  public static getTotalAssetAlertMsg(msgObj: MessageObj) {
    const { alertLevel, blockNumber, changeTotal } = msgObj;
    return `[${alertLevel}] - System asset change | Asset change in block ${blockNumber} is ${changeTotal}.`;
  }

  public static getTotalSupplyAlertMsg(msgObj: MessageObj) {
    const { alertLevel, blockNumber, changeTotal } = msgObj;
    return `[${alertLevel}] - System asset change | Total supply change in block ${blockNumber} is ${changeTotal}.`;
  }

  public static getPricePerShareAlertMsg(msgObj: MessageObj) {
    const { alertLevel, blockNumber, changeTotal, changeBPS, baseBPS } = msgObj;
    return `[${alertLevel}] - System asset change | Price per share change in block ${blockNumber} is ${changeTotal}. The ratio change is ${changeBPS} BPS, threshold ${baseBPS} BPS`;
  }

  public static getLockedProfitAlertMsg(msgObj: MessageObj) {
    const { alertLevel, blockNumber, changeTotal } = msgObj;
    return `[${alertLevel}] - System asset change | Locked profit in block ${blockNumber} isn't same and changed ${changeTotal}`;
  }

  public static getStrategyHarvestInfoMsg(msgObj: MessageObj) {
    const {
      strategy,
      transactionHash,
      profit,
      debtPaid,
      debtAdded,
      lockedProfit,
    } = msgObj;
    const ndProfit = removeDecimals(profit);
    const ndDebtPaid = removeDecimals(debtPaid);
    const ndDebtAdded = removeDecimals(debtAdded);
    const ndLockedProfit = removeDecimals(lockedProfit);
    return `[${shortTXHash(
      transactionHash
    )}](https://etherscan.io/tx/${transactionHash}) ${StrategyConfig.getStrategyConfig().getStrategyName(
      strategy || ""
    )} strategy does harvest action with profit: ${ndProfit}, debtPaid: ${ndDebtPaid}, debtAdded:${ndDebtAdded}, lockedProfit:${ndLockedProfit}.`;
  }

  public static getUserDepositTradeMsg(msgObj: GrouterTradeMsgObj) {
    const {
      transactionHash,
      sender,
      tokenAmount,
      tokenIndex,
      tokenAmounts,
      tranche,
      trancheAmount,
      calcAmount,
    } = msgObj;
    const shortSender = shortTXHash(sender);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    const _trancheAmount = removeDecimals(trancheAmount.toString(), 18);
    const _calAmount = removeDecimals(calcAmount?.toString(), 18);
    const tokenSymbol = tranche ? "PWRD" : "Vault";
    if (tokenAmount) {
      // LogDeposit event
      const depositTokenIndex = tokenIndex?.toString();
      const depositTokenInfo: TokenInfo = {
        symbol: "",
        value: "",
      };
      switch (depositTokenIndex) {
        case "0":
          depositTokenInfo.symbol = "DAI";
          depositTokenInfo.value = removeDecimals(tokenAmount.toString(), 18);
          break;
        case "1":
          depositTokenInfo.symbol = "USDC";
          depositTokenInfo.value = removeDecimals(tokenAmount.toString(), 6);
          break;
        case "2":
          depositTokenInfo.symbol = "USDT";
          depositTokenInfo.value = removeDecimals(tokenAmount.toString(), 6);
          break;
      }
      return `[${shortSender}](${txLink}) deposit **$${_calAmount}** into ${tokenSymbol} (${depositTokenInfo.value} ${depositTokenInfo.symbol} -> ${_trancheAmount} ${tokenSymbol})`;
    } else {
      // LogLegacyDeposit event
      const depositDAI = removeDecimals(tokenAmounts?.[0].toString(), 18);
      const depositUSDC = removeDecimals(tokenAmounts?.[1].toString(), 6);
      const depositUSDT = removeDecimals(tokenAmounts?.[2].toString(), 6);

      return `[${shortSender}](${txLink}) deposit **$${_calAmount}** into ${tokenSymbol} (${depositDAI} DAI, ${depositUSDC} USDC, ${depositUSDT} USDT -> ${_trancheAmount} ${tokenSymbol})`;
    }
  }

  public static getUserWithdrewTradeMsg(msgObj: GrouterTradeMsgObj) {
    const {
      transactionHash,
      sender,
      trancheAmount,
      tokenIndex,
      tranche,
      tokenAmount,
    } = msgObj;
    const shortSender = shortTXHash(sender);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    const _trancheAmount = removeDecimals(trancheAmount.toString(), 18);
    const tokenSymbol = tranche ? "PWRD" : "Vault";
    const withdrewTokenIndex = tokenIndex?.toString();
    const withdrewTokenInfo: TokenInfo = {
      symbol: "",
      value: "",
    };
    switch (withdrewTokenIndex) {
      case "0":
        withdrewTokenInfo.symbol = "DAI";
        withdrewTokenInfo.value = removeDecimals(tokenAmount.toString(), 18);
        break;
      case "1":
        withdrewTokenInfo.symbol = "USDC";
        withdrewTokenInfo.value = removeDecimals(tokenAmount.toString(), 6);
        break;
      case "2":
        withdrewTokenInfo.symbol = "USDT";
        withdrewTokenInfo.value = removeDecimals(tokenAmount.toString(), 6);
        break;
    }
    return `[${shortSender}](${txLink}) withdrew **$${withdrewTokenInfo.value}** ${withdrewTokenInfo.symbol} from ${tokenSymbol} (${_trancheAmount} ${tokenSymbol} -> ${withdrewTokenInfo.value} ${withdrewTokenInfo.symbol})`;
  }

  public static getGTranchAssetChangeMsg(msgObj: GTrancheAssetChangeMsgObj) {
    const { transactionHash, action, gvtAmount, pwrdAmount, utilization } =
      msgObj;
    const shortTX = shortTXHash(transactionHash);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    const totalTVL = gvtAmount.add(pwrdAmount);
    const _totalTVL = removeDecimals(totalTVL.toString(), 18);
    const _gvtAmount = removeDecimals(gvtAmount.toString(), 18);
    const _pwrdAmount = removeDecimals(pwrdAmount.toString(), 18);
    const _utilization = removeDecimals(utilization.toString(), 2);
    return `[${shortTX}](${txLink}) after ${action} the Tranche's asset is **$${_totalTVL}** ($${_gvtAmount} GVT, $${_pwrdAmount} PWRD), the utilization is ${_utilization}%`;
  }

  public static getStopLossInitiatedMsg(
    msgObj: StopLossInitiatedOrEndedMsgObj
  ) {
    const { transactionHash, strategy } = msgObj;
    const shortTX = shortTXHash(transactionHash);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    return `[${shortTX}](${txLink}) strategy **${StrategyConfig.getStrategyConfig().getStrategyName(
      strategy
    )}** start stop loss primer`;
  }

  public static getStopLossExecutedMsg(msgObj: StopLossExecutedMsgObj) {
    const { transactionHash, strategy, isSuccess } = msgObj;
    const shortTX = shortTXHash(transactionHash);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    return `[${shortTX}](${txLink}) strategy **${StrategyConfig.getStrategyConfig().getStrategyName(
      strategy
    )}** executed stop loss: ${isSuccess ? "Success" : "Failure"}`;
  }

  public static getStopLossEndedMsg(msgObj: StopLossInitiatedOrEndedMsgObj) {
    const { transactionHash, strategy } = msgObj;
    const shortTX = shortTXHash(transactionHash);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    return `[${shortTX}](${txLink}) strategy **${StrategyConfig.getStrategyConfig().getStrategyName(
      strategy
    )}** end stop loss primer`;
  }

  public static getStrategyHarvestFailureMsg(
    msgObj: StrategyHarvestFailureMsgObj
  ) {
    const { transactionHash, strategy, reason, lowLevelData } = msgObj;
    const shortTX = shortTXHash(transactionHash);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    let msg = reason;
    if (msg == "") {
      msg = MessageTemplate._getReadableErrorMsg(lowLevelData);
    }
    if (!msg) msg = lowLevelData;
    return `[${shortTX}](${txLink}) strategy **${StrategyConfig.getStrategyConfig().getStrategyName(
      strategy
    )}** harvest failed for ${msg}`;
  }

  public static getMetapoolTVLAlertMsg(msgObj: metapoolTVLAlertMsgObj) {
    const {
      transactionHash,
      strategy,
      metapoolName,
      metapoolTVL,
      strategyTVL,
      ratio,
    } = msgObj;
    const shortTX = shortTXHash(transactionHash);
    const txLink = `https://etherscan.io/tx/${transactionHash}`;
    const curveMetaPoolLink = `https://curve.fi/#/ethereum/pools/${metapoolName}/deposit`;
    return `[${shortTX}](${txLink}) strategy **${StrategyConfig.getStrategyConfig().getStrategyName(
      strategy
    )}** asset(${strategyTVL}) has reached **${ratio}**% in [${metapoolName}](${curveMetaPoolLink}) metapool(${metapoolTVL}).`;
  }
  public static getMetaPoolSlippageInfoMsg(
    msgObj: curvepoolSlippageAlertMsgObj
  ) {
    const { strategy, metapoolName, threshold, history } = msgObj;
    const shortTX = shortTXHash(strategy);
    const curveMetaPoolLink = `https://curve.fi/#/ethereum/pools/${metapoolName}/deposit`;
    const contractLink = `https://etherscan.io/address/${strategy}`;
    const strategyName =
      StrategyConfig.getStrategyConfig().getStrategyName(strategy);
    return `[${shortTX}](${contractLink}) **${metapoolName}** NEGATIVE MEANS WITHDRAW BONUS exotic -> base slippage: [${history}] Bps, threshold: ${threshold}, latest->before in [${metapoolName}](${curveMetaPoolLink}).`;
  }

  public static getCurvePoolSlippageInfoMsg(
    msgObj: curvepoolSlippageAlertMsgObj
  ) {
    const { strategy, metapoolName, threshold, history } = msgObj;
    const shortTX = shortTXHash(strategy);
    const curveMetaPoolLink = `https://curve.fi/#/ethereum/pools/${metapoolName}/deposit`;
    const contractLink = `https://etherscan.io/address/${strategy}`;
    const strategyName =
      StrategyConfig.getStrategyConfig().getStrategyName(strategy);
    return `[${shortTX}](${contractLink}) **${strategyName}** NEGATIVE MEANS WITHDRAW BONUS 3CRV -> base slippage: [${history}] Bps, threshold: ${threshold}, latest->before`;
  }

  private static _getReadableErrorMsg(code: string): string {
    return StrategyErrors[code];
  }
}
