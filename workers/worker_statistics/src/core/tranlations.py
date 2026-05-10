from .config import config

def t(locale: str, key: str) -> str:
  return translations.get(locale, translations[config.LANGUAGE.lower()]).get(key, key)

translations = {
  "en": {
    "not_found_series": "Failed to extract a data series",
    "series_is_only_positive": "All values of the data series must be positive",
    "invalid_data": "Invalid data",
    "unnamed": "Unnamed",
    "need_2_number_series": "Need minimum 2 number series",
  },
  "ru": {
    "not_found_series": "Не удалось извлечь ряд данных",
    "series_is_only_positive": "Все значения ряда данных должны быть положительными",
    "invalid_data": "Некорректные данные",
    "unnamed": "Безымянный",
    "need_2_number_series": "Нужно минимум 2 числовых ряда данных",
  },
}