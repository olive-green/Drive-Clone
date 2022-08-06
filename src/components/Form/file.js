import React, { useState } from "react";
import Message from "../Message/index";
import { Button, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { openUploadWidget } from "../../util/CloudinaryService";
import axios from "axios";
import styles from "./styles.module.css";
import Loader1 from "../Loader/Loader-1";
import {url} from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

function FileForm() {
	const [img_url, setimg_url] = useState("");
	const [show, setShow] = useState(false);
	const [fileURL, setfileURL] = useState(null);
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

	const beginUpload = (tag) => {
		const uploadOptions = {
			cloudName: "dtqzhg98l",
			tags: [tag, "my image"],
			uploadPreset: "vdkuxmpd",
		};

		openUploadWidget(uploadOptions, (error, photos) => {
			if (!error) {
				// console.log(photos);
				if (photos.event === "success") {
					// console.log(photos.info.secure_url)
					setfileURL(photos.info.secure_url);
					setname(photos.info.original_filename);
					setimg_url(photos.info.secure_url);
				}
			} else {
				console.log(error);
			}
		});
	};

	const submitFileHandler = async (e) => {
		e.preventDefault();
		try {
			const userInfoFromStorage = localStorage.getItem("driveUserInfo")
				? JSON.parse(localStorage.getItem("driveUserInfo"))
				: null;
			if (fileURL && name) {
				let obj = {
					name: name,
					link: String(fileURL),
					parentFolder: currentFolder,
				};
				console.log(obj);
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userInfoFromStorage.token}`,
					},
				};
				// console.log(config)
				setloading(true);
				const { data } = await axios.post(
					`${url}/api/files/create`,
					obj,
					config
				);
				setloading(false);
				// console.log(data)
				if (data) {
					setloading(false);
					if (data.success) {
						setmessage("File created !");
						setcount(true);
						window.location.reload();
					} else {
						seterror(data.error);
					}
				}
			} else {
				seterror("Fill Name and Upload File");
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
				<FontAwesomeIcon icon={faFileUpload} className={styles.fIcon} />
				&nbsp;File Upload
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Upload File</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{img_url !== "" ? (
						<img
							src={img_url}
							className={styles.previewImg}
							alt="preview_img"
						/>
					) : null}
					<Form>
						{error && <Message variant={"danger"}>{error}</Message>}
						{message && (
							<Message variant={"success"}>{message}</Message>
						)}
						<Form.Group controlId="formBasicName">
							<Form.Label>File Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter File Name"
								value={name}
								onChange={(e) => {
									setname(e.target.value);
								}}
							/>
							<Button
								onClick={() => beginUpload()}
								className="mt-4"
							>
								{img_url === ""
									? "Upload File"
									: "+Change File"}
							</Button>
						</Form.Group>
						{loading ? (
							<Loader1></Loader1>
						) : (
							<Button
								variant="danger"
								type="submit"
								onClick={submitFileHandler}
								disabled={loading}
							>
								Submit
							</Button>
						)}
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default FileForm;
