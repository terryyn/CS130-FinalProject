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
							onChange={(e) => this.props.setStartDate(e.target.value)}
						/>
						<div id="starttime">
							<TextField
								id="starttime-input"
								type="time"
								variant="outlined"
								InputProps={{ classes: { input: this.props.classes.textField } }}
								onChange={(e) => this.props.setStartTime(e.target.value)}
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
							onChange={(e) => this.props.setEndDate(e.target.value)}
						/>
						<div id="endtime">
							<TextField
								id="endtime-input"
								type="time"
								variant="outlined"
								InputProps={{ classes: { input: this.props.classes.textField } }}
								onChange={(e) => this.props.setEndTime(e.target.value)}
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
							value={this.props.type}
						>
							<MenuItem value={0}>General</MenuItem>
							<MenuItem value={1}>Course</MenuItem>
							<MenuItem value={2}>Discussion</MenuItem>
							<MenuItem value={3}>OH</MenuItem>
							<MenuItem value={4}>Exam</MenuItem>
							<MenuItem value={5}>Deadline</MenuItem>
						</Select>
					</div>

					{this.props.currentIsInstructor &&
						<div className="addevent-field" id="course">
							<InputLabel id="type-label">Course</InputLabel>
							<Select
								id="course-input"
								label="Course"
								onChange={(e) => this.props.setCourse(e.target.value)}
							>
							{
								this.props.courses.map( (c,index) => (
									<MenuItem value={c}>{c}</MenuItem>
								))
							}
							</Select>
						</div>
					}

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
