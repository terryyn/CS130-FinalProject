import React, { useEffect, useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import ICAL from 'ical.js';

import { makeStyles } from '@material-ui/core/styles';

import ImportICS from '../components/ImportICSForm';
import StyleForm from '../components/AddEventForm';
import DayView from '../components/DayView';

import '../styles/home.css';

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
	const [ showImportICS, setImportICS ] = useState(false);

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
			'DTSTART:20191112T070000Z',
			'DTEND:20191112T110000Z',
			'SUMMARY:Planning meeting',
			'UID:4088E990AD89CB3DBB484909',
			'END:VEVENT',
			'BEGIN:VEVENT',
			'DTSTAMP:20190205T191224Z',
			'DTSTART:20191113T070000Z',
			'DTEND:20191113T110000Z',
			'SUMMARY:Planning meeting 2',
			'UID:4088E990AD89CB3DBB484909',
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\r\n');
		const parsed = ICAL.parse(sampleICS);
		setCalendar(parsed);
	}

	function getEvents() {
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
		return events;
	}

	useEffect(() => getCalendar(), []);
	useEffect(() => setEvents(getEvents()), [ calendar, dateString ]);

	function onChangeDate(date) {
		setDate(date.toLocaleString());
	}

	function addEvent() {
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
		setEvents(getEvents());
		setAddEvent(false);
	}

	function toggleAddEventModal() {
		setAddEvent(!showAddEvent);
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
					<StyleForm addEvent={addEvent} />
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
		<div class="home">
			<Grid container spacing={3} className={classes.grid}>
				{renderImportICS()}
				{renderAddEvent()}
				<Grid item xs={12}>
					<h1>{props.currentUser.replace(/ .*/, '')}'s calendar</h1>
				</Grid>
				<Grid item xs={9}>
					<DayView date={dateString} events={events} />
				</Grid>
				<Grid item xs={3}>
					<Calendar onChange={onChangeDate} value={new Date(dateString)} />
				</Grid>
				<Grid container justify="space-evenly" item xs={9} spacing={3}>
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
			</Grid>
		</div>
	);
}

export default Home;
