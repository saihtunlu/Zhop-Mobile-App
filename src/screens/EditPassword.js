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
    AsyncStorage
} from 'react-native';

import {
    View,
    Text,
    Toast,
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


export default class EditPassword extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            ThemeColor: store.getState().Theme.theme,
            navigation: this.props.navigation,
            new_password: '',
            email: '',
            new_password_confirmation: '',
            current_password: '',
            error: null,
            isSaving: false,
            addNew: false,
        }
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    //Mounted
    componentDidMount() {
        let value = this.context;
        this.setState({ email: value.user.user.email })
    }

    save = () => {
        this.setState({ isSaving: true });
        const { current_password, new_password, new_password_confirmation, navigation } = this.state;
        var data = {};
        if (new_password !== new_password_confirmation) {
            this.setState({ error: "Password Confirmation Doesn't Match!", isSaving: false })
            return false;
        }
        data.current_password = current_password;
        data.new_password = new_password;

        let value = this.context;
        let token = value.user.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.post(`/updatePassword`, { data: data })
            .then(response => {
                console.log("updatePassword -> save -> response", response.data)
                this.setState({ isSaving: false });
                navigation.navigate('user')
            })
            .catch(error => {
                console.log("EditPersonal -> save -> error", error.response.data)
                this.setState({ isSaving: false, error: error.response.data.error });
            });
    }
    render() {
        const { new_password, email, error, current_password, new_password_confirmation, isSaving, ThemeColor, navigation } = this.state;


        return (
            <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
                <Loader show={isSaving} ThemeColor={ThemeColor} />
                <View style={{
                    ...styles.header
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text text70 color={ThemeColor.text1}> Edit Password</Text>
                    </TouchableScale>
                </View>
                <Toast
                    visible={error ? true : false}
                    position={'bottom'}
                    backgroundColor={`rgb(${ThemeColor.danger})`}
                    style={{
                        borderRadius: 10,
                        marginHorizontal: 10,
                        width: width - 20,
                        marginBottom: 10,
                    }}
                    message={error}
                    showDismiss={true}
                    onDismiss={() => this.setState({ error: '' })}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={{
                    flex: 1,
                    width: width
                }}>
                    <View style={{ ...styles.Body, backgroundColor: ThemeColor.Bg2, }}>

                        <TextField
                            placeholder="Enter current password"
                            title={'Current Password'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ current_password: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={current_password}
                            secureTextEntry
                        />
                        <TextField
                            placeholder="Enter new password"
                            title={'New Password'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ new_password: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={new_password}
                            secureTextEntry
                        />
                        <TextField
                            placeholder="Enter new password confirmation"
                            title={'New Password Confirmation'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ new_password_confirmation: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={new_password_confirmation}
                            secureTextEntry
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <TouchableScale activeScale={0.985} style={{ ...styles.centerElement, backgroundColor: `rgb(${ThemeColor.primary})` }} onPress={() => this.save()}>
                                <Text style={{ color: '#fff' }}>Save</Text>
                            </TouchableScale>
                        </View>
                        <TouchableScale activeScale={0.985} onPress={() => navigation.navigate("Forgot", { email: email })}>
                            <Text style={{ marginVertical: 20, textAlign: 'center', color: ThemeColor.text2, fontSize: 12 }}>Forgot your password?</Text>
                        </TouchableScale>
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
