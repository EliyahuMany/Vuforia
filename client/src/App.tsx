import React, { useEffect, useState } from "react";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Home from "./components/home";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import AuthProvider, { useAuth } from "./utils/auth";
import Add from "./components/add";
import { userAlreadyAuth } from "./utils/api";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <OnlyPublic>
            <Switch>
              <Route path="/signup">
                <SignUp />
              </Route>
              <Route path="/login">
                <SignIn />
              </Route>
            </Switch>
          </OnlyPublic>
          <PrivateRoute>
            <Switch>
              <Route path="/add">
                <Add />
              </Route>
              <Route exactpath="/">
                <Home />
              </Route>
            </Switch>
          </PrivateRoute>
        </Router>
      </AuthProvider>
    </div>
  );
}

type PrivateProps = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: PrivateProps) => {
  const auth = useAuth();

  return auth.user ? (
    children
  ) : (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
};

const OnlyPublic = ({ children }: PrivateProps) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => userAuth(), []);

  const userAuth = () => {
    userAlreadyAuth()
      .then((res) => {
        if (res && res.status === 200) {
          auth.signin(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <div></div>
  ) : auth.user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    children
  );
};

export default App;
