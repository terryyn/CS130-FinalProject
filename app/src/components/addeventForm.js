import React, { Component } from 'react';  
import TextField from'@material-ui/core/TextField';  
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from "@material-ui/core/styles";

const styles = {
  textField: {
    height: 10,
  },

  timeField: {
    height: 10,
  },
}

class addeventForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        startdate: '',
        starttime: '',
        location: '',
        type: '',
        endtime:'',
        enddate:'',
        description:'',
    }
    
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleStartDateChange(e) {
    let value = e.target.value;
    this.setState(prev=>({startdate:value}));
  }

  handleStartTimeChange(e) {
    let value = e.target.value;
    this.setState(prev=>({starttime:value}));
  }

  handleEndDateChange(e) {
    let value = e.target.value;
    this.setState(prev=>({enddate:value}));
  }

  handleEndTimeChange(e) {
    let value = e.target.value;
    this.setState(prev=>({endtime:value}));
  }

  handleNameChange(e) {
    let value = e.target.value;
    this.setState(prev=>({name:value}));
  }

  handleLocationChange(e) {
    let value = e.target.value;
    this.setState(prev=>({location:value}));
  }

  handleTypeChange(e){
    let value = e.target.value;
    this.setState(prev=>({type:value}));
  }

  handleDescriptionChange(e){
    let value = e.target.value;
    this.setState(prev=>({description:value}));
  }


  submit(e) {
    console.log(this.state.starttime);
  }

  render() {
    return (
      <div className="addevent">
        <h1 id="addevent-title">Add an event</h1>
        <form className="addevent-form" onSubmit={this.submit}>
          <div id="start">
            <InputLabel id="start-label">Start</InputLabel>
              <TextField id="startdate-input" type="date" variant="outlined" InputProps={{ classes: { input: this.props.classes.textField } }}
                onChange={this.handleStartDateChange} ></TextField>
              <div id="starttime">
              <TextField id="starttime-input" type="time"  variant="outlined" InputProps={{ classes: { input: this.props.classes.textField } }}
                onChange={this.handleStartTimeChange}></TextField>
              </div>
          </div>

          <div id="end">
            <InputLabel id="end-label">End</InputLabel>
              <TextField id="enddate-input" type="date" variant="outlined" InputProps={{ classes: { input: this.props.classes.textField } }} 
                onChange={this.handleEndDateChange} ></TextField>
                <div id="endtime">
                <TextField id="endtime-input" type="time" variant="outlined" InputProps={{ classes: { input: this.props.classes.textField } }}
                  onChange={this.handleEndTimeChange}></TextField>
                </div>
          </div>

          <div id="name">
            <InputLabel id="name-label">Name</InputLabel>
            <TextField required id="name-input" title={'name'} variant="outlined" InputProps={{ classes: { input: this.props.classes.textField } }}
               onChange={this.handleNameChange}/>
          </div>

          <div id="location">
            <InputLabel id="location-label">Location</InputLabel>
            <TextField id="location-input" variant="outlined"   InputProps={{ classes: { input: this.props.classes.textField } }}
              onChange={this.handleLocationChange}/>
          </div>

          <div id="type">
            <InputLabel id="type-label">Type</InputLabel>
            <Select id="type-input" label="Type" onChange={this.handleTypeChange} value={this.state.type}>
              <MenuItem value={1}>Class</MenuItem>
              <MenuItem value={2}>Exam</MenuItem>
              <MenuItem value={3}>Office Hour</MenuItem>
              <MenuItem value={4}>Club</MenuItem>
              <MenuItem value={5}>Other</MenuItem>
            </Select>
          </div>

          <div id="description">
            <InputLabel id="description-label">Description</InputLabel>
            <TextField
            id="description-input"
            multiline
            variant="outlined" 
            rows="2"
            margin="normal"
            onChange={this.handleDescriptionChange}
            />
          </div>

          <div id="submit">
            <Button 
                  onClick={this.submit}
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
  margin : '10px 10px 10px 0'
}

const StyleForm = withStyles(styles)(addeventForm);

export default StyleForm;
