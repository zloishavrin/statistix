const ExcelJS = require('exceljs');

class FileService {

  async formExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    data.forEach((columnData, colIndex) => {
      columnData.forEach((cellValue, rowIndex) => {
        worksheet.getCell(rowIndex + 1, colIndex + 1).value = cellValue;
      });
    });

    return workbook;
  }

}

module.exports = new FileService();