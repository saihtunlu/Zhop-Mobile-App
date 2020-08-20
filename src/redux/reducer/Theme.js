import { Light, Dark } from '../../constants/theme'
import { TOGGLE_THEME } from '../actions/actionTypes'
const initialState = {
    theme: { ...Light }
}

const Theme = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_THEME:
            switch (action.payload) {
                case 'Light':
                    return { theme: Light };
                case 'Dark':
                    return { theme: Dark }
            }
        default:
            return state
    }
}


export default Theme