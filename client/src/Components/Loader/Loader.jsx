import styles from "./Loader.module.css";

const Loader = () => {

    return (
        <svg
            className={styles.Loader}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
    );

}

export default Loader;