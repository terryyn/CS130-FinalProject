import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import '../styles/meeting.css'

const useStyles = makeStyles({
	grid: {
		padding: '32px'
	},
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: 'white',
		borderRadius: '3px',
		boxShadow:
			'0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
	},
	textField: {
		height: 10
	},

	timeField: {
		height: 10
	}
});
function Meeting() {
	const classes = useStyles();

	const [ showAvailable, setShowAvailable ] = useState(false);
	const [ availableTimes, setAvailable ] = useState([ 1 ]);

	function renderCreateMeeting() {
		return (
			<Card>
				<div className="addevent">
					<CardHeader title="Select range" />
					<CardContent>
						<form className="addevent-form" onSubmit={() => {}}>
							<div className="addevent-field" id="start">
								<InputLabel id="start-label">Start range</InputLabel>
								<TextField id="startdate-input" type="date" variant="outlined" onChange={() => {}} />
								<div id="starttime">
									<TextField
										id="starttime-input"
										type="time"
										variant="outlined"
										onChange={() => {}}
									/>
								</div>
							</div>

							<div className="addevent-field" id="end">
								<InputLabel id="end-label">End range</InputLabel>
								<TextField id="enddate-input" type="date" variant="outlined" onChange={() => {}} />
								<div id="endtime">
									<TextField id="endtime-input" type="time" variant="outlined" onChange={() => {}} />
								</div>
							</div>

							<div className="addevent-field" id="name">
								<InputLabel id="name-label">Name</InputLabel>
								<TextField
									required
									id="name-input"
									title={'name'}
									variant="outlined"
									onChange={() => {}}
								/>
							</div>
						</form>
					</CardContent>
				</div>
			</Card>
		);
	}

	function renderInviteFriends() {
		return (
			<Card style={{ marginTop: '16px' }}>
				<div className="addevent">
					<CardHeader title="Invite up to 4 friends" />
					<CardContent>
						<form className="addevent-form" onSubmit={() => {}}>
							<div className="addevent-field" id="name">
								<InputLabel id="name-label">Name</InputLabel>
								<TextField
									required
									id="name-input"
									title={'name'}
									variant="outlined"
									onChange={() => {}}
								/>
							</div>
							<div className="addevent-field" id="name">
								<InputLabel id="name-label">Name</InputLabel>
								<TextField
									required
									id="name-input"
									title={'name'}
									variant="outlined"
									onChange={() => {}}
								/>
							</div>
							<div className="addevent-field" id="name">
								<InputLabel id="name-label">Name</InputLabel>
								<TextField
									required
									id="name-input"
									title={'name'}
									variant="outlined"
									onChange={() => {}}
								/>
							</div>
							<div className="addevent-field" id="name">
								<InputLabel id="name-label">Name</InputLabel>
								<TextField
									required
									id="name-input"
									title={'name'}
									variant="outlined"
									onChange={() => {}}
								/>
							</div>
						</form>
					</CardContent>
				</div>
			</Card>
		);
	}

	function renderAvailableTimes() {
		return (
			showAvailable && (
				<Card style={{ marginTop: '16px' }}>
					<div className="addevent">
						<CardHeader title="Available times" />
						<CardContent>
							{availableTimes.map((time) => (
								<Card style={{ marginBottom: '16px' }}>
									<CardContent>{`${time.date}: ${time.start} to ${time.end}`}</CardContent>
								</Card>
							))}
						</CardContent>
					</div>
				</Card>
			)
		);
	}

	function getAvailableTimes() {
		setAvailable([
			{ start: '8:00 a.m.', end: '9:00 a.m.', date: '11/15' },
			{ start: '9:00 a.m.', end: '10:00 a.m.', date: '11/15' }
		]);
		setShowAvailable(true);
	}

	return (
		<div id="meeting-card">
			<div>
				<h1 id="name-h1">Create a meeting</h1>
			</div>
			<div id="meeting-content">
				<Grid container spacing={3} className={classes.grid}>
					<Grid item xs={8}>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							{renderCreateMeeting()}
							{renderInviteFriends()}
							<Button variant="contained" color="primary" onClick={getAvailableTimes}>
								Find available times
							</Button>
						</div>
					</Grid>
					<Grid item xs={4}>
						{renderAvailableTimes()}
					</Grid>
				</Grid>
			</div>
		</div>
	);
}

export default Meeting;
