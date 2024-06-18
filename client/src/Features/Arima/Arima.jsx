import Input from "../../Components/Input/Input";
import { useEffect, useState } from "react";

const Arima = () => {

    const [ pValue, setPValue ] = useState(0);
    const [ dValue, setDValue ] = useState(0);
    const [ QValue, setQValue ]  = useState(0);

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
                </div>
                <div className="FeaturesTableContainer">
                </div>
            </div>
        </>
    )

}

export default Arima;