import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Message from "../Message/index";
import Loader1 from "../Loader/Loader-1/index";
import registerImg from "../../assets/img/register.png";
import axios from "axios";
import {url} from "../../utilities";
function Login() {
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");
	const [error, seterror] = useState(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setuser] = useState(null);

	const history = useHistory();

	const localData = localStorage.getItem("driveUserInfo");
	const userInfo = localData ? JSON.parse(localData) : null;

	useEffect(() => {
		if (userInfo || user) {
			history.push("/home");
		}
		// eslint-disable-next-line
	}, [userInfo]);

	if (error) {
		setTimeout(() => {
			seterror(null);
		}, 3000);
	}

	const submitLogin = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post(`${url}/api/users/login`, {
				email,
				password,
			});

			setLoading(false);
			if (data && data.success) {
				localStorage.setItem(
					"driveUserInfo",
					JSON.stringify(data.data)
				);
				setSuccess(true);
				setuser(data.data);
			} else {
				if (data) {
					seterror(data.message);
				} else {
					seterror("Network error");
				}
			}
		} catch (e) {
			setLoading(false);
			seterror("Network Error");
		}
	};
	return (
		<div className="container my-5 d-flex justify-content-center align-items-center ">
			<div className={styles.leftSection}>
				<h2 className={styles.logoHeading}>Drive</h2>
				<img
					src={registerImg}
					className={styles.registerImg}
					alt="display_img"
				/>
			</div>
			<div
				className="form-container my-5 p-4 shadow"
				id="formBox"
				style={{ minWidth: "350px" }}
			>
				{error && <Message variant={"danger"}>{error}</Message>}
				{success && (
					<Message variant={"success"}>Loggedin Successfully</Message>
				)}
				<div className="mt-4">
					<Form onSubmit={submitLogin}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter email"
								value={email}
								required
								onChange={(e) => {
									setemail(e.target.value);
								}}
							/>
							<Form.Text className="text-muted">
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>
						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								value={password}
								required
								onChange={(e) => {
									setpassword(e.target.value);
								}}
							/>
						</Form.Group>
						{loading ? (
							<Loader1></Loader1>
						) : (
							<Button type="submit" className={styles.btn}>
								Login
							</Button>
						)}
					</Form>
					<div className="mt-3">
						<p>
							Don't have an account ? <Link to="/">Signup</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
