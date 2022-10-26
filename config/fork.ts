export const rabbitmq_exchange_name = "testing.inform.topic";
export const strategies = {
  "0x74Df809b1dfC099E8cdBc98f6a8D1F5c2C3f66f8": {
    name: "convexMim",
  },
  "0x10e38eE9dd4C549b61400Fc19347D00eD3edAfC4": {
    name: "convexLusd",
  },
  "0x00CAC06Dd0BB4103f8b62D280fE9BCEE8f26fD59": {
    name: "convexFrax",
  },
};
export const EndPoints = {
  ethereum: {
    fullRPCEndPoint: `https://u4ybf5gmfc.execute-api.eu-west-2.amazonaws.com`,
    fullWSEndPoint: `ws://ec2-13-40-62-97.eu-west-2.compute.amazonaws.com:9999`,
  },
  //   ethereum: {
  //     fullRPCEndPoint: "http://127.0.0.1:8545/",
  //     fullWSEndPoint: "http://127.0.0.1:8545/",
  //   },
};

export const EthereumSubscribeConfig = {
  GTranche: {
    address: "0x627b9A657eac8c3463AD17009a424dFE3FDbd0b1",
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
  GRouter: {
    address: "0x8E45C0936fa1a65bDaD3222bEFeC6a03C83372cE",
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
    address: "0x325c8Df4CFb5B068675AFF8f62aA668D1dEc3C4B",
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
};
