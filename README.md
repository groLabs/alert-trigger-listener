# alert-trigger-listener

## Set up environment

### Node endpoint

The alert bot use websocket to monitor the change of contracts. Because the monitor will focus on tracking new events, full node is enough.

```
alchemy_key=xxxx
```

### Message queue config

The alert message will be send to message queue to inform related developer.
Need to specified the connection information

```
rabbitmq_url=/path/to/messagequeue
rabbitmq_user=username
rabbitmq_password=password
```

## Run Alert

1. remove old dist folder: `rm -rf dist`
2. compile ts files: `tsc`
3. run alert on current protocol : `yarn start:mainnet:alert`
4. run alert on g2internal protocol : `yarn start:g2internal:alert`
5. run alert on fork testing protocol: `yarn start:fork:alert`
