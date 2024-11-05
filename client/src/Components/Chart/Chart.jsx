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
import { useRef } from "react";
import { Line } from 'react-chartjs-2';
import html2canvas from "html2canvas";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ dataset, title, label, colors, backgroundColor, gridColor, legendColor }) => {

    const chartRef = useRef(null);

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title,
                color: legendColor || "#878787"
            },
            legend: {
                color: legendColor || "#878787",
            }
        },
        scales: {
            x: {
                title: {
                    display: false
                },
                grid: {
                    display: true,
                    color: gridColor || "#d4d4d4"
                },
                ticks: {
                    color: legendColor || "#878787"
                }
            },
            y: {
                title: {
                    display: false
                },
                grid: {
                    display: true,
                    color: gridColor || "#d4d4d4"
                },
                ticks: {
                    color: legendColor || "#878787"
                }
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        }
    };

    const randomColors = [];

    for(let index = 0; index < dataset.length; index++) {
        const randomColor =`${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}`;
        randomColors.push(randomColor);
    }

    console.log(dataset);

    const data = {
        labels: dataset
            .reduce((longest, current) => {
                return current.length > longest.length ? current : longest;
            }, [])
            .map((_, index) => index),
        datasets: dataset.map((dataArray, i) => ({
            label: label[i],
            data: dataArray,
            borderColor: (colors && colors[i]) || `rgb(${randomColors[i]})`,
            backgroundColor: (colors && colors[i]) || `rgba(${randomColors[i]}, 0.5)`,
        }))
    };

    const saveAsImage = () => {
        if (chartRef.current) {
          html2canvas(chartRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `График.png`;
            link.click();
          });
        }
      };

    return (
        <div
            className={styles.Container}
            style={{
                backgroundColor: backgroundColor || 'white',
            }}
        >
            <div
                className={styles.ChartContainer}
                style={{
                    backgroundColor: backgroundColor || 'white',
                }}
            >
                <button
                    className={styles.Download}
                    onClick={saveAsImage}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0">
                        </g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                        </g>
                        <g id="SVGRepo_iconCarrier"> 
                            <path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            </path> 
                        </g>
                    </svg>
                </button>
                <div 
                    className={styles.Chart}
                    ref={chartRef}
                >
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