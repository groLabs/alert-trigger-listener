const logger = require("../utils/logger");
import { ChainDataCatcher } from "./ChainDataCatcher";
import {
  balanceOf,
  factor,
  realizedTotalAssets,
  totalSupply,
  getPricePerShare,
  lockedProfit,
  calcWithdrawOneCoin,
  getVirtualPrice,
  strategyCheck,
  strategies,
  estimatedTotalAssets,
} from "./DataCatcherABI";

export class EthereumChainDataCatcher extends ChainDataCatcher {
  public async getChainData(
    functionName: string,
    contractAddress: string,
    options: any
  ) {
    const { blockNumber, tx } = options;
    switch (functionName) {
      case "balanceOf":
        return this._getBalanceOf(
          contractAddress,
          options.account,
          blockNumber
        );
      case "factor":
        return this._getGTokenFactor(contractAddress, blockNumber);
      case "realizedTotalAssets":
        return this._getRealizedTotalAssets(contractAddress, blockNumber);
      case "totalSupply":
        return this._getTotalSupply(contractAddress, blockNumber);
      case "pricePerShare":
        return this._getPricePerShare(contractAddress, blockNumber);
      case "lockedProfit":
        return this._getLockedProfit(contractAddress, blockNumber);
      case "strategyTotalDebt":
        return this._getStrategyTotalDebt(
          contractAddress,
          options.strategy,
          blockNumber
        );
      case "strategyEstimatedTotalAssets":
        return this._getStrategyEstimatedTotalAssets(
          contractAddress,
          blockNumber
        );
      case "strategyCheck":
        return this._getStrategyCheck(
          contractAddress,
          options.strategy,
          blockNumber
        );
      case "calcWithdrawOneCoin":
        return this._getCalcWithdrawOneCoin(
          contractAddress,
          options.tokenAmount,
          options.index,
          blockNumber
        );
      case "getVirtualPrice":
        return this._getVirtualPrice(contractAddress, blockNumber);
      case "logsInTransaction":
        return this._getLogsInTransaction(tx);
      default:
        logger.error(
          `Not fund chain data function by function: ${functionName}`
        );
        return undefined;
    }
  }

  private async _getBalanceOf(
    contractAddress: string,
    accountAddress: string,
    blockNumber: number
  ) {
    const abi = [balanceOf];
    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .balanceOf(accountAddress)
      .call({}, blockNumber);
    return result;
  }

  private async _getGTokenFactor(contractAddress: string, blockNumber: number) {
    const abi = [factor];

    const gtoken = new this._web3.eth.Contract(abi, contractAddress);
    const result = await gtoken.methods.factor().call({}, blockNumber);
    return result;
  }

  private async _getRealizedTotalAssets(
    contractAddress: string,
    blockNumber: number
  ) {
    const abi = [realizedTotalAssets];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .realizedTotalAssets()
      .call({}, blockNumber);
    return result;
  }

  private async _getTotalSupply(contractAddress: string, blockNumber: number) {
    const abi = [totalSupply];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods.totalSupply().call({}, blockNumber);
    return result;
  }

  private async _getPricePerShare(
    contractAddress: string,
    blockNumber: number
  ) {
    const abi = [getPricePerShare];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .getPricePerShare()
      .call({}, blockNumber);
    return result;
  }

  private async _getLockedProfit(contractAddress: string, blockNumber: number) {
    const abi = [lockedProfit];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods.lockedProfit().call({}, blockNumber);
    return result;
  }

  private async _getCalcWithdrawOneCoin(
    contractAddress: string,
    tokenAmount: number,
    index: number,
    blockNumber: number
  ) {
    const abi = [calcWithdrawOneCoin];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .calc_withdraw_one_coin(tokenAmount, index)
      .call({}, blockNumber);
    return result;
  }

  private async _getVirtualPrice(contractAddress: string, blockNumber: number) {
    const abi = [getVirtualPrice];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .get_virtual_price()
      .call({}, blockNumber);
    return result;
  }

  private async _getStrategyCheck(
    contractAddress: string,
    strategyAddress: string,
    blockNumber: number
  ) {
    const abi = [strategyCheck];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .strategyCheck(strategyAddress)
      .call({}, blockNumber);
    return result;
  }

  private async _getStrategyTotalDebt(
    gVaultAddress: string,
    strategyAddress: string,
    blockNumber: number
  ) {
    return this._getStrategyInfo(
      gVaultAddress,
      strategyAddress,
      blockNumber,
      "totalDebt"
    );
  }

  private async _getStrategyInfo(
    gVaultAddress: string,
    strategyAddress: string,
    blockNumber: number,
    fieldName: string
  ) {
    const abi = [strategies];
    const contract = new this._web3.eth.Contract(abi, gVaultAddress);
    const result = await contract.methods
      .strategies(strategyAddress)
      .call({}, blockNumber);
    return result[fieldName];
  }

  private async _getLogsInTransaction(tx: string) {
    const receipt = await this._web3.eth.getTransactionReceipt(tx);
    return receipt.logs;
  }

  private async _getStrategyEstimatedTotalAssets(
    contractAddress: string,
    blockNumber: number
  ) {
    const abi = [estimatedTotalAssets];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .estimatedTotalAssets()
      .call({}, blockNumber);
    return result;
  }
}
