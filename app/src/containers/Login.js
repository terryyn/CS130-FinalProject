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
import Divider from '@material-ui/core/Divider';

import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import '../styles/login.css';
import App from '../App'
import Server from '../server'

const exampleEmail = ["dinkarkhattar@gmail.com"];
const exampleUser = ["Dinkar Khattar"];

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const [ newUser, setNewUser ] = useState(false);
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ isInstructor, setIsInstructor ] = useState(false);



  const classes = useStyles();

  let login = (response) => {
    console.log(response);
    if (exampleEmail.includes(response.email)) {
      props.setLoggedIn(true);
      props.setUser(response.name);
      props.setUserPhotoUrl(response.picture.data.url);
    }
    else {
      exampleUser.push(response.name);
      exampleEmail.push(response.email);
      props.setLoggedIn(true);
      props.setUser(response.name);
      props.setUserPhoto(response.picture.data.url);
    }
  }

  let regularLogin = (event) => {
    event.preventDefault();
    const form = {'username': name, 'email': email, 'password': password, 'isInstructor': isInstructor};
    const server = new Server();
    server.createUser(form);
  }

  let isNewUser = () => {
    if (newUser) {
      setNewUser(false);
    } else {
      setNewUser(true);
    }
	}

  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper} id="main">
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign in
            </Typography>

            <div id="fbbutton">
              <FacebookLogin
              appId="1436766753144072"
              autoLoad
              fields="name,email,picture"
              callback={login}
              icon="fa-facebook"
              />
            </div>
            
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
              { !newUser &&
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
              }
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                  Sign In
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