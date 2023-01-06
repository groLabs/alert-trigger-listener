export const balanceOf = {
  inputs: [
    {
      internalType: "address",
      name: "account",
      type: "address",
    },
  ],
  name: "balanceOf",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const factor = {
  inputs: [],
  name: "factor",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const realizedTotalAssets = {
  inputs: [],
  name: "realizedTotalAssets",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const totalSupply = {
  inputs: [],
  name: "totalSupply",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const getPricePerShare = {
  inputs: [],
  name: "getPricePerShare",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const lockedProfit = {
  inputs: [],
  name: "lockedProfit",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const calcWithdrawOneCoin = {
  name: "calc_withdraw_one_coin",
  outputs: [
    {
      type: "uint256",
      name: "",
    },
  ],
  inputs: [
    {
      type: "uint256",
      name: "_token_amount",
    },
    {
      type: "int128",
      name: "i",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const getVirtualPrice = {
  name: "get_virtual_price",
  outputs: [
    {
      type: "uint256",
      name: "",
    },
  ],
  inputs: [],
  stateMutability: "view",
  type: "function",
};

export const strategyCheck = {
  inputs: [
    {
      internalType: "address",
      name: "",
      type: "address",
    },
  ],
  name: "strategyCheck",
  outputs: [
    {
      internalType: "bool",
      name: "active",
      type: "bool",
    },
    {
      internalType: "uint64",
      name: "timeLimit",
      type: "uint64",
    },
    {
      internalType: "uint64",
      name: "primerTimestamp",
      type: "uint64",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const strategies = {
  inputs: [
    {
      internalType: "address",
      name: "_address",
      type: "address",
    },
  ],
  name: "strategies",
  outputs: [
    {
      components: [
        {
          internalType: "bool",
          name: "active",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "debtRatio",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "lastReport",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalDebt",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalGain",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalLoss",
          type: "uint256",
        },
      ],
      internalType: "struct StrategyParams",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};

export const estimatedTotalAssets = {
  inputs: [],
  name: "estimatedTotalAssets",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};
