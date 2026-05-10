from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine
from asyncio import sleep

class MongoDB:
  client: AsyncIOMotorClient | None = None
  engine: AIOEngine | None = None

  async def connect(
    self,
    uri: str,
    db_name: str,
    max_retries: int = 5,
    retry_delay: int = 5
  ):
    for attempt in range(max_retries):
      try:
        if self.client:
          self.client.close()

        self.client = AsyncIOMotorClient(
          uri,
          serverSelectionTimeoutMS=1500,
          connectTimeoutMS=3000,
        )
        self.engine = AIOEngine(
          client=self.client,
          database=db_name,
        )
        await self.client.admin.command("ping")
        return
      except Exception as error:
        if attempt < max_retries - 1:
          await sleep(retry_delay)
        else:
          raise error
  
  def get_engine(self):
    return self.engine

  async def close(self):
    self.engine = None
    if self.client:
      self.client.close()
      self.client = None

mongodb = MongoDB()