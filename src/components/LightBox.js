
import _ from 'lodash';
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import ImageView from 'react-native-image-view';
import { Carousel, AnimatedImage, Avatar, PageControl, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

export default class LightBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            isImageViewVisible: false,
            current_index: 0
        };

    }



    render() {
        const { isImageViewVisible, imageIndex, current_index } = this.state;
        const { images, imageStyle, discount } = this.props;


        return (
            <View style={{ ...imageStyle }}>
                {discount ? <Avatar
                    containerStyle={styles.discount}
                    size={45}
                    title='Discount'
                    label={`-${discount}%`}
                    backgroundColor={Colors.red30}
                    labelColor={Colors.white}
                /> : null}
                <Carousel containerStyle={{}} animated initialPage={current_index} loop allowAccessibleLayout onChangePage={(e) => {
                    this.setState({ current_index: e })
                }} autoplay={false}>
                    {_.map(images, (image, index) => {
                        return (
                            <TouchableScale
                                key={index}
                                activeScale={1.05}
                                onPress={() => {
                                    this.setState({
                                        imageIndex: index,
                                        isImageViewVisible: true,
                                    });
                                }}
                            >
                                <AnimatedImage
                                    style={{ resizeMode: 'cover', height: '100%', width: '100%' }}
                                    source={image.source}
                                    loader={<ActivityIndicator color="#ececec" />}
                                    animationDuration={index === 0 ? 300 : 800}
                                />
                            </TouchableScale>
                        );
                    })}
                </Carousel>
                <ImageView
                    glideAlways
                    images={images}
                    imageIndex={imageIndex}
                    animationType="fade"
                    isVisible={isImageViewVisible}
                    onClose={() => this.setState({ isImageViewVisible: false })}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    discount: {
        position: 'absolute',
        zIndex: 10,
        bottom: 40,
        right: 10
    }
});