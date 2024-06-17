const Router = require('express');
const controller = require('./controller');

const router = Router();

router.get(
    '/all',
    controller.getAll
);

router.get(
    '/search/:search',
    controller.search
);

module.exports = router;