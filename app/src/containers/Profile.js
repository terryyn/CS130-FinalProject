import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import '../styles/profile.css'

import Server from '../server';
const server = new Server();

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '60%',
  },
  close: {
    padding: theme.spacing(0.5),
  },
  success: {
    backgroundColor: green[600],
  },
}));

function toString(b) {
    if (b) return 'true'
    else return 'false'
}

function Profile(props) {
    const [ editInfo, setEditInfo ] = useState(false);
    const [open, setOpen] = React.useState(false);

    const [name, setName] = React.useState(props.currentUser);
    const [email, setEmail] = React.useState(props.currentUserEmail);
    const [instructor, setInstructor] = React.useState(props.currentIsInstructor);
    const [password, setPassword] = React.useState("");
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    let enableEdit = () => {
        if (editInfo) {
            setOpen(true);
            props.setUser(name);
            props.setUserEmail(email);
            props.setcurrentIsInstructor(instructor);
            const form = {'username': name, 'email': email, 'password': password, 'is_instructor': toString(instructor)};
            server.editUser(form).then( data => {
                setEditInfo(false);
            });
        }
        else {
            setEditInfo(true);
        }
    }

    const classes = useStyles();
    return (
        <div id="profile-card">
            <div>
                <h1 id="name-h1">Profile Settings</h1>
            </div>
            <div id="user-info">
                <Card id="content-container">
                    <CardContent id="content-fields">
                        <TextField
                            id="name"
                            label="Name"
                            defaultValue={name}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                readOnly: !editInfo,
                            }}
                            onInput={ e=>{setName(e.target.value)}}
                        />
                        <TextField
                            id="email"
                            label="Email"
                            defaultValue={email}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                readOnly: !editInfo,
                            }}
                            onInput={ e=>setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            InputProps={{
                                readOnly: !editInfo,
                            }}
                            className={classes.textField}
                            label="Password"
                            type="password"
                            id="password"
                            defaultValue={password}
                            onInput={ e=>setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            id="instructor-toggle"
                            control={
                                <Switch 
                                    checked={instructor} 
                                    onChange={ e=>{
                                        if (instructor) {
                                            setInstructor(false)
                                        }
                                        else {
                                            setInstructor(true)
                                        }
                                        }
                                    }
                                />
                            }
                            label="Instructor"
                            disabled={!editInfo}
                        />
                    </CardContent>
                    <CardActions disableSpacing>
                        {editInfo ?
                            (
                                <IconButton color="white" size="small" id="editButton" onClick={enableEdit}>
                                    <CheckIcon />
                                </IconButton>
                            ) :
                            (
                                <IconButton color="white" size="small" id="editButton" onClick={enableEdit}>
                                    <EditIcon />
                                </IconButton>
                            )
                        }
                    </CardActions>
                </Card>
            </div>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                ContentProps={{
                'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Profile Updated!</span>}
                action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    className={classes.close}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>,
                ]}
            />
        </div>
    );
}

export default Profile;