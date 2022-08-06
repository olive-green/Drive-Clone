import React, { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./styles.module.css";

// import Modals from '../Modal/index'
import { Button } from "react-bootstrap";
import FileForm from "../Form/file";
import FolderForm from "../Form/folder";
// Font Awesome Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faDatabase,
	faDesktop,
	faCalendarWeek,
	faSdCard,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar(params) {
	const [count, setcount] = useState(false);
	const handleNew = () => {
		setcount(!count);
	};
	return (
		<div className={styles.leftSideBar}>
		    { params.default === true ? null : (
			<Button className={styles.addFileBtn} onClick={handleNew}>
				+ New
			</Button>
			)}
			{count === true ? (
				<div className={styles.selectBox}>
					<FolderForm />
					<FileForm />
				</div>
			) : null}
			
			<br />
			<Link to="/home" className={styles.optionBtn}>
				<FontAwesomeIcon icon={faHome} />
				&nbsp;&nbsp;Home
			</Link>
			<Link to="/drive" className={styles.optionBtn}>
				<FontAwesomeIcon icon={faDatabase} />
				&nbsp;&nbsp;My Drive
			</Link>
			<button className={styles.optionBtn}>
				<FontAwesomeIcon icon={faDesktop} />
				&nbsp;&nbsp; Computers
			</button>
			<Link to="/recent" className={styles.optionBtn}>
				<FontAwesomeIcon icon={faCalendarWeek} />
				&nbsp;&nbsp; Recent
			</Link>
			<Link to="/recycleBin" className={styles.optionBtn}>
				<FontAwesomeIcon icon={faSdCard} />
				&nbsp;&nbsp; Bin
			</Link>
		</div>
	);
}

export default Sidebar;
