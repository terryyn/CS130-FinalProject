import React, { useEffect, useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import ICAL from 'ical.js';

import { makeStyles } from '@material-ui/core/styles';

import EventInfo from '../components/EventInfo';
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
	const [ showEventInfo, setEventInfo ] = useState(false);

	const [ showImportICS, setImportICS ] = useState(false);

	const [ startTime, setStartTime ] = useState(null);
	const [ startDate, setStartDate ] = useState(null);
	const [ endTime, setEndTime ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);

	const [ eventName, setName ] = useState('');
	const [ eventLocation, setLocation ] = useState('');
	const [ eventType, setType ] = useState(0);
	const [ eventDesc, setDesc ] = useState('');
	const [ eventFreq, setFreq ] = useState(0);
	const [ course, setCourse ] = useState('');

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
		const vevents = comp.getAllSubcomponents('vevent');
		vevents.forEach((vevent) => {
			const event = new ICAL.Event(vevent);
			const dtstart = event.startDate.toJSDate();
			const dtend = event.endDate.toJSDate();
			const name = event.summary;
			const description = event.description;
			const location = event.location;

			const form = {
				name,
				description,
				location,
				type: 0
			};
			server.addEvent(form);
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
			course: course,
			frequencyType: eventFreq,
			guests: ''
		};

		server.addEvent(form).then(() => {
			getEventsFromDate(new Date(dateString));
			toggleAddEventModal();
		});
	}

	function deleteEvent(id) {
		const form = {
			eventID: id
		};
		server.deleteEvent(form).then(() => {
			getEventsFromDate(new Date(dateString));
		});
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
			description: eventDesc,
			frequencyType: eventFreq,
			guests: ''
		};
		server.editEvent(form).then(() => {
			getEventsFromDate(new Date(dateString));
			toggleEditEventModal();
		});
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

	function clearEventInfo() {
		setDesc(null);
		setName(null);
		setLocation(null);
		setStartDate(null);
		setEndDate(null);
		setStartTime(null);
		setEndTime(null);
	}

	function getEvent(id) {
		server.getEvent(id).then((event_obj) => {
			const event = event_obj['event'];
			setDesc(event['description']);
			setName(event['name']);
			setLocation(event['location']);
			setStartDate(event['startdate']);
			setEndDate(event['enddate']);
			setStartTime(event['starttime']);
			setEndTime(event['endtime']);
		});
	}

	function toggleEditEventModal(id) {
		setSelected(id);
		if (!showEditEvent) {
			getEvent(id);
		}
		setEditEvent(!showEditEvent);
	}

	function toggleImportICSModal() {
		clearEventInfo();
		setImportICS(!showImportICS);
	}

	function toggleEventInfoModal(id) {
		if (!showEventInfo) {
			getEvent(id);
		}
		setEventInfo(!showEventInfo);
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
						setFrequency={setFreq}
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
						setFrequency={setFreq}
						type={eventType}
						frequency={eventFreq}
						setDesc={setDesc}
						description={eventDesc}
						name={eventName}
						location={eventLocation}
						startDate={startDate}
						endDate={endDate}
						startTime={startTime}
						endTime={endTime}
						selected={selectedEvent}
						edit
						setCourse={setCourse}
						courses={props.currentCourses}
						currentIsInstructor={props.currentIsInstructor}
					/>
				</div>
			</Modal>
		);
	}

	function renderEventInfo() {
		return (
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={showEventInfo}
				onClose={() => setEventInfo(false)}
			>
				<div style={getModalStyle()} className={classes.paper}>
					<EventInfo name={eventName} description={eventDesc} location={eventLocation} />
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
					{renderEventInfo()}
					<Grid item xs={12}>
						<h1 id="name-h1">{props.currentUser.replace(/ .*/, '')}'s Day</h1>
					</Grid>
					<Grid item xs={9} id="event-grid">
						<DayView
							date={dateString}
							events={events}
							editEvent={toggleEditEventModal}
							deleteEvent={deleteEvent}
							showEvent={toggleEventInfoModal}
						/>
					</Grid>
				</Grid>
				<Grid container justify="space-evenly" alignItems="flex-end" item xs={12} spacing={3} id="buttons">
					{/* <Grid item>
						<Button variant="contained" color="default" onClick={toggleImportICSModal}>
							Import .ics file
						</Button>
					</Grid> */}
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
