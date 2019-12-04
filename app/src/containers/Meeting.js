import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

import '../styles/meeting.css'
import { withTheme } from '@material-ui/styles';

import Server from '../server';
const server = new Server();

const useStyles = makeStyles(theme =>({
	grid: {
		height: '100%',
		width: '100%',
		margin: '0',
		padding: '3%'
	},
	cardContent: {
		height: '75%',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: '80%',
	},
	pos: {
		marginBottom: 12,
		marginTop:'-16px',
		paddingLeft: '16px',
		color: '#aaaaaa',
	}
}));
function Meeting() {
	const classes = useStyles();

	const [ showAvailable, setShowAvailable ] = useState(false);
	const [ availableTimes, setAvailableTimes] = useState([]);

	const [ startDate, setStartDate ] = useState(new Date());
	const [ endDate, setEndDate ] = useState(new Date());

	const [ meetingDes, setMeetingDes ] = useState("");
	const [ meetingLoc, setMeetingLoc ] = useState("");
	const [ meetingName, setMeetingName ] = useState("");
	const [ duration, setDuration] = useState("0");

	const [ guests, setGuests ] = useState("");
	const [ course, setCourse ] = useState("");

	const [ showSuccess, setSuccess ] = useState(false);
	const [ customStartDate, setCustomStartDate ] = useState(new Date());
	const [ customEndDate, setCustomEndDate ] = useState(new Date());

	const [ availableRooms, setAvailableRooms] = useState(new Object());
	const [ roomErrMsg, setRoomErrMsg]  = useState("");


	const handleStartDateChange = date => {
		setStartDate(date);
	};

	const handleEndDateChange = date => {
		setEndDate(date);
	};

	const handleMeetingDesChange = desc => {
		setMeetingDes(desc.target.value);
	};

	const handleMeetingLocChange = desc => {
		setMeetingLoc(desc.target.value);
	};

	const handleMeetingNameChange = desc => {
		setMeetingName(desc.target.value);
	};

	const handleGuestsChange = desc => {
		setGuests(desc.target.value);
		setCourse("");
	};

	const handleCourseChange = courseInput => {
		setCourse(courseInput.target.value);
		setGuests("");
	};

	const submitMeeting = (startDateMeeting, endDateMeeting) => {
		setSuccess(true);
		addEvent(startDateMeeting, endDateMeeting);
	};

	const handleClose = () => {
		setSuccess(false);
	};

	const handleCustomStartDate = date => {
		setCustomStartDate(date);
		setCustomEndDate(date);
	};

	const handleCustomEndDate = date => {
		setCustomEndDate(date);
	};

	const handleAvailableRooms = rooms => {
		setAvailableRooms(rooms);
	};

	const handleRoomErrMsg = msg => {
		setRoomErrMsg(msg);
	}

	const handleDuration = dur => {
		setDuration(dur.target.value);
	}

	function formatDate(d) {
		var month = '' + (d.getMonth() + 1);
		var day = '' + d.getDate();
		var year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}

	function formateTime(d) {
		var datetext = d.toTimeString();
		var datetext = datetext.split(' ')[0];
		return datetext.substring(0, 5);
	}

	async function addEvent(time) {
		var start = time.substring(0,time.lastIndexOf('-'));
		const form = {
			startdate: start.substring(0,start.indexOf(' ')),
			starttime: start.substring(start.indexOf(' ')+1,start.length),
			enddate: start.substring(0,start.indexOf(' ')),
			endtime: time.substring(time.lastIndexOf('-'),time.length),
			location: meetingLoc,
			name: meetingName,
			type: 6,
			description: meetingDes,
			course: course,
			guests: guests,
			frequency_type: 0
		};

		server.addEvent(form);
	}


	function renderCreateMeeting() {
		return (
			<Card id="material-card-container">
				<CardHeader title="Select range" />
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<CardContent>
						<form id="range-form" onSubmit={() => {}}>
							<div id="range-container">
								<div className="meeting-field" id="from-field">
									<KeyboardDatePicker
										margin="normal"
										id="date-picker-dialog"
										label="From"
										format="MM/dd/yyyy"
										value={startDate}
										onChange={handleStartDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
									<KeyboardTimePicker
										margin="normal"
										id="time-picker"
										label="Time"
										value={startDate}
										onChange={handleStartDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change time',
										}}
									/>
								</div>
								<div className="meeting-field" id="to-field">
									<KeyboardDatePicker
										margin="normal"
										id="date-picker-dialog"
										label="To"
										format="MM/dd/yyyy"
										value={endDate}
										onChange={handleEndDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
									<KeyboardTimePicker
										margin="normal"
										id="time-picker"
										label="Time"
										value={endDate}
										onChange={handleEndDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change time',
										}}
									/>
								</div>
							</div>
							<div className="meeting-field" id="description-and-loc">
								<TextField
									id="outlined-multiline-flexible"
									label="Name"
									value={meetingName}
									onChange={handleMeetingNameChange}
									className={classes.textField}
									margin="normal"
									variant="outlined"
								/>
								<TextField
									id="outlined-multiline-flexible"
									label="Description"
									multiline
									rowsMax="4"
									value={meetingDes}
									onChange={handleMeetingDesChange}
									className={classes.textField}
									margin="normal"
									variant="outlined"
								/>
								<TextField
									id="outlined-multiline-flexible"
									label="Duration"
									value={duration}
									onChange={handleDuration}
									className={classes.textField}
									margin="normal"
									variant="outlined"
								/>
							</div>
						</form>
					</CardContent>
				</MuiPickersUtilsProvider>
			</Card>
		);
	}

	function renderInviteFriends() {
		return (
			<Card id="material-card-container">
				<CardHeader title="Invite guests" />
				<CardContent>
					<form id="guest-form" onSubmit={() => {}}>
						<TextField
							id="course"
							label="Course name (Ex: CS 130)"
							className={classes.textField}
							margin="normal"
							variant="outlined"
							value={course}
							onChange={handleCourseChange}
						/>
						<Divider id="divider" variant="middle" />
						<TextField
							id="guests"
							label="Emails (comma-separated)"
							multiline
							rows="4"
							className={classes.textField}
							margin="normal"
							variant="outlined"
							value={guests}
							onChange={handleGuestsChange}
						/>
					</form>
				</CardContent>
			</Card>
		);
	}

	function renderAvailableTimes() {
		return (
			showAvailable && (
				<Card id="time-card">
					<div id="time-container">
						<CardHeader title="Available times" />
						<Typography className={classes.pos} color="textSecondary">
							Times that work for all guests
						</Typography>
						<CardContent className={classes.cardContent}>
							{
								(availableTimes.length>0) ?
								(
									<div id="time-buttons">
										{availableTimes.map((time, index) => (
											<div>
											<Button key={index} variant="outlined" onClick={() => {submitMeeting(time)}}>
												{time}
											</Button>
											<Typography>
												<Link href="http://calendar.library.ucla.edu/reserve">{Array.from(availableRooms[time.substring(0,time.lastIndexOf('-'))].keys())}</Link>
											</Typography>
											</div>
										))}
									</div>
								) :
								(
									<div className="custom-date-time" id="custom-field">
										<MuiPickersUtilsProvider utils={DateFnsUtils}>
											<Typography variant="subtitle1" gutterBottom>
												Unfortunately, no single time and date works for all the guests.
												Pick a custom time and date instead.
											</Typography>

											<div id="custom-date-picker">
												<KeyboardDatePicker
													margin="normal"
													id="date-picker-dialog"
													label="Date"
													format="MM/dd/yyyy"
													value={customStartDate}
													onChange={handleCustomStartDate}
													KeyboardButtonProps={{
														'aria-label': 'change date',
													}}
												/>
											</div>
											<div id="custom-time-range">
												<KeyboardTimePicker
													margin="normal"
													id="time-picker"
													label="Start time"
													value={customStartDate}
													onChange={handleCustomStartDate}
													KeyboardButtonProps={{
														'aria-label': 'change time',
													}}
												/>
												<KeyboardTimePicker
													margin="normal"
													id="time-picker"
													label="End time"
													value={customEndDate}
													onChange={handleCustomEndDate}
													KeyboardButtonProps={{
														'aria-label': 'change time',
													}}
												/>
											</div>
											<Button variant="outlined" id="custom-submit-button" onClick={() => {submitMeeting(customStartDate, customEndDate)}}>
												Create Meeting
											</Button>
										</MuiPickersUtilsProvider>
									</div>
								)
							}
						</CardContent>
						<Snackbar
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
							open={showSuccess}
							onClose={handleClose}
							ContentProps={{
							'aria-describedby': 'message-id',
							}}
							message={<span id="message-id">Meeting created</span>}
						/>
					</div>
				</Card>
			)
		);
	}

	function getAvailableTimes() {
		var dur = 60;
		var startdate = formatDate(startDate);
		var enddate = formatDate(endDate);
		// setAvailable([
		// 	{ start: 'December 5, 2019 11:30', end: 'December 5, 2019 12:30' },
		// 	{ start: 'December 2, 2019 13:00', end: '"December 2, 2019 14:00' },
		// ]);
		// getAvailableRooms();
		var times = ["2019-12-05 11:00-12:00"];
		setAvailableTimes(times);
		const form = {
			participants: guests,
			earliest_meet_date: startdate,
			latest_meet_date: enddate,
			meet_duration: dur
		}
		// server.getAvailableTime(form).then(data => {
		// 	// var i;
		// 	// for (i=0;i<data.length;i++){
		// 	// 	console.log(Object.keys(data[i])[0]);
		// 	// }
		// 	console.log(data);
		// })
		getAvailableRooms(times);
		setShowAvailable(true);

	}

	function getAvailableRooms(times) {
		var meetsize = (guests.split(",").length) + 1 ;
		var dur = parseInt(duration)*2;
		const form = {
			duration: 2, 
			meeting_size: 5, 
			datetimes: times.join(',')
		}
		console.log(form.datetimes);
		server.getAvailableRoom(form).then(data => {
				console.log(data);
				setAvailableRooms(data.Timeslots);
		});
		// setAvailableRooms(["Powell Study Room 1,Powell Study Room 2","Powell Study Room 1"])
	}

	return (
		<div id="meeting-card">
			<div id="meeting-h1-div">
				<h1 id="name-h1">Create a meeting</h1>
			</div>
			<div id="meeting-content">
				<Grid container spacing={3} className={classes.grid}>
					<Grid item xs={8} id='meeting-details'>
						<div id="range-and-guests">
							{renderCreateMeeting()}
							{renderInviteFriends()}
							<Button variant="contained" color="primary" onClick={getAvailableTimes}>
								Find available times
							</Button>
						</div>
					</Grid>
					<Grid item xs={4} id='time-details'>
						{renderAvailableTimes()}
						{/* {renderFindRoom()} */}
					</Grid>
				</Grid>
			</div>
		</div>
	);
}

export default Meeting;
