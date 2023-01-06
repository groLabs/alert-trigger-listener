export const rabbitmq_exchange_name = "g2internal.inform.topic";

export const strategies = {
  "0xd1B9aF64Ed5CdcaEb58955d82FB384b3e558Df7B": {
    name: "convexFrax",
    metaPool: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    metaPoolToken: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    rewardContract: "0xB900EF131301B307dB5eFcbed9DBb50A3e209B2e",
    tokenIndex: 0,
    metaPoolName: "frax",
  },
};

export const EndPoints = {
  ethereum: {
    fullRPCEndPoint: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
    fullWSEndPoint: `wss://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  },
};

export const EthereumSubscribeConfig = {
  GStrategyGuard: {
    address: "0x117B2e090Cfe19cB6A246f690e58C54cBEB6b7b3",
    events: {
      LogStopLossEscalated: {
        signature: "event LogStopLossEscalated(address strategy)",
        alertFunction: "handleStopLossInitiatedMessage",
      },
    },
  },
  GRouter: {
    address: "0xb732473B9b1E56F8d1E68bC3fd8bb65E9A338e03",
    events: {
      LogDeposit: {
        signature:
          "event LogDeposit(address indexed sender, uint256 tokenAmount, uint256 tokenIndex,bool tranche, uint256 trancheAmount, uint256 calcAmount)",
        alertFunction: "handleGRouterTradeMessage",
      },
      LogLegacyDeposit: {
        signature:
          "event LogLegacyDeposit(address indexed sender, uint256[3] tokenAmounts, bool tranche, uint256 trancheAmount, uint256 calcAmount)",
        alertFunction: "handleGRouterTradeMessage",
      },
      LogWithdrawal: {
        signature:
          "event LogWithdrawal(address indexed sender, uint256 trancheAmount, uint256 tokenIndex, bool tranche, uint256 tokenAmount)",
        alertFunction: "handleGRouterTradeMessage",
      },
    },
  },
  GVault: {
    address: "0xAe013D9bfa88f54A825831f969CB44ee020872d8",
    events: {
      Deposit: {
        signature:
          "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)",
        alertFunction: "checkGVaultSystemAssets",
      },
      Withdraw: {
        signature:
          "event Withdraw(address indexed caller, address indexed receiver, address indexed owner,uint256 assets, uint256 shares)",
        alertFunction: "checkGVaultSystemAssets",
      },
      LogStrategyHarvestReport: {
        signature:
          "event LogStrategyHarvestReport(address indexed strategy, uint256 gain, uint256 loss,uint256 debtPaid, uint256 debtAdded,uint256 lockedProfit)",
        alertFunction: "checkGVaultHarvestEvent",
      },
    },
  },
  FRAX: {
    address: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    events: {
      RemoveLiquidity: {
        signature:
          "event RemoveLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 tokenSupply)",
        alertFunction: "checkMetaPoolTVL",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkMetaPoolTVL",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkMetaPoolTVL",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkMetaPoolTVL",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkMetaPoolTVL",
      },
      TokenExchangeUnderlying: {
        signature:
          "event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkMetaPoolTVL",
      },
    },
  },
  Curve3Pool: {
    address: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
    events: {
      RemoveLiquidity: {
        signature:
          "event RemoveLiquidity(address indexed provider, uint256[3] tokenAmounts, uint256[3] fees,uint256 tokenSupply)",
        alertFunction: "checkBaseSlippage",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkBaseSlippage",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[3] tokenAmounts, uint256[3] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkBaseSlippage",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[3] tokenAmounts, uint256[3] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkBaseSlippage",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkBaseSlippage",
      },
    },
  },
};

export const Scheduler = {
  CheckStatsApi: {
    cron: "00 */30 * * * *",
    url: "https://j8ibm6u3ca.execute-api.eu-west-2.amazonaws.com/subgraph/gro_stats_mc?network=mainnet&subgraph=g2_internal",
    alertingMessage: "[WARN] E2 - Get gro stats failed",
    criticalMessage: "[CRIT] E2 - Get gro stats failed",
  },
  CheckPersonalApi: {
    cron: "20 */30 * * * *",
    url: "https://j8ibm6u3ca.execute-api.eu-west-2.amazonaws.com/subgraph/gro_personal_position_mc?address=0x60ff7dcb4a9c1a89b18fa2d1bb9444143bbea9bd&subgraph=g2_internal",
    alertingMessage: "[WARN] E1 - Get personal stats failed",
    criticalMessage: "[CRIT] E1 - Get personal stats failed",
  },
  StopLossCountdown: {
    address: "0x117B2e090Cfe19cB6A246f690e58C54cBEB6b7b3",
    cron: "30 */60 * * * *",
    strategies: ["0xd1B9aF64Ed5CdcaEb58955d82FB384b3e558Df7B"],
  },
};
