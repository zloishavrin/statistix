import $api from './api';

export default class FileService {

  static async formExcel(data) {
      return $api.post('/form-excel', {
        data
      },
      {
        responseType: 'blob'
      });
  }

  static async formCSV(data) {
    return $api.post('/form-csv', {
      data
    },
    {
      responseType: 'blob'
    });
  }

}