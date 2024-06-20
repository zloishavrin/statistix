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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ dataset, title, label }) => {
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            x: {
                title: {
                    display: false
                },
            },
            y: {
                title: {
                    display: false
                },
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        }
    };

    const data = {
        labels: dataset[0].map((_, index) => index),
        datasets: dataset.map((dataArray, i) => ({
            label: label[i],
            data: dataArray,
            borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
        }))
    };

    return (
        <div className={styles.Container}>
            <div className={styles.ChartContainer}>
                <div className={styles.Chart}>
                    <Line 
                        options={options}
                        data={data}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chart;