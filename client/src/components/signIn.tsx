import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login } from "../utils/api";
import { useAuth } from "../utils/auth";
import { AxiosResponse } from "axios";
import { useHistory } from "react-router-dom";

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

export default function SignIn() {
  const classes = useStyles();
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const auth = useAuth();
  const history = useHistory();

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (emailInput.length && passwordInput.length) {
      login(emailInput, passwordInput).then((res: AxiosResponse) => {
        if (res && res.data) {
          auth.signin(res.data);
          history.push("/");
        }
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={submitHandler}>
          <TextField
            value={emailInput}
            onChange={(e) => {
              e.preventDefault();
              setEmailInput(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Sign In
          </Button>
          <Grid container justify="center">
            <Button fullWidth onClick={() => history.push("/signup")}>
              {"Sign Up"}
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
