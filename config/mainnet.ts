export const EndPoints = {
  ethereum: {
    fullRPCEndPoint: `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
    fullWSEndPoint: `wss://eth-mainnet.alchemyapi.io/v2/${process.env.alchemy_key}`,
  },
};

export const EthereumSubscribeConfig = {
  GVault: {
    handler: "handleDepositHandlerEvent",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    events: {
      Transfer: {
        topic:
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        alertFunction: "checkSystemAssets",
      },
      Approval: {
        topic:
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        alertFunction: "checkSystemAssets",
      },
    },
  },
};
