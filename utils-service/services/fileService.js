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
    const maxRows = Math.max(...data.map(column => column.length));
    const csvRows = [];

    const headers = data.map(column => `"${column[0].toString().replace(/"/g, '""')}"`).join(',');
    csvRows.push(headers);

    for (let rowIndex = 1; rowIndex < maxRows; rowIndex++) {
      const csvRow = data.map(column => {
        if (column[rowIndex] !== undefined) {
          const cellValue = column[rowIndex].toString();
          if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
            return `"${cellValue.replace(/"/g, '""')}"`;
          }
          return cellValue;
        }
        return '';
      }).join(',');

      csvRows.push(csvRow);
    }

    const csvContent = csvRows.join('\n');
    return csvContent;
  }

}

module.exports = new FileService();