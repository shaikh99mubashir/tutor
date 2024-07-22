


import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import PhoneInput from 'react-native-phone-number-input';
import CustomButton from '../../Component/CustomButton';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import Toast from 'react-native-toast-message';
const Login = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    if (!phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Kindly Enter Phone Number',
        position:'bottom'
      });
      return;
    }
    setLoading(true);

    const phoneNumberWithCountryCode = phoneNumber;
    console.log("phoneNumberWithCountryCode", phoneNumberWithCountryCode);

    try {
      await apiRequestWithTimeout(`${Base_Uri}loginAPI/${phoneNumberWithCountryCode}`, 60000);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Request timeout:',
        text2: 'Please check your internet connection',
        position:'bottom'
      });
    }
  };

  const apiRequestWithTimeout = (url:any, timeout:any) => {
    return Promise.race([
      axios.get(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ])
    .then(({ data }:any) => {
      setLoading(false);
      if (data?.status === 404) {
        Toast.show({
          type: 'success',
          text1: `${data.msg}`,
          position:'bottom'
        });
      } else if (data?.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Hello 👋',
          text2: 'Enter verification code to continue',
          position:'bottom'
        });
        navigation.navigate('Verification', data);
      }
    })
    .catch(error => {
      Toast.show({
        type: 'error',
        text1: 'Request timeout:',
        text2: ' Please check your internet connection',
        position:'bottom'
      });
      throw error;
      
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Theme.GhostWhite,
        paddingHorizontal: 25,
      }}>
      <Header navigation={navigation} color={Theme.GhostWhite} />
      <Text style={[styles.textType2]}>Register</Text>
      <View style={{ margin: 20 }}></View>
      <Text
        style={[styles.textType1, { lineHeight: 20, color: Theme.IronsideGrey }]}>
        Please Enter your{' '}
        <Text style={[styles.textType1, { lineHeight: 20 }]}>Phone Number</Text>{' '}
        to register and begin using our app.
      </Text>
      <View style={{ margin: 15 }}></View>
      <Text style={styles.textType1}>Phone Number*</Text>
      <View style={{ margin: 4 }}></View>
      <View>
        <PhoneInput
          // ref={phoneInput}
          placeholder="149655271"
          defaultValue={phoneNumber}
          defaultCode="MY"
          layout="first"
          autoFocus={true}
          textInputStyle={{
            color: Theme.DustyGrey,
            height: 50,
            fontFamily: 'Circular Std Medium',
            marginLeft: -5,
            letterSpacing: 1.5,
          }}
          textInputProps={{ placeholderTextColor: Theme.DustyGrey }}
          codeTextStyle={{
            marginLeft: 0,
            color: Theme.DustyGrey,
            fontFamily: 'Circular Std Medium',
            letterSpacing: 1.5,
          }}
          containerStyle={styles.phoneNumberView}
          flagButtonStyle={{
            borderRadius: 8,
            borderWidth: 2,
            borderColor: Theme.GhostWhite,
            width: 70,
            height: 40,
            marginLeft: 10,
            marginTop: 10,
          }}
          textContainerStyle={{
            height: 60,
            backgroundColor: 'white',
            borderRadius: 10,
            borderColor: Theme.GhostWhite,
          }}
          onChangeFormattedText={text => {
            setPhoneNumber(text);
          }}
        />
      </View>

      <View style={{ margin: 20 }}></View>

      <CustomButton btnTitle='Continue' loading={loading}  onPress={handleLoginPress}/>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  textType1: {
    color: Theme.Black,
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
  },
  textType2: {
    color: Theme.Black,
    fontSize: 26,
    fontFamily: 'Circular Std Medium',
  },
  phoneNumberView: {
    // height: 70,
    width: '100%',
    // backgroundColor: 'white',
    borderColor: Theme.GhostWhite,
    borderRadius: 10,
    borderWidth: 1,
    color: '#E5E5E5',
    flexShrink: 22,
    fontFamily: 'Circular Std Medium',
  },
});


