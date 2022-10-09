const _ = require("lodash");
import { getConfig } from "../utils/tools";

export class DefaultConnectOptions {
  private static _instance: DefaultConnectOptions;
  private _ethWSEndPoint: string;
  private _ethRPCEndPoint: string;
  private _options: any;

  private constructor() {
    this._options = {
      timeout: 30000,
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000,
      },
      reconnect: {
        auto: true,
        delay: 10000,
        maxAttempts: 10,
        onTimeout: false,
      },
      healthCheckInterval: 3600000 * 6,
    };
    this._ethWSEndPoint = getConfig("EndPoints.ethereum.fullWSEndPoint");
    this._ethRPCEndPoint = getConfig("EndPoints.ethereum.fullRPCEndPoint");
  }

  public static getInstance() {
    if (!DefaultConnectOptions._instance) {
      DefaultConnectOptions._instance = new DefaultConnectOptions();
    }
    return DefaultConnectOptions._instance;
  }

  public get options() {
    return _.cloneDeep(this._options);
  }

  public get ethWSEndPoint() {
    return this._ethWSEndPoint;
  }

  public get ethRPCEndPoint() {
    return this._ethRPCEndPoint;
  }
}
