const ApiError = require('../exception');
const fileService = require('../services/fileService');

class FileController {

  async formExcel(req, res, next) {
    try {
      const data = req.body;

      if (!Array.isArray(data) || !data.every(Array.isArray)) {
        next(new ApiError(400, 'Неправильный запрос: тело запроса должно быть массивом массивов'));
      }

      const workbook = await fileService.formExcel(data);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
      
      await workbook.xlsx.write(res);
      res.end();
    }
    catch(error) {
      next(error);
    }
  }

  async formCSV(req, res, next) {
    try {
      const data = req.body;
      console.log(data);
      if (!Array.isArray(data) || !data.every(Array.isArray)) {
        next(new ApiError(400, 'Неправильный запрос: тело запроса должно быть массивом массивов'));
      }

      const csvContent = await fileService.formCSV(data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
      
      res.send(csvContent);
    }
    catch(error) {
      next(error);
    }
  }

}

module.exports = new FileController();