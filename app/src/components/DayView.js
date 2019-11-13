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
	function renderEvent(event) {
		return (
			<ListItem>
				<ListItemText>
					<div>{`${event.Start} to ${event.End}`}</div>
					<div>{event.Title}</div>
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
