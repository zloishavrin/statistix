from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Config:
  def _read_secret(secret_name: str, default: any):
    """
    Read values from _FILE env.
    """
    secret_path = os.getenv(f"{secret_name}_FILE")
    if secret_path and os.path.exists(secret_path):
      try:
        with open(secret_path, 'r') as secret_file:
          return secret_file.read().strip()
      except Exception as error:
        print(f"Warning: Could not read secret {secret_name}: {error}")
    else:
      return os.getenv(secret_name, default)

  DB_URI: str = _read_secret("DB_URI", "mongodb://root:password@mongodb:27017/statistix?authSource=admin")
  DB_NAME: str = os.getenv('DB_NAME', 'statistix')
  DB_MAX_RETRY_ATTEMPTS: int = 5
  DB_RETRY_DELAY: int = 5

  S3_URI: str = os.getenv('S3_ENDPOINT_URL', 'http://minio:9000')
  S3_ACCESS_KEY_ID: str = _read_secret("S3_ACCESS_KEY_ID", "admin")
  S3_SECRET_ACCESS_KEY: str = _read_secret("S3_SECRET_ACCESS_KEY", "admin_secret")
  S3_BUCKET = os.getenv('S3_BUCKET', 'statistix')
  S3_REGION: str = os.getenv('S3_REGION', 'ru-central-1')
  S3_MAX_RETRY_ATTEMPTS: int = 5
  S3_RETRY_DELAY: int = 10

  LANGUAGE = os.getenv('LANGUAGE', 'EN')

config = Config()
