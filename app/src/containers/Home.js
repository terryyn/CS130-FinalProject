import React, { useEffect, useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import ICAL from 'ical.js';

import { makeStyles } from '@material-ui/core/styles';

import ImportICS from '../components/ImportICSForm';
import StyleForm from '../components/addeventForm';
import DayView from '../components/DayView';
import Server from '../server';

import '../styles/home.css';

const useStyles = makeStyles({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: 'white',
		borderRadius: '3px',
		boxShadow:
			'0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
	}
});

function getModalStyle() {
	return {
		top: '50%',
		left: '50%',
		transform: `translate(-50%, -50%)`
	};
}

function Home(props) {
	const [ dateString, setDate ] = useState(new Date().toLocaleString());
	const [ calendar, setCalendar ] = useState(null);
	const [ events, setEvents ] = useState([]);
	const [ showAddEvent, setAddEvent ] = useState(false);
	const [ showEditEvent, setEditEvent ] = useState(false);

	const [ showImportICS, setImportICS ] = useState(false);

	const [ startTime, setStartTime ] = useState(null);
	const [ startDate, setStartDate ] = useState(null);
	const [ endTime, setEndTime ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);

	const [ eventName, setName ] = useState('');
	const [ eventLocation, setLocation ] = useState('');
	const [ eventType, setType ] = useState(0);
	const [ eventDesc, setDesc ] = useState('');
	const [ course, setCourse ] = useState("");

	const [ selectedEvent, setSelected ] = useState(-1);

	const server = new Server();

	const classes = useStyles();

	function getCalendar() {
		// TODO: get from server

		const sampleICS = [
			'BEGIN:VCALENDAR',
			'CALSCALE:GREGORIAN',
			'PRODID:-//Example Inc.//Example Calendar//EN',
			'VERSION:2.0',
			'BEGIN:VEVENT',
			'DTSTAMP:20190205T191224Z',
			'DTSTART:20191112T210000Z',
			'DTEND:20191112T220000Z',
			'SUMMARY:Test Event 1',
			'UID:4088E990AD89CB3DBB484909',
			'END:VEVENT',
			'BEGIN:VEVENT',
			'DTSTAMP:20191112T191224Z',
			'DTSTART:20191112T180000Z',
			'DTEND:20191113T200000Z',
			'SUMMARY:Test Event 2',
			'UID:4088E990AD89CB3DBB484909',
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\r\n');
		const parsed = ICAL.parse(sampleICS);
		setCalendar(parsed);
	}

	function getEventsFromICS() {
		// Get events and filter based on date
		console.log('getting events');
		if (!calendar) return [];
		const comp = new ICAL.Component(calendar);
		const currDate = new Date(dateString).toDateString();
		const vevents = comp.getAllSubcomponents('vevent');
		const events = [];
		vevents.forEach((vevent) => {
			const event = new ICAL.Event(vevent);
			const dtstart = event.startDate.toJSDate().toDateString();
			const dtend = event.endDate.toJSDate().toDateString();
			if (dtstart === currDate || dtend === currDate) {
				events.push(event);
			}
		});
		events.sort(function(first, second) {
			return first.startDate._time.hour - second.startDate._time.hour;
		});
		return events;
	}

	useEffect(() => {
		getEventsFromDate(new Date());
	}, []);

	async function getEventsFromDate(date) {
		const newDateStr = date.toDateString();
		const form = { date: newDateStr };
		server.getEventByUserAndDate(form).then((events) => {
			console.log('events', events);
			setEvents(events['events'] ? events['events'] : []);
		});
	}

	function onChangeDate(date) {
		setDate(date.toLocaleString());
		setEvents(getEventsFromDate(date));
	}

	async function addEvent() {
		const form = {
			startdate: startDate,
			starttime: startTime,
			enddate: endDate,
			endtime: endTime,
			location: eventLocation,
			name: eventName,
			type: eventType,
			description: eventDesc,
			course: course
		};

		console.log(form);

		server.addEvent(form).then(() => {
			getEventsFromDate(new Date(dateString));
			toggleAddEventModal();
		});
	}

	function deleteEvent(id) {
		const form = {
			eventID: id
		};
		server.deleteEvent(form);
	}

	function editEvent(id) {
		const form = {
			eventID: id,
			startdate: startDate,
			starttime: startTime,
			enddate: endDate,
			endtime: endTime,
			location: eventLocation,
			name: eventName,
			type: eventType,
			description: eventDesc
		};
		server.editEvent(form);
	}

	function addEventFromICS() {
		// Update current calendar object
		const comp = new ICAL.Component(calendar);
		var vevent = new ICAL.Component('vevent'),
			event = new ICAL.Event(vevent);

		// Set standard properties
		event.summary = 'foo bar';
		event.uid = 'abcdef...';
		event.startDate = ICAL.Time.now();
		comp.addSubcomponent(vevent);
		// Post serialized calendar
		console.log(comp.toString());
		// Refetch calendar
		setCalendar(comp.toJSON());
		// TODO: change to get
		setEvents(getEventsFromICS());
		setAddEvent(false);
	}

	function toggleAddEventModal() {
		setAddEvent(!showAddEvent);
	}

	function toggleEditEventModal(id) {
		setSelected(id);
		setEditEvent(!showEditEvent);
	}

	function toggleImportICSModal() {
		setImportICS(!showImportICS);
	}

	function renderAddEvent() {
		return (
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={showAddEvent}
				onClose={() => setAddEvent(false)}
			>
				<div style={getModalStyle()} className={classes.paper}>
					<StyleForm
						addEvent={addEvent}
						setStartTime={setStartTime}
						setStartDate={setStartDate}
						setEndTime={setEndTime}
						setEndDate={setEndDate}
						setName={setName}
						setLocation={setLocation}
						setType={setType}
						type={eventType}
						setDesc={setDesc}
						setCourse={setCourse}
						courses={props.currentCourses}
						currentIsInstructor={props.currentIsInstructor}
					/>
				</div>
			</Modal>
		);
	}

	function renderEditEvent() {
		return (
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={showEditEvent}
				onClose={() => setEditEvent(false)}
			>
				<div style={getModalStyle()} className={classes.paper}>
					<StyleForm
						addEvent={(selectedEvent) => editEvent(selectedEvent)}
						setStartTime={setStartTime}
						setStartDate={setStartDate}
						setEndTime={setEndTime}
						setEndDate={setEndDate}
						setName={setName}
						setLocation={setLocation}
						setType={setType}
						type={eventType}
						setDesc={setDesc}
						setCourse={setCourse}
						courses={props.currentCourses}
						currentIsInstructor={props.currentIsInstructor}
					/>
				</div>
			</Modal>
		);
	}

	function renderImportICS() {
		return (
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={showImportICS}
				onClose={() => setImportICS(false)}
			>
				<div style={getModalStyle()} className={classes.paper}>
					<ImportICS />
				</div>
			</Modal>
		);
	}

	return (
		<div id="home">
			<div id="day-view">
				<Grid container spacing={3} id="grid">
					{renderImportICS()}
					{renderAddEvent()}
					{renderEditEvent()}
					<Grid item xs={12}>
						<h1 id="name-h1">{props.currentUser.replace(/ .*/, '')}'s Day</h1>
					</Grid>
					<Grid item xs={9} id="event-grid">
						<DayView
							date={dateString}
							events={events}
							editEvent={toggleEditEventModal}
							deleteEvent={deleteEvent}
						/>
					</Grid>
				</Grid>
				<Grid container justify="space-evenly" alignItems="flex-end" item xs={12} spacing={3} id="buttons">
					<Grid item>
						<Button variant="contained" color="default" onClick={toggleImportICSModal}>
							Import .ics file
						</Button>
					</Grid>
					<Grid item>
						<Button variant="contained" color="primary" onClick={toggleAddEventModal}>
							Add event
						</Button>
					</Grid>
				</Grid>
			</div>
			<div id="calendar">
				<Calendar onChange={onChangeDate} value={new Date(dateString)} />
			</div>
		</div>
	);
}

export default Home;
