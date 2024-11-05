const ModeModel = require('./models/mode');
const CategoryModel = require('./models/category');

const init = async () => {
    const modes = await ModeModel.find();
    const categories = await CategoryModel.find();

    if(!categories || categories.length < 1) {
        for(let i = 0; i < initCategoryArray.length; i++) {
            await CategoryModel.create(initCategoryArray[i]);
        }
    }

    if(!modes || modes.length < 1) {
        for(let i = 0; i < initModeArray.length; i++) {
            await ModeModel.create(initModeArray[i]);
        }
    }
}

module.exports = init;

const initCategoryArray = [
    {
        name: "Модели прогнозирования временных рядов"
    },
    {
        name: "Тесты для определения стационарности временных рядов"
    },
    {
        name: "Другое"
    }
]

const initModeArray = [
    {
        name: "AR",
        description: "Построение AR-модели",
        path: "ar"
    },
    {
        name: "MA",
        description: "Построение MA-модели",
        path: "ma"
    },
    {
        name: "ESM",
        description: "Построение ESM-модели",
        path: "esm"
    },
    {
        name: "VAR",
        description: "Построение VAR-модели",
        path: "var"
    },
    {
        name: "GARCH",
        description: "Построение GARCH-модели",
        path: "garch"
    },
    {
        name: "ARIMA",
        description: "Построение ARIMA-модели",
        path: "arima"
    },
    {
        name: "SARIMA",
        description:  "Построение SARIMA-модели",
        path: "sarima"
    },
    {
        name: "SARIMAX",
        description: "Построение SARIMAX-модели",
        path: "sarimax"
    },
    {
        name: "Визуализация",
        description: "Визуализация данных",
        path: "graphics"
    }
]