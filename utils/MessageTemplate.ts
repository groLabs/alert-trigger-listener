import { MessageObj } from "../utils/interface";
import { shortTXHash, getConfig, removeDecimals } from "../utils/tools";
const strategiesConfig = getConfig("strategies");

export class MessageTemplate {
  public static getTotalAssetAlertMsg(msgObj: MessageObj) {
    const { alertLeval, blockNumber, changeTotal } = msgObj;
    return `[${alertLeval}] - System asset change | Asset change in block ${blockNumber} is ${changeTotal}.`;
  }

  public static getTotalSupplyAlertMsg(msgObj: MessageObj) {
    const { alertLeval, blockNumber, changeTotal } = msgObj;
    return `[${alertLeval}] - System asset change | Total supply change in block ${blockNumber} is ${changeTotal}.`;
  }

  public static getPricePerShareAlertMsg(msgObj: MessageObj) {
    const { alertLeval, blockNumber, changeTotal, changeBPS, baseBPS } = msgObj;
    return `[${alertLeval}] - System asset change | Price per share change in block ${blockNumber} is ${changeTotal}. The ratio change is ${changeBPS} BPS, threshold ${baseBPS} BPS`;
  }

  public static getLockedProfitAlertMsg(msgObj: MessageObj) {
    const { alertLeval, blockNumber, changeTotal } = msgObj;
    return `[${alertLeval}] - System asset change | Locked profit in block ${blockNumber} isn't same and changed ${changeTotal}`;
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
    )}](https://etherscan.io/tx/${transactionHash}) ${
      strategiesConfig[strategy || ""]?.name
    } strategy does harvest action with profit: ${ndProfit}, debtPaid: ${ndDebtPaid}, debtAdded:${ndDebtAdded}, lockedProfit:${ndLockedProfit}.`;
  }
}
