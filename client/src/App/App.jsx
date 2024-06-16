import './reset.css';
import './global.css';
import './scrollbar.css';
import styles from './App.module.css';
import Main from "../Pages/Main/Main";

function App() {
  return (
    <div className={styles.App}>
      <Main />
    </div>
  );
}

export default App;
