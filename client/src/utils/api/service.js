import $api from './api';

export default class ModelService {

    static async AR(p, forecast, data) {
        return $api.post('/tsm/ar', {
            p,
            steps: forecast,
            data
        })
    }

    static async MA(q, forecast, data) {
        return $api.post('/tsm/ma', {
            q,
            steps: forecast,
            data
        })
    }

    static async ARMA(p, q, forecast, data) {
        return $api.post('/tsm/arma', {
            p, 
            q, 
            steps: forecast,
            data
        })
    }

    static async ARIMA(p, d, q, forecast, data) {
        return $api.post('/tsm/arima', {
            p,
            d,
            q,
            steps: forecast,
            data
        })
    }

    static async SARIMA(p, d, q, P, D, Q, s, forecast, data)  {
        return $api.post('/tsm/sarima', {
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