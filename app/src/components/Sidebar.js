import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { CalendarToday, ExitToApp, MeetingRoom } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

function Sidebar() {
	const useStyles = makeStyles({
		list: {
			width: 250
		},
		fullList: {
			width: 'auto'
		}
	});

	return (
		<Drawer open variant="permanent" className="sidebar">
			<div className={useStyles().list}>
				<List>
					<ListItem>
						<ListItemIcon>
							<CalendarToday />
						</ListItemIcon>
						<ListItemText>
							<Link to="/home">Home</Link>
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
						<ListItemIcon>
							<ExitToApp />
						</ListItemIcon>
						<ListItemText>
							<Link to="/">Sign out</Link>
						</ListItemText>
					</ListItem>
				</List>
			</div>
		</Drawer>
	);
}

export default Sidebar;
