import React, { useContext, useState } from "react";
import store from '../redux/store';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//Screens
import Explore from "../screens/Explore";
import Search from "../screens/Search";
import Browse from "../screens/Browse";
import Product from "../screens/Product";
import ProductsList from "../screens/ProductsList";
import Settings from "../screens/Settings";
import Cart from "../screens/Cart";
import Checkout from "../screens/Checkout";
import MyAccount from "../screens/MyAccount";
import OrderDetail from "../screens/OrderDetail";
import OrderComplete from "../screens/OrderComplete";
import EditAddress from "../screens/EditAddress";
import Fav from "../screens/Fav";
import Address from "../screens/Address";
import Order from "../screens/Order";
import AboutUs from "../screens/AboutUs";
import EditPersonal from "../screens/EditPersonal";
import EditPassword from "../screens/EditPassword";
import Forgot from "../screens/Forgot";
import WebBrowser from "../screens/WebBrowser";
import { LinearGradient } from "expo-linear-gradient";
import TouchableScale from "react-native-touchable-scale";
import Feather from 'react-native-vector-icons/Feather';
import {
  View,
} from 'react-native-ui-lib';
import { StyleSheet, Animated, Dimensions } from "react-native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export const AppStack = (props) => {
  const [ThemeColor, setThemeColor] = React.useState(store.getState().Theme.theme);
  const [translateValue] = useState(new Animated.Value(0));
  //Subscribe to redux store
  store.subscribe(() => {
    var color = store.getState().Theme.theme;
    setThemeColor(color)
  });

  function MyTabBar({ state, descriptors, navigation }) {
    const totalWidth = Dimensions.get("window").width;
    const tabWidth = totalWidth / state.routes.length;
    const CenterStyle = {
      width: tabWidth,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      position: 'absolute',
      top: -10,
      zIndex: 0
    }
    Animated.spring(translateValue, {
      toValue: state.index * tabWidth,
      velocity: 10,
      useNativeDriver: true,
    }).start();

    return (
      <View style={{
        flexDirection: 'row',
        height: 55,
        marginTop: -10,
        backgroundColor: ThemeColor.Bg2,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16.00,
        elevation: 80,
      }}>
        <Animated.View
          style={[
            CenterStyle,
            {
              transform: [{ translateX: translateValue }],
            },
          ]}
        >
          <LinearGradient
            start={[1, 0]}
            end={[0, 1]} colors={[`rgb(${ThemeColor.primary})`, `rgb(${ThemeColor.secondary})`]} style={{
              borderRadius: 100,
              width: 70,
              height: 70,
              borderWidth: 8,
              borderColor: ThemeColor.Bg2,
            }}>

          </LinearGradient>
        </Animated.View>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          return (
            <TouchableScale
              activeScale={1}
              key={`#${label}-${index}`}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{
                ...styles.TabItem, width: tabWidth,
                position: 'relative',
                top: -3,
              }}
              onLongPress={onLongPress}
            >
              <Feather name={label} size={20} style={{
                color: isFocused ? `#fff` : `rgba(${ThemeColor.primary},0.5)`,
              }} />
            </TouchableScale>
          );
        })}
      </View>
    );
  }

  const TabScreens = () => {
    return (
      <Tab.Navigator initialRouteName="Browse"
        tabBar={props => <MyTabBar {...props} />}
      >
        <Tab.Screen name="home" component={Browse} />
        <Tab.Screen name="grid" component={Explore} />
        <Stack.Screen name="shopping-cart" component={Cart} />
        <Tab.Screen name="user" component={MyAccount} />
      </Tab.Navigator>
    )

  }

  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="Tabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabScreens} />
      <Stack.Screen name="EditAddress" component={EditAddress} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="OrderComplete" component={OrderComplete} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="ProductsList" component={ProductsList} />
      <Stack.Screen name="Fav" component={Fav} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="WebBrowser" component={WebBrowser} />
      <Stack.Screen name="EditPersonal" component={EditPersonal} />
      <Stack.Screen name="EditPassword" component={EditPassword} />
      <Stack.Screen name="Forgot" component={Forgot} />
    </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  TabItem: {
    height: 55,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  }
});