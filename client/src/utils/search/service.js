import $api from './api';

export default class SearchService {

    static async getAll() {
        return $api.get('/all');
    }

    static async search(searchString) {
        return $api.get(`/search/${searchString}`);
    }

    static async getAllCategories() {
        return $api.get('/allCategories');
    }

    static async getByCategory(categoryId) {
        return $api.get('/category/'+categoryId);
    }

    static async getBySearchAndCategory(searchString, categoryId) {
        return $api.get(`/search-and-category/${categoryId}/${searchString}`);
    }

}
