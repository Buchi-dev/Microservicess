const amqp = require('amqplib');

// Standard event types for inter-service communication
const EVENT_TYPES = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_PAID: 'order.paid',
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed'
};

let connection;
let channel;
let reconnectTimer;
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectAttempts = 0;

// Active subscriptions to reestablish on reconnect
const activeSubscriptions = new Map();

/**
 * Connects to RabbitMQ server
 */
async function connect() {
  try {
    // Clear any existing reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    const url = 'amqp://guest:guest@rabbitmq:5672';
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    
    // Reset reconnect attempts on successful connection
    reconnectAttempts = 0;
    
    console.log('Connected to RabbitMQ');
    
    // Reestablish all active subscriptions
    if (activeSubscriptions.size > 0) {
      console.log(`Reestablishing ${activeSubscriptions.size} subscriptions`);
      for (const [queueName, callback] of activeSubscriptions.entries()) {
        await subscribeToMessages(queueName, callback, false); // Don't re-register
      }
    }
    
    // Handle connection close
    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      channel = null;
      
      // Try to reconnect with backoff
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const backoffTime = Math.min(1000 * 2 ** reconnectAttempts, 30000);
        console.log(`Attempting to reconnect in ${backoffTime}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        
        reconnectTimer = setTimeout(() => {
          reconnectAttempts++;
          connect();
        }, backoffTime);
      } else {
        console.error('Max reconnection attempts reached. Giving up.');
      }
    });
    
    // Handle connection errors
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err.message);
      if (connection) {
        try {
          connection.close();
        } catch (e) {
          console.error('Error closing connection:', e.message);
        }
      }
    });
    
    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
    
    // Try to reconnect with backoff
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const backoffTime = Math.min(1000 * 2 ** reconnectAttempts, 30000);
      console.log(`Attempting to reconnect in ${backoffTime}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
      
      reconnectTimer = setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, backoffTime);
    } else {
      console.error('Max reconnection attempts reached. Giving up.');
    }
  }
}

/**
 * Create a queue if it doesn't exist
 */
async function createQueue(queueName) {
  if (!channel) {
    await reconnectIfNeeded();
  }
  
  await channel.assertQueue(queueName, { durable: true });
  return queueName;
}

/**
 * Publish a message to a queue
 */
async function publishToQueue(queueName, message) {
  if (!channel) {
    await reconnectIfNeeded();
  }
  
  // Ensure the queue exists
  await createQueue(queueName);
  
  return channel.sendToQueue(
    queueName, 
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
}

/**
 * Publish a message with a specific event type
 */
async function publishMessage(eventType, data) {
  const message = {
    eventType,
    data,
    timestamp: new Date().toISOString()
  };
  
  return publishToQueue(eventType, message);
}

/**
 * Subscribe to messages from a specific event queue
 */
async function subscribeToMessages(eventType, callback, registerSubscription = true) {
  if (registerSubscription) {
    // Store the subscription for reestablishment on reconnect
    activeSubscriptions.set(eventType, callback);
  }
  
  return consumeFromQueue(eventType, (message) => {
    console.log(`Received message from ${eventType}:`, message);
    callback(message.data || message);
  });
}

/**
 * Consume messages from a queue
 */
async function consumeFromQueue(queueName, callback) {
  if (!channel) {
    await reconnectIfNeeded();
  }
  
  // Ensure the queue exists
  await createQueue(queueName);
  
  return channel.consume(
    queueName,
    (message) => {
      if (message) {
        try {
          const content = JSON.parse(message.content.toString());
          callback(content, message);
          channel.ack(message);
        } catch (error) {
          console.error(`Error processing message from ${queueName}:`, error);
          // Still acknowledge the message to prevent queue buildup
          channel.ack(message);
        }
      }
    },
    { noAck: false }
  );
}

/**
 * Helper to reconnect if needed
 */
async function reconnectIfNeeded() {
  if (!connection || !channel) {
    console.log('No active connection, reconnecting...');
    await connect();
    
    if (!channel) {
      throw new Error('Failed to establish RabbitMQ connection');
    }
  }
}

/**
 * Close the connection
 */
async function close() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  
  if (channel) {
    try {
      await channel.close();
    } catch (error) {
      console.error('Error closing channel:', error.message);
    }
    channel = null;
  }
  
  if (connection) {
    try {
      await connection.close();
    } catch (error) {
      console.error('Error closing connection:', error.message);
    }
    connection = null;
  }
  
  // Clear active subscriptions
  activeSubscriptions.clear();
  
  console.log('RabbitMQ connection closed gracefully');
}

module.exports = {
  EVENT_TYPES,
  connect,
  createQueue,
  publishToQueue,
  publishMessage,
  subscribeToMessages,
  consumeFromQueue,
  close
}; 