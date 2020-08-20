import React, { useState } from 'react';
import {
    StyleSheet,
    Platform,
    StatusBar,
    Dimensions,
    Linking
} from 'react-native';
import {
    View,
    Text,
    Avatar,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import store from '../redux/store'
const { width, height } = Dimensions.get('window');
import Feather from 'react-native-vector-icons/Feather';
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

export default class AboutUs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ThemeColor: store.getState().Theme.theme,
            navigation: this.props.navigation
        }
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }

    makeCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${+959 692082635}';
        } else {
            phoneNumber = 'telprompt:${+959 692082635}';
        }

        Linking.openURL(phoneNumber);
    };


    render() {

        const { ThemeColor, navigation } = this.state;
        return (
            <View style={{ ...styles.container, backgroundColor: `rgb(${ThemeColor.primary})`, }}>
                <View style={{
                    ...styles.header,
                    backgroundColor: 'transparent',
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: -15, alignItems: 'center', justifyContent: 'center', }}>
                        <Feather name={'chevron-left'} size={20} color={`#fff`} />
                        <Text text70 color={'#fff'}> About Developer</Text>
                    </TouchableScale>
                </View>

                <View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: ThemeColor.Bg2,
                    width: width - 20,
                    marginHorizontal: 10,
                    borderRadius: 30,
                    marginTop: width / 2,
                    marginBottom: 10,
                    flex: 1
                }}>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>

                        <Avatar source={require('../assets/images/developer.jpg')} size={width / 2.5} containerStyle={{ marginTop: -(width / 5), marginBottom: (width / 12) }} />
                        <Text color={ThemeColor.header} style={{ fontWeight: 'bold', fontSize: 25, marginBottom: 5 }}>Sai Htun Lu</Text>
                        <Text text90 color={ThemeColor.text2} style={{ marginBottom: (width / 12.5) }}>Software Developer</Text>
                        <View style={{ width: width / 1.2, flexDirection: 'row', alignItems: 'space-around', justifyContent: 'space-around', }}>
                            <View alignItems={'center'}>
                                <TouchableScale activeScale={0.985} style={{
                                    backgroundColor: `rgba(${ThemeColor.primary},0.2)`,
                                    height: width / 8,
                                    width: width / 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                    borderRadius: 50,
                                }} onPress={() => this.makeCall()} >
                                    <Feather name={'phone'} size={20} color={`rgb(${ThemeColor.primary})`} />
                                </TouchableScale>
                                <Text text90 color={ThemeColor.text2} >Phone Call</Text>
                            </View>
                            <View alignItems={'center'}>
                                <TouchableScale activeScale={0.985} style={{
                                    backgroundColor: `rgba(0, 106, 255,0.2)`,
                                    height: width / 8,
                                    width: width / 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                    borderRadius: 50,
                                }} onPress={() =>
                                    Linking.canOpenURL('fb-messenger://').then(supported => {
                                        if (!supported) {
                                            Linking.openURL("https://m.me/sai.hl.311");
                                        } else {
                                            Linking.openURL("fb-messenger://m.me/" + "sai.hl.311");
                                        }
                                    })} >
                                    <Feather name={'message-circle'} size={20} color={`#006AFF`} />
                                </TouchableScale>
                                <Text text90 color={ThemeColor.text2} >Messenger</Text>
                            </View>
                            <View alignItems={'center'}>
                                <TouchableScale activeScale={0.985} style={{
                                    backgroundColor: `rgba(59, 89, 152,0.2)`,
                                    height: width / 8,
                                    width: width / 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                    borderRadius: 50,
                                }} onPress={() =>
                                    Linking.canOpenURL("fb://facewebmodal/f?href=https://www.facebook.com/sai.hl.311").then(supported => {
                                        if (supported) {
                                            return Linking.openURL("fb://facewebmodal/f?href=https://www.facebook.com/sai.hl.311");
                                        } else {
                                            return Linking.openURL("https://www.facebook.com/sai.hl.311");
                                        }
                                    })} >
                                    <Feather name={'facebook'} size={20} color={`#3b5998`} />
                                </TouchableScale>
                                <Text text90 color={ThemeColor.text2} >Facebook</Text>
                            </View>
                            <View alignItems={'center'}>
                                <TouchableScale activeScale={0.985} style={{
                                    backgroundColor: `rgba(212, 70, 56,0.2)`,
                                    height: width / 8,
                                    width: width / 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                    borderRadius: 50,
                                }} onPress={() => Linking.openURL('mailto:saihtunlu14996@gmail.com')} >
                                    <Feather name={'mail'} size={20} color={`#D44638`} />
                                </TouchableScale>
                                <Text text90 color={ThemeColor.text2} >Email</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableScale activeScale={0.985} style={{ ...styles.centerElement, backgroundColor: `rgba(${ThemeColor.primary},0.2)` }} onPress={() => navigation.navigate('WebBrowser', { link: 'https://saihtunlu.me/', title: 'About Developer' })}>
                        <Text style={{ color: `rgb(${ThemeColor.primary})` }}>Learn More</Text>
                    </TouchableScale>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        height: header_height,
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
    container: {
        zIndex: 1,
        minHeight: '100%',
        flex: 1,
    },
    centerElement: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        width: width - 40,
        marginBottom: 10,
        borderRadius: 30
    },
});

