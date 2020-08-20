import _ from 'lodash';
import store from '../redux/store';
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Dimensions,
    StatusBar,
    InteractionManager,
    ActivityIndicator,
    AsyncStorage,
    Animated
} from 'react-native';

import {
    View,
    Text,
    Picker,
    Toast,
    TextField,
    AnimatableManager,
    Colors,
    ListItem,
    Keyboard
} from 'react-native-ui-lib';
import { Divider, Loader } from '../components'
import TouchableScale from 'react-native-touchable-scale';
import { state, city } from '../constants/Address'
import { AuthContext } from "../navigation/AuthProvider";
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { addCart } from '../redux/actions'
const { width, height } = Dimensions.get("window");
import axios from "../axios";
const KeyboardAwareInsetsView = Keyboard.KeyboardAwareInsetsView;
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import * as Animatable from 'react-native-animatable';

class Checkout extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            currentStep: 0, /* using index 0 as starting point */
            steps: [{
                name: 'Personal',
                icon: 'user'
            }, {
                name: "Address",
                icon: "map-pin"
            }, {
                name: 'Payment',
                icon: 'credit-card'
            }, {
                name: 'Confirm',
                icon: 'send'
            }],
            isOrdering: false,
            ThemeColor: store.getState().Theme.theme,
            navigation: this.props.navigation,
            useTopErrors: true,
            state: '',
            city: '',
            cities: [],
            addressLine1: '',
            addressLine2: '',
            shippings: this.props.shippings,
            cart: this.props.cart,
            total: this.props.route.params.total,
            subtotal: this.props.route.params.subtotal,
            shippingPrice: null,
            errorStep2: false,
            ToastMessage: '',
            PaymentsMethods: this.props.payments, //all methods before filtering
            payments: [],
            selectedPayment: {},
            totalWeight: null,
            userName: '',
            email: '',
            phone: ''
        }
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    //Mounted
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            let value = this.context;
            let user = value.user.user;
            this.setState({ userName: user.name, email: user.email, phone: user.phone })
            this.getAddress();
            this.setState({ isReady: true })
        });
    }

    getAddress = async () => {
        var address = this.props.address;
        this.setState({
            id: address.id,
            state: address.state,
            city: { label: address.city },
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2
        })
        this.changeState();
        this.calculate(address.city);
    }
    calculate = (city) => {
        const { shippings, total, cart } = this.state;

        var getCity = null;
        this.calculatePayment(city, total);
        var weightArray = []
        cart.forEach(data => {
            weightArray.push(parseFloat(data.weight) * parseFloat(data.addCart))
        })
        var totalWeight = parseFloat(weightArray.reduce((sum, item) => sum + (item), 0)).toFixed(2);
        this.setState({ totalWeight: totalWeight })
        shippings.forEach(data => {
            var check = data.cities.filter(data => {
                return data.value === city;
            });
            if (check.length !== 0) {
                getCity = data;
            }
        });
        if (!getCity) {
            var Message = `${city} is current unavailable for shipping now!`
            this.setState({ ToastMessage: Message, errorStep2: true })
            return false;
        }
        var ShippingPrices = [];
        getCity.methods.forEach(data => {
            if (data.isCondition) {
                if (data.by === "Price") {
                    if (data.condition === "Greater") {
                        if (parseInt(total) > parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Greater or equal") {
                        if (parseInt(total) >= parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Less than") {
                        if (parseInt(total) < parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Less than or equal") {
                        if (parseInt(total) <= parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Equal") {
                        if (parseInt(total) === parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                }
                if (data.by === "City") {
                    if (data.condition === "Is") {
                        if (city === data.with) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Is not") {
                        if (city !== data.with) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                }

                if (data.by === "Weight") {
                    if (data.condition === "Greater") {
                        if (parseInt(totalWeight) > parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }

                    if (data.condition === "Greater or equal") {
                        if (parseInt(totalWeight) >= parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Less than") {
                        if (parseInt(totalWeight) < parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Less than or equal") {
                        if (parseInt(totalWeight) <= parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                    if (data.condition === "Equal") {
                        if (parseInt(totalWeight) === parseInt(data.with)) {
                            var resultArray = {};
                            if (data.type !== "Weight Based") {
                                resultArray.price = data.price;
                            } else {
                                if (parseInt(totalWeight) >= parseInt(data.initialWeight)) {
                                    var price = data.initialPrice;
                                    var check =
                                        parseInt(totalWeight) - parseInt(data.initialWeight);
                                    if (check > 0) {
                                        price = check * data.pricePerKg + parseInt(price);
                                    }
                                    resultArray.price = price;
                                }
                            }
                            if (resultArray.price !== null) {
                                resultArray.method = data.type;
                                resultArray.condition = data.condition;
                                resultArray.by = data.by;
                                ShippingPrices.push(resultArray);
                            }
                        }
                    }
                }
            }
        });
        if (ShippingPrices.length === 0) {
            var Message = `${city} is current unavailable for shipping now!`
            this.setState({ ToastMessage: Message, errorStep2: true })
            return false;
        }
        var shippingPrice = ShippingPrices.sort(
            (a, b) => parseInt(a.price) - parseInt(b.price)
        )[0].price;

        var GrandTotal = parseInt(shippingPrice) + parseInt(total) + (parseInt(total) * 0.05);
        this.setState({ shippingPrice: shippingPrice, total: GrandTotal })
    }
    calculatePayment(city, totalPrice) {
        var payments = [];
        const { PaymentsMethods } = this.state
        PaymentsMethods.forEach(data => {
            if (data.restrictions) {
                var getResult = [];
                var restriction1 = data.restrictions[0];
                if (restriction1.by === "Cities") {
                    if (restriction1.condition === "Is") {
                        var check = restriction1.cities.filter(data => {
                            return data.value === city;
                        });
                        if (check.length > 0) {
                            var resultArray = {};
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            resultArray.type = data.type;
                            getResult.push(resultArray);
                        }
                    }
                    if (restriction1.condition === "Is not") {
                        var check = restriction1.cities.filter(data => {
                            return data.label !== city;
                        });
                        if (check.length > 0) {
                            var resultArray = {};
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            resultArray.type = data.type;
                            getResult.push(resultArray);
                        }
                    }
                }
                if (restriction1.by === "Shipping") {
                    var cities = restriction1.shipping.cities;
                    if (restriction1.condition === "Is") {
                        var check = cities.filter(data => {
                            return data.value === city;
                        });
                        if (check.length > 0) {
                            var resultArray = {};
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            resultArray.type = data.type;
                            getResult.push(resultArray);
                        }
                    }
                    if (restriction1.condition === "Is not") {
                        var check = cities.filter(data => {
                            return data.value !== city;
                        });
                        if (check.length > 0) {
                            var resultArray = {};
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            resultArray.type = data.type;
                            getResult.push(resultArray);
                        }
                    }
                }
                if (restriction1.by === "Price") {
                    if (restriction1.condition === "Greater") {
                        if (parseInt(totalPrice) > parseInt(restriction1.price)) {
                            var resultArray = {};
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            resultArray.type = data.type;
                            getResult.push(resultArray);
                        }
                    }

                    if (restriction1.condition === "Greater or equal") {
                        if (parseInt(totalPrice) >= parseInt(restriction1.price)) {
                            var resultArray = {};
                            resultArray.type = data.type;
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            getResult.push(resultArray);
                        }
                    }
                    if (restriction1.condition === "Less than") {
                        if (parseInt(totalPrice) < parseInt(restriction1.price)) {
                            var resultArray = {};
                            resultArray.type = data.type;
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            getResult.push(resultArray);
                        }
                    }
                    if (restriction1.condition === "Less than or equal") {
                        if (parseInt(totalPrice) <= parseInt(restriction1.price)) {
                            var resultArray = {};
                            resultArray.type = data.type;
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            getResult.push(resultArray);
                        }
                    }
                    if (restriction1.condition === "Equal") {
                        if (parseInt(totalPrice) === parseInt(restriction1.price)) {
                            var resultArray = {};
                            resultArray.type = data.type;
                            resultArray.price = restriction1.price;
                            resultArray.condition = restriction1.condition;
                            resultArray.by = restriction1.by;
                            getResult.push(resultArray);
                        }
                    }
                }
                var getResult2 = [];
                if (data.restrictions[1]) {
                    var restriction2 = data.restrictions[1];
                    if (restriction2.by === "Cities") {
                        if (restriction2.condition === "Is") {
                            var check = restriction2.cities.filter(data => {
                                return data.label === city;
                            });
                            if (check.length > 0) {
                                var resultArray = {};
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                resultArray.type = data.type;
                                getResult2.push(resultArray);
                            }
                        }
                        if (restriction2.condition === "Is not") {
                            var check = restriction2.cities.filter(data => {
                                return data.label !== city;
                            });
                            if (check.length > 0) {
                                var resultArray = {};
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                resultArray.type = data.type;
                                getResult2.push(resultArray);
                            }
                        }
                    }
                    if (restriction2.by === "Shipping") {
                        var cities = restriction2.shipping.cities;
                        if (restriction2.condition === "Is") {
                            var check = cities.filter(data => {
                                return data.value === city;
                            });
                            if (check.length > 0) {
                                var resultArray = {};
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                resultArray.type = data.type;
                                getResult2.push(resultArray);
                            }
                        }
                        if (restriction2.condition === "Is not") {
                            var check = cities.filter(data => {
                                return data.value !== city;
                            });
                            if (check.length > 0) {
                                var resultArray = {};
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                resultArray.type = data.type;
                                getResult2.push(resultArray);
                            }
                        }
                    }
                    if (restriction2.by === "Price") {
                        if (restriction2.condition === "Greater") {
                            if (parseInt(totalPrice) > parseInt(restriction2.price)) {
                                var resultArray = {};
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                resultArray.type = data.type;
                                getResult2.push(resultArray);
                            }
                        }

                        if (restriction2.condition === "Greater or equal") {
                            if (parseInt(totalPrice) >= parseInt(restriction2.price)) {
                                var resultArray = {};
                                resultArray.type = data.type;
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                getResult2.push(resultArray);
                            }
                        }
                        if (restriction2.condition === "Less than") {
                            if (parseInt(totalPrice) < parseInt(restriction2.price)) {
                                var resultArray = {};
                                resultArray.type = data.type;
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                getResult2.push(resultArray);
                            }
                        }
                        if (restriction2.condition === "Less than or equal") {
                            if (parseInt(totalPrice) <= parseInt(restriction2.price)) {
                                var resultArray = {};
                                resultArray.type = data.type;
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                getResult.push(resultArray);
                            }
                        }
                        if (restriction2.condition === "Equal") {
                            if (parseInt(totalPrice) === parseInt(restriction2.price)) {
                                var resultArray = {};
                                resultArray.type = data.type;
                                resultArray.price = restriction2.price;
                                resultArray.condition = restriction2.condition;
                                resultArray.by = restriction2.by;
                                getResult2.push(resultArray);
                            }
                        }
                    }
                    if (getResult.length > 0 && getResult2.length > 0) {
                        payments.push(data);
                    }
                } else {
                    if (getResult.length > 0) {
                        payments.push(data);
                    }
                }
            } else {
                payments.push(data);
            }
        });
        this.setState({ payments: payments })
    }
    changeState = (text) => {
        if (text) {
            var cities = city.filter(function (data) {
                return data.state === text.value;
            });
            this.setState({ state: text.value, city: {} })
        } else {
            const { state } = this.state;
            var cities = city.filter(function (data) {
                return data.state === state;
            });
        }
        var data = cities.sort(function (a, b) {
            return b.label - a.label || a.label.localeCompare(b.label);
        }); // reorder 
        this.setState({ cities: data })

    }
    ChooseParams = (data, navigation) => {
        var product = null;
        if (data.type === "Simple Product") {
            product = data
        } else {
            product = data.product
        }
        navigation.navigate('Product', { product })
    }
    startOrder = () => {
        this.setState({ isOrdering: true });
        let value = this.context;
        let token = value.user.token;
        var data = {}

        const { userName,
            email,
            state,
            city,
            phone,
            addressLine1,
            addressLine2,
            selectedPayment,
            cart,
            total,
            shippingPrice,
            totalWeight } = this.state;
        var products = []
        cart.forEach(data => {
            if (data.type === 'Variable Product') {
                data.product = null;
                products.push(data)
            } else {
                products.push(data)
            }
        });
        data.userName = userName;
        data.email = email;
        data.phone = phone;
        data.state = state;
        data.city = city.label;
        data.addressLine1 = addressLine1;
        data.addressLine2 = addressLine2;
        data.selectedPayment = selectedPayment;
        data.cart = products;
        data.shippingPrice = shippingPrice;
        data.totalPrice = total;
        data.totalWeight = totalWeight;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.post(`/startOrder`, { data: data })
            .then(response => {
                this.setState({ isOrdering: false });
                this.props.addCart([])
                this.props.navigation.navigate('OrderComplete', { order: response.data, isSuccess: true })
            })
            .catch(error => {
                console.log("Checkout -> startOrder -> error", error.response.data)
                this.props.navigation.navigate('OrderComplete', { isSuccess: false })
                this.setState({ isOrdering: false });
            });
    }
    getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

    //renders
    RenderStep1 = () => {
        const { userName, email, phone, ThemeColor } = this.state;
        return (
            <View>
                <TextField
                    title={'Full Name*'}
                    onChangeText={(text) => this.setState({ userName: text })}
                    placeholder="Enter your name"
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                    hideUnderline
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={userName}
                />
                <TextField
                    placeholder="Enter your email address"
                    title={'Email Address*'}
                    onChangeText={(text) => this.setState({ email: text })}
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                    hideUnderline
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={email}
                />
                <TextField
                    placeholder="Enter your phone number"
                    title={'Phone Number*'}
                    onChangeText={(text) => this.setState({ phone: text })}
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                    hideUnderline
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={phone}
                />
            </View>
        )
    }
    RenderStep2 = () => {
        const { cities, city, ThemeColor } = this.state;
        var states = state.sort(function (a, b) {
            return b.label - a.label || a.label.localeCompare(b.label);
        }); // reorder 
        return (
            <View>
                <Picker
                    title={'State*'}
                    placeholder="Select a state"
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={this.state.state}
                    enableModalBlur
                    onChange={item => this.changeState(item)}
                    topBarProps={{ title: 'States' }}
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                    hideUnderline
                    showSearch
                    searchPlaceholder={'Select a state'}
                    searchStyle={{}}
                >
                    {_.map(states, data => (
                        <Picker.Item key={data.value} selectedIconColor={`rgb(${ThemeColor.primary})`} value={data.value} label={data.label} />
                    ))}
                </Picker>
                <Picker
                    title="City*"
                    placeholder="Select a city"
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={city}
                    enableModalBlur

                    onChange={item => { this.calculate(item.label); this.setState({ city: item }) }}
                    topBarProps={{ title: 'Cities' }}
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                    hideUnderline
                    showSearch
                    searchPlaceholder={'Select a state'}
                    searchStyle={{}}
                >
                    {_.map(cities, data => (
                        <Picker.Item key={data.value} selectedIconColor={`rgb(${ThemeColor.primary})`} value={data.label} label={data.label} />
                    ))}
                </Picker>
                <TextField
                    placeholder="Enter your street address 1"
                    title={'Street Address Line 1*'}
                    onChange={item => this.setState({ addressLine1: item.nativeEvent.text })}
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}

                    hideUnderline
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={this.state.addressLine1}
                />
                <TextField
                    placeholder="Enter your street address 2"
                    title={'Street Address Line 2 (Optional)'}
                    onChange={item => this.setState({ addressLine2: item.nativeEvent.text })}
                    style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                    hideUnderline
                    titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                    value={this.state.addressLine2}
                />
            </View>
        )
    }
    renderRow = (product, index, navigation) => {
        const { ThemeColor } = this.state;
        const animationProps = AnimatableManager.presets.fadeInRight;
        const imageAnimationProps = AnimatableManager.getRandomDelay();
        return (
            <Animatable.View {...animationProps} key={index}>
                <ListItem
                    activeBackgroundColor={Colors.dark60}
                    activeOpacity={0.3}
                    height={77.5}
                    containerStyle={{ borderBottomColor: ThemeColor.divider, backgroundColor: ThemeColor.Bg2, borderBottomWidth: 1 }}
                >
                    <ListItem.Part left>
                        <TouchableScale activeScale={0.985} onPress={() => this.ChooseParams(product, navigation)}>
                            <Animatable.Image
                                source={{
                                    uri: `https://zhop.admin.saihtunlu.me${product.type === 'Simple Product' ?
                                        product.images[0].path
                                        :
                                        product.attri1.image ? product.attri1.image : product.attri2.image}`
                                }}
                                style={styles.image}
                                {...imageAnimationProps}
                            /></TouchableScale>
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text text70 style={{ flex: 1, marginRight: 10, color: ThemeColor.header }} numberOfLines={1}>{product.title}</Text>
                            <Text style={{ color: `rgb(${ThemeColor.primary})` }}>{((product.sale_price ? product.sale_price : product.regular_price) * product.addCart)}Ks</Text>
                        </ListItem.Part>
                        {product.type === 'Variable Product' ?
                            <ListItem.Part>
                                <Text style={{ flex: 1, marginRight: 10, color: ThemeColor.text2 }} text90 numberOfLines={1}>{product.attri1.attribute.name} - {product.attri1.name}{product.attri2 ? <Text> / {product.attri2.attribute.name} - {product.attri2.name}</Text> : null}</Text>
                            </ListItem.Part> : null}
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text style={{ marginRight: 10, color: ThemeColor.text2 }} numberOfLines={1}>{product.sale_price ? product.sale_price : product.regular_price}Ks {product.weight ? `(${product.weight}Kg)` : null} x {product.addCart}</Text>
                        </ListItem.Part>
                    </ListItem.Part>
                </ListItem>
            </Animatable.View>
        );
    }
    RenderStep4() {
        const { cart, navigation, subtotal, total, totalWeight, shippingPrice, ThemeColor } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {cart.map((product, index) => this.renderRow(product, index, navigation))}
                <View row style={{ justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 15, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Subtotal</Text><Text style={{ color: ThemeColor.header }}>{subtotal}Ks</Text>
                </View>
                <Divider />
                <View row style={{ justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Total Weight (Kg)</Text><Text style={{ color: ThemeColor.header }}>{totalWeight} Kg</Text>
                </View>
                <Divider />
                <View row style={{ justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Tax</Text><Text style={{ color: ThemeColor.header }}>5%</Text>
                </View>
                <Divider />
                <View row style={{ justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Shipping Price</Text><Text style={{ color: ThemeColor.header }}>{shippingPrice === 0 ? 'Free Shipping' : `${shippingPrice}Ks`}</Text>
                </View>
                <Divider />
                <View row style={{ justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Total</Text><Text style={{ color: ThemeColor.header }}>{total}Ks</Text>
                </View>
            </View>
        )
    }
    RenderStep3 = () => {
        const { payments, selectedPayment, ThemeColor } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {payments.map((data, index) =>
                    <TouchableScale
                        activeScale={0.99}
                        key={index}
                        onPress={() => this.setState({ selectedPayment: data })}
                        style={{
                            backgroundColor: ThemeColor.Bg3,
                            borderRadius: 10,
                            padding: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10
                        }}>
                        <Feather
                            style={{ marginRight: 5 }}
                            name={data.id === selectedPayment.id ? 'disc' : 'circle'}
                            size={20}
                            color={ThemeColor.text1} />
                        <View>
                            <Text style={{ fontWeight: 'bold', color: ThemeColor.header, marginBottom: 5 }}>{data.type}</Text>
                            {data.description ? <Text color={ThemeColor.text1}>{data.description}</Text> : null}
                        </View>
                    </TouchableScale>
                )}
            </View>
        )
    }
    render() {
        const { steps, isOrdering, currentStep, navigation, ThemeColor, ToastMessage, errorStep2, payments } = this.state;
        var scrollY = new Animated.Value(0)
        const diffClamp = Animated.diffClamp(scrollY, 0, header_height);
        const animatedValue = diffClamp.interpolate({
            inputRange: [0, header_height],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })
        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <Animated.View style={{
                    ...styles.header, backgroundColor: `rgb(${ThemeColor.primary})`, opacity: animatedValue
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={'#fff'} /><Text text70 white> Checkout</Text>
                    </TouchableScale>
                    <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("Search")}>
                        <Feather name={'search'} size={20} color={'#fff'} />
                    </TouchableScale>
                </Animated.View>
                <Toast
                    visible={errorStep2}
                    position={'bottom'}
                    backgroundColor={Colors.red30}
                    style={{
                        borderRadius: 10,
                        marginHorizontal: 10,
                        width: width - 20,
                        marginBottom: 10,
                    }}
                    message={ToastMessage}
                    showDismiss={true}
                    onDismiss={() => this.setState({ errorStep2: false })}
                />
                <ScrollView
                    bounces={false}
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        scrollY.setValue(nativeEvent.contentOffset.y)
                    }}
                    style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
                    {/* Banner */}
                    <View style={{ ...styles.banner, backgroundColor: `rgb(${ThemeColor.primary})` }}>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: -header_height, justifyContent: 'center', alignItems: 'center', }}>
                        {currentStep == 0 &&
                            <Text black style={{ fontWeight: 'bold', color: '#fff' }} text60>Personal Information</Text>
                        }
                        {currentStep == 1 &&
                            <Text black style={{ fontWeight: 'bold', color: '#fff' }} text60>Address</Text>
                        }
                        {currentStep == 2 &&
                            <Text black style={{ fontWeight: 'bold', color: '#fff' }} text60>Payment Methods</Text>
                        }
                        {currentStep == 3 &&
                            <Text black style={{ fontWeight: 'bold', color: '#fff' }} text60>Confirmation</Text>
                        }
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: width
                    }}>

                        <View style={{ ...styles.Stepper }}>
                            {steps.map((item, i) =>
                                <View key={i} style={{ alignItems: 'center', width: 70, marginLeft: 5 }}>
                                    {i > currentStep && i != currentStep && /* Not selected */
                                        <TouchableScale activeScale={0.95} onPress={() => this.setState({ currentStep: i })} style={{
                                            ...styles.Lists,
                                            backgroundColor: ThemeColor.Bg2,
                                        }}>
                                            <Feather name={item.icon} size={20} color={ThemeColor.text2} />
                                            {/* <Text style={{ fontSize: 15, color: '#ee5e30' }}>{i + 1}</Text> */}
                                        </TouchableScale>
                                    }
                                    {i < currentStep && /* Checked */
                                        <TouchableScale activeScale={0.95} onPress={() => this.setState({ currentStep: i })} style={{
                                            ...styles.Lists,
                                            backgroundColor: ThemeColor.Bg2,
                                        }}>
                                            <Feather name="check" size={20} color={`rgb(${ThemeColor.primary})`} />
                                        </TouchableScale>
                                    }
                                    {i == currentStep && /* Selected */
                                        <TouchableScale activeScale={0.95} onPress={() => this.setState({ currentStep: i })} style={{
                                            ...styles.Lists,
                                            backgroundColor: ThemeColor.Bg2,
                                        }}>
                                            <Feather name={item.icon} size={20} color={`rgb(${ThemeColor.primary})`} />
                                            <View style={{
                                                height: 7,
                                                width: 7,
                                                position: 'absolute',
                                                borderRadius: 10,
                                                bottom: 5,
                                                backgroundColor: `rgb(${ThemeColor.primary})`
                                            }}>
                                            </View>
                                        </TouchableScale>
                                    }
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={{ ...styles.Body, backgroundColor: ThemeColor.Bg2, }}>
                        {currentStep == 0 &&
                            this.RenderStep1()
                        }
                        {currentStep == 1 &&
                            this.RenderStep2()
                        }
                        {currentStep == 2 &&
                            <View style={{ marginBottom: 20 }}>
                                {payments.length > 0 ? this.RenderStep3() :
                                    <View style={{
                                        height: 300,
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text grey30 text90>
                                            No payment methods are available for your location.</Text></View>}
                            </View>
                        }
                        {currentStep == 3 &&

                            this.RenderStep4()
                        }
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>

                            {(currentStep + 1) < steps.length /* add other conditions here */ &&
                                <TouchableScale activeScale={0.985} style={{ ...styles.centerElement, backgroundColor: `rgb(${ThemeColor.primary})` }} onPress={() => {
                                    if ((currentStep + 1) < steps.length && !errorStep2) {
                                        this.setState({ currentStep: currentStep + 1 });
                                    }
                                }}>
                                    <Text style={{ color: '#fff' }}>Next</Text>
                                </TouchableScale>
                            }

                            {(currentStep + 1) == steps.length /* add other conditions here */ &&
                                <TouchableScale activeScale={0.985} style={{ ...styles.centerElement, backgroundColor: `rgb(${ThemeColor.primary})` }} onPress={() => this.startOrder()}>
                                    <Text style={{ color: '#fff' }}>Start Order</Text>
                                </TouchableScale>
                            }
                            {currentStep > 0 ?
                                <TouchableScale activeScale={0.985} style={{ ...styles.centerElement, backgroundColor: `rgba(${ThemeColor.primary},0.2)` }} onPress={() => {
                                    if (currentStep > 0) {
                                        this.setState({ currentStep: currentStep - 1 });
                                    }
                                }}>
                                    <Text style={{ color: `rgb(${ThemeColor.primary})` }}>Back</Text>
                                </TouchableScale>
                                : <Text> </Text>
                            }
                        </View>
                    </View>
                    <KeyboardAwareInsetsView />
                    <Loader show={isOrdering} ThemeColor={ThemeColor} />
                </ScrollView>
            </View>
        );
    }
}

//Map the redux state to your props.
const mapStateToProps = state => ({
    shippings: state.Data.shippings,
    payments: state.Data.payments,
    cart: state.Cart.cart,
    address: state.Address.address
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
    addCart: products => dispatch(addCart(products)),
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);

const styles = StyleSheet.create({
    image: {
        width: 54,
        height: 54,
        borderRadius: 10,
        marginHorizontal: 14,
    },
    centerElement: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        marginBottom: 15,
        borderRadius: 30
    },
    inputStyle: {
        height: '100%',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 100
    },
    Stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        marginBottom: 15
    },
    Lists: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        height: 65,
        borderRadius: 15,
        marginHorizontal: 10
    },
    banner: {
        flex: 1,
        height: header_height + (width / 5),
        width: width,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    Body: {
        width: width - 20,
        margin: 10,
        borderRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 10
    }
});