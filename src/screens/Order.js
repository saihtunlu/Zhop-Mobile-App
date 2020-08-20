import _ from 'lodash';
import store from '../redux/store';
import React, { Component, createRef } from "react";
import {
    StyleSheet,
    AsyncStorage,
    InteractionManager,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    Platform,
    FlatList,
} from "react-native";
import {
    View,
    Text,
} from 'react-native-ui-lib';
import { AuthContext } from "../navigation/AuthProvider";
import TouchableScale from 'react-native-touchable-scale';
import OrderList from '../components/OrderList'
import Feather from 'react-native-vector-icons/Feather';
import ActionSheet from "react-native-actions-sheet";
import Divider from '../components/Divider'
const width = Dimensions.get('window').width;
const actionSheetRef = createRef();
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import { connect } from 'react-redux';

class Order extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            number_of_cart: 0,
            navigation: this.props.navigation,
            ThemeColor: store.getState().Theme.theme,
            selectedIndex: 0,
            orders: this.props.orders,
            deleteType: null,
            showOrders: [],
            limitedIndex: 20,
            loading: false
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }

    //Mounted
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            var values = this.props.cart.map(item => Number(item.addCart));
            if (!values.every(value => isNaN(value))) {
                var cart_no = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                }, 0);
                this.setState({ number_of_cart: cart_no })
            }
            this.setOrder()
        });
    }

    //Methods
    setOrder() {
        const { limitedIndex, orders } = this.state;
        var showOrders = [];
        orders.forEach((data, index) => {
            if (index > limitedIndex) {
                return false;
            }
            showOrders.push(data)
        });
        this.setState({ showOrders: showOrders, loading: false, isReady: true })
    }

    openAction = (index, type) => {
        actionSheetRef.current?.setModalVisible()
        this.setState({ selectedIndex: index, deleteType: type, loading: false, })
    }
    removeAction = () => {
        const { orders, selectedIndex, deleteType } = this.state;
        if (deleteType === 'fav') {
            var newProducts = orders;
            newProducts.splice(selectedIndex, 1)
            this.setState({ orders: newProducts })
        }
        actionSheetRef.current?.setModalVisible(false);
    }
    onEndReached = () => {
        const { limitedIndex, orders } = this.state
        this.setState({ limitedIndex: limitedIndex + 20 })
        this.setOrder();
    }

    //Renders
    render() {
        const { showOrders, navigation, ThemeColor, currentStep, number_of_cart } = this.state;
        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
                <ActionSheet ref={actionSheetRef} containerStyle={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    marginHorizontal: 10,
                    width: width - 20,
                    paddingHorizontal: 20,
                    paddingBottom: 15,
                    bottom: 10,
                    backgroundColor: ThemeColor.Bg2
                }}
                    overlayColor={ThemeColor.Bg1}
                    elevation={50}
                    indicatorColor={`rgb(${ThemeColor.primary})`}
                    footerHeight={0}
                    headerAlwaysVisible>
                    <TouchableScale activeScale={0.985} style={{ paddingTop: 15, paddingBottom: 5, }}
                        onPress={() => this.removeAction()}>
                        <Text text70 style={{ textAlign: 'center' }} color={`rgb(${ThemeColor.danger})`}>Remove</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                        <Text text70 style={{ textAlign: 'center' }} color={ThemeColor.text1}>Cancel</Text>
                    </TouchableScale>
                </ActionSheet>


                <View style={{
                    ...styles.header,
                    backgroundColor: 'transparent',
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} />
                        <Text text70 color={ThemeColor.header}> Order History</Text>
                    </TouchableScale>
                    <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("shopping-cart")}>
                        {number_of_cart !== 0 ?
                            <View
                                backgroundColor={'#ff563d'}
                                style={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    top: -10,
                                    zIndex: 10,
                                    right: -10,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }} >
                                <Text text100 white>
                                    {number_of_cart}
                                </Text>
                            </View> : null}
                        <Feather name={'shopping-cart'} size={20} color={ThemeColor.header} />
                    </TouchableScale>
                </View>
                <FlatList
                    data={showOrders}
                    renderItem={(item) => <OrderList
                        navigation={this.state.navigation}
                        key={item.index}
                        index={item.index}
                        order={item.item}
                        onPress={this.openAction} />}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    onEndReached={() => {
                        this.setState({ loading: true })
                        this.onEndReached()
                    }}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => this.state.loading ? <ActivityIndicator color={ThemeColor.text2} /> : null}
                />
            </View>
        );
    }
}
//Map the redux state to your props.
const mapStateToProps = state => ({
    orders: state.Orders.orders,
    cart: state.Cart.cart,
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Order);
const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        zIndex: 100
    },
});
