export abstract class ChainDataCatcher {
  protected readonly _web3: any;

  constructor(web3: any) {
    this._web3 = web3;
  }

  public abstract getChainData(
    dataName: string,
    contractAddress: string,
    options: any
  ): any;

  public async getChainDataByABI(
    contractAddress: string,
    blockNumber: number,
    abi: string,
    funcName: string,
    args: any[]
  ) {
    const abiJson = JSON.parse(abi);
    const contractInstance = new this._web3.eth.Contract(
      abiJson,
      contractAddress
    );
    if (args && args.length > 0) {
      const result = contractInstance.methods[funcName]
        .call(contractInstance, ...args)
        .call({}, blockNumber);
      return result;
    } else {
      const result = contractInstance.methods[funcName]
        .call(contractInstance)
        .call({}, blockNumber);
      return result;
    }
  }
}
