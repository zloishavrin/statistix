import './reset.css';
import './global.css';
import './scrollbar.css';
import styles from './App.module.css';
import Main from "../Pages/Main/Main";
import Build from "../Pages/Build/Build";
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/build/*" element={<Build/>}/>
      </Routes>
    </div>
  );
}

export default App;
