import store from '../redux/store';
import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
  AsyncStorage,
  StatusBar,
  FlatList,
  Dimensions,
  ScrollView
} from 'react-native';
import {
  View,
  Text,
  AnimatedImage
} from 'react-native-ui-lib';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from '../components/ScrollableTabBar'
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import Divider from '../components/Divider'
import _ from 'lodash';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get("window");
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;

class Category extends Component {

  Categories = (category3) => {
    const { navigation, ThemeColor } = this.props;
    return (
      _.map(category3, (category, index) => (
        <TouchableScale
          activeScale={0.985}
          key={`category-${index}`}
          style={{ ...styles.category }} onPress={() => navigation.navigate('ProductsList', { type: 'Category', data: category.id })}>
          <AnimatedImage
            style={{
              resizeMode: 'cover',
              height: 65,
              width: 65,
              marginBottom: 5,
              borderRadius: 15
            }}
            source={{ uri: `https://zhop.admin.saihtunlu.me${category.image}` }}
            loader={<ActivityIndicator color="#F7F7F7" />}
            animationDuration={index === 0 ? 300 : 800}
          />
          <View style={{ backgroundColor: ThemeColor.Bg3, borderRadius: 30, alignItems: 'center', width: '100%' }}>
            <Text text100 color={ThemeColor.text1} numberOfLines={1}>{category.label}</Text>
          </View>
        </TouchableScale>
      ))
    )
  }

  //Renders
  RenderCategory2(categories2) {
    const { ThemeColor } = this.props
    var elements = [];
    categories2.forEach((data, index) => {
      elements.push(
        <View key={`category2-${index}`}>
          <Text style={{ marginBottom: 5, color: ThemeColor.header, fontWeight: 'bold' }}>{data.label}</Text>
          <View row style={styles.categories}>
            {this.Categories(data.children)}
          </View>
          <Divider />
        </View>
      );
    });
    return elements;
  }
  render() {
    const { category1 } = this.props;
    return (
      <ScrollView
        key={category1.label}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10, flex: 1, width: width, paddingHorizontal: 10 }}>
        {this.RenderCategory2(category1.children)}
      </ScrollView>
    );
  }

}
class Explore extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories,
      ThemeColor: store.getState().Theme.theme,
      number_of_cart: this.props.cartLength,
      selectedIndex: 0,
      key: Date.now(),
      navigation: this.props.navigation,
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }
  //Mounted
  componentDidMount() {
    this.focusListener = this.state.navigation.addListener("focus", () => {
      this.setState({ number_of_cart: this.props.cartLength })
    });
  }
  onChangeIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
  };

  render() {
    const {
      categories,
      number_of_cart,
      navigation,
      ThemeColor
    } = this.state;

    return (
      <View style={{ backgroundColor: `rgb(${ThemeColor.primary})`, flex: 1 }}>
        <View style={{
          ...styles.header,
        }} >
          <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
            <Feather name={'chevron-left'} size={20} color={'#fff'} /><Text text70 white> Explore</Text>
          </TouchableScale>
          <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("shopping-cart")}>
            {number_of_cart !== 0 ?
              <View
                backgroundColor={'#ff563d'}
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  top: -10,
                  zIndex: 10,
                  right: -10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }} >
                <Text text100 white>
                  {number_of_cart}
                </Text>
              </View> : null}
            <Feather name={'shopping-cart'} size={20} color={'#fff'} />
          </TouchableScale>
        </View>

        <View style={{ ...styles.Container, backgroundColor: ThemeColor.Bg2 }}>
          <ScrollableTabView
            style={{ marginTop: 5 }}
            initialPage={0}
            renderTabBar={() => <ScrollableTabBar ThemeColor={ThemeColor} />}
          >
            {categories.map((category1, index) =>
              <Category
                key={`${category1.label}`}
                navigation={this.props.navigation}
                tabLabel={category1.label}
                category1={category1}
                ThemeColor={ThemeColor} />)}
          </ScrollableTabView>
        </View>
      </View>
    );
  }
}

//Map the redux state to your props.
const mapStateToProps = state => ({
  categories: state.Data.categories,
  cartLength: state.Cart.cartLength
})
//Map your action creators to your props.
const mapDispatchToProps = {
}
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Explore);


const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontFamily: 'popin',

  },
  header: {
    paddingTop: 15,
    height: header_height,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  Container: {
    marginTop: 5,
    borderTopLeftRadius: 20,
    flex: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16.00,
    elevation: 80,
  },
  TabBar: {
    paddingLeft: 20,
    paddingRight: 0,
  },
  categories: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%'
  },
  category: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    width: '21.8%',
    height: null,
    alignItems: 'center',
    flexDirection: 'column',
  },
});


