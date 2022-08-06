import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/index";
import Sidebar from "../Sidebar/index";
import styles from "./styles.module.css";
import { Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setFolder } from "../../actions/currentFolderAction";
import { useHistory } from "react-router-dom";
import noFolder from "../../assets/img/nofolder.png";
// import url from '../../utilities';
import axios from "axios";
import Folder from "../Folder/index";
import File from "../File/index";
import Message from "../Message";
import Loader1 from "../Loader/Loader-1";
import {url} from "../../utilities";

const Folders = ({ match }) => {
	const history = useHistory();
	const id = match.params.id;
	const dispatch = useDispatch();
	const { currentFolder } = useSelector((state) => state.currentFolder);

	const [childFolder, setchildFolder] = useState(null);
	const [childFiles, setchildFiles] = useState(null);
	const [error, seterror] = useState(null);
	const [loading, setloading] = useState(false);
	const [, setparentFolder] = useState(null);

	const setCurrentFolderDrive = async () => {
		if (id) {
			dispatch(setFolder(String(id)));
		}
	};
	useEffect(() => {
		setCurrentFolderDrive();
		const userInfoFromStorage = localStorage.getItem("driveUserInfo")
			? JSON.parse(localStorage.getItem("driveUserInfo"))
			: null;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfoFromStorage.token}`,
			},
		};
		const getFolderandFiles = async () => {
			try {
				if (id) {
					// console.log('Folder called')
					setloading(true);
					const { data } = await axios.get(
						`${url}/api/folders/details/${id}`,
						config
					);
					console.log(data);
					setloading(false);
					if (data.success) {
						setchildFiles(data.data.childFiles);
						setchildFolder(data.data.childFolder);
						setparentFolder(data.data.parentFolder);
					} else {
						seterror(data.error);
					}
				}
			} catch (e) {
				console.log(e);
				seterror("Some Error Occured");
			}
		};
		getFolderandFiles();
		// eslint-disable-next-line
	}, [dispatch, currentFolder, id]);

	return (
		<div className="">
			<Navbar />
			<div className="my-2 d-flex justify-content-flex-start">
				<Sidebar />
				<div className={styles.rightBox}>
					<div className="mt-4">
						<Button
							className={styles.backButton}
							onClick={() => history.goBack()}
						>
							Back
						</Button>
					</div>
					<div className="p-4">
						{error && <Message variant={"danger"}>{error}</Message>}
						{!error && loading && <Loader1></Loader1>}
						<div className={styles.fContainer}>
							{childFolder &&
							childFiles &&
							(childFolder.length || childFiles.length) ? (
								<div>
									<h4 className="mt-4 mt-2">Folder</h4>
									{childFolder && childFolder.length === 0 && (
										<div className={styles.empty}>
											<img
												src={noFolder}
												className={styles.emptyImg}
												alt="empty-img"
											/>
										</div>
									)}
									{childFolder && (
										<Row>
											{childFolder
												.sort((a, b) => {
													if (a.name < b.name)
														return -1;
													else return 1;
												})
												.map((folder) => {
													return (
														!folder.isrecycled && (
															<Col
																key={
																	folder.folder
																}
																sm={12}
																md={6}
																lg={4}
																xl={3}
															>
																<Folder
																	name={
																		folder.name
																	}
																	id={
																		folder.folder
																	}
																	link={`/folder/${folder.folder}`}
																	isrecycled={
																		folder.isrecycled
																	}
																></Folder>
															</Col>
														)
													);
												})}
										</Row>
									)}
									<h4 className="mt-4 mt-2">Files</h4>
									{childFiles && childFiles.length === 0 && (
										<div className={styles.empty}>
											<img
												src={noFolder}
												className={styles.emptyImg}
												alt="empty-img"
											/>
										</div>
									)}
									{childFiles && (
										<Row>
											{childFiles
												.sort((a, b) => {
													if (a.name < b.name)
														return -1;
													else return 1;
												})
												.map((file) => {
													return (
														!file.isrecycled && (
															<Col
																key={file.file}
																sm={12}
																md={6}
																lg={4}
																xl={3}
															>
																<File
																	name={
																		file.name
																	}
																	id={
																		file.file
																	}
																	link={
																		file.link
																	}
																></File>
															</Col>
														)
													);
												})}
										</Row>
									)}
								</div>
							) : (
								<div className={styles.wholeEmpty}>
									<img
										src={noFolder}
										className={styles.wholeEmptyImg}
										alt="empty-img"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Folders;
