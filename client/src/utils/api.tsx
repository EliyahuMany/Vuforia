import axios from "axios";

axios.defaults.withCredentials = true;

export const login = async (email: string, password: string) => {
  return axios.post(process.env.REACT_APP_API + "/user/auth", { user: { email, password } });
};

export const signup = async (firstname: string, lastname: string, email: string, password: string) => {
  return axios.post(process.env.REACT_APP_API + "/user/create", { user: { firstname, lastname, email, password } });
};

export const getLibs = async () => {
  return axios.get(process.env.REACT_APP_API + "/lib");
};

export const userAlreadyAuth = async () => {
  return axios.get(process.env.REACT_APP_API + "/user/isAuth");
};

export const userSignout = async () => {
  return axios.get(process.env.REACT_APP_API + "/user/signout");
};

export const createLib = async (url: string, emails: Array<string>) => {
  return axios.post(process.env.REACT_APP_API + "/lib/create", { lib: { url, emails } });
};
