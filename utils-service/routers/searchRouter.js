const Router = require('express');
const searchController = require('../controllers/searchController');

const searchRouter = Router();

searchRouter.get(
    '/all',
    searchController.getAll
);

searchRouter.get(
    '/allCategories',
    searchController.getAllCategories
);

searchRouter.get(
    '/search/:search',
    searchController.search
);

searchRouter.get(
    '/search',
    searchController.getAll
);

searchRouter.get(
    '/category/:category',
    searchController.getByCategory
);

searchRouter.get(
    '/search-and-category/:category/:search',
    searchController.searchAndCategory
);

module.exports = searchRouter;