export const rabbitmq_exchange_name = "product.inform.topic";

export const strategies = {
  "0xDea436e15B40E7B707A7002A749f416dFE5B383F": {
    name: "convexFrax",
    metaPool: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    metaPoolToken: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    rewardContract: "0xB900EF131301B307dB5eFcbed9DBb50A3e209B2e",
    tokenIndex: 0,
    metaPoolName: "frax",
  },
  "0x4d5b5376Cbcc001bb4F8930208828Ab87D121dA8": {
    name: "convexTusd",
    metaPool: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    metaPoolToken: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    rewardContract: "0x308b48F037AAa75406426dACFACA864ebd88eDbA",
    tokenIndex: 0,
    metaPoolName: "tusd",
  },
  "0xD370998b2E7941151E7BB9f6e337A12F337D0682": {
    name: "convexGusd",
    metaPool: "0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956",
    metaPoolToken: "0xD2967f45c4f384DEEa880F807Be904762a3DeA07",
    rewardContract: "0x7A7bBf95C44b144979360C3300B54A7D34b44985",
    tokenIndex: 1,
    metaPoolName: "gusd",
  },
  "0x8b335D3E266389Ae08A2F22b01D33813d40ED8Fd": {
    name: "convexGusdBusd",
    metaPool: "0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a",
    metaPoolToken: "0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a",
    rewardContract: "0xbD223812d360C9587921292D0644D18aDb6a2ad0",
    tokenIndex: 1,
    metaPoolName: "busd",
  },
  "0xDE5a25415C637b52d59Ef980b29a5fDa8dC3C70B": {
    name: "convexOusd",
    metaPool: "0x87650D7bbfC3A9F10587d7778206671719d9910D",
    metaPoolToken: "0x87650D7bbfC3A9F10587d7778206671719d9910D",
    rewardContract: "0x7D536a737C13561e0D2Decf1152a653B4e615158",
    tokenIndex: 2,
    metaPoolName: "ousd",
  },
};
export const EndPoints = {
  ethereum: {
    fullRPCEndPoint: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
    fullWSEndPoint: `wss://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  },
};

export const EthereumSubscribeConfig = {
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
