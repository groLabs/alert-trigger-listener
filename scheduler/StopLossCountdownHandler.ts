import {
  CheckResult,
  AlertingLevel,
  StopLossCountdownMsgObj,
} from "../utils/interface";
import { BaseTaskHandler } from "./BaseTaskHandler";
import { MessageTemplate } from "../utils/MessageTemplate";
const logger = require("../utils/logger");

export class StopLossCountdownHandler extends BaseTaskHandler {
  private _strategies: Array<string>;
  private _contract: string;

  constructor(config: any) {
    super(config);
    this._strategies = this._config.strategies;
    this._contract = this._config.address;
  }

  async check(): Promise<CheckResult> {
    try {
      const blockNumber = await this._chainHelper.getBlockNumber();
      for (let i = 0; i < this._strategies.length; i += 1) {
        const strategyAddr: string = this._strategies[i];
        let strategyInfo = await this._getChainData(
          "strategyCheck",
          this._contract,
          {
            strategy: strategyAddr,
            blockNumber,
          }
        );
        let { primerTimestamp } = strategyInfo;
        if (primerTimestamp > 0) {
          const now = new Date().getTime();
          const countdown = now / 1000 - primerTimestamp;
          const runningHours = Math.floor(countdown / 3600);
          const runningMinutes = Math.floor((countdown % 3600) / 60);
          const runningSeconds = Math.floor((countdown % 3600) % 60);
          logger.info(
            `Strategy ${this._strategies[i]} stop loss running ${runningHours} h ${runningMinutes} m ${runningSeconds} s`
          );
          const msg: StopLossCountdownMsgObj = {
            strategy: strategyAddr,
            hours: runningHours,
            minutes: runningMinutes,
            seconds: runningSeconds,
          };
          const checkResult: CheckResult = {
            level: AlertingLevel.Critical,
            message: MessageTemplate.getStopLossCountdownMsg(msg),
            timestamp: Date.now(),
          };
          return checkResult;
        }
      }
    } catch (error) {
      logger.error(error);
    }
    const checkResult: CheckResult = {
      level: AlertingLevel.None,
      message: "None",
      timestamp: Date.now(),
    };
    return checkResult;
  }
}
