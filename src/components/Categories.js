import store from '../redux/store';
import _ from 'lodash';
import React, { useEffect } from "react";
import {
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import {
    View,
    Text,
    AnimatedImage,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
const { width, height } = Dimensions.get("window");

function Categories(props) {
    const navigation = props.navigation
    const categories = props.categories
    const ThemeColor = props.ThemeColor;


    return (
        <View row style={{ ...styles.categories, backgroundColor: ThemeColor.Bg2 }} >
            {_.map(categories, (category, index) => (
                <TouchableScale
                    key={`${category.label}-${index}`}
                    style={styles.category}
                    activeScale={0.985}
                    onPress={() => navigation.navigate("grid")}>
                    <AnimatedImage
                        style={{ resizeMode: 'cover', height: 65, borderRadius: 10, width: 65 }}
                        source={{ uri: `https://zhop.admin.saihtunlu.me${category.image}` }}
                        loader={<ActivityIndicator color="#F7F7F7" />}
                        animationDuration={index === 0 ? 300 : 800}
                    />
                    <View style={{ backgroundColor: ThemeColor.Bg3, width: '100%', borderRadius: 30, alignItems: 'center' }}>
                        <Text text100 color={ThemeColor.text1}>{category.label}</Text>
                    </View>
                </TouchableScale>
            ))}
        </View>
    )
}
export default Categories;
const styles = StyleSheet.create({
    categories: {
        height: width / 1.75,
        minHeight: 200,
        width: (width - 20),
        marginBottom: 20,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20,
        flexWrap: 'wrap',
        padding: 15,
        justifyContent: 'space-between',
    },
    category: {
        marginBottom: 10,
        width: '21.8%',
        height: width / 4.2,
        minHeight: 80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        overflow: 'hidden',
    }
});
