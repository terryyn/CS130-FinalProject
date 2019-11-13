import React, { useState, useMemo } from 'react';
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

const sampleEvents = [
	{
		Title: 'Bowling tournament',
		Description: '',
		StartTimezone: null,
		Start: '2013-06-09T21:00:00.000Z',
		End: '2013-06-10T00:00:00.000Z'
	},
	{
		Title: 'Bowling tournament',
		Description: '',
		StartTimezone: null,
		Start: '2013-06-09T21:00:00.000Z',
		End: '2013-06-10T00:00:00.000Z'
	}
];

function Home() {
	// function getCalendar() {
	// 	// TODO: get from server
	// 	const sampleICS =
	// 		'BEGIN:VCALENDAR' +
	// 		'CALSCALE:GREGORIAN' +
	// 		'PRODID:-//Example Inc.//Example Calendar//EN' +
	// 		'VERSION:2.0' +
	// 		'END:VCALENDAR';
	// 	return ICAL.parse(sampleICS);
	// }
	// function getVevent(calendar) {
	// 	return calendar.getFirstSubcomponent('vevent');
	// }

	// const calendar = useMemo(() => getCalendar(), []);
	// const vevent = useMemo(() => getVevent(calendar), [ calendar ]);

	const [ dateString, setDate ] = useState(new Date().toLocaleString());
	const [ events, setEvents ] = useState(sampleEvents);

	function onChangeDate(date) {
		setDate(date.toLocaleString());
		console.log(date);
	}

	function addEvent() {}

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
