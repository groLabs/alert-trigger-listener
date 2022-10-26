export const rabbitmq_exchange_name = "inform";
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
    },
  },
};
