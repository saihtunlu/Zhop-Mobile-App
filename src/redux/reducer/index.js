import { combineReducers } from 'redux';
import Theme from './Theme'
import Data from './Data'
import Cart from './Cart'
import Address from './Address'
import Fav from './Fav'
import Orders from './Orders'


export default combineReducers({
    Theme, Data, Cart, Address, Fav, Orders
})