const Web3WsProvider = require("web3-providers-ws");
const { errors: Web3Error } = require("web3-core-helpers");
const logger = require("../logger");
export class WSProvider {
  private _connectionOptions: any;
  private _wsEndPoint: string;
  protected _providerInstance: any;

  constructor(wsEndPoint: string, connOptions: any) {
    this._connectionOptions = connOptions;
    this._wsEndPoint = wsEndPoint;
    this.updateProviderInstance();
  }

  toString() {
    return `wsEndPoist: ${
      this._wsEndPoint
    }, connectionOptions: ${JSON.stringify(this._connectionOptions)}`;
  }

  get provider() {
    return this._providerInstance;
  }

  get wsEndPoint() {
    return this._wsEndPoint;
  }

  private updateProviderInstance() {
    this._providerInstance = new Web3WsProvider(
      this._wsEndPoint,
      this._connectionOptions
    );
    this.useExponentialBackoffReconnect();
    this.startHealthCheckTimer();
  }

  private useExponentialBackoffReconnect() {
    this._providerInstance.reconnect = function () {
      logger.info(
        `Start to reconnect WebSocket ${this.url} ${this.reconnectOptions.delay}`
      );
      var _this = this;
      this.reconnecting = true;

      if (this.responseQueue.size > 0) {
        this.responseQueue.forEach(function (request: any, key: any) {
          request.callback(Web3Error.PendingRequestsOnReconnectingError());
          _this.responseQueue.delete(key);
        });
      }

      if (
        !this.reconnectOptions.maxAttempts ||
        this.reconnectAttempts < this.reconnectOptions.maxAttempts
      ) {
        setTimeout(function () {
          _this.reconnectAttempts++;
          logger.info(`WebSocket connect attempts ${_this.reconnectAttempts}`);
          _this._removeSocketListeners();
          _this.emit(_this.RECONNECT, _this.reconnectAttempts);
          _this.connect();
        }, this.reconnectOptions.delay * Math.pow(2, _this.reconnectAttempts));

        return;
      }

      this.emit(this.ERROR, Web3Error.MaxAttemptsReachedOnReconnectingError());
      this.reconnecting = false;

      if (this.requestQueue.size > 0) {
        this.requestQueue.forEach(function (request: any, key: any) {
          request.callback(Web3Error.MaxAttemptsReachedOnReconnectingError());
          _this.requestQueue.delete(key);
        });
      }
    };
  }

  private startHealthCheckTimer() {
    var _provider = this._providerInstance;
    let _this = this;
    let wsHealthCheckTimer = setTimeout(function run() {
      wsHealthCheckTimer = setTimeout(
        run,
        _this._connectionOptions.healthCheckInterval
      );
      // skip if provider is connected or connecting
      if (_provider.connected || _provider.reconnecting) {
        logger.info(
          `WebSocket status check ${_this._wsEndPoint} connected: ${_provider.connected} reconnecting: ${_provider.reconnecting}`
        );
        return;
      }

      // reset the reconnect attempts count to prepare the reconnect
      if (
        _provider.reconnectAttempts >= _provider.reconnectOptions.maxAttempts
      ) {
        logger.info(
          `Reset reconnectAttempts before retry: ${_this._wsEndPoint} ${_provider.reconnectAttempts}`
        );
        _provider.reconnectAttempts = 0;
      }
      _provider.reconnect();
    }, _this._connectionOptions.healthCheckInterval);
  }
}
