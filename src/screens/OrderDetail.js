import _ from 'lodash';
import store from '../redux/store';
import React, { PureComponent, createRef } from "react";
import {
    Dimensions,
    StyleSheet,
    Animated,
    StatusBar,
    Platform,
    InteractionManager,
    ActivityIndicator,
    Text,
    ScrollView,
    Linking
} from "react-native";
import {
    View,
    AnimatableManager,
    Colors,
    ListItem,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import * as Animatable from 'react-native-animatable';
import { Divider } from '../components'
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

class OrderDetail extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            ThemeColor: store.getState().Theme.theme,
            products: [],
            order: this.props.route.params.order,
            isReady: false,
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    //Mounted
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            var array = []
            this.state.order.detail.forEach((data) => {
                var product = {};
                if (data.product_type === "Simple Product") {
                    product = data.product;
                    product.quantity = data.quantity;
                    array.push(product);
                } else {
                    product = data.variation;
                    product.quantity = data.quantity;
                    array.push(product);
                }
            });
            this.setState({ products: array, isReady: true })
        });
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

    renderRow = (product, index, navigation) => {
        if (product.type !== "Simple Product") {
            console.log("OrderDetail -> renderRow -> product", product.attri1.image)
        }
        const { ThemeColor } = this.state;
        const animationProps = AnimatableManager.presets.fadeInRight;
        const imageAnimationProps = AnimatableManager.getRandomDelay();
        return (
            <Animatable.View {...animationProps} key={index} >
                <TouchableScale activeScale={0.985} onPress={() => this.ChooseParams(product, navigation)}>
                    <ListItem
                        activeBackgroundColor={Colors.dark60}
                        activeOpacity={0.3}
                        height={77.5}
                        containerStyle={{ ...styles.Lists, backgroundColor: ThemeColor.Bg2 }}
                    >
                        <ListItem.Part left>
                            {product.type === 'Simple Product' ?
                                <Animatable.Image
                                    source={{
                                        uri: product.images[0].path
                                    }}
                                    style={styles.image}
                                    {...imageAnimationProps}
                                />
                                : <Animatable.Image
                                    source={{ uri: `https://zhop.admin.saihtunlu.me${product.attri1.image !== null ? product.attri1.image : product.attri2.image}` }}
                                    style={styles.image}
                                    {...imageAnimationProps}
                                />}

                        </ListItem.Part>
                        <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                                <Text text70 style={{ flex: 1, marginRight: 10, color: ThemeColor.header }} numberOfLines={1}>{product.type === 'Simple Product' ? product.title : product.product.title}</Text>
                                <Text style={{ color: `rgb(${ThemeColor.primary})` }}>{parseInt(product.sale_price ? product.sale_price : product.regular_price) * parseInt(product.quantity)}Ks</Text>
                            </ListItem.Part>
                            {product.type === 'Simple Product' ?
                                null : <ListItem.Part>
                                    <Text style={{ flex: 1, marginRight: 10, color: ThemeColor.text2 }} text90 numberOfLines={1}>{product.attri1.attribute.name} - {product.attri1.name}{product.attri2 ? <Text> / {product.attri2.attribute.name} - {product.attri2.name}</Text> : null}</Text>
                                </ListItem.Part>}
                            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                                <Text style={{ marginRight: 10, color: ThemeColor.text2 }} numberOfLines={1}>{product.sale_price ? product.sale_price : product.regular_price}Ks {product.weight ? `(${product.weight}Kg)` : null} x {product.quantity}</Text>
                            </ListItem.Part>
                        </ListItem.Part>
                    </ListItem>
                </TouchableScale>
            </Animatable.View>
        );
    }
    render() {
        const { navigation } = this.props;
        const { ThemeColor, products, order } = this.state;
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
                    ...styles.header, opacity: animatedValue, backgroundColor: `rgb(${ThemeColor.primary})`
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={'#fff'} /><Text style={{ fontSize: 16, color: '#fff' }}> Order Detail</Text>
                    </TouchableScale>
                    <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("Search")}>
                        <Feather name={'search'} size={20} color={'#fff'} />
                    </TouchableScale>
                </Animated.View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        scrollY.setValue(nativeEvent.contentOffset.y)
                    }}
                    style={{ flex: 1, backgroundColor: ThemeColor.Bg1, }}
                >
                    <View
                        style={{
                            backgroundColor: `rgb(${ThemeColor.primary})`, height: header_height + 150,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                        }}>

                    </View>
                    <View style={{

                        zIndex: 100,
                        flex: 1,
                    }}>

                        <View style={{ ...styles.CartDetail, marginTop: -140, backgroundColor: ThemeColor.Bg2 }}>
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Order ID</Text><Text style={{ color: ThemeColor.text1 }}>{order.order_id}</Text>
                            </View>
                            <Divider />
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Order Date</Text><Text style={{ color: ThemeColor.text1 }}> {moment(order.created_at).format('DD/MM/YYYY')}</Text>
                            </View>
                            <Divider />

                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Total</Text><Text style={{ color: ThemeColor.text1 }}>{order.totalPrice}Ks</Text>
                            </View>
                            <Divider />
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Status</Text>
                                {order.status === 'Pending' &&
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 30, backgroundColor: `rgba(${ThemeColor.warning},0.2)`, fontSize: 12, color: `rgb(${ThemeColor.warning})` }} text90 >{order.status}</Text>}
                                {order.status === 'Cancelled' &&
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 30, backgroundColor: `rgba(${ThemeColor.danger},0.2)`, fontSize: 12, color: `rgb(${ThemeColor.danger})` }} text90 >{order.status}</Text>}
                                {order.status === 'Confirmed' &&
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 30, backgroundColor: `rgba(${ThemeColor.success},0.2)`, fontSize: 12, color: `rgb(${ThemeColor.success})` }} text90 >{order.status}</Text>}
                                {order.status === 'Delivering' &&
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 30, backgroundColor: `rgba(${ThemeColor.success},0.2)`, fontSize: 12, color: `rgb(${ThemeColor.success})` }} text90 >{order.status}</Text>}
                                {order.status === 'Completed' &&
                                    <Text style={{ color: `rgb(${ThemeColor.success})` }} text90 >{order.status}</Text>}

                            </View>
                            <Divider />
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Payment</Text><Text style={{ color: ThemeColor.text1 }}>{order.payment_method}</Text>
                            </View>
                            {order.payment_method === 'Bank Direct Transfer' && <Divider />}
                            {order.payment_method === 'Bank Direct Transfer' &&
                                <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: ThemeColor.text1 }}>Paid</Text><Text style={{ color: `rgb(${ThemeColor.warning})` }}>{order.paid ? 'Yes' : 'No'}</Text>
                                </View>}
                        </View>

                        <Text style={{ fontWeight: 'bold', marginHorizontal: 30, marginTop: 20, marginBottom: 10, color: ThemeColor.header }}>Address</Text>
                        <View style={{ ...styles.CartDetail, backgroundColor: ThemeColor.Bg2 }}>
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>State</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.state}</Text>
                            </View>
                            <Divider />
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>City/Township</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.city}</Text>
                            </View>
                            <Divider />
                            <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Address Line 1</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.addressLine1}</Text>
                            </View>
                            {order.bill_address.addressLine2 && <Divider />}
                            {order.bill_address.addressLine2 && <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: ThemeColor.text1 }}>Address Line 2</Text><Text style={{ color: ThemeColor.text1 }}>{order.bill_address.addressLine2}</Text>
                            </View>}
                        </View>

                        <Text style={{ fontWeight: 'bold', marginHorizontal: 30, marginTop: 20, marginBottom: 10, color: ThemeColor.header }}>Products</Text>

                        {products.map((data, index) => this.renderRow(data, index, navigation))}
                        <Divider />
                        <TouchableScale
                            onPress={() => Linking.openURL(`https://zhop.admin.saihtunlu.me/api/slip/${this.state.order.id}`)}
                            style={{
                                backgroundColor: `rgb(${ThemeColor.primary})`,
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 9,
                                height: 45,
                                width: width - 40,
                                margin: 20,
                                borderRadius: 30
                            }}
                            activeScale={0.985}
                        >
                            <Text style={{ color: '#fff' }}>Download Slip</Text>
                            <Feather name={'download'} size={20} style={{ marginLeft: 5 }} color={'white'} />
                        </TouchableScale>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
export default OrderDetail;
const styles = StyleSheet.create({
    Lists: {
        paddingVertical: 10,
        height: 90,
        marginHorizontal: 10,
        borderRadius: 15,
        marginBottom: 10
    },
    image: {
        width: 54,
        height: 54,
        borderRadius: 10,
        marginHorizontal: 14,
    },
    CartDetail: {
        marginHorizontal: 10,
        width: width - 20,
        borderRadius: 20,
        padding: 20
    },
    header: {
        paddingTop: 15,
        height: header_height,
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

});
