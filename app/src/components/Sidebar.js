import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { CalendarToday, ExitToApp, MeetingRoom } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
	list: {
		width: 250
	}
});

function Sidebar(props) {
	let signOut = () => {
		props.setLoggedIn(false);
	}
	
	return (
		<Drawer open variant="permanent" className={useStyles().list} classes={{ paper: useStyles().list }}>
			<List>
				<ListItem>
					<h2>UCal</h2>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<CalendarToday />
					</ListItemIcon>
					<ListItemText>
						<Link to="/">Home</Link>
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<MeetingRoom />
					</ListItemIcon>
					<ListItemText>
						<Link to="/meeting">Meeting</Link>
					</ListItemText>
				</ListItem>
				<Divider />
				<ListItem>
					<ListItemAvatar>
						<Avatar alt="User Photo" src={props.currentUserPhotoUrl} />
					</ListItemAvatar>
					<ListItemText>
						<Link to="/profile">Profile</Link>
					</ListItemText>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<ExitToApp />
					</ListItemIcon>
					<ListItemText>
						<Link onClick={signOut} to="/">Sign out</Link>
					</ListItemText>
				</ListItem>
			</List>
		</Drawer>
	);
}

export default Sidebar;
