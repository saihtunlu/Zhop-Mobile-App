import _ from 'lodash';
import store from '../redux/store';
import React, { PureComponent } from "react";
import {
    ActivityIndicator,
    StyleSheet, Dimensions,
} from "react-native";
import {
    View,
    Text,
    AnimatableManager,
    AnimatedImage,
    Card,
    Avatar
} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
const { width } = Dimensions.get("window");

class ProductCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ThemeColor: store.getState().Theme.theme,
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }

    Variation = (product) => {
        var prices = []
        product.variations.forEach(data => {
            prices.push(parseInt(data.regular_price))
        });
        var minVal = Math.min(...prices);
        var maxVal = Math.max(...prices);
        var priceRange = minVal === maxVal ? minVal + 'Ks' : `${minVal}Ks - ${maxVal}Ks`
        return (
            <View row style={{ width: '100%' }}>
                <Text style={{ color: `rgb(${this.state.ThemeColor.primary})` }}>{priceRange}</Text>
            </View>
        )
    }

    render() {
        const { ThemeColor } = this.state;
        const { product, index, navigation, style } = this.props
        var animationProps = AnimatableManager.getEntranceByIndex(index);
        return (
            <Animatable.View key={`${product.title}-${index}`} {...animationProps} style={{ ...style }}>
                <Card
                    center
                    middle
                    activeScale={0.98}
                    style={{ ...styles.product, backgroundColor: ThemeColor.Bg2, marginRight: 10, }}
                    onPress={() => navigation.push("Product", { product })}>
                    {product.discount ? <Avatar
                        containerStyle={styles.discount}
                        size={35}
                        title='Discount'
                        label={`-${product.discount}%`}
                        backgroundColor={`rgb(${ThemeColor.danger})`}
                        labelColor={'white'}
                    /> : null}

                    <AnimatedImage style={{
                        width: (width - 40) / 2,
                        height: (width - 40) / 2,
                        borderRadius: 10,
                        marginTop: 2.5,
                        marginBottom: 3
                    }}
                        source={{ uri: `https://zhop.admin.saihtunlu.me${product.images[0].path}` }}
                        // source={{ uri: 'https://images.unsplash.com/photo-1579065560489-989b0cc394ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=649&q=80' }}
                        loader={<ActivityIndicator color="#ececec" />}
                        animationDuration={index === 0 ? 300 : 800}
                    />
                    <View style={{ paddingHorizontal: 10, marginBottom: 5, width: '100%' }}>
                        <Text style={{ color: ThemeColor.header }} numberOfLines={1}>
                            {product.title}
                        </Text>
                        {product.type === 'Simple Product' &&
                            <View row style={{ width: '100%' }}>
                                {product.sale_price ? <Text><Text style={{ textDecorationLine: 'line-through', color: ThemeColor.text2 }} red30>${product.regular_price}</Text><Text style={{ color: `rgb(${ThemeColor.primary})` }}> ${product.sale_price}</Text></Text> : <Text style={{ color: `rgb(${ThemeColor.primary})` }}>${product.regular_price}</Text>}
                            </View>
                        }{product.type === 'Variable Product' &&
                            this.Variation(product)
                        }
                    </View>
                </Card>
            </Animatable.View>

        )
    }
}
export default ProductCard;
const styles = StyleSheet.create({
    product: {
        minWidth: (width - 30) / 2,
        maxWidth: (width - 30) / 2,
        borderRadius: 10,
        elevation: 0,
        marginBottom: 10,
    },
    discount: {
        position: 'absolute',
        zIndex: 10,
        top: 10,
        right: 10
    }
});
