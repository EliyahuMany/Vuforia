import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { AxiosResponse, AxiosError } from "axios";
import { useAuth } from "../utils/auth";
import { useHistory } from "react-router-dom";
import { signup } from "../utils/api";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const auth = useAuth();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordInput, setPasswordInput] = useState<string>("");

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (firstName.length && lastName.length && emailInput.length && passwordInput.length) {
      signup(firstName, lastName, emailInput, passwordInput)
        .then((res: AxiosResponse) => {
          if (res && res.data) {
            auth.signin(res.data);
            history.push("/");
          }
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 409) {
            setEmailError("Email already in use");
          }
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={submitHandler} noValidate>
          <TextField
            value={firstName}
            onChange={(e) => {
              e.preventDefault();
              setFirstName(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="firstName"
            label="First Name"
            type="text"
            id="firstName"
            autoFocus
          />
          <TextField
            value={lastName}
            onChange={(e) => {
              e.preventDefault();
              setLastName(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="lastName"
            label="Last Name"
            type="text"
            id="lastName"
          />
          <TextField
            value={emailInput}
            onChange={(e) => {
              e.preventDefault();
              setEmailError(undefined);
              setEmailInput(e.target.value);
            }}
            error={emailError !== undefined}
            helperText={emailError ? emailError : null}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            value={passwordInput}
            onChange={(e) => {
              e.preventDefault();
              setPasswordInput(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
}
