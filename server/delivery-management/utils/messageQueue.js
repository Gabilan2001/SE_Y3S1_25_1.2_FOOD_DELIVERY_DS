// deliveryManagement/utils/messageQueue.js
import amqp from 'amqplib';

let channel, connection;

export const connectQueue = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  const attemptConnection = async () => {
    try {
      console.log('Attempting to connect to RabbitMQ...');
      connection = await amqp.connect('amqp://quickeat:quickeat123@rabbitmq:5672');
      channel = await connection.createChannel();
      await channel.assertQueue('register_user_queue', { durable: true });
      console.log('Successfully connected to RabbitMQ');
      return true;
    } catch (err) {
      console.error(`Connection attempt ${retries + 1}/${maxRetries} failed:`, err.message);
      return false;
    }
  };

  while (retries < maxRetries) {
    const connected = await attemptConnection();
    if (connected) return;
    
    retries++;
    if (retries < maxRetries) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.error('Failed to connect to RabbitMQ after multiple attempts');
};

export const publishUserRegistration = async (data) => {
  if (!channel) {
    console.error('Cannot publish message: RabbitMQ connection not established');
    return;
  }
  
  try {
    channel.sendToQueue(
      'register_user_queue',
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );
    console.log('Message published successfully');
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};