import React, { createContext, ReactNode, useContext, useState } from "react";
import { userSignout } from "./api";
import { IContext, IUser } from "./interfaces";

const authContext = createContext({} as IContext);
export const useAuth = () => useContext(authContext);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useProvideAuth = () => {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const signin = (user: IUser) => {
    setUser(user);
  };

  const signout = () => {
    userSignout()
      .then((res) => {
        if (res && res.status === 200) {
          setUser(undefined);
        }
      })
      .catch((res) => console.log(res));
  };

  return { user, signin, signout };
};

export default AuthProvider;
