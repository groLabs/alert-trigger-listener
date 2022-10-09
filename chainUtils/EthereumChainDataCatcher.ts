const logger = require("../logger");
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
}
