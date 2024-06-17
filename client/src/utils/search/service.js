import $api from './api';

export default class SearchService {

    static async getAll() {
        return $api.get('/all');
    }

    static async search(searchString) {
        return $api.get(`/search/${searchString}`);
    }

}
