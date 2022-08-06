import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import {url} from "../../utilities";
import Loader1 from "../Loader/Loader-1";
import Message from "../Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

function FolderForm() {
	const [show, setShow] = useState(false);
	const [name, setname] = useState("");
	const [error, seterror] = useState(null);
	const [message, setmessage] = useState(null);
	const [loading, setloading] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const { currentFolder } = useSelector((state) => state.currentFolder);
	// const {userInfo}=useSelector(state=>state.userLogin)
	const [count, setcount] = useState(false);
	if (error || message) {
		setTimeout(() => {
			seterror(null);
			setmessage(null);
		}, 3000);
	}

	useEffect(() => {
		console.log("Hello");
	}, []);

	const submitFolderHandler = async (e) => {
		e.preventDefault();
		try {
			const userInfoFromStorage = localStorage.getItem("driveUserInfo")
				? JSON.parse(localStorage.getItem("driveUserInfo"))
				: null;
			if (name) {
				let obj = {
					name: name,
					parentFolder: currentFolder,
				};
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userInfoFromStorage.token}`,
					},
				};
				// console.log(config)
				setloading(true);
				const { data } = await axios.post(
					`${url}/api/folders/create`,
					obj,
					config
				);
				setloading(false);
				// console.log(data)
				if (data) {
					setloading(false);
					if (data.success) {
						setmessage("Folder created !");
						setcount(true);
						window.location.reload();
					} else {
						seterror(data.error);
					}
				}
			} else {
				seterror("Fill folder name");
			}
		} catch (e) {
			console.log(e);
			seterror("Some error occured try again");
		}
	};

	return (
		<>
			<Button
				className={styles.fBtn}
				onClick={handleShow}
				style={{ display: count === true ? "none" : "block" }}
			>
				<FontAwesomeIcon icon={faFolderPlus} className={styles.fIcon} />
				&nbsp;Folder Upload
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>AA DRIVE</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{error && <Message variant={"danger"}>{error}</Message>}
						{message && (
							<Message variant={"success"}>{message}</Message>
						)}
						<Form.Group controlId="formBasicName">
							<Form.Label>Folder Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter File Name"
								value={name}
								onChange={(e) => setname(e.target.value)}
							/>
						</Form.Group>
						{loading ? (
							<Loader1></Loader1>
						) : (
							<Button
								variant="primary"
								type="submit"
								onClick={submitFolderHandler}
							>
								Create
							</Button>
						)}
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default FolderForm;
