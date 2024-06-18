import $api from './api';

export default class ModelService {

    static async ARIMA(p, d, q, forecast, data) {
        console.log(data);
        return $api.post('/arima', {
            p,
            d,
            q,
            steps: forecast,
            data
        })
    }

}