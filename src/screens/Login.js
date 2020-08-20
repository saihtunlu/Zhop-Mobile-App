import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import store from '../redux/store'
import { AuthContext } from "../navigation/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Toast,
  TextField,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import TouchableScale from 'react-native-touchable-scale';
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ThemeColor, setThemeColor] = useState(store.getState().Theme.theme);
  const { login, errors, loading } = useContext(AuthContext);
  //Subscribe to redux store
  store.subscribe(() => {
    var color = store.getState().Theme.theme;
    setThemeColor(color);
  });

  // const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);
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
        visible={errors ? true : false}
        position={'bottom'}
        backgroundColor={`rgb(${ThemeColor.danger})`}
        style={{
          borderRadius: 10,
          marginHorizontal: 10,
          marginBottom: 10,
        }}
        message={errors}
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
            title={'Email'}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email address"
            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
            hideUnderline
            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
            value={email}
          />

          <TextField
            title={'Password'}
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter your password"
            style={{ ...styles.inputStyle, backgroundColor: ThemeColor.Bg3, color: ThemeColor.text1 }}
            hideUnderline
            titleStyle={{ marginLeft: 10, color: ThemeColor.text2 }}
            value={password}
            secureTextEntry
          />
          <TouchableScale activeScale={0.985} onPress={() => login(email, password)} style={{ ...styles.Button, backgroundColor: `rgb(${ThemeColor.primary})` }}   >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                  Sign In
                </Text>
              )}

          </TouchableScale>
          <TouchableScale activeScale={0.985} onPress={() => navigation.navigate("Forgot", { email: email })}>
            <Text style={{ marginTop: '10%', textAlign: 'center', color: ThemeColor.text2, fontSize: 12 }}>Forgot your password?</Text>
          </TouchableScale>
        </View>
      </ScrollView>
    </LinearGradient>
  );
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
