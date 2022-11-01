import { scheduleJob } from "node-schedule";
import { getConfig } from "../utils/tools";
import { BaseTaskHandler } from "../scheduler/BaseTaskHandler";
import { APIStatusCheckHandler } from "../scheduler/APIStatusCheckHandler";
import { StopLossCountdownHandler } from "../scheduler/StopLossCountdownHandler";
import { sendMessage } from "../utils/messageService";
import { CheckResult, AlertingLevel } from "../utils/interface";

const logger = require("../utils/logger");

export class TaskManager {
  private readonly _configName: string;
  private readonly _taskName: string;
  private readonly _cron: string;
  private _handler: BaseTaskHandler;

  constructor(configName: string, taskName: string, cron: string) {
    this._configName = configName;
    this._taskName = taskName;
    this._cron = cron;
    this._handler = new BaseTaskHandler(undefined);
    this._registerHandler(taskName);
  }

  startTask() {
    scheduleJob(this._cron, this._callBack.bind(this));
  }

  private async _callBack() {
    const checkResult: CheckResult = await this._handler.check();
    if (
      !process.env.stop_alert_send &&
      checkResult.level != AlertingLevel.None
    ) {
      sendMessage(checkResult.level, checkResult.message);
    }
  }

  private _registerHandler(taskName: string) {
    const config = getConfig(this._configName);
    switch (taskName) {
      case "CheckStatsApi":
        this._handler = new APIStatusCheckHandler(config[taskName]);
        break;
      case "CheckPersonalApi":
        this._handler = new APIStatusCheckHandler(config[taskName]);
        break;
      case "StopLossCountdown":
        this._handler = new StopLossCountdownHandler(config[taskName]);
        break;
      default:
        logger.error(`Not found task handler for name:${taskName}`);
    }
  }
}
