import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom';


import Login from './containers/Login';
import Meeting from './containers/Meeting';
import Profile from './containers/Profile';
import Home from './containers/Home';
import Sidebar from './components/Sidebar';

import './styles/App.css';

import Server from './server';
const server = new Server();

function App() {
	const [ isLoggedIn, setLoggedIn ] = useState(false);
	const [ tryLogin, setTryLogin ] = useState(true);

	const [ currentUser, setUser ] = useState("");
	const [ currentUserPhotoUrl, setUserPhotoUrl ] = useState("https://cdn2.iconfinder.com/data/icons/animal-outline-icons-set/144/Dog-512.png");
	const [ currentUserEmail, setUserEmail ] = useState("");
	const [ currentIsInstructor, setcurrentIsInstructor ] = useState(false);
	const [ currentCourses, setCurrentCourses ] = useState([]);

	async function authUser() {
		server.authenticateUser().then(data => {
			if (data!="fail") {
				setLoggedIn(true);
				setUserEmail(data.email);
				setUser(data.name);
				setcurrentIsInstructor(data.is_instructor);
				if ('courses' in data) if (data.courses != '') setCurrentCourses(data.courses.split(','));
			}
		})
	}

	useEffect(() => {
		if (tryLogin) {
			authUser();
		}
	}, []);

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/">
						{isLoggedIn ?
							(
								<Redirect to='/home' />
							) :
							(<Login setLoggedIn={setLoggedIn} setTryLogin={setTryLogin} setUserPhotoUrl={setUserPhotoUrl} setUser={setUser} setUserEmail={setUserEmail} setcurrentIsInstructor={setcurrentIsInstructor} setCurrentCourses={setCurrentCourses}/>)
						}
					</Route>
					<Route path="/home">
						{isLoggedIn ?
							(
								<div id="main-page">
									<Sidebar setLoggedIn={setLoggedIn} setTryLogin={setTryLogin} currentUserPhotoUrl={currentUserPhotoUrl} currentPage={"home"}/>
									<Home currentUser={currentUser} currentCourses={currentCourses} currentIsInstructor={currentIsInstructor}/>
								</div>
							) :
							(<Redirect to='/' />)
						}
					</Route>
					<Route path="/profile">
						{isLoggedIn ?
							(
								<div id="main-page">
									<Sidebar setLoggedIn={setLoggedIn} setTryLogin={setTryLogin} currentUserPhotoUrl={currentUserPhotoUrl} currentPage={"profile"}/>
									<Profile currentUser={currentUser} currentUserPhotoUrl={currentUserPhotoUrl} currentUserEmail={currentUserEmail} currentIsInstructor={currentIsInstructor} currentCourses={currentCourses} setUser={setUser} setUserPhotoUrl={setUserPhotoUrl} setUserEmail={setUserEmail} setcurrentIsInstructor={setcurrentIsInstructor} setCurrentCourses={setCurrentCourses}/>
								</div>
							) :
							(<Redirect to='/' />)
						}
					</Route>
					<Route path="/meeting">
						{isLoggedIn ?
							(
								<div id="main-page">
									<Sidebar setLoggedIn={setLoggedIn} setTryLogin={setTryLogin} currentUserPhotoUrl={currentUserPhotoUrl} currentPage={"meeting"}/>
									<Meeting />
								</div>
							) :
							(<Redirect to='/' />)
						}
					</Route>
				</Switch>
			</Router>
		</div>
	);
}	

export default App;
