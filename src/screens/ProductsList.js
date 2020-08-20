import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    StatusBar,
    Dimensions,
    FlatList,
    Animated,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import {
    View,
    Text,
} from 'react-native-ui-lib';
import store from '../redux/store';

import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import ProductCard from '../components/ProductCard';
import _ from 'lodash';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

class ProductsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            number_of_cart: 0,
            navigation: this.props.navigation,
            TotalSelectedProducts: [],
            selectedProducts: [],
            Limited: 20,
            ThemeColor: store.getState().Theme.theme,
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
            this.filterProducts()
            this.getCart();
        });
    }
    //Methods
    getCart = async () => {
        await AsyncStorage.getItem('cart')
            .then(data => {
                if (data) {
                    var carts = JSON.parse(data);
                    var values = carts.map(item => Number(item.addCart));
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
            })
    }

    filterProducts = async () => {
        const { products } = this.props;
        const { type, data } = this.props.route.params;
        var array = []

        if (type === 'Category') {
            for (let i = 0; i < 3; i++) {
                var selectedData = await products.filter(element => {
                    if (!element.categories[i]) {
                        return false;
                    } else {
                        return element.categories[i].category3_id === data;
                    }
                })
                selectedData.forEach(element => {
                    array.push(element)
                });
            }
        }
        if (type === 'Discount') {
            products.forEach(data => {
                if (data.type === 'Simple Product') {
                    if (data.discount) {
                        array.push(data);
                    }
                } else {
                    var check = data.variations.filter(variation => {
                        return variation.discount;
                    })
                    if (check.length > 0) {
                        array.push(data)
                    }
                }
            });
        }
        if (type === 'New Products') {
            array = products;
        }
        if (type === 'Brand') {
            array = products.filter(product => {
                return product.brand_id === data;
            })
        }
        if (type === 'Related Products') {
            for (let i = 0; i < data.categories.length; i++) {
                var FilteredData = products.filter(product => {
                    return product.categories[i].category3_id === data.categories[i].category3_id && product.id !== data.id;
                })
                FilteredData.forEach(element => {
                    array.push(element)
                });
            }
            for (let i = 0; i < data.tags.length; i++) {
                var checkedArray = []
                products.forEach(productValue => {
                    var check = productValue.tags.filter((productData, index) => {
                        return productData.tag_id === data.tags[i].tag_id && productValue.id !== data.id;
                    })[0]
                    if (check) {
                        checkedArray.push(productValue);
                    }
                });
                checkedArray.forEach(element => {
                    array.push(element)
                });
            }
        }
        this.setState({ TotalSelectedProducts: array })
        this.setProduct(array)
    }
    setProduct = (data) => {
        const { TotalSelectedProducts, Limited } = this.state;
        if (data) {
            var array = data
        } else {
            var array = TotalSelectedProducts
        }
        var SelectedProducts = []
        array.forEach((data, key) => {
            if (parseInt(key + 1) > Limited) {
                return false;
            }
            SelectedProducts.push(data)
        })
        this.setState({ selectedProducts: SelectedProducts, isReady: true, loading: false })
    }
    onProductEndReached = () => {
        const { Limited, TotalSelectedProducts } = this.state
        if (Limited <= TotalSelectedProducts.length) {
            this.setState({ loading: true, Limited: Limited + 20 })
            this.setProduct();
        }
    }
    //Renders
    render() {
        const { number_of_cart, navigation, ThemeColor, selectedProducts } = this.state;
        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                </View>
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1 }}>
                <Animated.View style={{ ...styles.header }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text text70 color={ThemeColor.header}> Products</Text>
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
                </Animated.View>
                {selectedProducts.length > 0 ?
                    <FlatList
                        numColumns={2}
                        style={{ flexDirection: 'column', paddingHorizontal: 10, }}
                        data={selectedProducts}
                        renderItem={(item, index) => <ProductCard
                            navigation={navigation}
                            key={index}
                            index={index}
                            product={item.item}
                            navigation={navigation}
                        />}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => this.onProductEndReached()}
                        ListFooterComponent={() => this.state.loading ? <ActivityIndicator color={ThemeColor.text2} /> : null}
                        showsVerticalScrollIndicator={false}
                    /> :
                    <View style={{ justifyContent: 'center', height: height - header_height, alignItems: 'center', }}><Text grey30>No Product ...</Text></View>}
            </View>);
    }
}
//Map the redux state to your props.
const mapStateToProps = state => ({
    products: state.Data.products,
})
//Map your action creators to your props.
const mapDispatchToProps = {
}
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    products: {
        backgroundColor: 'red',
        flexWrap: "wrap",
        flexDirection: 'row',
        paddingHorizontal: 10,
        width: width,
        marginBottom: 10
    },

});