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
        name: "ARMA",
        description: "Построение ARMA-модели",
        path: "arma"
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
        name: "Визуализация",
        description: "Визуализация данных",
        path: "graphics"
    }
]