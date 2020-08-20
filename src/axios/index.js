import * as axios from "axios";
import * as SecureStore from "expo-secure-store";
import { setupCache } from 'axios-cache-adapter'

const cache = setupCache({
  maxAge: 15 * 60 * 1000
})

SecureStore.getItemAsync("user").then((userString) => {
  if (userString) {
    user = JSON.parse(userString);
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    axios.defaults.baseURL = "https://zhop.admin.saihtunlu.me/api";
    axios.defaults.timeout = 20000;
    axios.defaults.adapter = cache.adapter
  } else {
    axios.defaults.baseURL = "https://zhop.admin.saihtunlu.me/api";
    axios.defaults.timeout = 20000;
    axios.defaults.adapter = cache.adapter

  }
});

export { axios as default };
