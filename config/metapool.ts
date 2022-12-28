export const rabbitmq_exchange_name = "develop.inform.topic";
export const strategies = {
  "0xDea436e15B40E7B707A7002A749f416dFE5B383F": {
    name: "DAI Primary",
    metaPool: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    metaPoolToken: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    rewardContract: "0xB900EF131301B307dB5eFcbed9DBb50A3e209B2e",
    tokenIndex: 0,
    metaPoolName: "frax",
  },
  "0x4d5b5376Cbcc001bb4F8930208828Ab87D121dA8": {
    name: "DAI Secondary",
    metaPool: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    metaPoolToken: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
    rewardContract: "0x308b48F037AAa75406426dACFACA864ebd88eDbA",
    tokenIndex: 0,
    metaPoolName: "tusd",
  },
  "0xD370998b2E7941151E7BB9f6e337A12F337D0682": {
    name: "USDC Primary",
    metaPool: "0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956",
    metaPoolToken: "0xD2967f45c4f384DEEa880F807Be904762a3DeA07",
    rewardContract: "0x7A7bBf95C44b144979360C3300B54A7D34b44985",
    tokenIndex: 1,
    metaPoolName: "gusd",
  },
  "0x8b335D3E266389Ae08A2F22b01D33813d40ED8Fd": {
    name: "USDC Secondary",
    metaPool: "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
    metaPoolToken: "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
    rewardContract: "0x02E2151D4F351881017ABdF2DD2b51150841d5B3",
    tokenIndex: 1,
    metaPoolName: "alusd",
  },
  "0xDE5a25415C637b52d59Ef980b29a5fDa8dC3C70B": {
    name: "USDT Primary",
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
  TUSD: {
    address: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
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
  GUSD: {
    address: "0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956",
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
  ALUSD: {
    address: "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
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
  OUSD: {
    address: "0x87650D7bbfC3A9F10587d7778206671719d9910D",
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
