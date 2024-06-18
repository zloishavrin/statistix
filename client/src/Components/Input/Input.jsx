import styles from "./Input.module.css";
import Tale from "../Tale/Tale";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Input = ({ TaleTitle, TaleText, setter, type }) => {

    const [ taleView, setTaleView ] = useState(false);

    const changeValue = (value) => {
        if(type == "number") {
            if(value === "") {
                setter(0);
            }
            else {
                setter(Number(value));
            }
        }
        else if(type == "text") {
            setter(value);
        }
    }

    return (
        <div className={styles.InputContainer}>
            <TransitionGroup>
                <CSSTransition key={taleView} timeout={500} classNames="transition-fade">
                    {
                        taleView ? 
                        <Tale 
                            TaleText={TaleText}
                        />
                        : <></>
                    }
                </CSSTransition>
            </TransitionGroup>
            
            <div className={styles.Tale}>
                <p>{TaleTitle}</p>
                <svg
                    onMouseOver={() => setTaleView(true)}
                    onMouseOut={() => setTaleView(false)}
                    width="800" height="800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M12 7.01001V7.00002M12 17L12 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                </svg>
            </div>
            <input 
                onChange={(e) => changeValue(e.target.value)}
                className={styles.Input} 
                type={type}
            />
        </div>
    )
}

export default Input;