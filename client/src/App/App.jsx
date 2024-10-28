import './reset.css';
import './global.css';
import './scrollbar.css';
import './transition.css';
import styles from './App.module.css';
import Main from "../Pages/Main/Main";
import Build from "../Pages/Build/Build";
import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from "react-transition-group";
import ScrollToTop from '../Components/ScrollToTop/ScrollToTop';

function App() {

  const location = useLocation();

  return (
    <div className={styles.App}>
      <ScrollToTop />
      <SwitchTransition>
          <CSSTransition key={location.key} classNames="transition-fade" timeout={500}>
            <Routes location={location}>
              <Route path="/" element={<Main/>}/>
              <Route path="/build/*" element={<Build/>}/>
            </Routes>
          </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export default App;
