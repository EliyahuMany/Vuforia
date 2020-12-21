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
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";

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

  const validationSchema = yup.object({
    url: yup.string().url("Enter a valid url").required("Url is required"),
    emails: yup.array().of(yup.string().email("One of the emails is invalid").required("Email is required")),
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add new OS Library
        </Typography>
        <Formik
          initialValues={{ url: "", emails: [""] }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            createLib(values.url, values.emails)
              .then((res) => {
                if (res.status === 201) {
                  history.push("/");
                }
              })
              .catch((err) => console.log(err));
          }}
        >
          <Form className={classes.form}>
            <Field name="url">
              {(props: any) => {
                return (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="url"
                    id="url"
                    label="Library URL"
                    type="text"
                    autoFocus
                    error={props.form.touched.url && Boolean(props.form.errors.url)}
                    helperText={props.form.touched.url && props.form.errors.url}
                    {...props.field}
                  />
                );
              }}
            </Field>
            <FieldArray name="emails">
              {({ form, ...fieldArrayHelpers }) => {
                const onAddClick = () => {
                  fieldArrayHelpers.push("");
                };

                return form.values.emails.map((field: any, index: number) => {
                  const last = form.values.emails.length == index + 1;

                  return (
                    <Grid className={classes.addEmail}>
                      <Grid item md={last ? 10 : 12} xs={12}>
                        <TextField
                          value={field}
                          onChange={(e) => {
                            fieldArrayHelpers.replace(index, e.target.value);
                          }}
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id={`emails.${index}`}
                          label="Email Address"
                          name={`emails.${index}`}
                          autoComplete="email"
                          error={form.touched.emails && Boolean(form.errors.emails)}
                          helperText={form.touched.emails && form.errors.emails}
                        />
                      </Grid>
                      {last ? (
                        <Grid item md={2} xs={12} className={classes.addButton}>
                          <IconButton aria-label="add" onClick={() => onAddClick()}>
                            <AddIcon />
                          </IconButton>
                        </Grid>
                      ) : null}
                    </Grid>
                  );
                });
              }}
            </FieldArray>

            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Upload
            </Button>
          </Form>
        </Formik>
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
