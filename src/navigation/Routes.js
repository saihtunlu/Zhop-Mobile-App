import React, { useState, useEffect, useContext } from "react";
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import * as SecureStore from 'expo-secure-store';
import store from '../redux/store'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAllData } from '../helper/Store'


function Routes(props) {
  const { user, setUser, getUserData } = useContext(AuthContext)
  const [getLoading, setGetLoading] = useState(true)
  const ThemeColor = store.getState().Theme.theme;
  useEffect(() => {
    getAllData();
    SecureStore.getItemAsync('user')
      .then(userString => {
        if (userString) {
          userObject = JSON.parse(userString)
          setUser(userObject);
          getUserData(userObject.token);
        }
      })
      .catch(err => {
      });
    getAllData();
    setGetLoading(false)
  }, []);

  if (getLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: ThemeColor.Bg2, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
      </View>
    )
  }
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        {user ? <AppStack /> : <AuthStack />}
      </SafeAreaProvider>
    </NavigationContainer>

  );
}
export default Routes;