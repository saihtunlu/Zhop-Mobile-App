import React, { useState } from "react";
import { AsyncStorage, Keyboard } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "../axios";
import { getUserData } from '../helper/Store'
export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        errors,
        loading,
        getUserData,
        login: (email, password) => {
          Keyboard.dismiss();
          setLoading(true);
          axios
            .post("/sanctum/token", {
              email,
              password,
              device_name: "mobile",
            })
            .then((response) => {
              getUserData(response.data.token)
              setErrors(null);
              const userResponse = {
                user: response.data.user,
                token: response.data.token,
              };
              setUser(userResponse);
              setErrors(null);
              SecureStore.setItemAsync("user", JSON.stringify(userResponse));
              setLoading(false);
            })
            .catch((error) => {
              const key = Object.keys(error.response.data.errors)[0];
              setErrors(error.response.data.errors[key][0]);
              setLoading(false);
            });
        },
        logout: () => {
          setLoading(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
          axios
            .post("/logouts")
            .then((response) => {
              setUser(null);
              SecureStore.deleteItemAsync("user");
              AsyncStorage.removeItem("orders");
              setLoading(false);
            })
            .catch((error) => {
            });
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
