import { getConfig } from "../utils/tools";

export interface StrategyInfo {
  name: string;
  metaPoolToken: string;
  rewardContract: string;
}

export class StrategyConfig {
  private static _strategyConfig: StrategyConfig;
  private strategiesInfo: { [x: string]: StrategyInfo };
  private strategyiesMetapool: { [x: string]: string };

  private constructor() {
    this.strategiesInfo = {};
    this.strategyiesMetapool = {};
    const config = getConfig("strategies");
    const strateies = Object.keys(config);
    strateies.forEach((strategy) => {
      const strategyInfo = config[strategy];
      const { name, metaPool, metaPoolToken, rewardContract } = strategyInfo;
      this.strategyiesMetapool[metaPool.toLowerCase()] = strategy;
      this.strategiesInfo[strategy.toLowerCase()] = {
        name,
        metaPoolToken,
        rewardContract,
      };
    });
  }

  public static getStrategyConfig(): StrategyConfig {
    if (StrategyConfig._strategyConfig) return StrategyConfig._strategyConfig;

    StrategyConfig._strategyConfig = new StrategyConfig();
    return StrategyConfig._strategyConfig;
  }

  public getStrategyName(strategyAddr: string): string {
    strategyAddr = strategyAddr.toLowerCase();
    return this.strategiesInfo[strategyAddr].name;
  }

  public getStrategyMetaPoolToken(strategyAddr: string): string {
    strategyAddr = strategyAddr.toLowerCase();
    return this.strategiesInfo[strategyAddr].metaPoolToken;
  }

  public getStrategyRewardContract(strategyAddr: string): string {
    strategyAddr = strategyAddr.toLowerCase();
    return this.strategiesInfo[strategyAddr].rewardContract;
  }

  public getStrategyByMetapool(metapool: string): string {
    metapool = metapool.toLowerCase();
    return this.strategyiesMetapool[metapool];
  }
}
