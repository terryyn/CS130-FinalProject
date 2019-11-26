import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';

import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import '../styles/login.css';

import Server from '../server';
const server = new Server();

const useStyles = makeStyles((theme) => ({
  '@global': {
		body: {
			backgroundColor: theme.palette.common.white
		}
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

function toString(b) {
    if (b) return 'true'
    else return 'false'
}

function Login(props) {
	const [ newUser, setNewUser ] = useState(false);
	const [ name, setName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
    const [ isInstructor, setIsInstructor ] = useState(false);
    const [ remember, setRemember ] = useState(false);
    const [ showMsg, setShowMsg ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState("");

	const classes = useStyles();

	// let login = (response) => {
	// 	console.log(response);
    // };
    
    let performLogin = (form) => {
        server.loginUser(form).then( data => {
            if (data=="new user") {
                setErrorMsg("Looks like you don't have an account. Let's get you signed up!")
                setShowMsg(true);
                setNewUser(true);
            }
            else if (data=="incorrect password") {
                setErrorMsg("Looks like you entered an incorrect email/password")
                setShowMsg(true);
            }
            else if (data=="unknown error") {
                setErrorMsg("Something went wrong, please try again")
                setShowMsg(true);
            }
            else {
                props.setLoggedIn(true);
                props.setUserEmail(data.email);
                props.setUser(data.name);
                props.setcurrentIsInstructor(data.is_instructor);
            }
        })
    };

	let regularLogin = (event) => {
        event.preventDefault();
        if (email=="" || password=="") {
            return;
        }

        if (newUser) {
            var at_loc = email.indexOf('@');
            if (at_loc==-1) {
                setErrorMsg("Invalid email. Must have a g.ucla.edu email")
                setShowMsg(true);
                return;
            }
            else {
                console.log(at_loc)
                if (email.substring(at_loc)!="@g.ucla.edu") {
                    setErrorMsg("Invalid email. Must have a g.ucla.edu email")
                    setShowMsg(true);
                    return;
                }
            }

            const form = { username: name, email: email, password: password, is_instructor: toString(isInstructor) };
            server.createUser(form).then( data => {
                if (data=="user added") {
                    const form = { email: email, password: password, remember: toString(remember) };
                    performLogin(form);
                }
                else if (data=="current user") {
                    setErrorMsg("Looks like you already have an account")
                    setShowMsg(true);
                    setNewUser(false);
                }
            })
        }
        else {
            const form = { email: email, password: password, remember: toString(remember) };
            performLogin(form);
        }
	};

	let isNewUser = () => {
		if (newUser) {
			setNewUser(false);
		} else {
			setNewUser(true);
		}
    };
    
    const handleClose = (event, reason) => {
        setShowMsg(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
                <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={showMsg}
                ContentProps={{
                'aria-describedby': 'message-id',
                }}
                onClose={handleClose}
                message={<span id="message-id">{errorMsg}</span>}
            />
            <div className={classes.paper} id="main">
                <Typography variant="h4" id="text1" gutterBottom>
                    Calendar of the Bruins
                </Typography>
                <Typography variant="h4" id="text2" gutterBottom>
                    by the Bruins
                </Typography>
                <Typography variant="h4" id="text3" gutterBottom>
                    for the Bruins
                </Typography>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {newUser ? ('Sign up') : 'Sign in'}
                </Typography>

                {/* <div id="fbbutton">
                    <FacebookLogin
                        appId="1436766753144072"
                        autoLoad
                        fields="name,email,picture"
                        callback={login}
                        icon="fa-facebook"
                    />
                </div> */}

                <hr />

                <div id="regLogin">
                    <form className={classes.form} onSubmit={regularLogin} noValidate>
                        {newUser &&
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                onInput={ e=>setName(e.target.value)}
                            />
                        }
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onInput={ e=>setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onInput={ e=>setPassword(e.target.value)}
                        />
                        <div class="new-user">
                            {newUser &&
                                <FormControlLabel
                                control={<Checkbox checked={isInstructor} value="isInstructor" color="primary" />}
                                label="Are you an instructor?"
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
                        </div>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" checked={remember}/>}
                            label="Remember me"
                            onChange={ e=>{
                                if (remember) {
                                    setRemember(false)
                                }
                                else {
                                    setRemember(true)
                                }
                                }
                            }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            {newUser ? ('Sign up') : 'Sign in'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            <Link to="#">
                                Forgot password?
                            </Link>
                            </Grid>
                            <Grid item>
                            {!newUser ?
                            (
                                <Link onClick={isNewUser}>
                                {"Don't have an account? Sign Up"}
                                </Link>
                            ) :
                            (
                                <Link onClick={isNewUser}>
                                {"Have an account? Sign In"}
                                </Link>
                            )
                            }
                            </Grid>
                        </Grid>
                    </form>
                </div>
        </div>
        </Container>
    );
}

export default Login;
