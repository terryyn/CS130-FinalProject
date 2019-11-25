import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';


import Login from './containers/Login';
import Meeting from './containers/Meeting';
import Profile from './containers/Profile';
import Home from './containers/Home';

import Sidebar from './components/Sidebar';

import './styles/App.css';

function App() {
	const [ isLoggedIn, setLoggedIn ] = useState(true);

	const [ currentUser, setUser ] = useState("Test");
	const [ currentUserPhotoUrl, setUserPhotoUrl ] = useState("https://www.gstatic.com/images/branding/product/2x/photos_96dp.png");
	const [ currentUserEmail, setUserEmail ] = useState("test@test.com");

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/">
						{isLoggedIn ?
							(
								<div id="main-home">
									<Home currentUser={currentUser}/>
									<Sidebar setLoggedIn={setLoggedIn} currentUserPhotoUrl={currentUserPhotoUrl} currentPage={"home"}/>
								</div>
							) :
							(<Login setLoggedIn={setLoggedIn} setUserPhotoUrl={setUserPhotoUrl} setUser={setUser} setUserEmail={setUserEmail}/>)
						}
					</Route>
					<Route path="/profile">
						{isLoggedIn && <Sidebar setLoggedIn={setLoggedIn} currentUserPhotoUrl={currentUserPhotoUrl} currentPage={"profile"}/>}
						<Profile currentUser={currentUser} currentUserPhotoUrl={currentUserPhotoUrl} currentUserEmail={currentUserEmail} setUser={setUser}/>
					</Route>
					<Route path="/meeting">
						{isLoggedIn && <Sidebar setLoggedIn={setLoggedIn} currentUserPhotoUrl={currentUserPhotoUrl} currentPage={"meeting"}/>}
						<Meeting />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}	

export default App;
