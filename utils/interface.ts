export interface retryOptions {
  fn: any;
  thisObj: object;
  currentRetry?: number;
  params: any[];
}

export interface MessageObj {
  alertLeval: string;
  blockNumber: number;
  transactionHash?: string;
  changeTotal?: number;
  changeBPS?: number;
  baseBPS?: number;
}
