import styles from "./Chart.module.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Input from "../Input/Input";
import { useState } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ dataset, title }) => {

    const [ XTitle, setXTitle ] = useState("Ось X");
    const [ YTitle, setYTitle ] = useState("Ось Y");

    const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
        },
    };

    const data = {
        labels: dataset.map((value, index) => index),
        datasets: [
            {
                label: "y(t)",
                data: dataset,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    }

    return (
        <div className={styles.Container}>
            <h1 className={styles.TitleContainer}>Настройка графика</h1>
            <div className={styles.OptionsContainer}>
                <Input 
                    TaleTitle="Ось X"
                    TaleText="Подпись оси X"
                    setter={(e) => setXTitle(e)}
                    type="text"
                />
                <Input 
                    TaleTitle="Ось Y"
                    TaleText="Подпись оси Y"
                    setter={(e) => setYTitle(e)}
                    type="text"
                />
            </div>
            <h1 className={styles.TitleContainer}>График</h1>
            <div className={styles.ChartContainer}>
                <p className={styles.YAxis}>{YTitle}</p>
                <div className={styles.Chart}>
                    <Line 
                        options={options}
                        data={data}
                    />
                </div>
            </div>
            <p className={styles.XAxis}>{XTitle}</p>
        </div>
    )

}

export default Chart;