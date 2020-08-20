import { ADD_CART } from '../actions/actionTypes'
import { AsyncStorage } from 'react-native'
const initialState = {
    cart: [],
    cartLength: 0
}

const Cart = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CART:
            var values = action.payload.map(item => Number(item.addCart));
            var cart_no = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
            }, 0);
            console.log("Cart -> cart_no", cart_no)

            return { cart: action.payload, cartLength: cart_no };
        default:
            return state
    }
}

export default Cart