# Shared Modules

This directory contains shared code that is used across all microservices.

## Available Modules

### Messaging Module

Located in: `messaging/index.js`

Provides RabbitMQ messaging functionality for all microservices:

- `connect()` - Connect to RabbitMQ
- `createQueue(queueName)` - Create a new queue
- `publishToQueue(queueName, message)` - Publish a message to a queue
- `consumeFromQueue(queueName, callback)` - Consume messages from a queue
- `close()` - Close the connection

## Usage Example

```javascript
const { connect, publishToQueue, consumeFromQueue } = require('../shared/messaging');

// Connect to RabbitMQ
await connect();

// Publish a message
await publishToQueue('order-created', { orderId: '123', userId: '456' });

// Consume messages
await consumeFromQueue('order-created', (message) => {
  console.log('Received message:', message);
  // Process the message...
});
```

## Development

To add a new shared module:

1. Create a new directory in `shared/` with an appropriate name
2. Create an `index.js` file that exports the module's functionality
3. Update the `package.json` with any new dependencies 