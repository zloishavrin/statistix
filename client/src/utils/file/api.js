import axios from 'axios';

export const URL = 'http://localhost:3001/api/file';

const $api = axios.create({
    baseURL: URL,
});

export default $api;