import $api from './api';

export default class ModelService {

    static async ARIMA(p, d, q, forecast, data) {
        return $api.post('/arima', {
            p,
            d,
            q,
            steps: forecast,
            data
        })
    }

    static async SARIMA(p, d, q, P, D, Q, s, forecast, data)  {
        return $api.post('/sarima', {
            p,
            d,
            q,
            P,
            D,
            Q,
            s,
            steps: forecast,
            data
        })
    }

}