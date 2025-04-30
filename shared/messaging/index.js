const amqp = require('amqplib');

let connection;
let channel;

/**
 * Connects to RabbitMQ server
 */
async function connect() {
  try {
    const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    
    console.log('Connected to RabbitMQ');
    
    // Handle connection close
    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      // Try to reconnect after 5 seconds
      setTimeout(connect, 5000);
    });
    
    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
    // Try to reconnect after 5 seconds
    setTimeout(connect, 5000);
  }
}

/**
 * Create a queue if it doesn't exist
 */
async function createQueue(queueName) {
  if (!channel) throw new Error('Channel not initialized');
  await channel.assertQueue(queueName, { durable: true });
  return queueName;
}

/**
 * Publish a message to a queue
 */
async function publishToQueue(queueName, message) {
  if (!channel) throw new Error('Channel not initialized');
  
  // Ensure the queue exists
  await createQueue(queueName);
  
  return channel.sendToQueue(
    queueName, 
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
}

/**
 * Consume messages from a queue
 */
async function consumeFromQueue(queueName, callback) {
  if (!channel) throw new Error('Channel not initialized');
  
  // Ensure the queue exists
  await createQueue(queueName);
  
  return channel.consume(
    queueName,
    (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        callback(content, message);
        channel.ack(message);
      }
    },
    { noAck: false }
  );
}

/**
 * Close the connection
 */
async function close() {
  if (channel) await channel.close();
  if (connection) await connection.close();
}

module.exports = {
  connect,
  createQueue,
  publishToQueue,
  consumeFromQueue,
  close
}; 