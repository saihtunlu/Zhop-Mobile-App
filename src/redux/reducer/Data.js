import { GET_DATA, GET_VAR } from '../actions/actionTypes'
const initialState = {
    products: [],
    categories: [],
    shippings: [],
    payments: [],
    events: [],
    variations: [],
    selectedVariations: []
}

const Data = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA:
            return {
                ...state,
                products: action.payload.products,
                categories: action.payload.categories,
                shippings: action.payload.shippings,
                payments: action.payload.payments,
                events: action.payload.events,
                variations: action.payload.variations
            }
        case GET_VAR:
            console.log("Data -> action.payload", state)
            var selectedVariations = state.variations.filter(data => {
                return parseInt(data.product_no) === parseInt(action.payload)
            });
            return {
                ...state,
                selectedVariations: selectedVariations
            }
        default:
            return state
    }
}


export default Data