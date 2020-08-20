import _ from 'lodash';
import store from '../redux/store';
import React, { PureComponent } from "react";
import {
    StyleSheet,
} from "react-native";
import {
    View,
    Text,
    AnimatableManager,
    ListItem,
} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';


class ProductList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ThemeColor: store.getState().Theme.theme,
            showCustomIcons: false

        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    Variation = (product) => {
        const { ThemeColor } = this.state;
        var prices = []
        product.variations.forEach(data => {
            prices.push(parseInt(data.regular_price))
        });
        var minVal = Math.min(...prices);
        var maxVal = Math.max(...prices);
        var priceRange = minVal === maxVal ? minVal + 'Ks' : `${minVal}Ks - ${maxVal}Ks`
        return (
            <Text style={{ color: `rgb(${ThemeColor.primary})` }}>{priceRange}</Text>
        )
    }

    render() {
        const { ThemeColor, showCustomIcons } = this.state;
        const { product, index, navigation, type, onPress } = this.props
        var stockStatus = '';
        if (product.type === 'Simple Product') {
            if (product.stock === 'Manage Stock') {
                if (product.number_of_stock <= 0) {
                    stockStatus = 'Out Of Stock'
                } else {
                    stockStatus = `In Stock (${product.number_of_stock})`
                }
            } else {
                stockStatus = product.stock
            }
        } else {
            stockStatus = 'In Stock'
        }
        const BadgeColor = stockStatus === 'Out Of Stock' ? '#ff563d' : '#00cd8b';
        const imageAnimationProps = AnimatableManager.getRandomDelay();
        return (
            <View key={`${product.title}-${index}`}>
                <ListItem
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => navigation.push("Product", { product })}
                    containerStyle={{ ...styles.Lists, backgroundColor: ThemeColor.Bg2 }}
                >
                    <ListItem.Part left>

                        <Animatable.Image
                            source={{ uri: `https://zhop.admin.saihtunlu.me${product.images[0].path}` }}
                            // source={{ uri: 'https://images.unsplash.com/photo-1579065560489-989b0cc394ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=649&q=80' }}
                            style={styles.image}
                            {...imageAnimationProps}
                        />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <Text dark10 text70 style={{ flex: 1, marginRight: 10, color: ThemeColor.header }} numberOfLines={1}>{product.title}</Text>
                            {product.type === 'Simple Product' ?
                                <View row >
                                    {product.sale_price ? <Text><Text style={{ textDecorationLine: 'line-through', color: ThemeColor.text2 }} >${product.regular_price}</Text><Text style={{ color: `rgb(${ThemeColor.primary})` }}> ${product.sale_price}</Text></Text> : <Text style={{ color: `rgb(${ThemeColor.primary})` }}>{product.regular_price}Ks</Text>}
                                </View> :
                                this.Variation(product)
                            }
                        </ListItem.Part>
                        <ListItem.Part>
                            <Text style={{ flex: 1, marginRight: 10, color: ThemeColor.text2 }} text90 numberOfLines={1}>{`By ${product.brand.name}`}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View backgroundColor={BadgeColor} style={{ width: 8, height: 8, borderRadius: 10 }} marginRight={5} />
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{ color: ThemeColor.text1 }}>{stockStatus}</Text>
                                    {type === 'fav' ?
                                        <TouchableScale activeScale={0.85}
                                            style={{
                                                backgroundColor: `rgba(${ThemeColor.danger},0.2)`,
                                                padding: 5,
                                                borderRadius: 10,
                                                marginLeft: 10
                                            }}
                                            onPress={() => onPress(index, 'fav')}>
                                            <Feather name={'trash'} size={18} color={`rgb(${ThemeColor.danger})`} />
                                        </TouchableScale> : null}
                                </View>
                            </View>
                        </ListItem.Part>
                    </ListItem.Part>
                </ListItem>
            </View>
        );
    }
}
export default ProductList;
const styles = StyleSheet.create({

    image: {
        width: 54,
        height: 54,
        borderRadius: 10,
        marginHorizontal: 14,
    },
    Lists: {
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 10,
        marginBottom: 10
    }
});
