require("dotenv").config();

import { getConfig } from "./utils/tools";
import { SubscribeManager } from "./chainUtils/SubscribeManager";
import { TaskManager } from "./chainUtils/TaskManager";

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

export async function startScheduler(configName: string) {
  const schedulerConfig = getConfig(configName);
  const taskNames = Object.keys(schedulerConfig);
  const taskManagers: any[] | PromiseLike<any[]> = [];
  taskNames.forEach(async (taskName) => {
    const { cron } = schedulerConfig[taskName];
    const taskManager = new TaskManager(configName, taskName, cron);

    console.log(`${configName} -- ${cron} --- ${taskName}`);
    await taskManager?.startTask();
    taskManagers.push(taskManager);
  });
  return taskManagers;
}

if (require.main === module) {
  startAlertListener();
  startScheduler("Scheduler");
}
