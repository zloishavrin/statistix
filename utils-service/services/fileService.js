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

  async formCSV(data) {
    const csvRows = [];

    data.forEach((row) => {
      const csvRow = row.map((cellValue) => {
        if (typeof cellValue === 'string' && (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n'))) {
          return `"${cellValue.replace(/"/g, '""')}"`;
        }
        return cellValue;
      }).join(',');

      csvRows.push(csvRow);
    });

    const csvContent = csvRows.join('\n');

    return csvContent;
  }

}

module.exports = new FileService();