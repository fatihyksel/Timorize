const amqp = require('amqplib');

const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'timorize.events';

let connection = null;
let channel = null;
let connectPromise = null;

function isRabbitEnabled() {
  return Boolean(process.env.RABBITMQ_URL);
}

async function getRabbitChannel() {
  if (!isRabbitEnabled()) return null;

  if (channel) return channel;

  if (!connectPromise) {
    connectPromise = (async () => {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      return channel;
    })().catch((err) => {
      connectPromise = null;
      connection = null;
      channel = null;
      console.error('[RabbitMQ] Bağlantı kurulamadı:', err.message);
      return null;
    });
  }

  return connectPromise;
}

async function closeRabbit() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
  } catch (err) {
    console.error('[RabbitMQ] Kapatma hatası:', err.message);
  } finally {
    connection = null;
    channel = null;
    connectPromise = null;
  }
}
async function publishEvent(event) {
  const ch = await getRabbitChannel();
  if (!ch) {
    console.log('[RabbitMQ] RabbitMQ kapalı, mesaj gönderilemedi.');
    return;
  }
  
  const payload = JSON.stringify(event);
  ch.sendToQueue(QUEUE_NAME, Buffer.from(payload), { persistent: true });
  console.log(` [x] Mesaj gönderildi (Kuyruk: ${QUEUE_NAME}):`, payload);
}

// Ve module.exports kısmına bunu da ekle:
module.exports = {
  QUEUE_NAME,
  isRabbitEnabled,
  getRabbitChannel,
  closeRabbit,
  publishEvent, // Bunu unutma!
};