const Router = require('express');
const fileController = require('../controllers/fileController');

const fileRouter = Router();

fileRouter.post(
  '/form-excel',
  fileController.formExcel
);

fileRouter.post(
  '/form-csv',
  fileController.formCSV
);

module.exports = fileRouter;