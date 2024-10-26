const Router = require('express');
const controller = require('./controller');

const router = Router();

router.get(
    '/all',
    controller.getAll
);

router.get(
    '/allCategories',
    controller.getAllCategories
);

router.get(
    '/search/:search',
    controller.search
);

router.get(
    '/search',
    controller.getAll
);

router.get(
    '/category/:category',
    controller.getByCategory
);

router.get(
    '/search-and-category/:category/:search',
    controller.searchAndCategory
);

module.exports = router;