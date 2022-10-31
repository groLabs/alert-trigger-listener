import { BigNumber } from "ethers";

export interface Event {
  contractAddress: string;
  blockNumber: number;
  transactionHash: string;
  args: any;
}

export interface retryOptions {
  fn: any;
  thisObj: object;
  currentRetry?: number;
  params: any[];
}

export interface MessageObj {
  alertLeval?: string;
  blockNumber?: number;
  transactionHash?: string;
  changeTotal?: number;
  changeBPS?: number;
  baseBPS?: number;
  profit?: string;
  gain?: number;
  loss?: number;
  strategy?: string;
  debtPaid?: string;
  debtAdded?: string;
  lockedProfit?: string;
}

export interface GrouterTradeMsgObj {
  transactionHash: string;
  sender: string;
  tokenAmount: BigNumber;
  tokenIndex?: BigNumber;
  tokenAmounts?: BigNumber[];
  tranche: boolean;
  trancheAmount: BigNumber;
  calcAmount?: BigNumber;
}

export interface GTrancheAssetChangeMsgObj {
  transactionHash: string;
  action: "deposit" | "withdrew";
  gvtAmount: BigNumber;
  pwrdAmount: BigNumber;
  utilization: BigNumber;
}

export interface StopLossInitiatedMsgObj {
  transactionHash: string;
  strategy: string;
}

export interface StopLossExecutedMsgObj {
  transactionHash: string;
  strategy: string;
  isSuccess: boolean;
}

export interface TokenInfo {
  symbol: string;
  value: string;
}
