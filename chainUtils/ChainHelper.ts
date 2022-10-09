import { DefaultConnectOptions } from "./ConnectOptions";
import { RPCProvider } from "./RPCProvider";
import { WSProvider } from "./WSProvider";
import { ChainDataCatcher } from "./ChainDataCatcher";
import { EthereumChainDataCatcher } from "./EthereumChainDataCatcher";

const Web3 = require("web3");
const logger = require("../logger");

export class ChainHelper {
  private static _ethereumChainHelper: ChainHelper;
  private readonly _rpcProvider: RPCProvider;
  private readonly _wsProvider: WSProvider;
  private _chainDataCatcher?: ChainDataCatcher;
  private readonly _web3: any;

  private constructor(rpcProvder: RPCProvider, wsProvider: WSProvider) {
    this._rpcProvider = rpcProvder;
    this._wsProvider = wsProvider;
    this._web3 = new Web3(this._rpcProvider.provider);
  }

  public static getEthereumChainHelper() {
    if (!ChainHelper._ethereumChainHelper) {
      const { wsProvider, rpcProvider } = ChainHelper._getEthereumProviders();
      ChainHelper._ethereumChainHelper = new ChainHelper(
        rpcProvider,
        wsProvider
      );
    }
    ChainHelper._ethereumChainHelper._createChainDataCatcher("ethereum");
    return ChainHelper._ethereumChainHelper;
  }

  /**
   * Get data from the chain.
   * this function will automatically choose which data catcher used by passed block number
   * @param dataName
   * @param contractAddress
   * @param options
   * @returns
   */
  async getChainData(
    functionName: string,
    contractAddress: string,
    options: any
  ) {
    return this._chainDataCatcher?.getChainData(
      functionName,
      contractAddress,
      options
    );
  }

  /**
   * Get data by ABI from the chain.
   * this function will automatically choose which data catcher used by passed block number
   * @param contractAddress
   * @param blockNumber
   * @param abi
   * @param funcName
   * @param args
   * @returns
   */
  async getChainDataByABI(
    contractAddress: string,
    blockNumber: number,
    abi: string,
    funcName: string,
    args: any[]
  ) {
    return this._chainDataCatcher?.getChainDataByABI(
      contractAddress,
      blockNumber,
      abi,
      funcName,
      args
    );
  }

  public get rpcProvider(): RPCProvider {
    return this._rpcProvider;
  }

  public get wsProvider(): WSProvider {
    return this._wsProvider;
  }

  toString(): string {
    return `rpc provider's endPoint: ${this._rpcProvider.rpcEndPoint}; ws provider's endPoint: ${this._wsProvider.wsEndPoint}`;
  }

  private static _getEthereumProviders() {
    const connectOptions = DefaultConnectOptions.getInstance();
    const wsProvider = new WSProvider(
      connectOptions.ethWSEndPoint,
      connectOptions.options
    );

    const rpcProvider = new RPCProvider(connectOptions.ethRPCEndPoint, {});
    return { wsProvider, rpcProvider };
  }

  private _createChainDataCatcher(chainName: string) {
    switch (chainName) {
      case "ethereum":
        this._chainDataCatcher = new EthereumChainDataCatcher(this._web3);
        break;
      default:
        logger.info(`Not fund data catcher for chain ${chainName}`);
    }
  }
}
