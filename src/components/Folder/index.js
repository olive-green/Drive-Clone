import { React, useState } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import {url} from "../../utilities";
import axios from "axios";
import Message from "../Message";


function Folder({ name, id, link, isrecycled }) {
	console.log(isrecycled);
	const [show, setShow] = useState(false);
	const [error, seterror] = useState(null);
	const [, setloading] = useState(null);
	const [message, setmessage] = useState(null);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

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

	const deleteFolder = async () => {
		try {
			setloading(true);
			const { data } = await axios.delete(
				`${url}/api/folders/delete/${id}`,
				config
			);
			if (data) {
				setloading(false);
				if (data.success) {
					setmessage("Folder successfully deleted");
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
				`${url}/api/folders/recycled/${id}`,
				{},
				config
			);
			if (data) {
				setloading(false);
				if (data.success) {
					setmessage("Check your folder in bin");
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

	const removeFromRecycleBin = async () => {
		try {
			setloading(true);
			console.log(config);
			const { data } = await axios.put(
				`${url}/api/folders/recover/${id}`,
				{},
				config
			);
			if (data) {
				setloading(false);
				if (data.success) {
					setmessage("Check your folder in bin");
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

	return (
		<>
			<div className={styles.folder}>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>AA Drive</Modal.Title>
					</Modal.Header>
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
						{isrecycled ? (
							<Button
								variant="danger"
								onClick={removeFromRecycleBin}
							>
								Restore
							</Button>
						) : (
							<Button variant="danger" onClick={sendToRecycleBin}>
								Recycle
							</Button>
						)}
						<Button variant="danger" onClick={deleteFolder}>
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
						</DropdownButton>
				</div>
				<Link to={link}>
					<div className={styles.icon}>
						<FontAwesomeIcon
							icon={faFolderPlus}
							className={styles.folderIcon}
						/>
					</div>
				</Link>
				<div className={styles.name}>{name}</div>
			</div>
		</>
	);
}

export default Folder;
