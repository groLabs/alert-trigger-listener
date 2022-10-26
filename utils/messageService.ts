import {
  connect,
  AmqpConnectionManager,
  ChannelWrapper,
  Channel,
} from "amqp-connection-manager";
import { getConfig } from "./tools";
const logger = require("../utils/logger");

const exchangeName = getConfig("rabbitmq_exchange_name", false) || "amq.direct";
const server = process.env.rabbitmq_url || "localhost";
const user = process.env.rabbitmq_user || "guest";
const password = process.env.rabbitmq_password || "guest";
const connectionURL = `amqps://${user}:${password}@${server}`;
const discordQueue = "discord";
const pagerdutyQueue = "pagerduty";
let connManager: AmqpConnectionManager;
let channelWrapper: ChannelWrapper;

function getConnection(): AmqpConnectionManager {
  if (!connManager) {
    connManager = connect(connectionURL);
    logger.info("Create amqb connection manager.");
  }
  return connManager;
}

function getChannel(): ChannelWrapper {
  if (!channelWrapper) {
    const conn = getConnection();
    channelWrapper = conn.createChannel({
      json: false,
      setup: function (channel: Channel) {
        // check do the exchange and queue exist, if not, create them
        channel.assertExchange(exchangeName, "topic", {
          durable: true,
        });
        channel.assertQueue(discordQueue, { durable: true });
        channel.assertQueue(pagerdutyQueue, { durable: true });
        logger.info("Reconnect with rabbitHQ server.");
      },
    });
    logger.info("Create channel from rabbitmq connection.");
  }
  return channelWrapper;
}

export async function sendMessage(msgRouting: string, msg: string) {
  const channelWrapper = getChannel();
  await channelWrapper.publish(exchangeName, msgRouting, Buffer.from(msg));
  logger.info(
    `Send message to exchange[${exchangeName}] with routing[${msgRouting}] : ${msg}`
  );
}
