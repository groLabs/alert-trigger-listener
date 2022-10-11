export const EndPoints = {
  //   ethereum: {
  //     fullRPCEndPoint: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  //     fullWSEndPoint: `wss://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  //   },
  ethereum: {
    fullRPCEndPoint: "http://127.0.0.1:8545/",
    fullWSEndPoint: "http://127.0.0.1:8545/",
  },
};

export const EthereumSubscribeConfig = {
  GVault: {
    address: "0x06b3244b086cecC40F1e5A826f736Ded68068a0F",
    events: {
      Deposit: {
        signature:
          "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)",
        alertFunction: "checkSystemAssets",
      },
    },
  },
};
