import asyncio
from .services import storage_service, queue_service
from .event import event

class Adapter:
  def __init__(
    self,
    extension_name: str,
  ):
    self.extension_name = extension_name

  async def connect(
    self,
    s3_uri: str = "http://minio:9000",
    s3_access_key_id: str = "admin",
    s3_secret_access_key: str = "admin_secret",
    s3_bucket: str = "statistix",
    s3_region: str = "ru-central-1",
    s3_max_retry_attempts: int = 5,
    s3_retry_delay: int = 10,
    rabbit_user: str = "user",
    rabbit_password: str = "admin_secret",
    rabbit_max_retries: int = 5,
    rabbit_retry_delay: int = 10,
    default_language: str = "EN",
  ) -> bool:
    await storage_service.connect(
      endpoint=s3_uri,
      access_key=s3_access_key_id,
      secret_key=s3_secret_access_key,
      bucket_name=s3_bucket,
      region=s3_region,
      max_retries=s3_max_retry_attempts,
      retry_delay=s3_retry_delay,
    )

    asyncio.create_task(
      queue_service.start(
        extension_name=self.extension_name,
        user=rabbit_user,
        password=rabbit_password,
        max_retries=rabbit_max_retries,
        retry_delay=rabbit_retry_delay,
        handle_message=event.handle_queue_message,
      )
    )

    return event
