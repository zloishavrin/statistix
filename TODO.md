# TODO-Лист

## Backend

- [ ] Добавить ограничения на некоторые параметры (нереально обрабатывать запросы к моделям с трехзначными параметрами)
- [ ] TimeSeriesModel-роутер
    - [x] Переименовать ARIMA-роутер в TimeSeriesModel-роутер
    - [x] AR-модель
    - [x] MA-модель
    - [x] ARMA-модель
    - [ ] ESM-модель
    - [ ] VAR-модель
    - [ ] GARCH-модель
    - [ ] Prophet-модель
    - [ ] Оценки
        - [x] Построение прогноза
        - [x] MSE
        - [x] MAE
        - [ ] MAPE
        - [ ] WAPE
        - [ ] RMSE
        - [ ] Диагностика остатков
            - [ ] Тест Льюнга-Бокса
            - [ ] Тест Шапиро-Уилка
- [ ] Роутер линейной регресии
- [ ] Роутер TimeSeriesTests
    - [ ] Тест Дики-Фуллера
    - [ ] Тест Филипса — Перрона
    - [ ] Тест Лейбурна
    - [ ] Тест Шмидта — Филлипса
    - [ ] Тест Квятковского — Филлипса — Шмидта — Шина
    - [ ] Тест DF — GLS
    - [ ] Тест Кохрейн
- [ ] Роутер TimeSeriesMethods
    - [ ] Метод Бокса-Кокса
        - [ ] Преобразование данные
        - [ ] Обратное преобразование данных
        - [ ] Автоматический подбор лямбды
- [ ] Fixes:
    - [x] Необходимо добавить в модели параметр запроса (граница обучения) - до этого значения от нулевого будут обучаться модели, а после него будет строиться прогноз (а не как сейчас от последнего элемента до последнего элемента + steps) - это будет кроссвалидация
    - [x] Необходимо переписать уравнения в LaTeX формат
- [ ] Utils:
    - [x] Добавить категории
    - [x] Поиск по категории
    - [x] Добавить эндпоинт с генерацией эксель по массиву массивов

## FRONTEND

- [ ] Главная страница
    - [x] Шапка главной страницы
    - [x] Поиск по главной странице
    - [ ] Полный адаптив главной страницы
    - [x] Поиск по категориям
- [ ] Страница визулизации данных
- [ ] Переиспользуемые компоненты
    - [x] Таблица из EXCEL-файла
        - [x] Построение таблицы
        - [x] Удаление таблицы
    - [x] Построение графика
    - [ ] Форма
        - [x] Отправка формы
        - [ ] Обработка ошибок
    - [x] Инпуты
    - [x] Всплывающие подсказки
    - [x] Лоадеры
    - [ ] Результаты
        - [x] Скачать график
        - [x] Скачать результаты прогноза
        - [x] Математическое отображение уравнения
- [ ] SSR
    - [ ] Миграция на NextJS
- [ ] Анимации
    - [x] Анимация главной страницы
    - [x] Анимация перехода между страницами
    - [x] Анимация для DragAndDrop
    - [x] Анимация для графиков
    - [x] Анимация ScrollToTop при переходе между страницами