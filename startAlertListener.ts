require("dotenv").config();

import { getConfig } from "./utils/tools";
import { SubscribeManager } from "./chainUtils/SubscribeManager";

export function startAlertListener(chain: string = "ethereum") {
  const chainName = chain.toLowerCase();
  if (chainName !== "ethereum")
    throw new Error(`Doesn't find subscribe config for chain : ${chainName}`);

  const listenerConfig = getConfig("EthereumSubscribeConfig");
  const contractsName = Object.keys(listenerConfig);
  for (let i = 0; i < contractsName.length; i += 1) {
    const contractName = contractsName[i];
    const subscribeManager = new SubscribeManager(
      chainName,
      contractName,
      listenerConfig[contractName]
    );
    subscribeManager.startSubscribe();
  }
}

if (require.main === module) {
  startAlertListener();
}
