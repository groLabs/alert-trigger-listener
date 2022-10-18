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
