import React, { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import '../styles/DayView.css';

function DayView(props) {
	function formatDate(date) {
		const mmddyy = date.split(',')[0].split('/');
		var full_date = '';
		if (mmddyy[0] == '1') full_date += 'January';
		else if (mmddyy[0] == '2') full_date += 'February';
		else if (mmddyy[0] == '3') full_date += 'March';
		else if (mmddyy[0] == '4') full_date += 'April';
		else if (mmddyy[0] == '5') full_date += 'May';
		else if (mmddyy[0] == '6') full_date += 'June';
		else if (mmddyy[0] == '7') full_date += 'July';
		else if (mmddyy[0] == '6') full_date += 'August';
		else if (mmddyy[0] == '7') full_date += 'September';
		else if (mmddyy[0] == '10') full_date += 'October';
		else if (mmddyy[0] == '11') full_date += 'November';
		else if (mmddyy[0] == '12') full_date += 'December';
		full_date += ' ' + mmddyy[1] + ' ' + mmddyy[2];
		return full_date;
	}

	function formatTime(time) {
		var [ hours, minutes, seconds ] = time.split(':');
		var strampm;
		if (hours >= 12) {
			strampm = 'PM';
		} else {
			strampm = 'AM';
		}
		hours = hours % 12;
		if (hours == 0) {
			hours = 12;
		}
		if (hours < 10) {
			hours = '0' + hours;
		}
		var ret = hours + ':' + minutes + ' ' + strampm;
		return ret;
	}

	function renderEvent(event) {
		if (event.eventType === parseInt(event.eventType, 10)) {
			if (event.eventType==0) event.eventType='general';
			else if (event.eventType==1) event.eventType='course';
			else if (event.eventType==2) event.eventType='discussion';
			else if (event.eventType==3) event.eventType='office-hours';
			else if (event.eventType==4) event.eventType='exam';
			else if (event.eventType==5) event.eventType='class-deadline';
			else if (event.eventType==6) event.eventType='meeting-accepted';
			else event.eventType='general';
		}
		return (
			<Fragment>
				<ListItem onClick={() => props.showEvent(event['id'])} style={{ cursor: 'pointer' }}>
					<ListItemText>
						<div className={"agenda-item " + event.eventType}>
							<div className="agenda-item-info">
								<div className="agenda-item-time">
									<Typography variant="subtitle1" gutterBottom>
										{formatTime(event.starttime)}
									</Typography>
									<Typography variant="subtitle1" gutterBottom>
										{formatTime(event.endtime)}
									</Typography>
								</div>
								<div className="agenda-item-summary">{event.name}</div>
							</div>
							<div className="agenda-item-options">
								<Button
									onClick={(e) => {
										props.deleteEvent(event['id']);
										e.stopPropagation();
									}}
									color="secondary"
								>
									delete
								</Button>
								<Button
									onClick={(e) => {
										props.editEvent(event['id']);
										e.stopPropagation();
									}}
									color="default"
								>
									edit
								</Button>
							</div>
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
				<List>{props.events.length > 0 && props.events.map((event) => renderEvent(event))}</List>
			</CardContent>
		</Card>
	);
}

export default DayView;
