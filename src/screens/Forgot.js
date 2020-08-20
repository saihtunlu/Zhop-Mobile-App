import React, { Component } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Platform,
  StyleSheet,
} from "react-native";
import store from '../redux/store'
import {
  View,
  Text,
  Toast,
  TextField,
} from 'react-native-ui-lib';
import { LinearGradient } from "expo-linear-gradient";
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import axios from '../axios'
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;


export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.route.params.email,
      messageColor: null,
      message: null,
      loading: false,
      buttonText: 'Reset',
      ThemeColor: store.getState().Theme.theme
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }
  handleForgot() {
    const { navigation } = this.props;
    const { email, ThemeColor } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    axios
      .post("/password/create", {
        email: email
      })
      .then(response => {
        this.setState({ loading: false, message: response.data.message, messageColor: ThemeColor.success, buttonText: 'Resend' })
        console.log("Forgot -> handleForgot -> response", response.data.message)

      })
      .catch(error => {
        console.log("Forgot -> handleForgot -> error", error)
        this.setState({ message: error.response.data.error, messageColor: ThemeColor.danger })
        this.setState({ errors, loading: false });
      });

  }

  render() {
    const { navigation } = this.props;
    const { loading, messageColor, buttonText, message, ThemeColor } = this.state;

    return (
      <LinearGradient colors={[`rgb(${ThemeColor.primary})`, `rgba(${ThemeColor.secondary},0.5)`]}
        style={{ flex: 1, }}>
        <View style={{
          ...styles.header
        }} >
          <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
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

        <View style={{
          backgroundColor: ThemeColor.Bg2,
          paddingHorizontal: 10,
          paddingVertical: 30,
          marginHorizontal: 10,
          borderRadius: 20,
          marginTop: 10
        }}>
          <Text black style={{
            fontWeight: 'bold',
            marginLeft: 10,
            marginBottom: 20,
            color: ThemeColor.header
          }} text60>Reset Password</Text>
          <TextField
            title={'Email'}
            onChangeText={text => this.setState({ email: text })}
            placeholder="Enter your email address"
            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
            hideUnderline
            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
            value={this.state.email}
          />

          <TouchableScale activeScale={0.985} onPress={() => this.handleForgot()} style={{ ...styles.Button, backgroundColor: `rgb(${ThemeColor.primary})` }}   >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                  {buttonText}
                </Text>
              )}

          </TouchableScale>
          <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()}>
            <Text style={{ marginTop: '10%', textAlign: 'center', color: ThemeColor.text2, fontSize: 12 }}>Back</Text>
          </TouchableScale>
        </View>
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
