import _ from 'lodash';
import store from '../redux/store';
import React, { Component, createRef } from "react";
import {
    Dimensions,
    StyleSheet,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    StatusBar,
    Platform,
    Animated,
    InteractionManager
} from "react-native";
import {
    View,
    Text,
    AnimatableManager,
    Colors,
    ListItem,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import * as Animatable from 'react-native-animatable';
import { Divider, Stepper } from '../components'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import ActionSheet from "react-native-actions-sheet";
const actionSheetRef = createRef();
import { connect } from 'react-redux';
import { addCart } from '../redux/actions'
const { width, height } = Dimensions.get("window");
const marginTop = Platform.OS == 'ios' ? 55 : 15 + StatusBar.currentHeight;
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carts: this.props.cart,
            selectedIndex: 0,
            key: Date.now(),
            navigation: this.props.navigation,
            subtotal: 0,
            total: 0,
            index: null,
            isReady: false,
            ThemeColor: store.getState().Theme.theme,
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }

    //Mounted
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", () => {
            const { cart } = this.props;
            this.setState({ cart: cart })
            if (cart.length > 0) {
                InteractionManager.runAfterInteractions(() => {
                    this.Calculate(cart)
                })
            } else {
                this.setState({ isReady: true })
            }
        });
    }
    Calculate = async (carts) => {
        var array = []
        carts.forEach(data => {
            if (!data.sale_price) {
                data.subtotal = parseInt(data.addCart) * parseInt(data.regular_price)
            } else {
                data.subtotal = parseInt(data.addCart) * parseInt(data.sale_price)
            }
            array.push(data)
        });

        this.setState({ carts: array })
        var subtotal = parseInt(this.subtotalPrice())
        var total = (parseInt(this.subtotalPrice()) + parseInt(this.subtotalPrice() * 0.05))
        this.setState({ subtotal: subtotal, total: total, isReady: true })
    }
    ChooseParams = (data, navigation) => {
        var product = data.type === "Simple Product" ? data : data.product;
        navigation.navigate('Product', { product })
    }
    handle = (count, index) => {
        var AllCarts = this.state.carts;
        AllCarts[index].addCart = count;
        var subtotal = parseInt(this.subtotalPrice())
        var total = (parseInt(this.subtotalPrice()) + parseInt(this.subtotalPrice() * 0.05))
        this.props.addCart(AllCarts)
        this.setState({ subtotal: subtotal, total: total })

    }
    renderRow = (product, index, navigation) => {
        console.log("Cart -> renderRow -> product", product.addCart)
        const { ThemeColor } = this.state;
        var NoOfStock = product.stock === 'Manage Stock' ? parseInt(product.number_of_stock) : 1000000;
        var NoOfStock = product.stock === 'Out Of Stock' ? 0 : NoOfStock;
        const animationProps = AnimatableManager.presets.fadeInRight;
        const imageAnimationProps = AnimatableManager.getRandomDelay();
        return (
            <Animatable.View {...animationProps} key={index} >
                <ListItem
                    activeBackgroundColor={Colors.dark60}
                    activeOpacity={0.3}
                    height={77.5}
                    containerStyle={{ ...styles.Lists, backgroundColor: ThemeColor.Bg2 }}

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
                            <Text style={{ color: `rgb(${ThemeColor.primary})` }}>{(parseInt(product.sale_price ? product.sale_price : product.regular_price) * parseInt(product.addCart))}Ks</Text>
                        </ListItem.Part>
                        {product.type === 'Variable Product' ?
                            <ListItem.Part>
                                <Text style={{ flex: 1, marginRight: 10, color: ThemeColor.text2 }} text90 numberOfLines={1}>{product.attri1.attribute.name} - {product.attri1.name}{product.attri2 ? <Text> / {product.attri2.attribute.name} - {product.attri2.name}</Text> : null}</Text>
                            </ListItem.Part> : null}
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text style={{ marginRight: 10, color: ThemeColor.text2 }} numberOfLines={1}>{product.sale_price ? product.sale_price : product.regular_price}Ks x {product.addCart}</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Stepper
                                    minValue={1}
                                    maxValue={NoOfStock}
                                    onValueChange={count => this.handle(count, index)}
                                    initialValue={product.addCart}
                                />
                                <TouchableScale activeScale={0.85}
                                    style={{
                                        backgroundColor: `rgba(${ThemeColor.danger},0.2)`,
                                        padding: 5,
                                        borderRadius: 10,
                                        marginLeft: 10
                                    }}
                                    onPress={() => this.openAction(index)}>
                                    <Feather name={'trash'} size={18} color={`rgb(${ThemeColor.danger})`} />
                                </TouchableScale>
                            </View>
                        </ListItem.Part>
                    </ListItem.Part>
                </ListItem>
            </Animatable.View>
        );
    }
    subtotalPrice = () => {
        const { carts } = this.state;
        if (carts) {
            return carts.reduce((sum, item) => sum + (item.sale_price ? item.addCart * item.sale_price : item.addCart * item.regular_price), 0);
        }
        return 0;
    }

    openAction = (index) => {
        actionSheetRef.current?.setModalVisible()
        this.setState({ index: index })
    }
    removeCart = () => {
        var AllCarts = this.state.carts;
        AllCarts.splice(this.state.index, 1)
        this.setState({ carts: AllCarts })
        actionSheetRef.current?.setModalVisible(false);
        AsyncStorage.removeItem('cart').then(() => {
            var cart = AllCarts
            AsyncStorage.setItem('cart', JSON.stringify(cart))
        })
    }

    render() {
        const { carts, navigation, total, subtotal, ThemeColor } = this.state;
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
                        <Feather name={'chevron-left'} size={20} color={'#fff'} /><Text text70 white> My Cart</Text>
                    </TouchableScale>
                    <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("Search")}>
                        <Feather name={'search'} size={20} color={'#fff'} />
                    </TouchableScale>
                </Animated.View>
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
                        onPress={() => this.removeCart()}>
                        <Text text70 style={{ textAlign: 'center' }} color={`rgb(${ThemeColor.danger})`}>Remove</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                        <Text text70 style={{ textAlign: 'center' }} color={`rgb(${ThemeColor.primary})`}>Cancel</Text>
                    </TouchableScale>
                </ActionSheet>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}
                    onScroll={({ nativeEvent }) => {
                        scrollY.setValue(nativeEvent.contentOffset.y)
                    }}
                >
                    {/* Banner */}
                    <View style={{ ...styles.banner, backgroundColor: `rgb(${ThemeColor.primary})` }}>
                    </View>
                    <View animation={'slideInUp'} style={{ ...styles.CartDetail, backgroundColor: ThemeColor.Bg2 }}>
                        <View row style={{ justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: ThemeColor.header, fontSize: 14, }}>Cart Total</Text>
                        </View>
                        <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: ThemeColor.text1 }}>Subtotal</Text>
                            <Text style={{ color: ThemeColor.text1 }}>{subtotal}Ks</Text>
                        </View>
                        <Divider />
                        <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: ThemeColor.text1 }}>Tax</Text><Text style={{ color: ThemeColor.text1 }}>5%</Text>
                        </View>
                        <Divider />
                        <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }} >Total</Text><Text style={{ color: ThemeColor.text1 }}>{total}Ks</Text>
                        </View>
                        <TouchableScale
                            onPress={() => carts.length > 0 ? navigation.navigate('Checkout', { total: total, subtotal: subtotal }) : null}
                            style={{
                                backgroundColor: `rgb(${ThemeColor.primary})`,
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 9,
                                height: 45,
                                borderRadius: 30
                            }}
                            activeScale={0.985}
                        >
                            <Text white>Proceed To Checkout</Text><Feather name={'chevron-right'} size={20} style={{ marginLeft: 5 }} color={'white'} /></TouchableScale>
                    </View>
                    <Text black style={{ fontWeight: 'bold', marginHorizontal: 30, marginTop: 20, marginBottom: 10, fontSize: 14, color: ThemeColor.header }} >Products</Text>
                    {carts.length > 0 ?
                        carts.map((data, index) => this.renderRow(data, index, navigation))
                        :
                        <View style={{ flex: 1, height: height / 2.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: ThemeColor.text2 }} text90>No product found in your cart!</Text></View>}
                </ScrollView>
            </View>
        );
    }
}
//Map the redux state to your props.
const mapStateToProps = state => ({
    cart: state.Cart.cart,
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
    addCart: products => dispatch(addCart(products)),
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
const styles = StyleSheet.create({
    delete: {
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 10,
        marginBottom: 10,
        height: 90
    },
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
        marginTop: header_height + 5,
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
    banner: {
        flex: 1,
        height: header_height + 140,
        width: width,
        paddingTop: 40 + marginTop,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        position: 'absolute',
        top: 0, left: 0, right: 0,
    },
});
