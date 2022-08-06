import { React, useState } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import {url} from "../../utilities";
import axios from "axios";
import Message from "../Message";

function File({ name, id, link }) {
	const [show, setShow] = useState(false);
	const [error, seterror] = useState(null);
	const [, setloading] = useState(null);
	const [message, setmessage] = useState(null);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const resLink = link.slice(62)
	console.log(resLink)

	const userInfoFromStorage = localStorage.getItem("driveUserInfo")
		? JSON.parse(localStorage.getItem("driveUserInfo"))
		: null;
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userInfoFromStorage.token}`,
		},
	};
	if (error || message) {
		setTimeout(() => {
			seterror(null);
			setmessage(null);
		}, 3000);
	}

	const deleteFile = async () => {
		try {
			setloading(true);
			const { data } = await axios.delete(
				`${url}/api/files/delete/${id}`,
				config
			);
			if (data) {
				setloading(false);
				if (data.success) {
					setmessage("File successfully deleted");
					window.location.reload();
				} else {
					seterror(data.error);
				}
			}
		} catch (e) {
			console.log(e);
			seterror("Some error occured try again");
		}
	};

	const sendToRecycleBin = async () => {
		try {
			setloading(true);
			console.log(config);
			const { data } = await axios.put(
				`${url}/api/files/recycled/${id}`,
				{},
				config
			);
			if (data) {
				setloading(false);
				if (data.success) {
					setmessage("Check your file in bin");
					window.location.reload();
				} else {
					seterror(data.error);
				}
			}
		} catch (e) {
			console.log(e);
			seterror("Some error occured try again");
		}
	};

	// console.log(link)
	return (
		<>
			<div className={styles.file}>
				<Modal show={show} onHide={handleClose}>
					{error && <Message variant={"danger"}>{error}</Message>}
					{message && (
						<Message variant={"success"}>{message}</Message>
					)}
					<Modal.Body>
						<p class="text-danger">Do You Confirm Want to Delete</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="secondary" onClick={sendToRecycleBin}>
							Recycle
						</Button>
						<Button variant="danger" onClick={deleteFile}>
							Permanent Delete
						</Button>
					</Modal.Footer>
				</Modal>
				<div class={styles.header}>
					<DropdownButton
						id="dropdown-basic-button"
						title=""
						className={styles.dropDown}
					>
						<Dropdown.Item onClick={handleShow}>
							Delete
						</Dropdown.Item>
						<Dropdown.Item href={`/share?id=${resLink}&&name=${name}`}>
							Share
						</Dropdown.Item>
					</DropdownButton>
				</div>
				<div className={styles.icon}>
					<a href={link} target="_blank" rel="noreferrer">
						<FontAwesomeIcon
							icon={faFileDownload}
							className={styles.fIcon}
						/>
						{/* <div className={styles.fileIconContainer}>
							<img
								src={link}
								alt={link}
								className={styles.fileIcon}
							></img>
						</div> */}
					</a>
				</div>
				<div className={styles.name}>{name}</div>
			</div>
		</>
	);
}

export default File;
