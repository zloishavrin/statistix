from .services import EventService, storage_service
from .services import queue_service

event = EventService(
  storage=storage_service,
  handle_results=queue_service.publish_result,
  handle_error=queue_service.publish_error,
)