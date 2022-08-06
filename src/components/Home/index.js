import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Navbar from "../Navbar/index";
import { Link, useHistory } from "react-router-dom";
import emptyImg from "../../assets/img/empty.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faDatabase,
	faDesktop,
	faCalendarWeek,
	faSdCard,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
	const history = useHistory();

	useEffect(() => {
		const localData = localStorage.getItem("driveUserInfo");
		const userInfo = localData ? JSON.parse(localData) : null;
		if (!userInfo) {
			history.push("/");
		}
		// eslint-disable-next-line
	}, []);
	return (
		<div className="">
			<Navbar />
			<div className="my-2 d-flex justify-content-flex-start">
				<div className={styles.leftSideBar}>
					<br />
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
				<div className={styles.rightBox}>
					<div className="row p-3">
						<h2>Recent</h2>
						<img
							src={emptyImg}
							className={styles.emptyImg}
							alt="empty-img"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
