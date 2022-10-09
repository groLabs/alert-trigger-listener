const Web3 = require("web3");

export class RPCProvider {
  private _connectionOptions: any;
  private _rpcEndPoint: string;
  private _providerInstance: any;

  constructor(rpcEndPoint: string, connOptions: any) {
    this._connectionOptions = connOptions;
    this._rpcEndPoint = rpcEndPoint;
    this.updateProviderInstance();
  }

  get provider() {
    return this._providerInstance;
  }

  get rpcEndPoint() {
    return this._rpcEndPoint;
  }

  private updateProviderInstance() {
    this._providerInstance = new Web3.providers.HttpProvider(
      this._rpcEndPoint,
      this._connectionOptions
    );
  }
}
