import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
} from "../constants/userConstants";
import url from "../utilities";
import axios from "axios";
import { resetConfig, setconfig } from "./configActions";
export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST });

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.post(
			`${url}/api/users/login`,
			{ email, password },
			config
		);
		if (data.success) {
			dispatch(setconfig(data.data.token));
			dispatch({
				type: USER_LOGIN_SUCCESS,
				payload: data,
			});
			localStorage.setItem("driveUserInfo", JSON.stringify(data.data));
		} else {
			dispatch({
				type: USER_LOGIN_FAIL,
				payload: data.message,
			});
		}
	} catch (e) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};

export const logout = () => (dispatch) => {
	localStorage.removeItem("driveUserInfo");
	dispatch({
		type: USER_LOGOUT,
	});
	dispatch(resetConfig());
};

export const register = (name, email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_REGISTER_REQUEST,
		});
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post(
			`${url}/api/users`,
			{ name, email, password },
			config
		);

		if (data.success) {
			dispatch(setconfig(data.data.token));
			dispatch({
				type: USER_REGISTER_SUCCESS,
				payload: data,
			});
			localStorage.setItem("driveUserInfo", JSON.stringify(data.data));
		} else {
			dispatch({
				type: USER_REGISTER_FAIL,
				payload: data.message,
			});
		}
	} catch (error) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
