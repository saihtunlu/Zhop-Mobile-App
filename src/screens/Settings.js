import _ from 'lodash';
import store from '../redux/store';
import React, { Component, createRef } from "react";
import {
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
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
import ToggleTheme from '../components/ToggleTheme';

const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;


class Settings extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      ThemeColor: store.getState().Theme.theme,
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }

  render() {
    const { navigation, ThemeColor } = this.state;
    let value = this.context;
    let user = value.user.user;
    console.log("Settings -> render -> user", user)
    return (
      <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1 }}>
        <View style={{
          ...styles.header,
        }} >
          <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: -15, alignItems: 'center', justifyContent: 'center', }}>
            <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text text70 color={ThemeColor.header}> Settings</Text>
          </TouchableScale>

        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View row style={{ justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: ThemeColor.header, fontWeight: 'bold' }} >Personal Info</Text>

          </View>
          <View style={{
            width: width - 20,
            borderRadius: 20,
            marginHorizontal: 10,
            padding: 20,
            backgroundColor: ThemeColor.Bg2
          }}>
            <TouchableScale onPress={() => navigation.navigate('EditPersonal', { user: user })} activeScale={0.985} style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
              <View row center>
                <Feather name={'user'} style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                }} size={18} color={`rgb(${ThemeColor.primary})`} />
                <Text style={{ color: ThemeColor.text1 }}>Username</Text>
              </View>
              <Text style={{ color: ThemeColor.text1 }}>{user.name}</Text>
            </TouchableScale>
            <Divider />
            <TouchableScale onPress={() => navigation.navigate('EditPersonal', { user: user })} activeScale={0.985} style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
              <View row center>
                <Feather name={'mail'} style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                }} size={18} color={`rgb(${ThemeColor.primary})`} />
                <Text style={{ color: ThemeColor.text1 }}>Email</Text>
              </View>
              <Text style={{ color: ThemeColor.text1 }}>{user.email}</Text>
            </TouchableScale>
            <Divider />
            <TouchableScale onPress={() => navigation.navigate('EditPersonal', { user: user })} activeScale={0.985} style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
              <View row center>
                <Feather name={'smartphone'} style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                }} size={18} color={`rgb(${ThemeColor.primary})`} />
                <Text style={{ color: ThemeColor.text1 }}>Phone Number</Text>
              </View>
              <Text style={{ color: ThemeColor.text1 }}>{user.phone}</Text>
            </TouchableScale>
          </View>


          <View row style={{ justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: ThemeColor.header, fontWeight: 'bold' }} >Appearance</Text>
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
                <Feather name={'moon'} style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                }} size={18} color={`rgb(${ThemeColor.primary})`} />
                <Text style={{ color: ThemeColor.text1 }}>Dark Mode</Text>
              </View>
              <ToggleTheme />
            </View>
          </View>

          <View row style={{ justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10, marginTop: 15 }}>
            <Text style={{ color: ThemeColor.header, fontWeight: 'bold' }} >Security</Text>
          </View>
          <View style={{
            width: width - 20,
            borderRadius: 20,
            marginHorizontal: 10,
            padding: 20,
            backgroundColor: ThemeColor.Bg2
          }}>
            <TouchableScale activeScale={0.985} style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}
              onPress={() => navigation.navigate('EditPassword')}>
              <View row center>
                <Feather name={'key'} style={{
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                  backgroundColor: `rgba(${ThemeColor.primary},0.2)`
                }} size={18} color={`rgb(${ThemeColor.primary})`} />
                <Text style={{ color: ThemeColor.text1 }}>Password</Text>
              </View>
              <Feather name={'chevron-right'} size={18} color={ThemeColor.text2} />
            </TouchableScale>

          </View>
          <TouchableScale
            style={{
              backgroundColor: `rgba(${ThemeColor.danger},0.2)`,
              margin: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 9,
              height: 45,
              borderRadius: 30,
            }}
            activeScale={0.985}
            onPress={() => value.logout()}
          >
            {value.loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text color={`rgb(${ThemeColor.danger})`}>Log Out </Text>
                  <Feather name={'log-out'} size={20} style={{ marginLeft: 5 }} color={`rgb(${ThemeColor.danger})`} />
                </View>
              )}
          </TouchableScale>
        </ScrollView>
      </View>
    );
  }
}
export default Settings;
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
