import store from '../redux/store';
import React, { Component, createRef } from "react";
import {
    Dimensions,
    StyleSheet,
    AsyncStorage,
    InteractionManager,
    ActivityIndicator,
    StatusBar,
    Platform,
    Animated,
    ScrollView
} from "react-native";
import {
    View,
    Text,
    Avatar,
} from 'react-native-ui-lib';
import { AuthContext } from "../navigation/AuthProvider";
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get("window");
import Divider from '../components/Divider'
const marginTop = Platform.OS == 'ios' ? 55 : 15 + StatusBar.currentHeight;
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import ActionSheet from "react-native-actions-sheet";
const actionSheetRef = createRef();
import * as ImagePicker from 'expo-image-picker';
import axios from '../axios'
import * as SecureStore from "expo-secure-store";
import { connect } from 'react-redux';
class MyAccount extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            number_of_cart: this.props.cartLength,
            navigation: this.props.navigation,
            ThemeColor: store.getState().Theme.theme,
            orders: 0,
            fav: 0,
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
            this.setState({ number_of_cart: this.props.cartLength })
            InteractionManager.runAfterInteractions(() => {
                this.setState({ orders: this.props.orders.length, fav: this.props.fav.length, isReady: true })
            });
        });
    }

    //Methods
    pickImage = async () => {
        actionSheetRef.current?.setModalVisible(false)
        let value = this.context;
        let token = value.user.token;
        let user = value.user;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                base64: true,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            let imageUri = result ? `data:image/jpg;base64,${result.base64}` : null;
            if (result) {
                axios.post(`/updateProfile`, { file: imageUri, id: user.user.id })
                    .then(response => {
                        user.user.profile_image = response.data;
                        value.setUser(user); //update to provider
                        SecureStore.deleteItemAsync("user").then(() => {
                            SecureStore.setItemAsync('user', JSON.stringify(user))
                        })
                    })
                    .catch(error => {
                    });
            }

        } catch (E) {
        }
    };
    removeImage = () => {
        let value = this.context;
        let token = value.user.token;
        let user = value.user;
        user.user.profile_image = null
        actionSheetRef.current?.setModalVisible(false)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get(`/removeProfile`)
            .then(response => {
                value.setUser(user); //update to provider
                SecureStore.deleteItemAsync("user").then(() => {
                    SecureStore.setItemAsync('user', JSON.stringify(user))
                })
            })
            .catch(error => {
            });
    }
    render() {
        var scrollY = new Animated.Value(0)
        const diffClamp = Animated.diffClamp(scrollY, 0, header_height);
        const animatedValue = diffClamp.interpolate({
            inputRange: [0, header_height],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })
        let value = this.context;
        let user = value.user.user
        const { navigation, ThemeColor, number_of_cart, orders, fav } = this.state;
        const Lists = [{
            name: 'My Favorite',
            icon: 'heart',
            route: 'Fav',
            color: ThemeColor.danger
        }, {
            name: "Order History",
            icon: "gift",
            route: 'Order',
            color: ThemeColor.success
        }, {
            name: 'Address',
            icon: 'map-pin',
            route: 'Address',
            color: ThemeColor.primary
        }, {
            name: 'About Developer',
            icon: 'code',
            route: 'AboutUs',
            color: ThemeColor.secondary
        }, {
            name: 'Settings',
            icon: 'settings',
            route: 'Settings',
            color: ThemeColor.warning
        },]

        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
                <Animated.View style={{
                    ...styles.header, backgroundColor: `rgb(${ThemeColor.primary})`, opacity: animatedValue
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={'#fff'} /><Text text70 white> My Account</Text>
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
                        onPress={() => this.pickImage()}>
                        <Text text70 style={{ textAlign: 'center' }} color={ThemeColor.text1}>Update profile image</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => this.removeImage()}>
                        <Text text70 style={{ textAlign: 'center' }} color={`rgb(${ThemeColor.danger})`}>Remove profile image</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                        <Text text70 style={{ textAlign: 'center' }} color={ThemeColor.text1}>Cancel</Text>
                    </TouchableScale>
                </ActionSheet>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}
                    onScroll={({ nativeEvent }) => {
                        scrollY.setValue(nativeEvent.contentOffset.y)
                    }}
                >
                    <View
                        style={{
                            ...styles.banner,
                            backgroundColor: `rgb(${ThemeColor.primary})`,
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            marginTop: 10
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <TouchableScale activeScale={0.85} onPress={() => actionSheetRef.current?.setModalVisible()}>
                                    <Avatar source={{ uri: `https://zhop.admin.saihtunlu.me${user.profile_image}` }} size={width / 5.5} containerStyle={{ marginRight: 15, borderWidth: 0 }} />
                                </TouchableScale>
                                <View >
                                    <Text text60BL white style={{ marginBottom: 3 }} >{user.name}</Text>
                                    <Text text100 white>{user.email}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 10
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 10
                                }}>
                                <View style={{
                                    width: (width / 4) - 25,
                                    height: (width / 4) - 25,
                                    marginHorizontal: 5,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 15,
                                    borderRightColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }}>
                                    <Text style={{ textAlign: 'center' }} white>Favorites</Text>
                                    <Text style={{ textAlign: 'center' }} white>{fav}</Text>
                                </View>
                                <View style={{
                                    width: (width / 4) - 25,
                                    height: (width / 4) - 25,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                    borderRadius: 15,
                                    borderRightColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }}>
                                    <Text style={{ textAlign: 'center' }} white>Orders</Text>
                                    <Text style={{ textAlign: 'center' }} white>{orders}</Text>
                                </View>
                                <View style={{
                                    width: (width / 4) - 25,
                                    height: (width / 4) - 25,
                                    marginHorizontal: 5,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 15,
                                    borderRightColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }}>
                                    <Text style={{ textAlign: 'center' }} white>Cart</Text>
                                    <Text style={{ textAlign: 'center' }} white>{number_of_cart}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        marginTop: -40,
                    }}>
                        {Lists.map((data, index) =>
                            <TouchableScale activeScale={0.985} key={`#${index}`} style={{
                                ...styles.Lists,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: ThemeColor.Bg2
                            }}
                                onPress={() => navigation.navigate(data.route)}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>

                                    <Feather name={data.icon} style={{
                                        borderRadius: 10,
                                        padding: 10,
                                        marginRight: 10,
                                        backgroundColor: `rgba(${data.color},0.2)`
                                    }} size={18} color={`rgb(${data.color})`} />
                                    <Text color={ThemeColor.header}>
                                        {data.name}
                                    </Text>
                                </View>
                                <Feather
                                    name={'chevron-right'}
                                    size={18}
                                    color={ThemeColor.text2} />
                            </TouchableScale>)}
                    </View>
                </ScrollView>



            </View>
        );
    }
}

//Map the redux state to your props.
const mapStateToProps = state => ({
    cartLength: state.Cart.cartLength,
    orders: state.Orders.orders,
    fav: state.Fav.fav
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);

const styles = StyleSheet.create({
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
    banner: {
        width: width,
        paddingBottom: 60,
        paddingTop: marginTop + 30,
        overflow: 'hidden',
    },
    image: {
        width: 54,
        height: 54,
        borderRadius: 10,
        marginHorizontal: 14,
    },
    Lists: {
        borderRadius: 15,
        overflow: 'hidden',
        width: width - 20,
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10
    }
});
