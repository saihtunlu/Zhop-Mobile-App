import React from "react";
import { AuthProvider } from "./navigation/AuthProvider";
import Routes from "./navigation/Routes";
import { Provider } from 'react-redux'

import store from './redux/store'
export const Providers = ({ }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </Provider>
  );
};
