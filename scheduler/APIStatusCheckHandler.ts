import { CheckResult, AlertingLevel } from "../utils/interface";
import { BaseTaskHandler } from "./BaseTaskHandler";
import axios from "axios";

export class APIStatusCheckHandler extends BaseTaskHandler {
  private _failedChecks: Array<number>;
  private _timeWindow: number = 5 * 60 * 1000; // 5 mins
  private _threshold: number = 5;
  private _alertingMessage: string;
  private _criticalMessage: string;

  constructor(config: any) {
    super(config);
    this._failedChecks = [];
    this._alertingMessage = `${this._config.alertingMessage} at ${this._config.url}`;
    this._criticalMessage = `${this._config.criticalMessage} 5 times at ${this._config.url}`;
  }

  async check(): Promise<CheckResult> {
    const url = this._config.url;
    try {
      const response = await axios.get(url);
      if (response.status == 200) {
        const checkResult: CheckResult = {
          level: AlertingLevel.None,
          message: "Server is up",
          timestamp: Date.now(),
        };
        return checkResult;
      }
    } catch (error) {
      const checkResult = this.handleFailedResult();
      return checkResult;
    }
    const checkResult: CheckResult = {
      level: AlertingLevel.None,
      message: "None",
      timestamp: Date.now(),
    };
    return checkResult;
  }

  private handleFailedResult(): CheckResult {
    const currentTimestamp = Date.now();
    this._failedChecks.push(currentTimestamp);
    this._clearExpiredError(currentTimestamp);
    const errorLen = this._failedChecks.length;
    let checkResult: CheckResult = {
      level: AlertingLevel.Warning,
      message: `${this._alertingMessage}`,
      timestamp: Date.now(),
    };
    if (errorLen >= this._threshold) {
      checkResult = {
        level: AlertingLevel.Critical,
        message: `${this._criticalMessage}`,
        timestamp: Date.now(),
      };
      this._failedChecks = [];
    }
    return checkResult;
  }
  private _clearExpiredError(currentTimestamp: number) {
    while (this._failedChecks.length) {
      if (currentTimestamp - this._failedChecks[0] > this._timeWindow) {
        this._failedChecks.shift();
      } else {
        break;
      }
    }
  }
}
