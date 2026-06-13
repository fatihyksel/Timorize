const { getRabbitChannel, isRabbitEnabled, QUEUE_NAME } = require('../config/rabbitmq');

/**
 * Mevcut controller akışını bozmadan arka planda kuyruğa mesaj gönderir.
 * RABBITMQ_URL tanımlı değilse (ör. Vercel) sessizce atlanır.
 */
async function publishEvent(eventType, payload = {}) {
  if (!isRabbitEnabled()) return;

  try {
    const channel = await getRabbitChannel();
    if (!channel) return;

    const message = {
      eventType,
      payload,
      at: new Date().toISOString(),
    };

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  } catch (err) {
    console.error('[RabbitMQ] Mesaj gönderilemedi:', err.message);
  }
}

module.exports = {
  publishEvent,
};
