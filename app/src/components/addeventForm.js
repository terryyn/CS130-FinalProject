import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

import './AddEventForm.css';

const styles = {
	textField: {
		height: 10
	},

	timeField: {
		height: 10
	}
};

class AddEventForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			starttime: null,
			endtime: null
		};
	}

	handleStartDateChange(e) {
		let value = e.target.value;
		this.setState((prev) => ({ startdate: value }));
	}

	handleStartTimeChange(e) {
		let value = e.target.value;
		this.setState((prev) => ({ starttime: value }));
	}

	handleEndDateChange(e) {
		let value = e.target.value;
		this.setState((prev) => ({ enddate: value }));
	}

	handleEndTimeChange(e) {
		let value = e.target.value;
		this.setState((prev) => ({ endtime: value }));
	}

	render() {
		return (
			<div className="addevent">
				<h1 className="addevent-title">Add an event</h1>
				<form className="addevent-form" onSubmit={this.submit}>
					<div className="addevent-field" id="start">
						<InputLabel id="start-label">Start</InputLabel>
						<TextField
							id="startdate-input"
							type="date"
							variant="outlined"
							InputProps={{ classes: { input: this.props.classes.textField } }}
							onChange={this.handleStartDateChange}
						/>
						<div id="starttime">
							<TextField
								id="starttime-input"
								type="time"
								variant="outlined"
								InputProps={{ classes: { input: this.props.classes.textField } }}
								onChange={this.handleStartTimeChange}
							/>
						</div>
					</div>

					<div className="addevent-field" id="end">
						<InputLabel id="end-label">End</InputLabel>
						<TextField
							id="enddate-input"
							type="date"
							variant="outlined"
							InputProps={{ classes: { input: this.props.classes.textField } }}
							onChange={this.handleEndDateChange}
						/>
						<div id="endtime">
							<TextField
								id="endtime-input"
								type="time"
								variant="outlined"
								InputProps={{ classes: { input: this.props.classes.textField } }}
								onChange={this.handleEndTimeChange}
							/>
						</div>
					</div>

					<div className="addevent-field" id="name">
						<InputLabel id="name-label">Name</InputLabel>
						<TextField
							required
							id="name-input"
							title={'name'}
							variant="outlined"
							InputProps={{ classes: { input: this.props.classes.textField } }}
							onChange={(e) => this.props.setName(e.target.value)}
						/>
					</div>

					<div className="addevent-field" id="location">
						<InputLabel id="location-label">Location</InputLabel>
						<TextField
							id="location-input"
							variant="outlined"
							InputProps={{ classes: { input: this.props.classes.textField } }}
							onChange={(e) => this.props.setLocation(e.target.value)}
						/>
					</div>

					<div className="addevent-field" id="type">
						<InputLabel id="type-label">Type</InputLabel>
						<Select
							id="type-input"
							label="Type"
							onChange={(e) => this.props.setType(e.target.value)}
							value={this.state.type}
						>
							<MenuItem value={1}>Class</MenuItem>
							<MenuItem value={2}>Exam</MenuItem>
							<MenuItem value={3}>Office Hour</MenuItem>
							<MenuItem value={4}>Club</MenuItem>
							<MenuItem value={5}>Other</MenuItem>
						</Select>
					</div>

					<div className="addevent-field" id="description">
						<InputLabel id="description-label">Description</InputLabel>
						<TextField
							id="description-input"
							multiline
							variant="outlined"
							rows="2"
							margin="normal"
							onChange={(e) => this.props.setDesc(e.target.value)}
						/>
					</div>

					<div id="submit">
						<Button
							onClick={this.props.addEvent}
							variant="contained"
							title={'Submit'}
							id="submit-button"
							style={buttonStyle}
						>
							Create Event
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

const buttonStyle = {
	margin: '10px 10px 10px 0'
};

const StyleForm = withStyles(styles)(AddEventForm);
export default StyleForm;
