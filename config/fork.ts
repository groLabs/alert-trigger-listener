export const rabbitmq_exchange_name = "test.inform.topic";
export const strategies = {
  "0xBbc18b580256A82dC0F9A86152b8B22E7C1C8005": {
    name: "convexMim",
  },
  "0x24d41dbc3d60d0784f8a937c59FBDe51440D5140": {
    name: "convexLusd",
  },
  "0x313F922BE1649cEc058EC0f076664500c78bdc0b": {
    name: "convexFrax",
  },
};
export const EndPoints = {
  //   ethereum: {
  //     fullRPCEndPoint: `https://u4ybf5gmfc.execute-api.eu-west-2.amazonaws.com`,
  //     fullWSEndPoint: `ws://ec2-13-40-62-97.eu-west-2.compute.amazonaws.com:9999`,
  //   },
  ethereum: {
    fullRPCEndPoint: "http://127.0.0.1:8545/",
    fullWSEndPoint: "http://127.0.0.1:8545/",
  },
};

export const EthereumSubscribeConfig = {
  GVault: {
    address: "0x2e8880cAdC08E9B438c6052F5ce3869FBd6cE513",
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
