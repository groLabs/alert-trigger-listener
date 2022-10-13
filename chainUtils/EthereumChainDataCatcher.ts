const logger = require("../utils/logger");
import { ChainDataCatcher } from "./ChainDataCatcher";

export class EthereumChainDataCatcher extends ChainDataCatcher {
  public async getChainData(
    functionName: string,
    contractAddress: string,
    options: any
  ) {
    const { blockNumber } = options;
    switch (functionName) {
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
      default:
        logger.error(
          `Not fund chain data function by function: ${functionName}`
        );
        return undefined;
    }
  }

  private async _getGTokenFactor(contractAddress: string, blockNumber: number) {
    const abi = [
      {
        inputs: [],
        name: "factor",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const gtoken = new this._web3.eth.Contract(abi, contractAddress);
    const result = gtoken.methods.factor().call({}, blockNumber);
    return result;
  }

  private async _getRealizedTotalAssets(
    contractAddress: string,
    blockNumber: number
  ) {
    const abi = [
      {
        inputs: [],
        name: "realizedTotalAssets",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = contract.methods.realizedTotalAssets().call({}, blockNumber);
    return result;
  }

  private async _getTotalSupply(contractAddress: string, blockNumber: number) {
    const abi = [
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = contract.methods.totalSupply().call({}, blockNumber);
    return result;
  }

  private async _getPricePerShare(
    contractAddress: string,
    blockNumber: number
  ) {
    const abi = [
      {
        inputs: [],
        name: "getPricePerShare",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = contract.methods.getPricePerShare().call({}, blockNumber);
    return result;
  }

  private async _getLockedProfit(contractAddress: string, blockNumber: number) {
    const abi = [
      {
        inputs: [],
        name: "lockedProfit",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = contract.methods.lockedProfit().call({}, blockNumber);
    return result;
  }
}
