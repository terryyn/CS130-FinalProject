import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import { CalendarToday, ExitToApp, MeetingRoom } from '@material-ui/icons';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import '../styles/sidebar.css';

import Server from '../server';
const server = new Server();

function Sidebar(props) {
	let signOut = () => {
		props.setLoggedIn(false);
		props.setTryLogin(false);
		server.logoutUser();
	}
	
	return (
		<div id="sidebar">
			<div id="sidebar-heading">
				<Typography variant="h4" gutterBottom id="c1">
					U
				</Typography>
				<Typography variant="h4" gutterBottom id="c2">
					C
				</Typography>
				<Typography variant="h4" gutterBottom id="c3">
					a
				</Typography>
				<Typography variant="h4" gutterBottom id="c4">
					l
				</Typography>
			</div>
			<List id="navlist">
				<ListItem>
					<ListItemIcon>
						{props.currentPage=="home" ?
							(<CalendarToday />) :
							(<CalendarToday color="disabled"/>)
						}
					</ListItemIcon>
					<ListItemText>
						{props.currentPage=="home" ?
							(<Link class="navlink-selected" to="/home">Home</Link>) :
							(<Link class="navlink" to="/home">Home</Link>)
						}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						{props.currentPage=="meeting" ?
							(<MeetingRoom />) :
							(<MeetingRoom color="disabled"/>)
						}
					</ListItemIcon>
					<ListItemText>
						{props.currentPage=="meeting" ?
							(<Link class="navlink-selected" to="/meeting">Meeting</Link>) :
							(<Link class="navlink" to="/meeting">Meeting</Link>)
						}
					</ListItemText>
				</ListItem>
				<Divider id="divider"/>
				<ListItem>
					<ListItemIcon>
						<NotificationsIcon />
					</ListItemIcon>
					<ListItemText>
						<Link class="navlink" to="/">Notifications</Link>
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemAvatar>
						<Avatar alt="User Photo" src={props.currentUserPhotoUrl} />
					</ListItemAvatar>
					<ListItemText>
						{props.currentPage=="profile" ?
							(<Link class="navlink-selected" to="/profile">Profile</Link>) :
							(<Link class="navlink" to="/profile">Profile</Link>)
						}
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<ExitToApp color="disabled"/>
					</ListItemIcon>
					<ListItemText>
						<Link class="navlink" onClick={signOut} to="/">Sign out</Link>
					</ListItemText>
				</ListItem>
			</List>
		</div>
	);
}

export default Sidebar;
