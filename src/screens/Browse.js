import store from "../redux/store";
import _ from "lodash";
import React, { useState, useContext, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  RefreshControl,
  Animated,
  StatusBar,
  Platform,
  Text,
} from "react-native";
import { connect } from 'react-redux';
import { View, Button, Avatar } from "react-native-ui-lib";
import TouchableScale from "react-native-touchable-scale";
import Products from "../components/Products";
import Feather from "react-native-vector-icons/Feather";
const { width } = Dimensions.get("window");
import Categories from "../components/Categories";
import Carousal from "../components/Carousal";
import { AuthContext } from '../navigation/AuthProvider';
var scrollY = new Animated.Value(0);
const marginTop = Platform.OS == 'ios' ? 55 : 10 + StatusBar.currentHeight;
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import { getAllData } from '../helper/Store'

function Browse(props) {
  const navigation = props.navigation;
  const [refreshing, setRefreshing] = useState(false);
  const [ThemeColor, setThemeColor] = useState(store.getState().Theme.theme);
  const [LatestNo] = useState(9);
  const { user } = useContext(AuthContext)
  const latest = props.latest;
  const discount = props.discount;
  const categories = props.categories;
  const events = props.events;
  var diffClamp = Animated.diffClamp(scrollY, 0, header_height);
  var diffClampBanner = Animated.diffClamp(scrollY, 0, header_height + 200);
  const OpacityAnimated = diffClamp.interpolate({
    inputRange: [0, header_height],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  var bannerAnimated = diffClampBanner.interpolate({
    inputRange: [0, header_height + 200],
    outputRange: [0, -header_height - 200],
    extrapolate: "clamp",
  });


  //Subscribe to redux store
  store.subscribe(() => {
    var color = store.getState().Theme.theme;
    setThemeColor(color);
  });


  //Methods
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getAllData().then(() => {
      setRefreshing(false);
    })
  }, [refreshing]);

  return (
    <View
      style={{
        backgroundColor: ThemeColor.Bg1,
      }}
    >
      <Animated.View
        style={{
          ...styles.header,
          backgroundColor: `rgb(${ThemeColor.primary})`,
          opacity: OpacityAnimated
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            width: width,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          <TouchableScale
            activeScale={0.985}
            onPress={() => navigation.navigate("Search")}
            style={{
              backgroundColor: ThemeColor.Bg2,
              borderRadius: 100,
              overflow: "hidden",
              width: "85%",
              height: 45,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <View

              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name={"search"}
                size={18}
                style={{
                  marginRight: 5,
                }}
                color={ThemeColor.text2}
              />
              <Text
                style={{
                  color: ThemeColor.text2,
                }}
              >
                Tap here to Search...
              </Text>
            </View>
          </TouchableScale>
          <TouchableScale
            activeScale={0.85}
            onPress={() => navigation.navigate("user")}
          >
            <Avatar
              source={{
                uri: `https://zhop.admin.saihtunlu.me${user.user.profile_image}`,
              }}
              size={(0.15 * width) - 15}
            />
          </TouchableScale>
        </View>
      </Animated.View>
      <Animated.ScrollView
        style={{
          backgroundColor: ThemeColor.Bg1,
        }}
        bounces={false}
        alwaysBounceVertical={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          scrollY.setValue(nativeEvent.contentOffset.y);
        }}
      >
        {/* Banner */}
        <Animated.View
          style={{
            ...styles.banner,
            backgroundColor: `rgb(${ThemeColor.primary})`,
            transform: [
              {
                translateY: bannerAnimated,
              },
            ],
          }}
        ></Animated.View>
        <Carousal
          data={events}
          navigation={navigation}
          style={{
            marginTop: header_height + 20,
          }}
        />
        <View
          style={{
            ...styles.titleBar,
          }}
        >
          <Text
            black
            style={{
              fontWeight: "bold",
              color: ThemeColor.header,
              fontSize: 16
            }}
          >
            Main Categories
          </Text>
          <Button
            label={"More"}
            labelStyle={{ fontSize: 12 }}
            onPress={() => navigation.navigate("grid")}
            size={"xSmall"}
            style={{ backgroundColor: `rgb(${ThemeColor.primary})` }}
            iconSource={() => (
              <Feather
                name={"chevron-right"}
                size={10}
                style={{ marginLeft: 5, }}
                color={"white"}
              />
            )}
            iconOnRight
          />
        </View>
        <Categories
          navigation={navigation}
          ThemeColor={ThemeColor}
          categories={categories}
        />
        {/* Discounts */}
        <View
          style={{
            ...styles.titleBar,
          }}
        >
          <Text
            black
            style={{
              fontWeight: "bold",
              color: ThemeColor.header,
              fontSize: 16
            }}
          >
            Discounts
          </Text>
          <Button
            label={"More"}
            labelStyle={{ fontSize: 12 }}
            onPress={() =>
              navigation.navigate("ProductsList", {
                type: "Discount",
              })
            }
            size={"xSmall"}
            style={{
              backgroundColor: `rgb(${ThemeColor.primary})`,
            }}
            iconSource={() => (
              <Feather
                name={"chevron-right"}
                size={10}
                style={{
                  marginLeft: 5,
                }}
                color={"white"}
              />
            )}
            iconOnRight
          />
        </View>
        <Products
          products={discount}
          ThemeColor={ThemeColor}
          type={"List"}
          navigation={navigation}
        />

        <View style={{ ...styles.titleBar }}>
          <Text style={{ fontWeight: "bold", color: ThemeColor.header, fontSize: 16 }}>
            New Arrivals
          </Text>
          <Button
            label={"More"}
            labelStyle={{ fontSize: 12 }}
            onPress={() =>
              navigation.navigate("ProductsList", {
                type: "New Products",
              })
            }
            size={"xSmall"}
            style={{
              backgroundColor: `rgb(${ThemeColor.primary})`,
            }}
            iconSource={() => (
              <Feather
                name={"chevron-right"}
                size={10}
                style={{
                  marginLeft: 5,
                }}
                color={"white"}
              />
            )}
            iconOnRight
          />
        </View>
        <Products
          products={latest}
          ThemeColor={ThemeColor}
          navigation={navigation}
          style={{ marginBottom: 10 }}
        />
      </Animated.ScrollView>
    </View>
  );
}

//Map the redux state to your props.
const mapStateToProps = state => ({
  latest: state.Data.latest,
  discount: state.Data.discount,
  categories: state.Data.categories,
  events: state.Data.events,
  cart: state.Cart.cart
})
//Map your action creators to your props.
const mapDispatchToProps = {
}
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Browse);

const styles = StyleSheet.create({
  header: {
    paddingTop: marginTop,
    height: header_height + 15,
    width: width,
    zIndex: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  banner: {
    flex: 1,
    height: width / 1.8,
    width: width,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    position: 'absolute',
    justifyContent: "center",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
