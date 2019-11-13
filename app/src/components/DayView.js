import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function DayView(props) {
	function formatDate(date) {
		const mmddyy = date.split(',')[0];
		return mmddyy;
	}

	function formatTime(time) {
		const date = time.toJSDate().toString();
		return date;
	}

	function renderEvent(event) {
		return (
			<ListItem>
				<ListItemText>
					<div>{`${formatTime(event.startDate)} to ${formatTime(event.endDate)}`}</div>
					<div>{event.summary}</div>
				</ListItemText>
			</ListItem>
		);
	}
	return (
		<Card>
			<CardHeader title={formatDate(props.date)} />
			<CardContent>
				<List>{props.events.map((event) => renderEvent(event))}</List>
			</CardContent>
		</Card>
	);
}

export default DayView;
