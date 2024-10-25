const ModeModel = require('./model');

const init = async () => {
    const modes = await ModeModel.find();
    if(!modes || modes.length < 1) {
        for(let i = 0; i < initArray.length; i++) {
            await ModeModel.create(initArray[i]);
        }
    }
}

module.exports = init;

const initArray = [
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
    }
]