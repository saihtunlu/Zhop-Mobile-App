import axios from '../axios'
import { AsyncStorage } from 'react-native'

export const getAllData = () => {
    axios
        .get("/getAllData")
        .then((response) => {
            var products = response.data.products;
            var categories = response.data.categories;
            var payments = response.data.payments;
            var shippings = response.data.shippings;
            var events = response.data.events;
            AsyncStorage.setItem('products', JSON.stringify(products))
            AsyncStorage.setItem('events', JSON.stringify(events))
            AsyncStorage.setItem('categories', JSON.stringify(categories))
            AsyncStorage.setItem('payments', JSON.stringify(payments))
            AsyncStorage.setItem('shippings', JSON.stringify(shippings))
        })
        .catch((error) => {
        });
}

export const getUserData = (params) => {
    if (params) {
        var token = params
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    getOrder();
    getAddress();
    getFav();
}

const getOrder = () => {
    axios.get(`/orders`)
        .then(response => {
            AsyncStorage.removeItem("orders").then(() => {
                AsyncStorage.setItem('orders', JSON.stringify(response.data))
            })
        })
        .catch(error => {
        });
}
const getAddress = () => {
    axios.get(`/address`)
        .then(response => {
            AsyncStorage.setItem('address', JSON.stringify(response.data))
        })
        .catch(error => {
        });
}
const getFav = () => {
    axios.get(`/getFav`)
        .then(response => {
            AsyncStorage.removeItem("fav").then(() => {
                AsyncStorage.setItem('fav', JSON.stringify(response.data))
            })
        })
        .catch(error => {
        });
}
export const removeFav = (id, token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.post(`/removeFav`, { id: id })
        .then(response => {
        }).catch(err => {
        })
}