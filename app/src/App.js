import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import Login from './containers/Login';
import SignUp from './containers/SignUp';
import Meeting from './containers/Meeting';
import Home from './containers/Home';

import Sidebar from './components/Sidebar';

import './App.css';

function App() {
	const [ isLoggedIn, setLoggedIn ] = useState(false);

	const [ currentUser, setUser ] = useState("");

	return (
		<div className="App">
			<Router>
				{isLoggedIn && <Sidebar setLoggedIn={setLoggedIn}/>}
				<Switch>
					<Route exact path="/">
						{isLoggedIn ?
							(<Home currentUser={currentUser}/>) :
							(<Login setLoggedIn={setLoggedIn} setUser={setUser}/>)
						}
					</Route>
					<Route path="/meeting">
						<Meeting />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
