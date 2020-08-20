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
    Picker,
    TextField,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import { state, city } from '../constants/Address'
import Feather from 'react-native-vector-icons/Feather';
import { Loader } from '../components'
const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import { AuthContext } from "../navigation/AuthProvider";
import axios from '../axios'
import { connect } from 'react-redux';
import { getAddress } from '../redux/actions'

class EditAddress extends React.Component {
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
            const { address } = this.props.route.params;
            if (_.isEmpty(address)) {
                this.setState({ addNew: true })
            } else {
                this.setState({
                    id: address.id,
                    state: address.state,
                    city: address.city,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2
                })
            }
            this.changeState();
            this.setState({ isReady: true })
        });
    }
    changeState = (text) => {
        if (text) {
            var cities = city.filter(function (data) {
                return data.state === text.value;
            });
            this.setState({ state: text.value, city: {} })
        } else {
            const { state } = this.state;
            var cities = city.filter(function (data) {
                return data.state === state;
            });
        }
        var data = cities.sort(function (a, b) {
            return b.label - a.label || a.label.localeCompare(b.label);
        }); // reorder
        this.setState({ cities: data })
    }
    save = () => {
        this.setState({ isSaving: true });
        const { addNew, city, state, addressLine1, id, addressLine2, navigation } = this.state;
        var data = {};
        data.state = state;
        data.city = city.label;
        data.id = id;
        data.addressLine1 = addressLine1;
        if (addressLine2) {
            data.addressLine2 = addressLine2
        }
        let value = this.context;
        let token = value.user.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (addNew) {
            axios.post(`/addAddress`, { data: data })
                .then(response => {
                    this.props.getAddress(response.data)
                    this.setState({ isSaving: false });
                    navigation.navigate('Address')
                })
                .catch(error => {
                    console.log("EditAddress -> save -> error", error)
                    this.setState({ isSaving: false });
                });
        } else {
            axios.post(`/updateAddress`, { data: data })
                .then(response => {
                    this.props.getAddress(data)
                    this.setState({ isSaving: false });
                    navigation.navigate('Address')

                })
                .catch(error => {
                    console.log("EditAddress -> save -> error", error)
                    this.setState({ isSaving: false });
                });
        }
    }
    render() {
        const { cities, addNew, isSaving, ThemeColor, navigation } = this.state;
        var states = state.sort(function (a, b) {
            return b.label - a.label || a.label.localeCompare(b.label);
        }); // reorder

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
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text text70 color={ThemeColor.text1}> {addNew ? "Add" : 'Edit'} Address</Text>
                    </TouchableScale>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{
                    flex: 1,
                    width: width
                }}>
                    <View style={{ ...styles.Body, backgroundColor: ThemeColor.Bg2, }}>
                        <Picker
                            title={'State*'}
                            placeholder="Select a state"
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={this.state.state}
                            enableModalBlur
                            onChange={item => this.changeState(item)}
                            topBarProps={{ title: 'States' }}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            showSearch
                            searchPlaceholder={'Select a state'}
                            searchStyle={{}}
                        >
                            {_.map(states, data => (
                                <Picker.Item key={data.value} selectedIconColor={`rgb(${ThemeColor.primary})`} value={data.value} label={data.label} />
                            ))}
                        </Picker>
                        <Picker
                            title="City*"
                            placeholder='Select a city'
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={this.state.city}
                            enableModalBlur
                            onChange={city => this.setState({ city: city })}
                            topBarProps={{ title: 'Cities' }}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            showSearch
                            searchPlaceholder={'Select a city'}
                            searchStyle={{}}
                        >
                            {_.map(cities, data => (
                                <Picker.Item key={data.value} selectedIconColor={`rgb(${ThemeColor.primary})`} value={data.label} label={data.label} />
                            ))}
                        </Picker>
                        <TextField
                            placeholder="Enter your street address 1"
                            title={'Street Address Line 1*'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ addressLine1: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={this.state.addressLine1}
                        />
                        <TextField
                            placeholder="Enter your street address 2"
                            title={'Street Address Line 2 (Optional)'}
                            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
                            hideUnderline
                            onChange={e => this.setState({ addressLine2: e.nativeEvent.text })}
                            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
                            value={this.state.addressLine2}
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
//Map the redux state to your props.
const mapStateToProps = state => ({
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
    getAddress: address => dispatch(getAddress(address)),
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(EditAddress);

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
