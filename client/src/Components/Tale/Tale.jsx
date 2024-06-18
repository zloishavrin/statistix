import styles from "./Tale.module.css";

const Tale = ({ TaleText }) => {
    return (
        <div className={styles.TaleContainer}>
            <p>{TaleText}</p>
        </div>
    )
};

export default Tale;