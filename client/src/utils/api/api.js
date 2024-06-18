import axios from 'axios';

export const URL = 'http://localhost:8000';

const $api = axios.create({
    baseURL: URL,
});

export default $api;