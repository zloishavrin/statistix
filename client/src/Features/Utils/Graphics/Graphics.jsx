import Input from "../../../Components/Input/Input";
import Table from "../../../Components/Table/Table";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from 'xlsx';
import Chart from "../../../Components/Chart/Chart";
import Loader from "../../../Components/Loader/Loader";

const Graphics = () => {

  const [ file, setFile ] = useState(null);
  const [ data, setData ] = useState(null);

  const [ isTableLoading, setTableLoading ]= useState(false);

  const [ backgroundColor, setBackgroundColor ] = useState('#ffffff');
  const [ variableCount, setVariableCount ] = useState(1);
  const [ labels, setLabels ] = useState([]);
  const [ name, setName ] = useState('');
  const [ colors, setColors ] = useState([]);
  const [ gridColor, setGridColor ] = useState('#d4d4d4');
  const [ legendColor, setLegendColor ] = useState('#878787');

  const [ error, setError ] = useState(null);

  useEffect(() => {
    try {
        if(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                const dataArrayOfArray = [];
                for(let index = 0; index < variableCount; index++) {
                  const dataArrayOfNumber = sheetData.map(obj => {
                    const value = Object.values(obj)[index];
                    const isValid = /^(\d+|\d+[,.]\d+)$/.test(value);

                    if(typeof(value) === 'number') {
                      return value;
                    }
                    else if(isValid) {
                      const correctValue = value.includes(',') ?
                          value.replace(',', '.') : value;
                      return parseFloat(correctValue);
                    }
                    else if(value === undefined) {
                      
                    }
                    else {
                      setError(`Не удалось загрузить таблицу. Значение "${value}" не является числом.`);
                    }
                  });
                  dataArrayOfArray.push(dataArrayOfNumber);
                }
                setData(dataArrayOfArray);
                setTableLoading(false);
                setError(null);
            };
            reader.readAsBinaryString(file);
        }
    }
    catch(error) {
        setTableLoading(false);
        setError('Не удалось загрузить таблицу. Проверьте корректность файла с таблицей.');
    }
  }, [file, variableCount]);

  const exitTable = () => {
    setFile(null);
    setData(null);
  }

  return (
    <>
      <div className="FeaturesTitleContainer">
        <h1>Визуализация данных</h1>
        <p>Визуализация данных с помощью графиков</p>
      </div>
      <div className="FeaturesInputsContainer">
        <div className="FeaturesAreaContainer">
          <Input
              TaleTitle="Фон"
              TaleText="Цвет фона"
              setter={(e) => setBackgroundColor(e)}
              type="color"
              defaultValue={"#ffffff"}
          />
          <Input
            TaleTitle="Сетка"
            TaleText="Цвет сетки на графике"
            setter={(e) => setGridColor(e)}
            type="color"
            defaultValue={"#d4d4d4"}
          />
          <Input
            TaleTitle="Легенда"
            TaleText="Цвет легенды графика"
            setter={(e) => setLegendColor(e)}
            type="color"
            defaultValue={"#878787"}
          />
          <Input
            TaleTitle="Название графика"
            TaleText="Название графика - отображается в легенде графика"
            setter={(e) => setName(e)}
            type="text"
            defaultValue=""
          />
          <Input 
            TaleTitle="Кол-во переменных"
            TaleText="Кол-во столбцов таблицы (начиная с первого), которые включаются в визуализацию"
            setter={(e) => setVariableCount(e)}
            type="number"
            defaultValue={1}
          />
          {
            Array.from({ length: variableCount }, (_, index) => index).map(index => 
              <>
                <Input 
                  TaleTitle={`Название переменной ${index+1}`}
                  TaleText={`Название переменной, значения которой находятся в столбце под номером ${index+1}`}
                  setter={(e) => {
                    const newLabels = [...labels];
                    newLabels[index] = e;
                    setLabels(newLabels);
                  }}
                  type="text"
                  defaultValue={labels[index] || ''}
                />
                <Input 
                  TaleTitle={`Цвет переменной ${index+1}`}
                  TaleText={`Цвет переменной на графике, значения которой находятся в столбце под номером ${index+1}`}
                  setter={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e;
                    setColors(newColors);
                  }}
                  type="color"
                  defaultValue="#000000"
                />
              </>
            )
          }
          <p className="FeaturesErrorContainer">
              { error }
          </p>
        </div>
        <div className="FeaturesTableContainer">
          {
              isTableLoading ? 
                  <Loader /> : data ?
                      <Table 
                          data={[data.slice(0, 100)]}
                          labels={labels}
                          exit={exitTable}
                      /> :
                      <FileUploader
                          handleChange={(file) => { 
                              setTableLoading(true);
                              setFile(file);
                          }}
                          name="file"
                          classes="FeaturesFileUploader"
                          types={['xls', 'xlsx']}
                      >
                          <h1>Загрузка файла</h1>
                          <p>Поддерживаются xls, xlsx и csv файлы</p>
                      </FileUploader>
          }
        </div>
      </div>
      {
        data &&
        <div id="FeaturesResults" className="FeaturesResults">
          <div
            className="FeaturesChartContainer"
            style={{
              backgroundColor: backgroundColor || 'white'
            }}
          >
              <Chart
                  dataset={data}
                  title={name}
                  label={labels}
                  backgroundColor={backgroundColor}
                  colors={colors}
                  gridColor={gridColor}
                  legendColor={legendColor}
              />
          </div>
        </div>
      }
    </>
  )

}

export default Graphics;