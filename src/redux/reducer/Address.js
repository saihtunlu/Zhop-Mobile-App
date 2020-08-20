import { GET_ADDRESS } from '../actions/actionTypes'
const initialState = {
    address: [],
}

const Address = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADDRESS:
            return { address: action.payload };
        default:
            return state
    }
}

export default Address