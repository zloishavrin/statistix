import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import styles from './Equation.module.css';

export const Equation = ({ math }) => {

  return (
    <div className={styles.Container}>
      <InlineMath math={math} />
    </div>
  )

}