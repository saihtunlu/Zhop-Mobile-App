import React, { Component } from 'react';
import store from '../redux/store';
import { StyleSheet, StatusBar, TextInput, FlatList, AsyncStorage, Platform } from 'react-native';
import {
    View,
    Text
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import TouchableScale from 'react-native-touchable-scale';
import ProductList from '../components/ProductList'
import { connect } from 'react-redux';
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onEdit: false,
            updating: false,
            products: this.props.products,
            navigation: this.props.navigation,
            searchData: [],
            number_of_cart: 0,
            searchString: '',
            ThemeColor: store.getState().Theme.theme
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    //Mounted
    componentDidMount() {
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
    }

    //Methods
    FilterSearch(text) {
        const { products } = this.state
        const newData = products.filter(function (item) {
            const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            searchData: newData,
            SearchString: text,
        });
        var array = text.split("");
        if (array.length < 2) {
            this.setState({ searchData: [] })
        }
    }
    render() {
        const { searchData, navigation, SearchString, number_of_cart, ThemeColor } = this.state
        const SearchIcon = SearchString ? 'x' : 'search'
        return (
            <View useNativeDriver style={{ flex: 1, backgroundColor: ThemeColor.Bg1 }}>
                <View style={{
                    ...styles.header,
                    backgroundColor: ThemeColor.Bg2
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: -15, alignItems: 'center', justifyContent: 'center', }}>
                        <Feather name={'chevron-left'} size={20} color={ThemeColor.header} /><Text color={ThemeColor.header} text70> Search</Text>
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
                <View style={{
                    paddingHorizontal: 10,
                    backgroundColor: ThemeColor.Bg2,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    paddingTop: 5,
                    paddingBottom: 15,
                    marginBottom: 10,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TextInput
                        style={{
                            height: 40,
                            width: '100%',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            backgroundColor: ThemeColor.Bg3,
                            color: ThemeColor.text1
                        }}
                        onChangeText={text => this.FilterSearch(text)}
                        value={SearchString}
                        placeholder={'What are you watching for? Type here...'}
                        autoFocus
                    />
                    <Feather name={SearchIcon} onPress={() => this.setState({ searchData: [], SearchString: '' })} style={{ position: 'relative', left: -30, zIndex: 1000 }} size={18} color={'#999'} />
                </View>
                <FlatList
                    data={searchData}
                    renderItem={({ item, index }) =>
                        <ProductList index={index} navigation={navigation} product={item} />
                    }
                    keyExtractor={item => item.title}
                />
            </View>);
    }
}

//Map the redux state to your props.
const mapStateToProps = state => ({
    products: state.Data.products,
    cart: state.Cart.cart
})
//Map your action creators to your props.
const mapDispatchToProps = {
}
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Search);

const styles = StyleSheet.create({
    image: {
        width: 54,
        height: 54,
        borderRadius: 10,
        marginHorizontal: 14,
    },
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    Lists: {
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 10,
        marginBottom: 10
    }
});