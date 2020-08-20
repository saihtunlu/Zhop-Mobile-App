import React, { createRef } from 'react';
import _ from 'lodash';
import {
    StyleSheet,
    RefreshControl,
    Image,
    Platform,
    StatusBar,
    Dimensions,
    Linking,
    Share,
    ScrollView, BackHandler, ToastAndroid, Clipboard, ActivityIndicator
} from 'react-native';
import {
    Text, View
} from 'react-native-ui-lib';
import ProgressWebView from "react-native-progress-webview";
import TouchableScale from 'react-native-touchable-scale';
import store from '../redux/store'
import Divider from '../components/Divider'
const windowHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import Feather from 'react-native-vector-icons/Feather';
const header_height = Platform.OS == 'ios' ? 90 : 50 + StatusBar.currentHeight;
import ActionSheet from "react-native-actions-sheet";
const actionSheetRef = createRef();

export default class WebBrowser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            refreshing: false,
            isLoadingError: false,
            CanGoBack: false,
            siteTitle: null,
            ThemeColor: store.getState().Theme.theme
        }
        this.WEBVIEW_REF = React.createRef();
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        const { CanGoBack } = this.state;
        if (CanGoBack) {
            this.WEBVIEW_REF.current.goBack();
            return true;
        } else {
            return false;
        }

    }
    refreshWebview = () => {
        this.WEBVIEW_REF.reload();
    }
    onRefresh = () => {
        this.setState({ refreshing: true })
        this.WEBVIEW_REF.current.reload();
        this.setState({ refreshing: false, isLoadingError: false })
    };

    RenderErrorScreen = () => {
        const { refreshing } = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                }
                style={[styles.container, { backgroundColor: 'white', }]}>
                <View style={styles.viewStyles}>
                    <Image
                        source={require('../assets/images/offline.png')}
                        style={styles.Errorlogo}
                        resizeMode="contain"
                    />
                    <Text style={styles.fail} >Connection failed, Please try again!</Text>
                </View>

            </ScrollView>
        );
    }

    OpenInBrowser = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log("Don't know how to open URI: " + link);
            }
        });
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

    copyLink = (link) => {
        Clipboard.setString(link);
        this.renderToast('Link Copied!')
    }
    onShare = async (message) => {
        try {
            const result = await Share.share({
                message: message,
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
    render() {
        const { link, title } = this.props.route.params;
        const { ThemeColor, isLoaded, siteTitle } = this.state;
        return (
            <View style={styles.container}>
                <View style={{
                    ...styles.header, backgroundColor: ThemeColor.Bg1
                }} >
                    <TouchableScale activeScale={0.985} onPress={() => this.props.navigation.goBack()} style={{ flexDirection: 'row', marginLeft: -15, alignItems: 'center' }}>
                        <Feather name={'chevron-left'} size={20} color={`rgb(${ThemeColor.primary})`} /><Text style={{ color: ThemeColor.header, width: '80%' }} text70 numberOfLines={1} > {siteTitle ? siteTitle : title}</Text>
                    </TouchableScale>
                    <View style={{ flexDirection: 'row', marginLeft: -15, }}>
                        {!isLoaded ? <TouchableScale activeScale={0.985} onPress={() => this.WEBVIEW_REF.current.stopLoading()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name={'x'} size={20} color={`rgb(${ThemeColor.primary})`} />
                        </TouchableScale> :
                            <TouchableScale activeScale={0.985} onPress={() => {
                                this.setState({ isLoaded: false });
                                this.WEBVIEW_REF.current.reload()
                            }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Feather name={'rotate-cw'} size={20} color={`rgb(${ThemeColor.primary})`} />
                            </TouchableScale>}
                        <TouchableScale activeScale={0.985} onPress={() => actionSheetRef.current?.setModalVisible()} style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                            <Feather name={'more-vertical'} size={20} color={`rgb(${ThemeColor.primary})`} />
                        </TouchableScale>
                    </View>
                </View>
                <ActionSheet ref={actionSheetRef} containerStyle={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    marginHorizontal: 10,
                    width: width - 20,
                    paddingHorizontal: 20,
                    paddingBottom: 15,
                    bottom: 10,
                    backgroundColor: ThemeColor.Bg2
                }}
                    overlayColor={ThemeColor.Bg1}
                    elevation={50}
                    indicatorColor={`rgb(${ThemeColor.primary})`}
                    footerHeight={0}
                    headerAlwaysVisible>
                    <TouchableScale activeScale={0.985} style={{ paddingTop: 15, paddingBottom: 5, }}
                        onPress={() => this.OpenInBrowser(link)}>
                        <Text text70 style={{ textAlign: 'center' }} color={ThemeColor.text1}>Open in Browser</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => this.copyLink(link)}>
                        <Text text70 style={{ textAlign: 'center' }} color={ThemeColor.text1}>Copy Link</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => this.onShare(link)}>
                        <Text text70 style={{ textAlign: 'center' }} color={ThemeColor.text1}>Share Link</Text>
                    </TouchableScale>
                    <Divider />
                    <TouchableScale activeScale={0.985} style={{ paddingVertical: 5, }}
                        onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                        <Text text70 style={{ textAlign: 'center' }} color={`rgb(${ThemeColor.primary})`}>Cancel</Text>
                    </TouchableScale>
                </ActionSheet>
                {
                    this.state.isLoadingError ? this.RenderErrorScreen() : null
                }
                <ProgressWebView
                    showsVerticalScrollIndicator={false}
                    style={styles.map}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    geolocationEnabled={true}
                    javaScriptEnabled={true}
                    injectedJavaScript="window.ReactNativeWebView.postMessage(document.title)"
                    onMessage={(message) => this.setState({ siteTitle: message.nativeEvent.data })}
                    renderLoading={() => (
                        <View style={{
                            flex: 1,
                            backgroundColor: ThemeColor.Bg1,
                            alignItems: 'center',
                            justifyContent: 'center', position: 'absolute',
                            top: 0, right: 0, bottom: 0, left: 0
                        }}>
                            <ActivityIndicator size="small" color={`rgb(${ThemeColor.primary})`} />
                        </View>
                    )}
                    ref={this.WEBVIEW_REF}
                    color={`rgb(${ThemeColor.primary})`}
                    height={2}
                    startInLoadingState={true}
                    errorColor={`rgb(${ThemeColor.primary})`}

                    onError={() => this.setState({ isLoadingError: true })}
                    source={{ uri: link }}
                    onLoadStart={() => this.setState({ isLoaded: false })}
                    onLoadEnd={() => this.setState({ isLoaded: true })}
                    onNavigationStateChange={navState => {
                        this.setState({ CanGoBack: navState.canGoBack })
                    }}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        height: windowHeight
    },
    header: {
        paddingTop: 15,
        height: header_height,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    container: {
        zIndex: 1,
        minHeight: '100%',
        flex: 1,
    },
    viewStyles: {
        flex: 1,
        minHeight: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Errorlogo: {
        maxWidth: 250
    },
    logo: {
        maxWidth: "60%"
    },
    fail: {
        top: '65%',
        fontSize: 12,
        position: "absolute",
        color: "#666"
    }
});

