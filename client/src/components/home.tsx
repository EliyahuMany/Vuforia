import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getLibs } from "../utils/api";
import { useAuth } from "../utils/auth";
import { ILib } from "../utils/interfaces";
import Libs from "./lib";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsWrapper: { flexDirection: "row", justifyContent: "center", margin: "10px" },
  button: { margin: "10px" },
}));

const Home = () => {
  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();
  const [libs, setLibs] = useState<Array<ILib>>([]);

  useEffect(() => getLibsCaller(), []);

  const getLibsCaller = () => {
    getLibs().then((res) => {
      if (res && res.data) {
        setLibs(res.data);
      }
    });
  };

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.container}>
        <div className={classes.buttonsWrapper}>
          <Button variant="contained" onClick={() => history.push("/add")} className={classes.button} color="primary">
            New OS lib
          </Button>
          <Button variant="text" onClick={() => auth.signout()} className={classes.button}>
            Sign out
          </Button>
        </div>
        <Grid container justify="center" alignItems="center">
          {libs.length
            ? libs.map((lib: ILib, index: number) => <Libs key={`${lib.url}`} data={lib} index={index} />)
            : null}
        </Grid>
      </div>
    </Container>
  );
};

export default Home;
