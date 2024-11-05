import styles from "./Table.module.css";

const Table = ({ data, labels, exit }) => {

    const labelsRow = [];
    for(let index = 0; index < 11; index ++) {
        if(labels[index]) {
            labelsRow.push(<th>{labels[index]}</th>);
        }
        else {
            labelsRow.push(<th> </th>);
        }
    }

    const tableRows = [];

    for(let index = 0; index < 101; index++)  {
        const tableRow = [];
        tableRow.push(<td>{index}</td>);
        for(let jIndex = 0; jIndex < 11; jIndex ++) {
            if(Array.isArray(data[jIndex]) && Array.isArray(data[jIndex][jIndex])) {
                if(data[jIndex][jIndex] && data[jIndex][jIndex][index]) {
                    for(let kIndex = 0; kIndex < 11; kIndex++) {
                        if(data[jIndex] && data[jIndex][kIndex] && data[jIndex][kIndex][index]) {
                            tableRow.push(<td>{data[jIndex][kIndex][index]}</td>);
                        }
                    }
                }
            }
            else {
                if(data[jIndex] && data[jIndex][index]) {
                    tableRow.push(<td>{data[jIndex][index]}</td>);
                }
                else if(index === 100 && data[jIndex]) {
                    tableRow.push(<td>...</td>);
                }
                else {
                    tableRow.push(<td> </td>);
                }
            }
        }
        tableRows.push(<tr>{tableRow}</tr>);
    }

    return (
        <div className={styles.TableContainer}>
            <button 
                className={styles.TableExitButton}
                onClick={exit}
            >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M8.00386 9.41816C7.61333 9.02763 7.61334 8.39447 8.00386 8.00395C8.39438 7.61342 9.02755 7.61342 9.41807 8.00395L12.0057 10.5916L14.5907 8.00657C14.9813 7.61605 15.6144 7.61605 16.0049 8.00657C16.3955 8.3971 16.3955 9.03026 16.0049 9.42079L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.0039C15.6133 16.3945 14.9802 16.3945 14.5896 16.0039L12.0057 13.42L9.42097 16.0048C9.03045 16.3953 8.39728 16.3953 8.00676 16.0048C7.61624 15.6142 7.61624 14.9811 8.00676 14.5905L10.5915 12.0058L8.00386 9.41816Z" fill="#0F0F0F">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F">
                        </path>
                    </g>
                </svg>
            </button>
            <table className={styles.Table}>
                <thead>
                    <tr>
                        <th> </th>
                        {labelsRow}
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div>
    );
};

export default Table;