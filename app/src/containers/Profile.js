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

function Profile(props) {
    const [ editInfo, setEditInfo ] = useState(false);
    const [open, setOpen] = React.useState(false);

    const [name, setName] = React.useState(props.currentUser);
    const [email, setEmail] = React.useState(props.currentUserEmail);
    const [isInstructor, setIsInstructor] = React.useState(false);
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    let enableEdit = () => {
        if (editInfo) {
            setOpen(true);
            setEditInfo(false);
            props.setUser(name);
        }
        else {
            setEditInfo(true);
        }
    }

    const classes = useStyles();
    return (
        <div class="profile-card">
            <Typography variant="h5">
                Profile Settings
            </Typography>
            <Card>
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
                    <FormControlLabel
                        id="instructor-toggle"
                        control={
                            <Switch 
                                checked={isInstructor} 
                                onChange={ e=>{
                                    if (isInstructor) {
                                        setIsInstructor(false)
                                    }
                                    else {
                                        setIsInstructor(true)
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
                            <IconButton color="primary" size="small" id="editButton" onClick={enableEdit}>
                                <CheckIcon />
                            </IconButton>
                        ) :
                        (
                            <IconButton color="primary" size="small" id="editButton" onClick={enableEdit}>
                                <EditIcon />
                            </IconButton>
                        )
                    }
                </CardActions>
            </Card>
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