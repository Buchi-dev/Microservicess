const amqp = require('amqplib');
require('dotenv').config();

// Exchange name for the microservices communication
const EXCHANGE_NAME = 'ecommerce_events';
const EXCHANGE_TYPE = 'topic';

// Connection configuration
let connection = null;
let channel = null;

/**
 * Initialize connection to RabbitMQ
 * @returns {Promise<void>}
 */
const connect = async () => {
  try {
    // Use the RabbitMQ URL from environment variables
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    
    // Declare the exchange
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
    
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    // Retry connection after a delay
    setTimeout(connect, 5000);
  }
};

/**
 * Publish a message to the exchange with a routing key
 * @param {string} routingKey - The routing key (e.g., 'user.created')
 * @param {object} message - The message to publish
 * @returns {Promise<boolean>} - True if successful
 */
const publishMessage = async (routingKey, message) => {
  try {
    if (!channel) {
      await connect();
    }
    
    const success = channel.publish(
      EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`Message published to ${routingKey}:`, message);
    return success;
  } catch (error) {
    console.error(`Error publishing message to ${routingKey}:`, error);
    return false;
  }
};

/**
 * Subscribe to messages with a specific routing pattern
 * @param {string} routingPattern - The routing pattern to subscribe to (e.g., 'user.*')
 * @param {function} callback - The callback function to handle messages
 * @param {string} queueName - Optional queue name, will be auto-generated if not provided
 * @returns {Promise<string>} - The queue name
 */
const subscribeToMessages = async (routingPattern, callback, queueName = '') => {
  try {
    if (!channel) {
      await connect();
    }
    
    // Assert a queue - if no name is provided, a random one will be generated
    const queue = await channel.assertQueue(queueName, {
      exclusive: !queueName,
      durable: true
    });
    
    // Bind the queue to the exchange with the routing pattern
    await channel.bindQueue(queue.queue, EXCHANGE_NAME, routingPattern);
    
    // Consume messages from the queue
    await channel.consume(queue.queue, (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          callback(content, msg.fields.routingKey);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg, false, false); // Don't requeue on processing error
        }
      }
    });
    
    console.log(`Subscribed to ${routingPattern} on queue ${queue.queue}`);
    return queue.queue;
  } catch (error) {
    console.error(`Error subscribing to ${routingPattern}:`, error);
    throw error;
  }
};

/**
 * Close the RabbitMQ connection
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
};

// Event routing keys for the application
const EVENT_TYPES = {
  USER_CREATED: 'user.created',
  PRODUCT_UPDATED: 'product.updated',
  ORDER_CREATED: 'order.created',
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed'
};

module.exports = {
  connect,
  publishMessage,
  subscribeToMessages,
  closeConnection,
  EVENT_TYPES
}; 