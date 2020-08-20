import store from '../redux/store';
import _ from 'lodash';
import React, { useState, useRef } from "react";
import {
    Dimensions,
    StyleSheet,
} from "react-native";
import {
    Text,
    Button,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get("window");
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';



function Carousal(props) {
    const navigation = props.navigation
    const data = props.data;
    const [ThemeColor, setThemeColor] = React.useState(store.getState().Theme.theme);

    //Subscribe to redux store
    store.subscribe(() => {
        var color = store.getState().Theme.theme;
        setThemeColor(color)
    });
    const carouselRef = useRef(null);
    //Renders
    const Carousel_ = ({ item, index }, parallaxProps) => {
        return (
            <TouchableScale activeScale={0.999999} key={index} flex bottom style={{
                padding: 0,
                height: '100%',
                width: width - 20,
                marginHorizontal: 10,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'flex-end',
                overflow: 'hidden',
            }}
            >
                <ParallaxImage
                    source={{ uri: `https://zhop.admin.saihtunlu.me${item.image}` }}
                    containerStyle={{ ...StyleSheet.absoluteFillObject }}
                    style={{
                        height: '100%', resizeMode: 'cover',
                    }}
                    parallaxFactor={0.2}
                    {...parallaxProps}
                />
                <LinearGradient style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    width: '100%',
                    alignItems: 'center',
                }}
                    colors={['rgba(225,225,225,0)', 'rgba(225,225,225,0)']}>
                    <Text white text60>{item.title}</Text>
                    {item.link &&
                        <Button
                            round
                            backgroundColor="rgba(225,225,225,0.5)"
                            style={{ margin: 20 }}
                            onPress={() => navigation.navigate('WebBrowser', { link: item.link, title: item.title })}
                            iconSource={() => <Feather name={'chevron-right'} size={20} color={'white'} />}
                            iconStyle={{ tintColor: '#fff' }}
                            size={'small'}
                        />}
                </LinearGradient>
            </TouchableScale>
        )
    }

    return (
        <Carousel
            ref={carouselRef}
            data={data}
            renderItem={Carousel_}
            sliderWidth={width}
            itemWidth={width}
            containerCustomStyle={{ ...styles.carousel, ...props.style }}
            loop={true}
            autoplay={true}
            hasParallaxImages={true}
            autoplayDelay={500}
            autoplayInterval={10000}
            inactiveSlideScale={0.5}
            inactiveSlideOpacity={1}
            layout={'stack'}
            layoutCardOffset={0}
        />
    );
}
export default Carousal;
const styles = StyleSheet.create({
    carousel: {
        marginBottom: 20,
        width: width,
        height: width / 1.75,
    }
});
