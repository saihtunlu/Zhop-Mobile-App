import { TOGGLE_THEME, GET_VAR, GET_ORDER, GET_ADDRESS, GET_FAV, GET_DATA, ADD_CART, GET_DISCOUNT, GET_LATEST } from './actionTypes'

export const toggleTheme = theme => ({
    type: TOGGLE_THEME,
    payload: theme
})
export const getAllData = data => ({
    type: GET_DATA,
    payload: data
})
export const addCart = data => ({
    type: ADD_CART,
    payload: data
})
export const getOrder = data => ({
    type: GET_ORDER,
    payload: data
})
export const getFav = data => ({
    type: GET_FAV,
    payload: data
})
export const getAddress = data => ({
    type: GET_ADDRESS,
    payload: data
})
export const getVar = data => ({
    type: GET_VAR,
    payload: data
})
export const getLatest = data => ({
    type: GET_LATEST,
    payload: data
})
export const getDiscount = data => ({
    type: GET_DISCOUNT,
    payload: data
})
