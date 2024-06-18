import styles from "./Table.module.css";

const Table = ({ data, labels }) => {

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
    for(let index = 0; index < 101; index ++)  {
        const tableRow = [];
        tableRow.push(<td>{index}</td>);
        for(let jIndex = 0; jIndex < 11; jIndex ++) {
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
        tableRows.push(<tr>{tableRow}</tr>);
    }

    return (
        <div className={styles.TableContainer}>
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