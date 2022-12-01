const logger = require("../utils/logger");
import { ChainDataCatcher } from "./ChainDataCatcher";

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
    const abi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
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
    const result = await contract.methods
      .balanceOf(accountAddress)
      .call({}, blockNumber);
    return result;
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
    const result = await gtoken.methods.factor().call({}, blockNumber);
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
    const result = await contract.methods
      .realizedTotalAssets()
      .call({}, blockNumber);
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
    const result = await contract.methods.totalSupply().call({}, blockNumber);
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
    const result = await contract.methods
      .getPricePerShare()
      .call({}, blockNumber);
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
    const result = await contract.methods.lockedProfit().call({}, blockNumber);
    return result;
  }

  private async _getCalcWithdrawOneCoin(
    contractAddress: string,
    tokenAmount: number,
    index: number,
    blockNumber: number
  ) {
    const abi = [
      {
        name: "calc_withdraw_one_coin",
        outputs: [
          {
            type: "uint256",
            name: "",
          },
        ],
        inputs: [
          {
            type: "uint256",
            name: "_token_amount",
          },
          {
            type: "int128",
            name: "i",
          },
        ],
        stateMutability: "view",
        type: "function",
        gas: 1102,
      },
    ];

    const contract = new this._web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods
      .calc_withdraw_one_coin(tokenAmount, index)
      .call({}, blockNumber);
    return result;
  }

  private async _getVirtualPrice(contractAddress: string, blockNumber: number) {
    const abi = [
      {
        name: "get_virtual_price",
        outputs: [
          {
            type: "uint256",
            name: "",
          },
        ],
        inputs: [],
        stateMutability: "view",
        type: "function",
        gas: 1133537,
      },
    ];

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
    const abi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "strategyCheck",
        outputs: [
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint64",
            name: "timeLimit",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "primerTimestamp",
            type: "uint64",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

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
    const abi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
        ],
        name: "strategies",
        outputs: [
          {
            components: [
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "debtRatio",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lastReport",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "totalDebt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "totalGain",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "totalLoss",
                type: "uint256",
              },
            ],
            internalType: "struct StrategyParams",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
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
    const abi = [
      {
        inputs: [],
        name: "estimatedTotalAssets",
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
    const result = await contract.methods
      .estimatedTotalAssets()
      .call({}, blockNumber);
    return result;
  }
}
