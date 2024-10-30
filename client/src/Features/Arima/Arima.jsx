import Input from "../../Components/Input/Input";
import Table from "../../Components/Table/Table";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from 'xlsx';
import ModelService from "../../utils/api/service";
import Chart from "../../Components/Chart/Chart";
import Loader from "../../Components/Loader/Loader";
import { Equation } from "../../Components/Equation/Equation";
import FileService from "../../utils/file/service";

const Arima = () => {

    const [ pValue, setPValue ] = useState(0);
    const [ dValue, setDValue ] = useState(0);
    const [ QValue, setQValue ] = useState(0);
    const [ next, setNext ]  = useState(0);

    const [ file, setFile ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ results, setResults ] = useState(null);

    const [ isTableLoading, setTableLoading ]= useState(false);
    const [ isModelLoading, setModelLoading ]= useState(false);

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
                    const dataArrayOfNumber = sheetData.map(obj => {
                        const value = Object.values(obj)[0];
                        const isValid = /^(\d+|\d+[,.]\d+)$/.test(value);

                        if(typeof(value) === 'number') {
                            return value;
                        }
                        else if(isValid) {
                            const correctValue = value.includes(',') ?
                                value.replace(',', '.') : value;
                            return parseFloat(correctValue);
                        }
                        else {
                            setError(`Не удалось загрузить таблицу. Значение "${value}" не является числом.`);
                        }
                    });
                    setData(dataArrayOfNumber);
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
        
    }, [file]);

    const buildModel = async () => {
        try {
            setModelLoading(true);
            const responce = await ModelService.ARIMA(pValue,  dValue,  QValue, next, data);
            setResults(responce.data);
            setModelLoading(false);
            const scrollElement = document.getElementById("scroll-element");
            scrollElement.scrollIntoView({
                behavior: "smooth", 
                block: "start", 
                inline: "nearest"
            });
            setError(null);
        }
        catch(error) {
            setModelLoading(false);
            setError('Не удалось построить модель. Проверьте корректность таблицы и параметров модели.')
        }
    }

    const exitTable = () => {
        setFile(null);
        setData(null);
    }

    const downloadExcel = async () => {
        const excelData = ['y(t)', ...data];
        const excelForecastData = ['y\'(t)', ...results.forecast_data];
        const response = await FileService.formExcel([
            excelData,
            excelForecastData
        ]);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ARIMA-результаты.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url)
    }

    const downloadCSV = async () => {
        const excelData = ['y(t)', ...data];
        const excelForecastData = ['y\'(t)', ...results.forecast_data];
        const response = await FileService.formCSV([
            excelData,
            excelForecastData
        ]);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ARIMA-результаты.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url)
    }
 
    return (
        <>
            <div className="FeaturesTitleContainer">
                <h1>ARIMA</h1>
                <p>Построение ARIMA-модели</p>
            </div>
            <div className="FeaturesInputsContainer">
                <div className="FeaturesAreaContainer">
                    <Input
                        TaleTitle="p"
                        TaleText="Порядок авторегрессии"
                        setter={(e) => setPValue(e)}
                        type="number"
                    />
                    <Input
                        TaleTitle="d"
                        TaleText="Порядок дифференцирования"
                        setter={(e) => setDValue(e)}
                        type="number"
                    />
                    <Input
                        setter={(e) => setQValue(e)}
                        TaleText="Порядок скользящего среднего"
                        TaleTitle="q"
                        type="number"
                    />
                    <Input
                        setter={(e) => setNext(e)}
                        TaleText="Кол-во построенных прогнозных значений"
                        TaleTitle="Горизонт прогноза"
                        type="number"
                    />
                    <button
                        className="FeaturesButton"
                        onClick={buildModel}
                    >
                        Запустить
                    </button>
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
                                    labels={['y(t)']}
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
                isModelLoading ? 
                    <div id="FeaturesResults" className="FeaturesResults">
                        <Loader /> 
                    </div> :
                        results && (
                            <div id="FeaturesResults" className="FeaturesResults">
                                <div className="FeaturesTests">
                                    <div className="FeaturesEvaluation">
                                        <h1>Уравнение</h1>
                                        <Equation
                                            math={results.equation}
                                        />
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>AIC</h1>
                                        <p>{results.aic}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>AICC</h1>
                                        <p>{results.aicc}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>BIC</h1>
                                        <p>{results.bic}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>HQC</h1>
                                        <p>{results.hqic}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>LLF</h1>
                                        <p>{results.llf}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>MAE</h1>
                                        <p>{results.mae}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>MSE</h1>
                                        <p>{results.mse}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>Тест Дики-Фуллера</h1>
                                        <p>{results.adf_statistic}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>P-значение</h1>
                                        <p>{results.p_value}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>Крит. знач. (1%)</h1>
                                        <p>{results.critical_values['1%']}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>Крит. знач. (5%)</h1>
                                        <p>{results.critical_values['5%']}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>Крит. знач. (10%)</h1>
                                        <p>{results.critical_values['10%']}</p>
                                    </div>
                                    <div className="FeaturesTest">
                                        <h1>IC Best</h1>
                                        <p>{results.icbest}</p>
                                    </div>
                                </div>
                                <div className="FeaturesSmallButtonContainerContainer">
                                    <div className="FeaturesSmallButtonContainer">
                                        <button
                                            className="FeaturesButton"
                                            onClick={downloadExcel}
                                        >
                                            Скачать Excel
                                        </button>
                                    </div>
                                    <div className="FeaturesSmallButtonContainer">
                                        <button
                                            className="FeaturesButton"
                                            onClick={downloadCSV}
                                        >
                                            Скачать CSV
                                        </button>
                                    </div>
                                </div>
                                <div className="FeaturesChartContainer">
                                    <Chart
                                        dataset={[results.data, results.forecast_data]}
                                        title="ARIMA-модель"
                                        label={["y(t)", "y'(t)"]}
                                    />
                                </div>
                            </div>
                        )
            }
            <div id="scroll-element"></div>
        </>
    )

}

export default Arima;