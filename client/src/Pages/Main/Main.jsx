import Header from "../../Components/Header/Header";
import styles from "./Main.module.css";
import SearchService from "../../utils/search/service";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Main = () => {

    const [ modes, setModes ] = useState([]);
    const [ openCategories, setOpenCategories ] = useState(false);
    const [ currentCategory, setCurrentCategory ] = useState(null);
    const [ currentSearchText, setCurrentSearchText ] = useState(null);
    const [ categories, setCategories ] = useState(null);

    useEffect(() => {
        const getAllModes = async () => {
            const responce = await SearchService.getAll();
            const data = responce.data;
            setModes(data);
        }

        const getAllCategories = async () => {
            const responce = await SearchService.getAllCategories();
            const data = responce.data;
            setCategories(data);
        }

        getAllModes();
        getAllCategories();
    }, []);

    useEffect(() => {
        const getData = async () => {
            if(!currentCategory && !currentSearchText) {
                const responce = await SearchService.getAll();
                const data = responce.data;
                setModes(data);
            }
            else if(currentCategory && !currentSearchText) {
                const responce = await SearchService.getByCategory(currentCategory);
                const data = responce.data;
                setModes(data);
            }
            else if(!currentCategory && currentSearchText) {
                const responce = await SearchService.search(currentSearchText);
                const data = responce.data;
                setModes(data);
            }
            else {
                const responce = await SearchService.getBySearchAndCategory(currentSearchText, currentCategory);
                const data = responce.data;
                setModes(data);
            }
        }
        getData();
    }, [currentCategory, currentSearchText]);

    return (
        <>
            <Header />
            <div className={styles.Container}>
                <div className={styles.Main}>
                    <div id="search" className={styles.Search}>
                        <input
                            onChange={(e) => setCurrentSearchText(e.target.value)}
                            className={styles.SearchInput} 
                            placeholder="Поиск"
                            type="text"
                        />
                        <div 
                            className={styles.SearchSelect}
                            onClick={() => {
                                openCategories ? setOpenCategories(false) : setOpenCategories(true);
                            }}
                        >
                            <p>Категории</p>
                        </div>

                        <div 
                            className={styles.SearchOptionsContainer}
                            style={openCategories ? 
                                { transform: "scale(1)", opacity: "1" } : 
                                { transform: "scale(0)", opacity: "0" }
                            }
                        >
                            <div
                                className={styles.SearchOption}
                                onClick={() => {
                                    setCurrentCategory(null);
                                    setOpenCategories(false);
                                }}
                            >
                                <p>Все категории</p>
                            </div>
                            {
                                categories && categories.map((category) => {
                                    return (
                                        <div
                                            className={styles.SearchOption}
                                            key={category._id}
                                            onClick={() => {
                                                setCurrentCategory(category._id);
                                                setOpenCategories(false);
                                            }}
                                        >
                                            <p>{category.name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.ItemsContainer}>
                        <div className={styles.Lines}>
                            <div className={styles.VericalLineContainer}>
                                <div className={styles.VericalLine}></div>
                                <div className={styles.VericalLine}></div>
                            </div>
                            <div className={styles.HorizontalLinesContainer}>
                                {
                                    modes.map((item, index) => {
                                        return (
                                            <div key={`${item._id}_${index}`} className={styles.HorizontalLine}></div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className={styles.Items}>
                            {
                                modes.map((item) => {
                                    return (
                                        <div key={item._id} className={styles.Item}>
                                            <div className={styles.ItemTitle}>
                                                <h1>{item.name}</h1>
                                                <p>{item.description}</p>
                                            </div>
                                            <Link to={`build/${item.path}`}>Перейти</Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <footer className={styles.Footer}>
                <a href="https://statistix.shaligula.ru/conf">Конфиденциальность данных</a>
                <a href="https://api.statistix.shaligula.ru/docs">API</a>
                <a href="https://shaligula.ru">Шалигула</a>
                <a href="https://github.com/zloishavrin/statistix">GitHub</a>
            </footer>
        </>
    )

}

export default Main;