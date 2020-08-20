import { GET_DATA, GET_VAR, GET_DISCOUNT, GET_LATEST } from '../actions/actionTypes'
const initialState = {
    products: [],
    categories: [],
    shippings: [],
    payments: [],
    events: [],
    variations: [],
    selectedVariations: [],
    discount: [],
    latest: []
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
            var selectedVariations = state.variations.filter(data => {
                return parseInt(data.product_no) === parseInt(action.payload)
            });
            return {
                ...state,
                selectedVariations: selectedVariations
            }
        case GET_LATEST:
            var latest = [];
            state.products.forEach((data, key) => {
                if (key > 20) {
                    return false;
                }
                latest.push(data);
            });
            console.log("Data -> latest", latest)

            return {
                ...state,
                latest: latest
            }
        case GET_DISCOUNT:
            var discount = [];
            state.products.forEach((data, key) => {
                if (key > 6) {
                    return false;
                }
                if (data.type === "Simple Product") {
                    if (data.discount) {
                        discount.push(data);
                    }
                } else {
                    var check = data.variations.filter((variation) => {
                        return variation.discount;
                    });
                    if (check.length > 0) {
                        discount.push(data);
                    }
                }
            });
            console.log("Data -> discount", discount)
            return {
                ...state,
                discount: discount
            }
        default:
            return state
    }
}


export default Data