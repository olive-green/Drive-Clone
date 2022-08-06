import React, { useState, useEffect } from "react";
import axios from "axios";
import {url} from "../../utilities";
import { openUploadWidget } from "../../util/CloudinaryService";
import Message from "../Message/index";
import styles from "./styles.module.css";
import Navbar from "../Navbar/index";
import { Link } from "react-router-dom";
import Loader1 from "../Loader/Loader-1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faDatabase,
	faDesktop,
	faCalendarWeek,
	faSdCard,
	faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Button } from "react-bootstrap";

function Profile() {
	const [name, setname] = useState(null);
	const [imgurl, setimgurl] = useState(null);
	const [email, setemail] = useState(null);
	const [password, setpassword] = useState(null);
	const [error, seterror] = useState(null);
	const [message, setmessage] = useState(null);
	const [loading, setloading] = useState(false);
	if (error || message) {
		setTimeout(() => {
			seterror(null);
			setmessage(null);
		}, 3000);
	}
	// Cloudinary Setup
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
					setimgurl(photos.info.secure_url);
				}
			} else {
				console.log(error);
			}
		});
	};

	const usernameHandler = (e) => {
		setname(e.target.value);
	};
	const emailHandler = (e) => {
		setemail(e.target.value);
	};
	const passwordHandler = (e) => {
		setpassword(e.target.value);
	};

	const submitHandler = async (e) => {
		// alert('submitted');
		e.preventDefault();
		try {
			const userInfoFromStorage = localStorage.getItem("driveUserInfo")
				? JSON.parse(localStorage.getItem("driveUserInfo"))
				: null;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfoFromStorage.token}`,
				},
			};
			setloading(true);
			const { data } = await axios.put(
				`${url}/api/users/update`,
				{ name, email, password, imgurl },
				config
			);
			setloading(false);
			if (data.success) {
				setloading(false);
				setmessage("Updated!!!");
				setname(data.name);
				setemail(data.email);
				setimgurl(data.imgurl);
				window.location.reload();
			} else {
				setloading(false);
				seterror(data.error);
			}
		} catch (e) {
			console.log(e);
			seterror("Some error occured try again");
		}
	};
	// use effect
	useEffect(() => {
		const userInfoFromStorage = localStorage.getItem("driveUserInfo")
			? JSON.parse(localStorage.getItem("driveUserInfo"))
			: null;

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfoFromStorage.token}`,
			},
		};
		const getData = async () => {
			const { data } = await axios.get(`${url}/api/users/`, config);

			console.log(data);

			if (data.success) {
				setname(data.data.name);
				setemail(data.data.email);
				setimgurl(data.data.imgurl);
			} else {
				seterror(`${data.error}`);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<Navbar />
			<div className="my-2 d-flex justify-content-flex-start">
				{/* Left Part(20%) */}
				<div className={styles.leftSideBar}>
					{/* Add File/Folder */}
					{/* <Modals /> */}
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
					<button className={styles.optionBtn}>
						<FontAwesomeIcon icon={faCalendarWeek} />
						&nbsp;&nbsp; Recent
					</button>
					<button className={styles.optionBtn}>
						<FontAwesomeIcon icon={faSdCard} />
						&nbsp;&nbsp; Bin
					</button>
				</div>
				{/* Right Side */}
				<div className={styles.rightBox}>
					<div
						className={`card shadow col-6 p-4 ${styles.profileCard}`}
					>
						<Form>
							{error && (
								<Message variant={"danger"}>{error}</Message>
							)}
							{message && (
								<Message variant={"success"}>{message}</Message>
							)}
							<div className={`mb-1 ${styles.profileImgWrapper}`}>
								<img
									src={imgurl}
									alt="user_img"
									draggable="false"
									className={styles.profileImg}
								/>
							</div>
							<Button
								onClick={() => beginUpload()}
								className="btn btn-dark px-3"
								style={{ marginTop: "-74px" }}
							>
								<FontAwesomeIcon icon={faEdit} />
							</Button>
							<Form.Group>
								<Form.Control
									type="text"
									value={imgurl}
									className="d-none"
								/>
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="formBasicEmail"
							>
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="username"
									value={name}
									onChange={usernameHandler}
									placeholder="Update Username"
									required="true"
								/>
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="formBasicEmail"
							>
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									value={email}
									onChange={emailHandler}
									placeholder="Enter email"
									required="true"
								/>
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="formBasicPassword"
							>
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="text"
									value={password}
									onChange={passwordHandler}
									placeholder="Password"
									required="true"
								/>
							</Form.Group>
							{loading ? (
								<Loader1></Loader1>
							) : (
								<Button
									className="p-2"
									style={{ width: "100%" }}
									variant="primary"
									type="submit"
									onClick={submitHandler}
									disabled={loading}
								>
									Update
								</Button>
							)}
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
