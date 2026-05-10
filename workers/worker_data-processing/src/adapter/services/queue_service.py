import asyncio
import aio_pika
import json

class QueueService:
  def __init__(self):
    self._connection = None
    self._channel = None
    self._exchange = None

  async def start(
    self,
    extension_name: str,
    user: str,
    password: str,
    handle_message: callable,
    max_retries: int = 5,
    retry_delay: int = 5,
  ):
    attempt = 0
    while attempt < max_retries:
      try:
        self._connection = await aio_pika.connect_robust(
          f"amqp://{user}:{password}@rabbitmq/"
        )

        self._channel = await self._connection.channel()
        await self._channel.set_qos(prefetch_count=10)

        self._exchange = await self._channel.declare_exchange(
          "tasks-exchange",
          aio_pika.ExchangeType.TOPIC,
          durable=True,
        )
        queue_name = f"{extension_name}-queue"
        queue = await self._channel.declare_queue(
          queue_name,
          durable=True,
        )

        routing_key = f"tasks.{extension_name}.#"
        await queue.bind(self._exchange, routing_key)

        await queue.consume(handle_message)
        await asyncio.Future()
      except Exception as error:
        attempt += 1
        print(f"[!] Connection failed ({attempt}/{max_retries}): {error}", flush=True)
        if attempt >= max_retries:
            raise
        await asyncio.sleep(retry_delay)

  async def publish_result(
    self,
    payload: dict,
  ):
    routing_key = "tasks.results"
    await self._publish_message(
      payload=payload,
      routing_key=routing_key,
    )

  async def publish_error(
    self,
    payload: dict,
  ):
    routing_key = "tasks.failed"
    await self._publish_message(
      payload=payload,
      routing_key=routing_key,
    )

  async def _publish_message(
    self,
    payload: dict,
    routing_key: str,
  ):
    message = aio_pika.Message(
      body=json.dumps(payload).encode(),
      content_type="application/json",
      delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
    )

    await self._exchange.publish(
      message,
      routing_key=routing_key,
    )

queue_service = QueueService()