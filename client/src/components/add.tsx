import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { createLib } from "../utils/api";
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
  addEmail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Add() {
  const classes = useStyles();
  const history = useHistory();
  const [url, setUrl] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [emails, setEmails] = useState<Array<string>>([]);

  const addEmailHandler = () => {
    if (emailInput.length) {
      setEmails((prev) => {
        let temp = prev;
        temp.push(emailInput);
        return temp;
      });
      setEmailInput("");
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (url && emails.length) {
      createLib(url, emails)
        .then((res) => {
          if (res.status === 201) {
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add new OS Library
        </Typography>
        <form className={classes.form} onSubmit={submitHandler} noValidate>
          <TextField
            value={url}
            onChange={(e) => {
              e.preventDefault();
              setUrl(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="libURL"
            label="Library URL"
            type="text"
            id="libURL"
            autoFocus
          />
          {emails.length ? <EmailItemField emails={emails} /> : null}
          <Grid className={classes.addEmail}>
            <Grid item md={10} xs={12}>
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
              />
            </Grid>
            <Grid item md={2} xs={12} className={classes.addButton}>
              <IconButton aria-label="add" onClick={() => addEmailHandler()}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Upload
          </Button>
        </form>
      </div>
    </Container>
  );
}

type ItemField = {
  emails: string[];
};

const EmailItemField = ({ emails }: ItemField) => {
  return (
    <div>
      {emails.map((email) => (
        <TextField
          key={email}
          value={email}
          disabled
          variant="outlined"
          margin="normal"
          fullWidth
          name={email}
          type="email"
          id={email}
        />
      ))}
    </div>
  );
};
