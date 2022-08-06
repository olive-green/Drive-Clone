/* Global Css */
import "./App.css";
/* Bootstrap */
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
/* Register */
import Register from "./components/Register/index";
/* Login */
import Login from "./components/Login/index";
/* Home Page */
import Home from "./components/Home/index";
/* Drive Page */
import Drive from "./components/Drive/index";
import Folders from "./components/Folders/index";
/* About Page */
import About from "./components/About/index";
/* Recent Page */
import Recent from "./components/Recent/index";
/* Profile Page */
import Profile from "./components/Profile/index";
/* Share Page */
import Share from './components/Share/index'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Bin from "./components/Bin/index";

function App() {
	return (
		<Router>
			<div className="App">
				<Router>
					<Switch>
						<Route path="/" exact>
							<Register></Register>
						</Route>
						<Route path="/login">
							<Login></Login>
						</Route>
						<Route path="/home">
							<Home />
						</Route>
						<Route path="/drive">
							<Drive />
						</Route>
						<Route path="/folder/:id" component={Folders}></Route>
						<Route path="/bin" component={Bin}></Route>
						<Route path="/about" component={About}></Route>
						<Route path="/recent" component={Recent}></Route>
						<Route path="/profile" component={Profile}></Route>
						<Route path="/recycleBin" component={Bin}></Route>
						<Route path="/share" component={Share}></Route>
					</Switch>
				</Router>
			</div>
		</Router>
	);
}

export default App;
