from starlette.middleware.base import BaseHTTPMiddleware
from src.core.config import config

class LanguageMiddleware(BaseHTTPMiddleware):
  SUPPORTED_LANGUAGES = {"ru", "en"}

  async def dispatch(self, request, call_next):
    language = request.headers.get("Accept-Language", config.LANGUAGE)
    locale = language.split(",")[0].split("-")[0].lower()

    if locale not in self.SUPPORTED_LANGUAGES:
      locale = config.LANGUAGE

    request.state.locale = locale

    response = await call_next(request)
    response.headers["Content-Language"] = locale

    return response