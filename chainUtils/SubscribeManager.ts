const Web3 = require("web3");
import { ChainHelper } from "./ChainHelper";
import { AlertCheckService } from "./AlertCheckService";
const logger = require("../logger");

export class SubscribeManager {
  private readonly _chainName: string;
  private readonly _contractName: string;
  private readonly _eventConfig: any;
  private readonly _wsProvider: any;
  private readonly _web3Instance: any;
  private readonly _functions: any;

  constructor(chainName: string, contractName: string, eventConfig: any) {
    this._chainName = chainName.toLowerCase();
    this._contractName = contractName;
    this._eventConfig = eventConfig;
    this._wsProvider = this._getWSProvider();
    this._web3Instance = new Web3(this._wsProvider);
    this._functions = {};
    this._initFunctions();
  }

  public startSubscribe() {
    const options = this._getSubscribeOptions();
    const contractName = this._contractName;
    const checkService: any = AlertCheckService.getAlertCheckServiceInstance();

    const callback = function (data: any) {
      const topic = data.topics[0];
      //@ts-ignore
      const functionName = this._functions[topic];
      logger.info(`topic: ${JSON.stringify(topic)}`);
      checkService[functionName].call(checkService, {}, {});
    }.bind(this);

    this._web3Instance.eth
      .subscribe("logs", options)
      .on("connected", function (subID: string) {
        logger.info(`${contractName}'s subscription id: ${subID}`);
      })
      .on("data", callback)
      //   .on("changed", function (log) {
      //     logger.info(`changed: ${JSON.stringify(log)}`);
      //   })
      .on("error", function (error: any) {
        logger.error(
          `${contractName}'s subscription error: ${JSON.stringify(error)}`
        );
      });
  }

  private _getWSProvider() {
    if (this._chainName === "ethereum") {
      return ChainHelper.getEthereumChainHelper().wsProvider.provider;
    }
    throw new Error(`Doesn't find provider for chain: ${this._chainName}`);
  }

  private _getSubscribeOptions() {
    const options: any = {
      address: this._eventConfig.address,
      topics: [],
    };

    const events = Object.keys(this._eventConfig.events);
    const topics: any = [];
    events.forEach((key) => {
      topics.push(this._eventConfig.events[key].topic);
    });
    options.topics.push(topics);
    return options;
  }

  private _initFunctions() {
    const events = Object.keys(this._eventConfig.events);
    events.forEach((key) => {
      const eventItem = this._eventConfig.events[key];
      this._functions[eventItem.topic] = eventItem.alertFunction;
    });
  }
}
