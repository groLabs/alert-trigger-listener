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
  alertLevel?: string;
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

export interface StopLossInitiatedOrEndedMsgObj {
  transactionHash: string;
  strategy: string;
}

export interface StopLossExecutedMsgObj {
  transactionHash: string;
  strategy: string;
  isSuccess: boolean;
}

export interface StrategyHarvestFailureMsgObj {
  transactionHash: string;
  strategy: string;
  reason: string;
  lowLevelData: string;
}

export interface TokenInfo {
  symbol: string;
  value: string;
}

export interface metapoolTVLAlertMsgObj {
  transactionHash: string;
  strategy: string;
  metapoolName: string;
  metapoolTVL: string;
  strategyTVL: string;
  ratio: string;
}

export interface curvepoolSlippageAlertMsgObj {
  strategy: string;
  metapoolName: string;
  history: string;
  threshold: number;
}
