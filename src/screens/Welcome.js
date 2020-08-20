import React, { Component } from "react";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import store from '../redux/store';
import TouchableScale from 'react-native-touchable-scale';
import {
  Text, View
} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { LinearGradient } from "expo-linear-gradient";

class Welcome extends Component {
  scrollX = new Animated.Value(0);


  constructor(props) {
    super(props);
    this.state = {
      showTerms: false,
      title: '',
      ThemeColor: store.getState().Theme.theme
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }

  renderTermsService() {
    const { ThemeColor } = this.state;
    return (
      <Modal
        animationType="slide"
        visible={this.state.showTerms}
        onRequestClose={() => this.setState({ showTerms: false })}
      >
        <View
          style={{ backgroundColor: ThemeColor.Bg2, padding: 10, flex: 1 }}
        >
          <Text style={{ color: ThemeColor.header, fontSize: 16 }}>
            Terms of Service
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              1. Your use of the Service is at your sole risk. The service is
              provided on an "as is" and "as available" basis.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              2. Support for Expo services is only available in English, via
              e-mail.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              3. You understand that Expo uses third-party vendors and hosting
              partners to provide the necessary hardware, software, networking,
              storage, and related technology required to run the Service.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              4. You must not modify, adapt or hack the Service or modify
              another website so as to falsely imply that it is associated with
              the Service, Expo, or any other Expo service.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              5. You may use the Expo Pages static hosting service solely as
              permitted and intended to host your organization pages, personal
              pages, or project pages, and for no other purpose. You may not use
              Expo Pages in violation of Expo's trademark or other rights or in
              violation of applicable law. Expo reserves the right at all times
              to reclaim any Expo subdomain without liability to you.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              6. You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the Service, use of the Service, or access
              to the Service without the express written permission by Expo.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              7. We may, but have no obligation to, remove Content and Accounts
              containing Content that we determine in our sole discretion are
              unlawful, offensive, threatening, libelous, defamatory,
              pornographic, obscene or otherwise objectionable or violates any
              party's intellectual property or these Terms of Service.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              8. Verbal, physical, written or other abuse (including threats of
              abuse or retribution) of any Expo customer, employee, member, or
              officer will result in immediate account termination.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              9. You understand that the technical processing and transmission
              of the Service, including your Content, may be transferred
              unencrypted and involve (a) transmissions over various networks;
              and (b) changes to conform and adapt to technical requirements of
              connecting networks or devices.
            </Text>
            <Text
              style={{ color: ThemeColor.text2 }}
            >
              10. You must not upload, post, host, or transmit unsolicited
              e-mail, SMSs, or "spam" messages.
            </Text>
          </ScrollView>

          <TouchableScale activeScale={0.985}
            style={{ ...styles.Button, marginTop: 15, backgroundColor: `rgb(${ThemeColor.primary})` }}
            onPress={() => this.setState({ showTerms: false })}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>I understand</Text>
          </TouchableScale>
        </View>
      </Modal>
    );
  }

  render() {
    const { navigation } = this.props;
    const { ThemeColor } = this.state;
    return (
      <LinearGradient backgroundColor={ThemeColor.Bg2} colors={[`rgb(${ThemeColor.primary})`, `rgba(${ThemeColor.secondary},0.2)`]}
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        {this.renderTermsService()}
        <Animatable.View
          animation="pulse" delay={200} duration={5000} easing="ease-out" iterationCount="infinite"
          style={{
            backgroundColor: `rgb(${ThemeColor.primary})`,
            width: 250,
            height: 250,
            position: 'absolute',
            top: -100,
            alignItems: 'center',
            justifyContent: 'center',
            left: -50,
            opacity: 0.6,
            borderRadius: 300
          }}>
          <MaterialCommunityIcons name={'gamepad-variant-outline'} style={{ transform: [{ rotate: '90deg' }] }} size={140} color={ThemeColor.Bg2} />
        </Animatable.View>

        <Animatable.View delay={600}
          animation="pulse" duration={5000} easing="ease-out" iterationCount="infinite"
          style={{
            backgroundColor: `rgb(${ThemeColor.primary})`,
            width: 150,
            height: 150,
            position: 'absolute',
            top: 20,
            right: -50,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
            borderRadius: 300
          }}>
          <Ionicons name={'ios-phone-portrait'} style={{ transform: [{ rotate: '130deg' }] }} size={100} color={ThemeColor.Bg2} />
        </Animatable.View>
        <Animatable.View delay={1000} duration={5000}
          animation="pulse" easing="ease-out" iterationCount="infinite"
          style={{
            backgroundColor: `rgb(${ThemeColor.primary})`,
            width: 200,
            height: 200,
            position: 'absolute',
            top: 200,
            left: -50,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            borderRadius: 300,
          }}>
          <MaterialCommunityIcons name={'cupcake'} style={{ transform: [{ rotate: '30deg' }] }} size={110} color={ThemeColor.Bg2} />
        </Animatable.View>
        <Animatable.View delay={1400} duration={5000}
          animation="pulse" easing="ease-out" iterationCount="infinite"
          style={{
            backgroundColor: `rgb(${ThemeColor.primary})`,
            width: 100,
            height: 100,
            position: 'absolute',
            top: 250,
            right: '10%',
            borderRadius: 300,
            alignItems: 'center',
            opacity: 0.4,
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons name={'tshirt-crew-outline'} style={{ transform: [{ rotate: '330deg' }] }} size={50} color={ThemeColor.Bg2} />
        </Animatable.View>

        <Animatable.View delay={1400} duration={5000}
          animation="pulse" easing="ease-out" iterationCount="infinite"
          style={{
            backgroundColor: `rgb(${ThemeColor.primary})`,
            width: 50,
            height: 50,
            position: 'absolute',
            top: 370,
            right: '40%',
            borderRadius: 300,
            alignItems: 'center',
            opacity: 0.15,
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons name={'watch-variant'} style={{ transform: [{ rotate: '230deg' }] }} size={30} color={ThemeColor.Bg2} />
        </Animatable.View>

        <Animatable.View animation={'bounceIn'}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '35%'
          }}>
          <Image source={require('../assets/logo.png')} style={{
            borderRadius: 100,
            width: 200,
            height: 200
          }} />
        </Animatable.View>
        <Animatable.View animation={'fadeInUp'} duration={300} style={{
          paddingHorizontal: 20,
          marginBottom: 20
        }}>
          <TouchableScale activeScale={0.985} style={{ ...styles.Button, backgroundColor: `rgb(${ThemeColor.primary})` }} onPress={() => navigation.navigate('Login')} >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Sign In</Text>
          </TouchableScale>
          <TouchableScale activeScale={0.985} style={{ ...styles.Button, backgroundColor: `rgba(${ThemeColor.primary},0.2)` }} onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: `rgb(${ThemeColor.primary})`, fontSize: 14, fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableScale>
          <TouchableScale activeScale={0.985} onPress={() => this.setState({ showTerms: true })} >
            <Text style={{ marginTop: '10%', textAlign: 'center', color: ThemeColor.text2, fontSize: 12 }}>Terms & Conditions</Text></TouchableScale>
        </Animatable.View>
      </LinearGradient>
    );
  }
}


export default Welcome;

const styles = StyleSheet.create({
  Button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginBottom: 15,
    borderRadius: 30
  },
});
