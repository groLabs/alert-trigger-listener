export const rabbitmq_exchange_name = "develop.inform.topic";

export const strategies = {
  "0x60a6A86ad77EF672D93Db4408D65cf27Dd627050": {
    name: "convexFrax",
    metaPool: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    metaPoolToken: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    rewardContract: "0xB900EF131301B307dB5eFcbed9DBb50A3e209B2e",
    tokenIndex: 0,
    metaPoolName: "frax",
  },
  "0x4D81d0C2655D8D5FDee83DbB16E6b899ec276FAc": {
    name: "convexLusd",
    metaPool: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    metaPoolToken: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    rewardContract: "0x2ad92A7aE036a038ff02B96c88de868ddf3f8190",
    tokenIndex: 0,
    metaPoolName: "lusd",
  },
  "0x73703f0493C08bA592AB1e321BEaD695AC5b39E3": {
    name: "convexOusd",
    metaPool: "0x87650D7bbfC3A9F10587d7778206671719d9910D",
    metaPoolToken: "0x87650D7bbfC3A9F10587d7778206671719d9910D",
    rewardContract: "0x7D536a737C13561e0D2Decf1152a653B4e615158",
    tokenIndex: 0,
    metaPoolName: "ousd",
  },
  "0xa522b13feF6161C570FF765C986cb9992a89C786": {
    name: "convexTusd",
    metaPool: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    metaPoolToken: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    rewardContract: "0x308b48F037AAa75406426dACFACA864ebd88eDbA",
    tokenIndex: 0,
    metaPoolName: "tusd",
  },
};
export const EndPoints = {
  //   ethereum: {
  //     fullRPCEndPoint: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  //     fullWSEndPoint: `wss://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  //   },
  ethereum: {
    fullRPCEndPoint: `https://mainnet.infura.io/v3/2e66d8901729490aabfb4b97022decaa`,
    fullWSEndPoint: `wss://mainnet.infura.io/ws/v3/2e66d8901729490aabfb4b97022decaa`,
  },
};

export const EthereumSubscribeConfig = {
  GStrategyGuard: {
    address: "0xE09dE1b49118bB197b2Ea45D4d7054D48D1c3224",
    events: {
      LogStopLossEscalated: {
        signature: "event LogStopLossEscalated(address strategy)",
        alertFunction: "handleStopLossInitiatedMessage",
      },
    },
  },

  GRouter: {
    address: "0xd4139E090e43Ff77172d9dD8BA449d2A9683790d",
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

  GTranche: {
    address: "0x19A07afE97279cb6de1c9E73A13B7b0b63F7E67A",
    events: {
      LogNewDeposit: {
        signature:
          "event LogNewDeposit(address indexed sender, address indexed recipient, uint256 amount, uint256 index,bool indexed tranche, uint256 calcAmount)",
        alertFunction: "handleTrancheAssetChangeMessage",
      },
      LogNewWithdrawal: {
        signature:
          "event LogNewWithdrawal(address indexed sender, address indexed recipient, uint256 amount, uint256 index,bool indexed tranche, uint256 yieldTokenAmounts, uint256 calcAmount)",
        alertFunction: "handleTrancheAssetChangeMessage",
      },
    },
  },

  GVault: {
    address: "0x1402c1cAa002354fC2C4a4cD2b4045A5b9625EF3",
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
          "event LogStrategyHarvestReport(address indexed strategy, uint256 gain, uint256 loss,uint256 debtPaid, uint256 debtAdded,uint256 lockedProfit, uint256 lockedProfitBeforeLoss)",
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
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchangeUnderlying: {
        signature:
          "event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
    },
  },
  TUSD: {
    address: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    events: {
      RemoveLiquidity: {
        signature:
          "event RemoveLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchangeUnderlying: {
        signature:
          "event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
    },
  },
  GUSD: {
    address: "0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956",
    events: {
      RemoveLiquidity: {
        signature:
          "event RemoveLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchangeUnderlying: {
        signature:
          "event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
    },
  },
  BUSD: {
    address: "0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a",
    events: {
      RemoveLiquidity: {
        signature:
          "event RemoveLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchangeUnderlying: {
        signature:
          "event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
    },
  },
  OUSD: {
    address: "0x87650D7bbfC3A9F10587d7778206671719d9910D",
    events: {
      RemoveLiquidity: {
        signature:
          "event RemoveLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityOne: {
        signature:
          "event RemoveLiquidityOne(address indexed provider, uint256 tokenAmount, uint256 coinAmount,uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      RemoveLiquidityImbalance: {
        signature:
          "event RemoveLiquidityImbalance(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      AddLiquidity: {
        signature:
          "event AddLiquidity(address indexed provider, uint256[2] tokenAmounts, uint256[2] fees,uint256 invariant, uint256 tokenSupply)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchange: {
        signature:
          "event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
      },
      TokenExchangeUnderlying: {
        signature:
          "event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)",
        alertFunction: "checkG2MetaPoolTVL",
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
