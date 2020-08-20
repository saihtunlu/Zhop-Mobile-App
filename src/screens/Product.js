import _ from 'lodash';
import store from '../redux/store';
import React, { Component, createRef } from "react";
import {
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Animated,
  StatusBar,
  Platform,
  InteractionManager,
  FlatList,
  AsyncStorage,
  ToastAndroid,
  Share
} from "react-native";
import {
  View,
  Text,
  Button,
  Colors,
  AnimatedImage,
} from 'react-native-ui-lib';
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
// import { Rating, AirbnbRating } from 'react-native-ratings';
import HTML from 'react-native-render-html';
import { Divider, Stepper } from '../components'
import LightBox from '../components/LightBox';
import axios from "../axios";
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("window");
import Products from '../components/Products';
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import ActionSheet from "react-native-actions-sheet";
const actionSheetRef = createRef();
import { AuthContext } from "../navigation/AuthProvider";
import { connect } from 'react-redux';
import { addCart, getFav, getVar } from '../redux/actions'

class Product extends Component {
  static contextType = AuthContext;
  //Define Variable
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      isReady: false,
      isLoading: false,
      addCart: 1,
      isWishlistLoading: false,
      showDialog: false,
      selectedProduct: [],
      variation1: { details: [{ image: '' }] },
      variation2: { details: [{ image: '' }] },
      selectedVariation1_id: null,
      selectedVariation2_id: null,
      number_of_stock: 0,
      adding: false,
      number_of_cart: this.props.cartLength,
      isPageLoading: false,
      minVal: null,
      maxVal: null,
      addedFav: false,
      brandProducts: [],
      RelatedProducts: [],
      Limited: 20,
      ThemeColor: store.getState().Theme.theme,
      TotalRelatedProducts: [],
      animationConfig: null
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }

  //Mounted
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const products = this.props.products;
      const { product } = this.props.route.params;
      this.setState({ product: product })
      if (product.type === 'Variable Product') {
        this.setState({ isPageLoading: true })
        this.getVariations(product);
      }
      var check = this.props.fav.filter(data => {
        return data.product_id === product.id;
      })
      if (check.length > 0) {
        this.setState({ addedFav: true })
      }
      this.getBrandProduct(products);
      this.getRelatedProduct(products)
      this.getPriceRange(product);

    });
  }

  //Renders
  renderGallery(product) {
    var images = []
    product.images.forEach(data => {
      var url = { source: { uri: `https://zhop.admin.saihtunlu.me${data.path}` } }
      images.push(url)
    });
    return (
      <LightBox imageStyle={styles.imageStyle} images={images} discount={product.discount} />
    );
  }
  renderPrice(product) {
    const { minVal, maxVal, ThemeColor } = this.state;
    var stockStatus = '';
    if (product.stock === 'Manage Stock') {
      if (product.number_of_stock <= 0) {
        stockStatus = 'Out Of Stock'
      } else {
        stockStatus = `In Stock (${product.number_of_stock})`
      }
    } else {
      stockStatus = product.stock
    }
    const BadgeColor = stockStatus === 'Out Of Stock' ? '#ff563d' : '#00cd8b';
    var priceRange = minVal === maxVal ? minVal + 'Ks' : `${minVal}Ks - ${maxVal}Ks`
    return (
      <View>
        {product.type === 'Simple Product' ?
          <View style={{ ...styles.price, marginTop: 10 }}>
            <View row style={{ width: '60%' }}>
              {product.sale_price ? <View row center><Text color={`rgb(${ThemeColor.primary})`} text60>${product.sale_price}</Text><Text style={{ textDecorationLine: 'line-through' }} color={ThemeColor.text2} text80> ${product.regular_price}</Text></View> : <Text color={`rgb(${ThemeColor.primary})`} text60>${product.regular_price}</Text>}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View backgroundColor={BadgeColor} style={{ width: 8, height: 8, borderRadius: 10 }} marginRight={5} />
              <Text color={ThemeColor.text1}>{stockStatus}</Text>
            </View>
          </View>
          :
          <View style={{ ...styles.price, marginTop: 10 }}>
            <View row style={{ width: '60%', }}>
              <Text color={`rgb(${ThemeColor.primary})`} text60>{priceRange}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View backgroundColor={'#00cd8b'} style={{ width: 8, height: 8, borderRadius: 10 }} marginRight={5} />
              <Text color={ThemeColor.text1}>Available</Text>
            </View>
          </View>}

      </View>
    )
  }
  renderBottomBar(product) {
    const { isWishlistLoading, addedFav, ThemeColor } = this.state;
    return (
      <View style={{
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

      }}>
        <View style={{
          height: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Button
            onPress={() => this.AddFav()}
            round
            backgroundColor={addedFav ? `rgba(${ThemeColor.danger},0.2)` : ThemeColor.Bg3}
            style={{ marginRight: 10, height: 45 }}
          >
            {isWishlistLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
                <Feather name={'heart'} size={20} color={addedFav ? `rgb(${ThemeColor.danger})` : ThemeColor.text2} />
              )}
          </Button>
          <Button
            onPress={() => this.onShare()}
            round
            backgroundColor={`rgba(${ThemeColor.success},0.2)`}
            style={{ marginRight: 10, height: 45 }}
          >
            <Feather name={'share-2'} size={20} color={`rgb(${ThemeColor.success})`} />
          </Button>
        </View>
        {product.type === 'Simple Product' ?
          <Button
            round
            backgroundColor={`rgb(${ThemeColor.primary})`}
            style={{
              height: 45,
              width: '65%',
              paddingHorizontal: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              this.AddToCart();
            }}
          >
            <Feather name={'shopping-cart'} size={20} style={{ marginRight: 5 }} color={'white'} />
            <Text white>Add To Cart</Text>
          </Button>
          :
          <Button
            round
            backgroundColor={`rgb(${ThemeColor.primary})`}
            style={{
              height: 45,
              width: '65%',
              paddingHorizontal: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              actionSheetRef.current?.setModalVisible();
            }}
          >
            <Feather name={'sliders'} size={20} style={{ marginRight: 5 }} color={'white'} />
            <Text white>Select Option</Text>
          </Button>}

      </View>

    )
  }
  renderDetails(product) {

    const { ThemeColor } = this.state;
    var NoOfStock = product.stock === 'Manage Stock' ? parseInt(product.number_of_stock) : 1000000;
    var NoOfStock = product.stock === 'Out Of Stock' ? 0 : NoOfStock;
    return (
      <View style={{ ...styles.additional, backgroundColor: ThemeColor.Bg2 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text text60 style={{ fontWeight: 'bold', color: ThemeColor.header }} >
              {product.title}
            </Text>
            <Text text90 color={ThemeColor.text2}>
              {product.sold_out} Sold Out!
          </Text>
          </View>
          <Text text90 color={ThemeColor.text2}>
            By {product.brand.name}
          </Text>
          {this.renderPrice(product)}
          {product.type === 'Simple Product' ?
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10
            }}>
              <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Quantity</Text>
              <Stepper
                minValue={1}
                maxValue={NoOfStock}
                onValueChange={count => this.setState({ addCart: count })}
                initialValue={1}
              />
            </View> : null}
        </View>
        <Divider />

        <View style={{ ...styles.des }}>
          <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Descriptions</Text>
        </View>
        <Text color={ThemeColor.text1} >{product.short_description}</Text>
        <Divider />
        <View style={{ ...styles.des }}>
          <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Tags</Text>
        </View>

        <FlatList
          data={product.tags}
          horizontal={true}
          renderItem={({ item, index }) =>
            <Button style={{ ...styles.tag, backgroundColor: `rgba(${ThemeColor.primary},0.2)` }}>
              <Text style={{ color: `rgb(${ThemeColor.primary})` }}>{item.tag.name}</Text>
            </Button>
          }
          keyExtractor={item => item.tag.name}
        />
        <Divider />
        <View style={{ ...styles.des }}>
          <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>Additional Information</Text>
        </View>
        {product.Length && product.width || product.height || product.weight ?
          <View>
            <Text style={{ marginBottom: 5, color: ThemeColor.text1 }}>Length : {product.Length} (cm)</Text>
            <Text style={{ marginBottom: 5, color: ThemeColor.text1 }}>Width : {product.width} (cm)</Text>
            <Text style={{ marginBottom: 5, color: ThemeColor.text1 }}>Height : {product.height} (cm)</Text>
            <Text style={{ marginBottom: 5, color: ThemeColor.text1 }}>Weight : {product.weight} (Kg)</Text>
          </View> : null}

        <HTML html={product.long_description}
          containerStyle={{ marginTop: 10 }}
          imagesMaxWidth={width - 20}
          tagsStyles={{
            span: { color: ThemeColor.text1, marginBottom: 5 },
            h1: { color: ThemeColor.text1, marginBottom: 5 },
            h2: { color: ThemeColor.text1, marginBottom: 5 },
            h3: { color: ThemeColor.text1, marginBottom: 5 },
            h4: { color: ThemeColor.text1, marginBottom: 5 },
            h5: { color: ThemeColor.text1, marginBottom: 5 },
            p: { color: ThemeColor.text1, marginBottom: 5 },
            img: { borderRadius: 10, width: '100%', height: null, marginBottom: 10 },
            table: { maxWidth: width - 20 },
            iframe: { maxWidth: width - 20, height: null, }
          }}
          classesStyles={{
            'video': {
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 10
            }
          }}
        />
      </View>
    )
  }
  renderDialog() {
    const {
      adding,
      variation1,
      variation2,
      selectedProduct,
      minVal,
      maxVal,
      ThemeColor } = this.state;
    var priceRange = minVal === maxVal ? minVal + 'Ks' : `${minVal}Ks - ${maxVal}Ks`
    var NoOfStock = selectedProduct.stock === 'Manage Stock' ? parseInt(selectedProduct.number_of_stock) : 1000000;
    var NoOfStock = selectedProduct.stock === 'Out Of Stock' ? 0 : NoOfStock;


    var stockStatus = ' ';
    if (selectedProduct) {
      if (selectedProduct.stock === 'Manage Stock') {
        if (selectedProduct.number_of_stock <= 0) {
          stockStatus = 'Out Of Stock'
        } else {
          stockStatus = `In Stock (${selectedProduct.number_of_stock})`
        }
      } else {
        stockStatus = selectedProduct.stock
      }
    }

    return (

      <ActionSheet ref={actionSheetRef} containerStyle={{
        backgroundColor: ThemeColor.Bg2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height / 1.3
      }}
        overlayColor={ThemeColor.Bg2}
        elevation={50}
        indicatorColor={`rgb(${ThemeColor.primary})`}
        headerAlwaysVisible
        footerAlwaysVisible
        CustomFooterComponent={<Button
          fullWidth
          style={{
            height: 55,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0
          }}
          backgroundColor={`rgb(${ThemeColor.primary})`}
          onPress={() => this.AddToCart()}>
          {adding ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
              <View row>
                <Feather name={'shopping-cart'} size={20} style={{ marginRight: 5 }} color={'#fff'} />
                <Text white>Add To Cart</Text>
              </View>
            )}
        </Button>}
      >
        <View row marginBottom={10} paddingHorizontal={10}>
          {selectedProduct && !selectedProduct.regular_price ?
            <Text color={`rgb(${ThemeColor.primary})`} text60>{priceRange}</Text>
            : this.renderDialogPrice(selectedProduct, stockStatus)}
        </View>
        <ScrollView marginTop={10}
          showsVerticalScrollIndicator={false}
          paddingHorizontal={10} >

          {variation1.details.length > 1 ? this.renderVariation1(variation1) : null}
          <Divider />
          {variation2.details.length > 1 ? this.renderVariation2(variation2) : null}
          <Divider />
          <View style={{ ...styles.des }}>
            <Text style={{ fontWeight: 'bold', color: ThemeColor.text1 }}>Quantity</Text>
            <Stepper
              minValue={0}
              maxValue={NoOfStock}
              onValueChange={count => this.setState({ addCart: count })}
              initialValue={1}
            />
          </View>
          <Divider />
        </ScrollView>
      </ActionSheet>
    )
  }
  renderVariation1(variation1) {
    const { selectedVariation1_id, ThemeColor } = this.state;
    return (
      <View marginBottom={10}>
        <View style={{ ...styles.des }}>
          <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>{variation1.name}</Text>
        </View>
        {variation1.details[0].image ?
          <View row style={styles.variation1} >
            {_.map(variation1.details, (data, index) => (
              <TouchableScale
                activeScale={0.985}
                key={index}
                style={styles.variation}
                onPress={() => { this.filterVariation1(data.id) }}>
                <View>
                  <AnimatedImage
                    style={{ resizeMode: 'cover', height: (width / 3) - 14, width: '100%' }}
                    source={{ uri: `https://zhop.admin.saihtunlu.me${data.image}` }}
                    loader={<ActivityIndicator color="#F7F7F7" />}
                    animationDuration={index === 0 ? 300 : 800}
                  />
                  <View style={{ backgroundColor: data.id === selectedVariation1_id ? `rgb(${ThemeColor.primary})` : ThemeColor.Bg3, height: '100%', alignItems: 'center', paddingTop: 3 }}>
                    <Text style={{ color: data.id === selectedVariation1_id ? '#fff' : ThemeColor.text1 }}>{data.name}</Text>
                  </View>
                </View>
              </TouchableScale>
            ))}
          </View> :
          <View style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            width: (width - 20),
          }}>
            {_.map(variation1.details, (data, index) => (
              <TouchableScale
                activeScale={0.985}
                key={index}
                style={{ marginBottom: 10 }}
                onPress={() => { this.filterVariation1(data.id) }}
              >
                <View style={{ flexDirection: 'row', ...styles.VariationList, backgroundColor: data.id === selectedVariation1_id ? `rgb(${ThemeColor.primary})` : ThemeColor.Bg3 }}>
                  <Text style={{ marginLeft: 5, color: data.id === selectedVariation1_id ? '#fff' : ThemeColor.text2 }}>{data.name}</Text>
                </View>
              </TouchableScale>
            ))}
          </View>
        }
      </View>
    )
  }
  renderVariation2(variation2) {
    const { selectedVariation2_id, ThemeColor } = this.state;
    return (
      <View marginBottom={10}>
        <View style={{ ...styles.des }}>
          <Text style={{ fontWeight: 'bold', color: ThemeColor.header }}>{variation2.name}</Text>
        </View>
        {variation2.details[0].image ?
          <View row style={styles.variation1} >
            {_.map(variation2.details, (data, index) => (
              <TouchableScale
                activeScale={0.985}
                key={index}
                style={styles.variation}
                onPress={() => { this.filterVariation2(data.id) }}>
                <View>
                  <AnimatedImage
                    style={{ resizeMode: 'cover', height: (width / 3) - 14, width: '100%' }}
                    source={{ uri: `https://zhop.admin.saihtunlu.me${data.image}` }}
                    loader={<ActivityIndicator color="#F7F7F7" />}
                    animationDuration={index === 0 ? 300 : 800}
                  />

                  <View style={{ backgroundColor: data.id === selectedVariation2_id ? `rgb(${ThemeColor.primary})` : ThemeColor.Bg3, height: '100%', alignItems: 'center', paddingTop: 3 }}>
                    <Text style={{ color: data.id === selectedVariation2_id ? '#fff' : ThemeColor.text2 }}>{data.name}</Text>
                  </View>
                </View>
              </TouchableScale>
            ))}
          </View> :
          <View style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            width: (width - 20),
          }}>
            {_.map(variation2.details, (data, index) => (
              <TouchableScale
                activeScale={0.985}
                key={index}
                style={{ marginBottom: 10 }}
                onPress={() => { this.filterVariation2(data.id) }}
              >
                <View style={{ flexDirection: 'row', ...styles.VariationList, backgroundColor: data.id === selectedVariation2_id ? `rgb(${ThemeColor.primary})` : ThemeColor.Bg3 }}>
                  <Text style={{ marginLeft: 5, color: data.id === selectedVariation2_id ? '#fff' : ThemeColor.text2 }}>{data.name}</Text>
                </View>
              </TouchableScale>
            ))}
          </View>
        }
      </View>
    )
  }
  renderToast(Message) {
    ToastAndroid.showWithGravityAndOffset(
      Message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      200
    );
  };
  renderDialogPrice(selectedProduct, stockStatus) {
    const { ThemeColor } = this.state;
    const BadgeColor = stockStatus === 'Out Of Stock' ? '#ff563d' : '#00cd8b';
    return (
      <View>
        {selectedProduct ?
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <View style={{ width: '70%' }} text60>{selectedProduct.sale_price ?
              <View row>
                <Text color={`rgb(${ThemeColor.primary})`} text60>${selectedProduct.sale_price}</Text>
                <Text style={{ textDecorationLine: 'line-through' }} color={ThemeColor.text2} text80> ${selectedProduct.regular_price}</Text>
              </View> :
              <Text color={`rgb(${ThemeColor.primary})`} text60>${selectedProduct.regular_price}</Text>}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '30%' }}>
              <View backgroundColor={BadgeColor} style={{ width: 8, height: 8, borderRadius: 10 }} marginRight={5} />
              <Text color={ThemeColor.text1} >{stockStatus}</Text>
            </View>
          </View> :
          <Text red30 color={ThemeColor.text1}>Not Available</Text>}
      </View>
    )
  }

  //Methods
  AddFav = () => {
    this.setState({ isWishlistLoading: true });
    const { product, addedFav } = this.state;
    let value = this.context;
    let token = value.user.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (!addedFav) {
      axios.post(`/addFav`, { id: product.id })
        .then(response => {
          var array = {};

          array.product_id = product.id;
          array.product = product;
          var favs = [...this.props.fav, array]
          this.props.getFav(favs)
          this.setState({ isWishlistLoading: false, addedFav: true });
        })
    } else {
      axios.post(`/removeFav`, { id: product.id }).then(() => {
        var favs = this.props.fav;
        var index = favs
          .map(x => {
            return x.product_id;
          })
          .indexOf(product.id);
        favs.splice(index, 1)
        this.props.getFav(favs)
        this.setState({ isWishlistLoading: false, addedFav: false });
      })
    }
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  getVariations = (product) => {
    this.props.getVar(product.product_no)
    const variations = this.props.variations;
    if (variations[0]) {
      this.setState({ variation1: variations[0] })
    }
    if (variations[1]) {
      this.setState({ variation2: variations[1] })
    }
    this.setState({ isPageLoading: false })

  }
  filterVariation1 = async (id) => {
    this.setState({ selectedVariation1_id: id })
    const { product, selectedVariation2_id } = this.state;
    var selected = null;
    if (selectedVariation2_id) {
      selected = await product.variations.filter(data => {
        return parseInt(data.attribute2_id) === parseInt(selectedVariation2_id) && parseInt(data.attribute1_id) === parseInt(id);
      })[0];
    } else {
      selected = await product.variations.filter(data => {
        return parseInt(data.attribute1_id) === parseInt(id);
      })[0];
    }
    if (selected) {
      this.setState({ number_of_stock: selected.number_of_stock })
    }
    this.setState({ addCart: selected.number_of_stock === 'Out of stock' ? 0 : 1, selectedProduct: selected })
  }
  filterVariation2 = async (id) => {
    this.setState({ selectedVariation2_id: id })
    const { product, selectedVariation1_id } = this.state;
    var selected = null;
    selected = product.variations.filter(data => {
      return parseInt(data.attribute2_id) === parseInt(id) && parseInt(data.attribute1_id) === parseInt(selectedVariation1_id);
    })[0];
    if (selected) {
      this.setState({ number_of_stock: selected.number_of_stock, selectedProduct: selected })
    }
    this.setState({ addCart: selected.number_of_stock === 'Out of stock' ? 0 : 1 })
  }

  AddToCart = async () => {
    this.setState({ adding: true })
    const { product, selectedProduct, addCart, number_of_cart } = this.state;
    var cart = this.props.cart;
    if (product.type === 'Variable Product') {
      if (selectedProduct.length === 0) {
        this.renderToast('Please, Select a product first!')
        this.setState({ adding: false })
      } else {
        this.setState({ number_of_cart: parseInt(number_of_cart) + parseInt(addCart) })
        var Selected = selectedProduct;
        Selected.title = product.title;
        Selected.addCart = addCart;
        Selected.type = product.type;
        Selected.brand = product.brand;
        Selected.product_id = product.id;
        Selected.product = product;
        this.setState({ adding: false })
        var check = cart.filter((data, index) => {
          return data.id === Selected.id;
        })
        if (check.length > 0) {
          var index = cart
            .map(x => {
              return x.id;
            })
            .indexOf(Selected.id);
          cart[index].addCart = parseInt(cart[index].addCart) + parseInt(Selected.addCart);
          this.props.addCart(cart)
        } else {
          cart.push(Selected)
          this.props.addCart(cart)
        }
        this.renderToast(`${product.title} has been successfully added to cart.`)
      }
    }
    if (product.type === 'Simple Product') {
      if (product.stock === 'Out Of Stock') {
        this.renderToast(`Sorry! This product is current out of stock.`)
        this.setState({ adding: false })
      } else {
        var check = cart.filter((data, index) => {
          return data.id === product.id;
        })
        this.setState({ number_of_cart: parseInt(number_of_cart) + parseInt(addCart) })
        product.addCart = addCart;
        if (check.length > 0) {
          var index = cart
            .map(x => {
              return x.id;
            })
            .indexOf(product.id);
          cart[index].addCart = parseInt(cart[index].addCart) + parseInt(product.addCart);
        } else {
          cart.push(product)
        }
        this.props.addCart(cart)
        this.renderToast(`${product.title} has been successfully added to cart.`)
      }
    }
  }

  getPriceRange = async (product) => {
    var minVal = null;
    var maxVal = null
    if (product.type === 'Variable Product') {
      var prices = []
      await product.variations.forEach(data => {
        if (data) {
          prices.push(parseInt(data.regular_price))
        }
      });
      minVal = Math.min(...prices);
      maxVal = Math.max(...prices);
    }
    this.setState({ minVal: minVal, maxVal: maxVal })
  }
  getBrandProduct = async (products) => {
    const { product } = this.state;
    var brandProducts = products.filter(data => {
      return data.brand_id === product.brand_id;
    })

    this.setState({ brandProducts: brandProducts })
  }
  getRelatedProduct = async (products) => {
    const { product, Limited } = this.state;
    var array = []
    for (let i = 0; i < product.categories.length; i++) {
      var data = await products.filter(data => {
        if (data.categories[i]) {
          return data.categories[i].category3_id === product.categories[i].category3_id && data.id !== product.id;
        }
      })
      data.forEach(element => {
        array.push(element)
      });
    }

    for (let i = 0; i < product.tags.length; i++) {
      var checkedArray = []
      products.forEach(productValue => {
        var check = productValue.tags.filter((data, index) => {
          return data.tag_id === product.tags[i].tag_id && productValue.id !== product.id;
        })[0]
        if (check) {
          checkedArray.push(productValue);
        }
      });

      checkedArray.forEach(element => {
        array.push(element)
      });
    }
    this.setState({ TotalRelatedProducts: array })
    var RelatedProducts = []
    array.forEach((data, key) => {
      if (key > Limited) {
        return false;
      }
      RelatedProducts.push(data)
    })

    this.setState({ RelatedProducts: RelatedProducts, isReady: true })
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 1;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  //Main Render
  render() {
    const { product, number_of_cart, ThemeColor, isPageLoading, brandProducts, Limited, RelatedProducts, TotalRelatedProducts } = this.state;
    const navigation = this.props.navigation
    var scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, header_height);
    const animatedValue = diffClamp.interpolate({
      inputRange: [0, header_height],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    // const BottomAnimated = diffClamp.interpolate({
    //   inputRange: [0, header_height - 7],
    //   outputRange: [0, header_height + 7],
    //   extrapolate: 'clamp'
    // })


    if (!this.state.isReady || isPageLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: ThemeColor.Bg1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={`rgb(${ThemeColor.primary})`} />
        </View>
      )
    }
    return (
      <View style={{ backgroundColor: ThemeColor.Bg1, flex: 1, paddingBottom: 65 }}>
        <View style={{
          ...styles.header
        }} >
          <Animated.View style={{ backgroundColor: ThemeColor.Bg2, opacity: animatedValue, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}></Animated.View>
          <TouchableScale activeScale={0.985} onPress={() => navigation.goBack()} style={{ justifyContent: 'center', flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
            <Feather name={'chevron-left'} size={20} color={ThemeColor.header} /><Text color={ThemeColor.header} text70> Product</Text>
          </TouchableScale>
          <TouchableScale activeScale={0.85} onPress={() => navigation.navigate("shopping-cart")}>
            {number_of_cart ?
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
            <Feather name={'shopping-cart'} size={20} color={ThemeColor.header} />
          </TouchableScale>
        </View>

        {product.type === 'Variable Product' ? this.renderDialog() : null}
        <Animated.ScrollView
          bounces={false}
          alwaysBounceVertical={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            scrollY.setValue(nativeEvent.contentOffset.y)
            if (this.isCloseToBottom(nativeEvent) && TotalRelatedProducts.length > Limited) {
              this.setState({ Limited: Limited + 20 });
              this.getRelatedProduct();
            }
          }}
        >
          {this.renderGallery(product)}
          {this.renderDetails(product)}

          {/* Brands */}
          <View style={{ ...styles.titleBar }}>
            <Text black style={{ fontWeight: 'bold', color: ThemeColor.header }} >Products By {product.brand.name}</Text>
            <Button
              label={'More'}
              onPress={() => navigation.navigate('ProductsList', { type: 'Brand', data: product.brand_id })}
              size={'xSmall'}
              style={{ backgroundColor: `rgb(${ThemeColor.primary})` }}
              iconSource={() => <Feather name={'chevron-right'} size={10} style={{ marginLeft: 5 }} color={'white'} />}
              iconOnRight />
          </View>
          <Products products={brandProducts} ThemeColor={ThemeColor} type={'List'} navigation={navigation} />

          {/* Related */}
          <View style={{ ...styles.titleBar }}>
            <Text black style={{ fontWeight: 'bold', color: ThemeColor.header }} >Related Products</Text>
            <Button
              label={'More'}
              onPress={() => navigation.navigate('ProductsList', { type: 'Related Products', data: product })}
              size={'xSmall'}
              style={{ backgroundColor: `rgb(${ThemeColor.primary})` }}
              iconSource={() => <Feather name={'chevron-right'} size={10} style={{ marginLeft: 5 }} color={'white'} />}
              iconOnRight />
          </View>
          <Products products={RelatedProducts} ThemeColor={ThemeColor} navigation={navigation} />
        </Animated.ScrollView>
        <View style={{ ...styles.bottomAdd, backgroundColor: ThemeColor.Bg2 }}>
          {this.renderBottomBar(product)}
        </View>
      </View>

    );
  }
}
//Map the redux state to your props.
const mapStateToProps = state => ({
  products: state.Data.products,
  cart: state.Cart.cart,
  cartLength: state.Cart.cartLength,
  fav: state.Fav.fav,
  variations: state.Data.selectedVariations
})
//Map your action creators to your props.
const mapDispatchToProps = dispatch => ({
  addCart: products => dispatch(addCart(products)),
  getFav: fav => dispatch(getFav(fav)),
  getVar: product_no => dispatch(getVar(product_no)),

})
//export your list as a default export 
export default connect(mapStateToProps, mapDispatchToProps)(Product);

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  VariationList: {
    borderRadius: 30, marginRight: 10, padding: 5
  },
  additional: {
    padding: 10,
    paddingTop: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 20,
    marginTop: -30
  },
  header: {
    paddingTop: 15,
    height: header_height,
    // backgroundColor: '#F7F7F7',
    position: 'absolute',
    zIndex: 10,
    paddingHorizontal: 25,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bottomAdd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  des: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  shortDes: {
    padding: 10,
  },
  tag: {
    minWidth: 0,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10
  },
  image: {
    width: width / 3.26,
    height: width / 3.26,
    marginRight: 10
  },
  more: {
    width: 55,
    height: 55
  },
  imageStyle: {
    overflow: 'hidden',
    width: '100%',
    height: 360,
    position: 'relative',
  },
  productImage: {
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundedDialog: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10
  },
  variation1: {
    width: (width - 20),
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  variation: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    width: (width / 3) - 14,
    height: (width / 3) + 10,
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 15
  },
});
