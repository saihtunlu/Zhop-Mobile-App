import _ from 'lodash';
import React from "react";
import { FlatList } from "react-native";
import ProductCard from './ProductCard'

function Products(props) {
    const products = props.products
    const style = props.style;
    const navigation = props.navigation
    return (
        <FlatList
            data={products}
            style={{ paddingHorizontal: 10, ...style, }}
            horizontal={true}
            renderItem={({ item, index }) =>
                <ProductCard product={item} navigation={navigation} index={index} List />
            }
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
        />
    )
}
export default Products;