import boto3
from asyncio import sleep
from core.config import config

class StorageService:
  client = None
  bucket_name = config.S3_BUCKET

  def get_file(
    self,
    file_key: str
  ):
    return self.client.get_object(
      Bucket=self.bucket_name,
      Key=file_key,
    )

  async def connect(
    self,
    endpoint: str,
    access_key: str,
    secret_key: str,
    region: str = "ru-central-1",
    max_retries: int = 5,
    retry_delay: int = 5,
  ):
    for attempt in range(max_retries):
      try:
        self.client = boto3.client(
          "s3",
          endpoint_url=endpoint,
          aws_access_key_id=access_key,
          aws_secret_access_key=secret_key,
          region_name=region
        )

        self.client.list_buckets()

        return
      except Exception as error:
        if attempt < max_retries - 1:
          await sleep(retry_delay)
        else:
          raise error
        
  def get_self(self):
    return self

  def get_client(self):
    return self.client

  def close(self):
    self.client = None

storage = StorageService()