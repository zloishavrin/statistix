import Input from "../../Components/Input/Input";
import Table from "../../Components/Table/Table";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from 'xlsx';

const Arima = () => {

    const [ pValue, setPValue ] = useState(0);
    const [ dValue, setDValue ] = useState(0);
    const [ QValue, setQValue ] = useState(0);
    const [ next, setNext ]  = useState(0);

    const [ file, setFile ] = useState(null);
    const [ data, setData ] = useState(null);

    useEffect(() => {
        if(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                const dataArrayOfObject = sheetData.slice(0, 100);
                const dataArrayOfNumber = dataArrayOfObject.map(obj => Object.values(obj)[0]);
                setData(dataArrayOfNumber);
            };
            reader.readAsBinaryString(file);
        }
    }, [file]);

    useEffect(() => {
        console.log([data]);
    }, [data]);

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
                        setter={(e) => setPValue(e)}
                    />
                    <Input
                        TaleTitle="D"
                        setter={(e) => setDValue(e)}
                    />
                    <Input
                        setter={(e) => setQValue(e)}
                        TaleTitle="Q"
                    />
                    <Input
                        setter={(e) => setNext(e)}
                        TaleTitle="Прогноз"
                    />
                    <button
                        className="FeaturesButton"
                    >
                        Запустить
                    </button>
                </div>
                <div className="FeaturesTableContainer">
                    {
                        data ?
                        <Table 
                            data={[data]}
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
        </>
    )

}

export default Arima;