import store from '../redux/store'
import React, { Component } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet,
} from "react-native";
import {
  View,
  Text,
  Toast,
  TextField,
} from 'react-native-ui-lib';
import { LinearGradient } from "expo-linear-gradient";
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from "../navigation/AuthProvider";
import axios from '../axios'
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

export default class SignUp extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      username: null,
      password: null,
      message: null,
      password_confirmation: null,
      messageColor: null,
      loading: false,
      ThemeColor: store.getState().Theme.theme
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }

  handleSignUp() {
    let value = this.context;
    const { email, username, password, password_confirmation, ThemeColor } = this.state;
    if (password !== password_confirmation) {
      this.setState({ message: "Password Confirmation Doesn't Match!", messageColor: ThemeColor.danger })
      return false;
    }
    Keyboard.dismiss();
    this.setState({ loading: true });
    var data = {};
    data.email = email;
    data.username = username;
    data.password = password;
    data.position = 'Customer';

    axios
      .post("/signUp", {
        data: data
      })
      .then(response => {
        this.setState({ loading: false, message: response.data.message, messageColor: ThemeColor.success })
        console.log("Forgot -> handleForgot -> response", response.data.message)
        // value.login(email, password)
      })
      .catch(error => {
        console.log("Forgot -> handleForgot -> error", error)
        this.setState({ message: error.response.data.error, messageColor: ThemeColor.danger })
        this.setState({ errors, loading: false });
      });
  }

  render() {
    const { navigation } = this.props;
    const { loading, message, messageColor, ThemeColor } = this.state;

    return (
      <LinearGradient colors={[`rgb(${ThemeColor.primary})`, `rgba(${ThemeColor.secondary},0.5)`]}
        style={{ flex: 1, }}>
        <View style={{
          ...styles.header
        }} >
          <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: -15, alignItems: 'center', justifyContent: 'center', }}>
            <Feather name={'chevron-left'} size={20} color={'#fff'} /><Text text70 white> Back</Text>
          </TouchableScale>
        </View>
        <Toast
          visible={message ? true : false}
          position={'bottom'}
          backgroundColor={`rgb(${messageColor})`}
          style={{
            borderRadius: 10,
            marginHorizontal: 10,
            marginBottom: 10,
          }}
          showDismiss={true}
          onDismiss={() => this.setState({ message: null })}
          message={message}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}>

          <View style={{
            backgroundColor: ThemeColor.Bg2,
            paddingHorizontal: 10,
            paddingVertical: 30,
            marginHorizontal: 10,
            borderRadius: 20,
            marginTop: 15
          }}>
            <Text black style={{ fontWeight: 'bold', marginLeft: 10, marginBottom: 20, color: ThemeColor.header }} text60>Sign In</Text>
            <TextField
              title={'Username'}
              onChangeText={(text) => this.setState({ username: text })}
              placeholder="Enter your email address"
              style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
              hideUnderline
              titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
              value={this.state.username}
            />
            <TextField
              title={'Email'}
              onChangeText={(text) => this.setState({ email: text })}
              placeholder="Enter your email address"
              style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
              hideUnderline
              titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
              value={this.state.email}
            />

            <TextField
              title={'Password'}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder="Enter your password"
              style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
              hideUnderline
              titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
              value={this.state.password}
              secureTextEntry
            />
            <TextField
              placeholder="Enter password confirmation"
              title={'Password Confirmation'}
              style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
              hideUnderline
              onChange={(text) => this.setState({ password_confirmation: text })}
              titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
              value={this.state.password_confirmation}
              secureTextEntry
            />
            <TouchableScale activeScale={0.985} onPress={() => this.handleSignUp()} style={{ ...styles.Button, backgroundColor: `rgb(${ThemeColor.primary})` }}   >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                    Sign Up
                  </Text>
                )}
            </TouchableScale>
            <TouchableScale activeScale={0.985} onPress={() => navigation.navigate("Login")}>
              <Text style={{ marginTop: '10%', textAlign: 'center', color: ThemeColor.text2, fontSize: 12 }}>Back to Sign In</Text>
            </TouchableScale>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  Button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginBottom: 15,
    borderRadius: 30
  },
  header: {
    paddingTop: 15,
    height: header_height,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputStyle: {
    height: '100%',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },

});
