import store from '../redux/store';
import { GET_DATA, GET_ORDER, GET_ADDRESS, GET_FAV, GET_LATEST, GET_DISCOUNT } from '../redux/actions/actionTypes'
import axios from '../axios'

export const getAllData = async () => {
    let res = await axios.get("/getAllData").catch(err => { console.log(err) });
    // get data ok
    if (null != res && null != res.data) {
        store.dispatch({ type: GET_DATA, payload: res.data })
        store.dispatch({ type: GET_LATEST, payload: '' })
        store.dispatch({ type: GET_DISCOUNT, payload: '' })
    }
}


export const getUserData = (params) => {
    if (params) {
        var token = params
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    getOrder();
    getAddress();
    GetFav();
}


const getAddress = async () => {
    let res = await axios.get("/address").catch(err => { console.log(err) });
    // get data ok
    if (null != res && null != res.data) {
        store.dispatch({ type: GET_ADDRESS, payload: res.data })
    }
}
export const GetFav = async () => {
    let res = await axios.get("/getFav").catch(err => { console.log(err) });
    // get data ok
    if (null != res && null != res.data) {
        store.dispatch({ type: GET_FAV, payload: res.data })
    }
}

const getOrder = async () => {
    let res = await axios.get("/orders").catch(err => { console.log(err) });
    // get data ok
    if (null != res && null != res.data) {
        store.dispatch({ type: GET_ORDER, payload: res.data })
    }
}
