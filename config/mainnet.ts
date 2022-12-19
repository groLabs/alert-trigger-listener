export const rabbitmq_exchange_name = "develop.inform.topic";
export const strategies = {
  "0xd1B9aF64Ed5CdcaEb58955d82FB384b3e558Df7B": {
    name: "convexFrax",
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
};
