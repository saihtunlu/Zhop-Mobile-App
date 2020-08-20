import { GET_ORDER } from '../actions/actionTypes'
const initialState = {
    orders: []
}

const Orders = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDER:
            return { orders: action.payload };
        default:
            return state
    }
}

export default Orders