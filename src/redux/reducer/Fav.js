import { GET_FAV } from '../actions/actionTypes'
const initialState = {
    fav: [],
}

const Fav = (state = initialState, action) => {
    switch (action.type) {
        case GET_FAV:
            return { fav: action.payload };
        default:
            return state
    }
}

export default Fav