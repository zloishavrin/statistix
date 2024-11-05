import { Route, Routes, Link } from 'react-router-dom';
import styles from "./Build.module.css";
import "./Build.css";
import Arima from '../../Features/Arima/Arima';
import Sarima from '../../Features/Sarima/Sarima';
import { Footer } from '../../Components/Footer/Footer';
import Graphics from '../../Features/Graphics/Graphics';

const Build = () => {

    return (
    <>
        <div className={styles.Container}>
            <div className={styles.Content}>
                <Link to='/'>
                    <svg width="35" height="78" viewBox="0 0 35 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33 2L4 39L33 76" stroke="white" stroke-width="5"/>
                    </svg>
                </Link>
                <Routes>
                    <Route path="/arima" element={<Arima/>} />
                    <Route path="/sarima" element={<Sarima/>} />
                    <Route path="/graphics" element={<Graphics/>} />
                </Routes>
            </div>
        </div>
        <Footer />
    </>
    )

}

export default Build;