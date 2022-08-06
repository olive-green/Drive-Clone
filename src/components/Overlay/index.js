import React from "react";
import styles from './styles.module.css';
import { Link } from "react-router-dom";

function Overlay({files,folders}){
   
    return (
        <div className={`${styles.overlayContainer} card`}>
            {files && (
                <div className="row">
                    {files.map(item => {
                        return (<a href={`${item.link}`} target="_blank" rel="noreferrer" className={`col-12 ${styles.itemBox}`}>
                            <h5 className={styles.searchText}>{item.name.substr(0,10) }</h5>
                            <p className={styles.typeOfFile}>Type:File</p>
                        </a>)
                    })
                    }
                </div>
                
            )}
            {folders && (
                <div className="row">
                    {folders.map(item => {
                        return (<Link to={`/folder/${item._id}`}  className={`col-12 ${styles.itemBox}`}>
                            <h5 className={styles.searchText}>{item.name.substr(0,10) }</h5>
                            <p className={styles.typeOfFile}>Type:Folder</p>
                        </Link>)
                    })
                    }
                </div>
                
            )}
            
        </div >
    )
}

export default Overlay;