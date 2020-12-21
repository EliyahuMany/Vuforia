import { Container, Grid, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { IEmailObject, IEmailStatus, ILib } from "../utils/interfaces";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import DoneIcon from "@material-ui/icons/Done";
import { green, grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  url: {
    textAlign: "center",
  },
  open: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginBottom: "10px",
  },
  emailBlock: {
    display: "flex",
    padding: "10px",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  },
  close: {},
  emails: { display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap" },
}));

type LibProps = {
  index: number;
  data: ILib;
};

const Libs = ({ data, index }: LibProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Grid item md={open ? 12 : 6} xs={12} className={open ? classes.open : classes.close}>
      <ListItem button onClick={() => setOpen((prev) => !prev)}>
        <ListItemText primary={data.url} className={classes.url} />
      </ListItem>
      {open ? <Emails emails={data.emails} /> : null}
    </Grid>
  );
};

type EmailProps = {
  emails: IEmailObject[];
};

const Emails = ({ emails }: EmailProps) => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md">
      <Grid container justify="center" alignItems="center">
        {emails.length
          ? emails.map((email: IEmailObject, index: number) => {
              return (
                <Grid item key={`${email.email}${email.status}`} md={6} xs={12} className={classes.emailBlock}>
                  <Typography color={email.status ? "inherit" : "textSecondary"}>
                    {index + 1}. {email.email}
                  </Typography>
                  {email.status === IEmailStatus.Pending ? <HourglassEmptyIcon style={{ color: grey[300] }} /> : null}
                  {email.status === IEmailStatus.Approved ? <DoneIcon style={{ color: green[400] }} /> : null}
                </Grid>
              );
            })
          : null}
      </Grid>
    </Container>
  );
};

export default Libs;
