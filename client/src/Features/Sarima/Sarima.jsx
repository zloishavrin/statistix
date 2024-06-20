import Input from "../../Components/Input/Input";
import Table from "../../Components/Table/Table";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from 'xlsx';
import ModelService from "../../utils/api/service";
import Chart from "../../Components/Chart/Chart";
import Loader from "../../Components/Loader/Loader";

const Sarima = () => {

    const [ pValue, setPValue ] = useState(0);
    const [ dValue, setDValue ] = useState(0);
    const [ QValue, setQValue ] = useState(0);
    const [ p1Value, setP1Value ] = useState(0);
    const [ d1Value, setD1Value ] = useState(0);
    const [ q1Value, setQ1Value ] = useState(0);
    const [ sValue, setSValue ] = useState(0);
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
                    const dataArrayOfNumber = sheetData.map(obj => Object.values(obj)[0]);
                    setData(dataArrayOfNumber);
                    setTableLoading(false);
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
            const responce = await ModelService.SARIMA(pValue,  dValue,  QValue, p1Value, d1Value, q1Value, sValue, next, data);
            setResults(responce.data);
            setModelLoading(false);
            const scrollElement = document.getElementById("scroll-element");
            scrollElement.scrollIntoView({
                behavior: "smooth", 
                block: "start", 
                inline: "nearest"
            });
        }
        catch(error) {
            setModelLoading(false);
            setError('Не удалось построить модель. Проверьте корректность таблицы и параметров модели.')
        }
        
    }

    return (
        <>
            <div className="FeaturesTitleContainer">
                <h1>SARIMA</h1>
                <p>Построение SARIMA-модели</p>
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
                        TaleTitle="P"
                        TaleText="Порядок авторегрессии для сезонности"
                        setter={(e) => setP1Value(e)}
                        type="number"
                    />
                    <Input
                        TaleTitle="D"
                        TaleText="Порядок дифференцирования для сезонности"
                        setter={(e) => setD1Value(e)}
                        type="number"
                    />
                    <Input
                        TaleTitle="Q"
                        TaleText="Порядок скользящего среднего для сезонности"
                        setter={(e) => setQ1Value(e)}
                        type="number"
                    />
                    <Input
                        TaleTitle="s"
                        TaleText="Длина сезонного цикла"
                        setter={(e) => setSValue(e)}
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
                                        <p>{results.equation}</p>
                                    </div>
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
                                <div className="FeaturesChartContainer">
                                    <Chart 
                                        dataset={[results.data]}
                                        title="SARIMA-модель"
                                        label={["y(t)"]}
                                    />
                                </div>
                            </div>
                        )
            }
            <div id="scroll-element"></div>
        </>
    )

}

export default Sarima;