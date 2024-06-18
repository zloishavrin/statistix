import Input from "../../Components/Input/Input";
import Table from "../../Components/Table/Table";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from 'xlsx';
import ModelService from "../../utils/api/service";
import Chart from "../../Components/Chart/Chart";

const Arima = () => {

    const [ pValue, setPValue ] = useState(0);
    const [ dValue, setDValue ] = useState(0);
    const [ QValue, setQValue ] = useState(0);
    const [ next, setNext ]  = useState(0);

    const [ file, setFile ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ results, setResults ] = useState(null);

    useEffect(() => {
        if(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                const dataArrayOfNumber = sheetData.map(obj => Object.values(obj)[0]);
                setData(dataArrayOfNumber);
            };
            reader.readAsBinaryString(file);
        }
    }, [file]);

    const buildModel = async () => {
        const responce = await ModelService.ARIMA(pValue,  dValue,  QValue, next, data);
        setResults(responce.data)
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
                        TaleTitle="P"
                        TaleText="Порядок авторегрессии"
                        setter={(e) => setPValue(e)}
                        type="number"
                    />
                    <Input
                        TaleTitle="D"
                        TaleText="Порядок дифференцирования"
                        setter={(e) => setDValue(e)}
                        type="number"
                    />
                    <Input
                        setter={(e) => setQValue(e)}
                        TaleText="Порядок скользящего среднего"
                        TaleTitle="Q"
                        type="number"
                    />
                    <Input
                        setter={(e) => setNext(e)}
                        TaleText="Кол-во построенных прогнозных значений"
                        TaleTitle="Прогноз"
                        type="number"
                    />
                    <button
                        className="FeaturesButton"
                        onClick={buildModel}
                    >
                        Запустить
                    </button>
                </div>
                <div className="FeaturesTableContainer">
                    {
                        data ?
                        <Table 
                            data={[data.slice(0, 100)]}
                            labels={['y(t)']}
                        />
                        :
                        <FileUploader
                            handleChange={(file) => setFile(file)}
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
                results && (
                    <div className="FeaturesResults">
                        <div className="FeaturesTests">
                            <div className="FeaturesTest">
                                <h1>AIC</h1>
                                <p>{results.aic}</p>
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
                                <h1>Тест Дики-Фуллера</h1>
                                <p>{results.adf_statistic}</p>
                            </div>
                            <div className="FeaturesTest">
                                <h1>P-значение</h1>
                                <p>{results.p_value}</p>
                            </div>
                            <div className="FeaturesTest">
                                <h1>P-значение</h1>
                                <p>{results.p_value}</p>
                            </div>
                            <div className="FeaturesTest">
                                <h1>P-значение</h1>
                                <p>{results.p_value}</p>
                            </div>
                        </div>
                        <div className="FeaturesChartContainer">
                            <Chart 
                                dataset={results.data}
                                title="ARIMA-модель"
                            />
                        </div>
                    </div>
                )
            }
        </>
    )

}

export default Arima;