import React, { useEffect, useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ICAL from 'ical.js';

import { makeStyles } from '@material-ui/core/styles';

import DayView from '../components/DayView';

const useStyles = makeStyles({
	grid: {
		padding: '32px'
	}
});

function Home() {
	const [ dateString, setDate ] = useState(new Date().toLocaleString());
	const [ calendar, setCalendar ] = useState(null);
	const [ showAddEvent, setAddEVent ] = useState(false);

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
	const events = useMemo(() => getEvents(), [ calendar, dateString ]);

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
	}

	return (
		<Grid container spacing={3} className={useStyles().grid}>
			<Grid item xs={12}>
				<h1>My calendar</h1>
			</Grid>
			<Grid item xs={9}>
				<DayView date={dateString} events={events} />
			</Grid>
			<Grid item xs={3}>
				<Calendar onChange={onChangeDate} value={new Date(dateString)} />
			</Grid>
			<Grid container justify="space-evenly" item xs={9} spacing={3}>
				<Grid item>
					<Button variant="contained" color="default">
						Import .ics file
					</Button>
				</Grid>
				<Grid item>
					<Button variant="contained" color="primary" onClick={addEvent}>
						Add event
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default Home;
