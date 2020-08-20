import _ from 'lodash';
import store from '../redux/store';
import React, { Component, createRef } from "react";
import {
    Dimensions,
    StyleSheet,
    StatusBar,
    InteractionManager,
    Platform,
    AsyncStorage,
    ActivityIndicator
} from "react-native";
import {
    View,
    Text,
} from 'react-native-ui-lib';
import { AuthContext } from "../navigation/AuthProvider";
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '../components'
import { connect } from 'react-redux';
const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;


class Address extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            ThemeColor: store.getState().Theme.theme,
            address: null
        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }

    //Mounted
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", () => {
            InteractionManager.runAfterInteractions(() => {
                this.setState({ address: this.props.address, isReady: true })
                console.log("Address -> componentDidMount -> this.props.address", this.props.address)
            })
        });
    }
    render() {
        const { navigation, ThemeColor, address } = this.state;
        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
                </View>)
        }
        return (
            <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
                <View style={{
                    ...styles.header,
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: -15, alignItems: 'center', justifyContent: 'center', }}>
                        <Feather name={'chevron-left'} size={25} color={`rgb(${ThemeColor.primary})`} /><Text text70 color={ThemeColor.header}> Billing Address</Text>
                    </TouchableScale>
                    <TouchableScale activeScale={0.85} onPress={() => navigation.navigate('EditAddress', { address: address })} >
                        {_.isEmpty(address) ? <Feather name={'plus'} size={20} color={`rgb(${ThemeColor.primary})`} /> : <Feather name={'edit-3'} size={20} color={`rgb(${ThemeColor.primary})`} />}
                    </TouchableScale>
                </View>
                <View style={{
                    width: width - 20,
                    borderRadius: 20,
                    marginHorizontal: 10,
                    padding: 20,
                    backgroundColor: ThemeColor.Bg2
                }}>
                    <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <View row center>
                            <Feather name={'map'} style={{
                                borderRadius: 10,
                                padding: 10,
                                marginRight: 10,
                                backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                            }} size={18} color={`rgb(${ThemeColor.primary})`} />
                            <Text style={{ color: ThemeColor.text1 }}>State</Text>
                        </View>
                        <Text style={{ color: ThemeColor.text1 }}>{address ? address.state : 'none'}</Text>
                    </View>
                    <Divider />
                    <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>

                        <View row center>
                            <Feather name={'home'} style={{
                                borderRadius: 10,
                                padding: 10,
                                marginRight: 10,
                                backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                            }} size={18} color={`rgb(${ThemeColor.primary})`} />
                            <Text style={{ color: ThemeColor.text1 }}>City/Township</Text>
                        </View>
                        <Text style={{ color: ThemeColor.text1 }}>{address ? address.city : 'none'}</Text>
                    </View>
                    <Divider />
                    <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <View row center>
                            <Feather name={'corner-up-right'} style={{
                                borderRadius: 10,
                                padding: 10,
                                marginRight: 10,
                                backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                            }} size={18} color={`rgb(${ThemeColor.primary})`} />
                            <Text style={{ color: ThemeColor.text1 }}>Street Line 1</Text>
                        </View>
                        <Text style={{ color: ThemeColor.text1 }}>{address ? address.addressLine1 : 'none'}</Text>
                    </View>
                    <Divider />
                    <View row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <View row center>
                            <Feather name={'corner-down-right'} style={{
                                borderRadius: 10,
                                padding: 10,
                                marginRight: 10,
                                backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                            }} size={18} color={`rgb(${ThemeColor.primary})`} />
                            <Text style={{ color: ThemeColor.text1 }}>Street Line 2</Text>
                        </View>
                        <Text style={{ color: ThemeColor.text1 }}>{address ? address.addressLine2 : 'none'}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
//Map the redux state to your props.
const mapStateToProps = state => ({
    address: state.Address.address
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Address);
const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        height: header_height,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    }

});
