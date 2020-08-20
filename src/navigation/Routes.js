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

// import Pusher from 'pusher-js/react-native';
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });


function Routes(props) {
  const { user, setUser, getUserData } = useContext(AuthContext)
  const [getLoading, setGetLoading] = useState(true)
  // const [token, setToken] = useState('')
  const ThemeColor = store.getState().Theme.theme;
  useEffect(() => {
    getAllData();
    SecureStore.getItemAsync('user')
      .then(userString => {
        if (userString) {
          userObject = JSON.parse(userString)
          setUser(userObject);
          // Noti(userObject);
          getUserData(userObject.token);
        }
      })
      .catch(err => {
      });
    getAllData();
    setGetLoading(false)
  }, []);

  // const Noti = (user) => {
  //   Pusher.logToConsole = true;
  //   var pusher = new Pusher('03e5c6a5f30c0d9e5406', {
  //     cluster: 'ap1'
  //   });
  //   ListenOrder(pusher, user.user.id)
  // }
  // const ListenOrder = (pusher, id) => {
  //   var channel = pusher.subscribe(`order.${id}`);
  //   channel.bind('App\\Events\\OrderStatus', function (data) {
  //     sendPushNotification(data.order)
  //   });
  // }
  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }
  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  //   setToken(token)
  //   console.log("registerForPushNotificationsAsync -> token", token)
  // }
  // sendPushNotification = async (data) => {
  //   console.log("sendPushNotification -> token", token)
  //   const message = {
  //     to: token,
  //     sound: 'default',
  //     title: 'Original Title',
  //     body: data.message,
  //   };

  //   await fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Accept-encoding': 'gzip, deflate',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(message),
  //   });
  // }


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