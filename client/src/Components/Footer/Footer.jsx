import styles from "./Footer.module.css";

export const Footer = () => {

  return (
    <footer className={styles.Footer}>
        <a href="https://statistix.shaligula.ru/conf">Конфиденциальность данных</a>
        <a href="https://api.statistix.shaligula.ru/docs">API</a>
        <a href="https://shaligula.ru">Шалигула</a>
        <a href="https://github.com/zloishavrin/statistix">GitHub</a>
    </footer>
  )

}