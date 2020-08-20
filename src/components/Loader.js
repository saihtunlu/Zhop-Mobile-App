import _ from 'lodash';
import React from 'react';
import {
    Dimensions,
    ActivityIndicator,
    Modal
} from 'react-native';

import {
    View,
} from 'react-native-ui-lib';
const { width, height } = Dimensions.get("window");


export default class Loader extends React.PureComponent {


    render() {
        const { show, ThemeColor } = this.props;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={show}
            >
                <View style={{ backgroundColor: ThemeColor.text1, zIndex: 0, opacity: 0.3, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}></View>

                <View style={{ flex: 1, zIndex: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        width: width / 3,
                        height: width / 3,
                        backgroundColor: ThemeColor.Bg1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20
                    }}>
                        <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                    </View>
                </View>
            </Modal>
        );
    }
}
