import React, { useState, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './DayView.css';

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
			<Fragment>
				<ListItem>
					<ListItemText>
						<div className="agenda-item">
							<div className="agenda-item-time">
								<p>{formatTime(event.startDate)}</p>
								<p>to</p>
								<p>{formatTime(event.endDate)}</p>
							</div>
							<div className="agenda-item-summary">{event.summary}</div>
						</div>
					</ListItemText>
				</ListItem>
			</Fragment>
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
