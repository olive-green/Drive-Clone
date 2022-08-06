import React, { useState, useEffect } from "react";
import axios from "axios";
import {url} from "../../utilities";
import styles from "./styles.module.css";
import {
	Navbar,
	Nav,
	InputGroup,
	Dropdown,
	ButtonGroup,
	Button,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import Overlay from "../Overlay/index";

function Menu() {
	const history = useHistory();
	const dispatch = useDispatch();

	const logoutHandler = () => {
		// console.log('Clicked')
		dispatch(logout());
		history.push("/login");
	};
	// States
	const [name, setname] = useState(null);
	const [imgurl, setimgurl] = useState(null);
	const [overlay, setoverlay] = useState(false);
	const [searchfiles, setsearchfiles] = useState(null);
	const [searchfolders, setsearchfolders] = useState(null);
	// Search Functionality
	const [searchtext, setsearchtext] = useState(null);

	const searchHandler = (e) => {
		const userInfoFromStorage = localStorage.getItem("driveUserInfo")
			? JSON.parse(localStorage.getItem("driveUserInfo"))
			: null;

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfoFromStorage.token}`,
			},
		};
		e.preventDefault();
		console.log(e.target.value);
		setoverlay(true);
		setsearchtext(e.target.value);
		if (e.target.value === "") {
			setsearchfiles(null);
			setsearchfolders(null);
		} else {
			setTimeout(async () => {
				// console.log("request made")
				const { data } = await axios.get(
					`${url}/api/search/${e.target.value}`,
					config
				);
				console.log(data);
				setsearchfiles(data.data.fileData);
				setsearchfolders(data.data.folderdata);
			}, 200);
		}
	};
	// useEffect
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

			// console.log(data);

			if (data.success) {
				setname(data.data.name);
				setimgurl(data.data.imgurl);
			} else {
				console.log("error");
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);
	return (
		<div>
			<Navbar className="p-3" bg="light" variant="light">
				<Link to="/home">
					<Navbar.Brand href="#">AA.Drive</Navbar.Brand>
				</Link>
				<InputGroup className={styles.searchBox}>
					<input
						className="form-control"
						value={searchtext}
						onChange={searchHandler}
						placeholder="Search"
					/>
					<button className="btn btn-primary">Search</button>
				</InputGroup>
				<Nav className="ml-auto align-items-center">
					<Nav.Link href="/about">
						<h5 className="text-dark">About</h5>
					</Nav.Link>
					&nbsp;
					<Dropdown as={ButtonGroup}>
						<Button variant="outline-info">
							<img
								src={imgurl}
								className={styles.navImg}
								alt="user_img"
							/>
							&nbsp;{name}
						</Button>
						<Dropdown.Toggle
							split
							variant="primary"
							id="dropdown-split-basic"
						/>
						<Dropdown.Menu>
							<Dropdown.Item href="/profile">
								Profile
							</Dropdown.Item>
							<Dropdown.Item
								href="#"
								className="text-danger"
								onClick={logoutHandler}
							>
								Logout
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Nav>
			</Navbar>
			{overlay === true ? (
				<Overlay files={searchfiles} folders={searchfolders} />
			) : null}
		</div>
	);
}

export default Menu;
