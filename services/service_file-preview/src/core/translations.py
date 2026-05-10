from .config import config

def t(locale: str, key: str) -> str:
  return translations.get(locale, translations[config.LANGUAGE.lower()]).get(key, key)

translations = {
  "en": {
    "not_found": "Not found",
    "unsupported_file_type": "Unsupported file type",
    "forbidden": "Access denied",
  },
  "ru": {
    "not_found": "Не найдено",
    "unsupported_file_type": "Неподдерживаемый тип файла",
    "forbidden": "Доступ запрещён",
  },
}