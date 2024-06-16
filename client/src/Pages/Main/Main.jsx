import Header from "../../Components/Header/Header";
import styles from "./Main.module.css";

const Main = () => {

    return (
        <>
            <Header />
            <div className={styles.Container}>
                <div className={styles.Main}>
                    <div id="search" className={styles.Search}>
                        <input 
                            className={styles.SearchInput} 
                            placeholder="Поиск"
                            type="text"
                        />
                    </div>
                    <div className={styles.ItemsContainer}>
                        <div className={styles.Lines}>

                        </div>
                        <div className={styles.Items}>
                            <div className={styles.Item}>
                                <div className={styles.ItemTitle}>
                                    <h1>ARIMA</h1>
                                    <p>Построение ARIMA-модели</p>
                                </div>
                                <a href="#">Перейти</a>
                            </div>
                            <div className={styles.Item}>
                                <div className={styles.ItemTitle}>
                                    <h1>SARIMA</h1>
                                    <p>Построение SARIMA-модели</p>
                                </div>
                                <a href="#">Перейти</a>
                            </div>
                            <div className={styles.Item}>
                                <div className={styles.ItemTitle}>
                                    <h1>SARIMAX</h1>
                                    <p>Построение SARIMAX-модели</p>
                                </div>
                                <a href="#">Перейти</a>
                            </div>
                            <div className={styles.Item}>
                                <div className={styles.ItemTitle}>
                                    <h1>Метод Бокса-Кокса</h1>
                                    <p>Построение ARIMA-модели</p>
                                </div>
                                <a href="#">Перейти</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Main;