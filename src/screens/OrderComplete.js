import React, { PureComponent } from 'react';
import store from '../redux/store';
import { StyleSheet, ScrollView, StatusBar, Dimensions, AsyncStorage, Platform } from 'react-native';
import {
    View,
    Text,
} from 'react-native-ui-lib';
import { Divider } from '../components'
import Feather from 'react-native-vector-icons/Feather';
import TouchableScale from 'react-native-touchable-scale';
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
const { width, height } = Dimensions.get("window");
import moment from 'moment';
import { connect } from 'react-redux';
import { getOrder } from '../redux/actions'

class OrderComplete extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            ThemeColor: store.getState().Theme.theme
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    //Mounted
    componentDidMount() {
        const { isSuccess } = this.props.route.params;
        if (isSuccess) {
            const { order } = this.props.route.params;
            var orders = this.props.orders;
            orders.push(order);
            this.props.getOrder(orders)
        }
    }

    render() {
        const { navigation, ThemeColor } = this.state
        const { order, isSuccess } = this.props.route.params;
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    ...styles.header,
                    backgroundColor: ThemeColor.Bg1
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.navigate('home')} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text color={ThemeColor.header} text70> Back To Home</Text>
                    </TouchableScale>
                    <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("Search")}>
                        <Feather name={'search'} size={20} color={ThemeColor.header} />
                    </TouchableScale>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: ThemeColor.Bg1 }}>
                    {isSuccess ?
                        <View >
                            <View style={{
                                width: width,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 15
                            }}>
                                <View style={{
                                    padding: 25,
                                    backgroundColor: `rgba(${ThemeColor.success},0.2)`,
                                    borderRadius: 100
                                }}>
                                    <Feather name={'check-circle'} size={50} color={`rgb(${ThemeColor.success})`} />
                                </View>
                                <Text style={{ fontWeight: 'bold', marginTop: 10, color: ThemeColor.header }} text60BL>Successfully Ordered!</Text>
                            </View>

                            {/* Order Details */}
                            <View style={{ ...styles.CartDetail, backgroundColor: ThemeColor.Bg2 }}>
                                <View row style={{ justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Order Details</Text>
                                </View>
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: ThemeColor.text1, fontWeight: 'bold' }}>Order ID</Text><Text style={{ color: ThemeColor.text1 }}>{order.order_id}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Ordered Date</Text><Text style={{ color: ThemeColor.text1 }}>{moment(order.created_at).format('DD/MM/YYYY')}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Name</Text><Text style={{ color: ThemeColor.text1 }}>{order.userName}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Phone Number</Text><Text style={{ color: ThemeColor.text1 }}>{order.phone}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Email</Text><Text style={{ color: ThemeColor.text1 }}>{order.email}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Payment Method</Text><Text style={{ color: ThemeColor.text1 }}>{order.payment_method}</Text>
                                </View>
                            </View>
                            {/* Address */}
                            <View style={{ ...styles.CartDetail, backgroundColor: ThemeColor.Bg2 }}>
                                <View row style={{ justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Address</Text>
                                </View>
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: ThemeColor.text1, fontWeight: 'bold' }}>State</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.state}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >City/Township</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.city}</Text>
                                </View>
                                <Divider />
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Street Line 1</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.addressLine1}</Text>
                                </View>
                                {order.bill_address.addressLine2 && <Divider />}
                                {order.bill_address.addressLine2 && <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: ThemeColor.text1 }}>Address Line 2</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.addressLine2}</Text>
                                </View>}
                            </View>
                            {/* Bank Info  */}
                            {order.payment_method === 'Bank Direct Transfer' &&
                                <Text style={{
                                    color: `rgb(${ThemeColor.primary})`,
                                    backgroundColor: `rgba(${ThemeColor.primary},0.2)`,
                                    padding: 10,
                                    fontWeight: 'bold',
                                    borderTopRightRadius: 30,
                                    borderBottomRightRadius: 30,
                                    marginBottom: 10,
                                    minWidth: 180,
                                    width: 230,
                                }} >Our Bank Information To Transfer</Text>}
                            {order.payment_method === 'Bank Direct Transfer' &&
                                order.payment.banks.map((data, index) =>
                                    <View key={`${data.bankName}-${index}`} style={{ ...styles.CartDetail, backgroundColor: ThemeColor.Bg2 }}>
                                        <View row style={{ justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>{data.bankName}</Text>
                                        </View>
                                        <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: ThemeColor.text1 }}>Holder Name</Text><Text style={{ color: ThemeColor.text1 }}>{data.holderName}</Text>
                                        </View>
                                        <Divider />
                                        <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Account Number</Text><Text style={{ color: ThemeColor.text1 }}>{data.accNumber}</Text>
                                        </View>
                                    </View>
                                )}
                        </View> :
                        <View style={{
                            width: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 15,
                            flex: 1
                        }}>
                            <View style={{
                                padding: 25,
                                backgroundColor: `rgba(${ThemeColor.danger},0.2)`,
                                borderRadius: 100
                            }}>
                                <Feather name={'x'} size={50} color={`rgb(${ThemeColor.danger})`} />
                            </View>
                            <Text style={{ fontWeight: 'bold', marginTop: 10, color: ThemeColor.header }} L>Failed To Order!</Text>
                            <Text style={{ marginVertical: 15, marginHorizontal: 20, textAlign: 'center' }} >
                                We are very sorry for the inconvenience. Please contact customer support for any further concerns you might have – our customer service agents are always very happy to help.
                        </Text>

                            <TouchableScale
                                style={{
                                    backgroundColor: `rgb(${ThemeColor.primary})`,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 9,
                                    height: 40,
                                    borderRadius: 30,
                                    marginHorizontal: 10
                                }}
                                activeScale={0.985}
                                onPress={() => navigation.navigate('home')}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Feather name={'chevron-left'} size={20} style={{ marginLeft: 5 }} color={'white'} />
                                    <Text white>Back To Home</Text>
                                </View>
                            </TouchableScale>

                        </View>}
                </ScrollView>
            </View>);
    }
}
//Map the redux state to your props.
const mapStateToProps = state => ({
    orders: state.Orders.orders,
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
    getOrder: orders => dispatch(getOrder(orders)),
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(OrderComplete);
const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    CartDetail: {
        marginHorizontal: 10,
        width: width - 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15
    },
});