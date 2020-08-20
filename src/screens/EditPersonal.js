import _ from 'lodash';
import store from '../redux/store';
import React from 'react';
import {
    StyleSheet,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    InteractionManager,
} from 'react-native';

import {
    View,
    Text,
    TextField,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import { Loader } from '../components'
const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import { AuthContext } from "../navigation/AuthProvider";
import axios from '../axios'
import * as SecureStore from "expo-secure-store";


export default class EditPersonal extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            ThemeColor: store.getState().Theme.theme,
            navigation: this.props.navigation,
            city: {},
            state: '',
            addressLine1: '',
            addressLine2: '',
            isSaving: false,
            addNew: false,
            id: null
        }
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    //Mounted
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { user } = this.props.route.params;
            this.setState({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            })
            this.setState({ isReady: true })
        });
    }

    save = () => {
        this.setState({ isSaving: true });
        const { name, email, phone, id, navigation } = this.state;
        var data = {};
        data.name = name;
        data.email = email;
        data.id = id;
        data.phone = phone;

        let value = this.context;
        var user = value.user;
        let token = value.user.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.post(`/updateUser`, { data: data })
            .then(response => {
                console.log("EditPersonal -> save -> response", response.data)
                this.setState({ isSaving: false });
                user.user.name = name;
                user.user.email = email;
                user.user.phone = phone;
                value.setUser(user); //update to provider
                SecureStore.deleteItemAsync("user").then(() => {
                    SecureStore.setItemAsync('user', JSON.stringify(user))
                })
                navigation.navigate('user')
            })
            .catch(error => {
                console.log("EditPersonal -> save -> error", error)
                this.setState({ isSaving: false });
            });
    }
    render() {
        const { name, email, phone, isSaving, ThemeColor, navigation } = this.state;

        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                </View>
            )
        }

        return (
            <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
                <Loader show={isSaving} ThemeColor={ThemeColor} />
                <View style={{
                    ...styles.header
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text text70 color={ThemeColor.text1}> Edit Personal Information</Text>
                    </TouchableScale>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{
                    flex: 1,
                    width: width
                }}>
                    <View style={{ ...styles.Body, backgroundColor: ThemeColor.Bg2, }}>

                        <TextField
                            placeholder="Enter your name"
                            title={'Name'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ name: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={name}
                        />
                        <TextField
                            placeholder="Enter your email address"
                            title={'Email Address'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ email: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={email}
                        />
                        <TextField
                            placeholder="Enter your phone number"
                            title={'Phone Number'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ phone: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={phone}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <TouchableScale activeScale={0.985} style={{ ...styles.centerElement, backgroundColor: `rgb(${ThemeColor.primary})` }} onPress={() => this.save()}>
                                <Text style={{ color: '#fff' }}>Save</Text>
                            </TouchableScale>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    centerElement: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        marginBottom: 15,
        borderRadius: 30
    },
    inputStyle: {
        height: '100%',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        zIndex: 100
    },
    Body: {
        width: width - 20,
        margin: 10,
        borderRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 10
    }
});
