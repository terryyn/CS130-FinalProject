import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';


import Login from './containers/Login';
import Meeting from './containers/Meeting';
import Profile from './containers/Profile';
import Home from './containers/Home';

import Sidebar from './components/Sidebar';

import './styles/App.css';

function App() {
	const [ isLoggedIn, setLoggedIn ] = useState(false);

	const [ currentUser, setUser ] = useState("");
	const [ currentUserPhotoUrl, setUserPhotoUrl ] = useState("");
	const [ currentUserEmail, setUserEmail ] = useState("");

	return (
		<div className="App">
			<Router>
				{isLoggedIn && <Sidebar setLoggedIn={setLoggedIn} currentUserPhotoUrl={currentUserPhotoUrl}/>}
				<Switch>
					<Route exact path="/">
						{isLoggedIn ?
							(<Home currentUser={currentUser}/>) :
							(<Login setLoggedIn={setLoggedIn} setUserPhotoUrl={setUserPhotoUrl} setUser={setUser} setUserEmail={setUserEmail}/>)
						}
					</Route>
					<Route path="/profile">
						<Profile currentUser={currentUser} currentUserPhotoUrl={currentUserPhotoUrl} currentUserEmail={currentUserEmail} setUser={setUser}/>
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
