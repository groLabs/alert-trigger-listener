import { MessageObj } from "../utils/interface";

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

  //   public static getStrategyHarvestMsg(msgObj: MessageObj){
  // 	const { transactionHash, gain, loss } = msgObj;
  //     return `Strategy[${transactionHash}] harvest profit`;
  //   }
}
