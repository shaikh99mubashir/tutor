import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import { convertArea } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({ navigation }: any) => {
  let [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLoginPress = () => {
    if (!phoneNumber) {
      ToastAndroid.show('Kindly Enter Phone Number', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      ToastAndroid.show('Request timeout: Please check your internet connection', ToastAndroid.SHORT);
    }, 30000);
    // const phoneNumberWithCountryCode = "+60" + phoneNumber;
    const phoneNumberWithCountryCode =  phoneNumber;
    console.log("phoneNumberWithCountryCode",phoneNumberWithCountryCode);
    
    axios
      .get(`${Base_Uri}loginAPI/${phoneNumberWithCountryCode}`,{
          // Set the timeout for the API call
      timeout: 30000, // 30 seconds
      })
      .then(({ data }) => {
        clearTimeout(timeoutId);
        if (data?.status == 404) {
          setLoading(false);
          console.log(data.status);
          
          ToastAndroid.show(data.msg, ToastAndroid.SHORT);
          return;
        }
        if (data?.status == 200) {
          // ToastAndroid.show(data.tutorDeviceToken, ToastAndroid.SHORT);
          ToastAndroid.show(
            'Enter verification code to continue.',
            ToastAndroid.SHORT,
          );
          navigation.navigate('Verification', data);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log("error", error);
        ToastAndroid.show('Request timeout: Please check your internet connection', ToastAndroid.LONG);
      });
  };

  const [allowedCountries, setAllowedCountries] = useState(['PK', 'MY']);
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
      <Text style={{ fontSize: 26, color: 'black', fontFamily: 'Circular Std Book' }}>
        Enter your{'\n'}mobile number
      </Text>
      <Text style={{ fontSize: 14, color: 'black', marginTop: 14, fontFamily: 'Circular Std Book' }}>
        A verification code will be sent to{'\n'}this mobile Number
      </Text>
      <View style={styles.container}>
        {/* <View style={[styles.phoneNumberView, { flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 15, paddingVertical: 5 }]}>
          <Image source={require('../../Assets/Images/malalogo.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
          <Text style={styles.textType3}>+60</Text>
          <TextInput
            placeholder='Enter Your Mobile Numberr'
            placeholderTextColor={Theme.black}
            keyboardType='number-pad'
            style={[styles.textType3, { color: 'black' }]}
            onChangeText={text => {
              setPhoneNumber(text);
            }}
          />
        </View> */}
         <PhoneInput
          // ref={phoneInput}
          placeholder="Enter Your Number"
          defaultValue={phoneNumber}
          defaultCode="MY"
          layout="first"
          autoFocus={true}
          textInputStyle={{color: Theme.black, height: 50}}
          textInputProps={{placeholderTextColor: Theme.gray}}
          codeTextStyle={{marginLeft: -15, paddingLeft: -55, color: 'black'}}
          containerStyle={styles.phoneNumberView}
          textContainerStyle={{
            height: 60,
            backgroundColor: 'white',
            borderRadius: 10,
            borderColor: 'transparent',
          }}
          onChangeFormattedText={text => {
            setPhoneNumber(text);
          }}
        /> 
      </View>
      {/* Submit Button */}

      <View
        style={{
          borderWidth: 1,
          borderColor: Theme.white,

          marginVertical: 20,
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => handleLoginPress()}
          style={{
            alignItems: 'center',
            padding: 10,
            backgroundColor: Theme.darkGray,
            borderRadius: 10,
          }}>
          {loading ? (
            <ActivityIndicator color={Theme.white} size="small" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
        {/* <View
          style={{
            width: '100%',
            alignItems: 'center',
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Theme.black,
              fontSize: 14,
              fontWeight: '400',
            }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: Theme.black, fontWeight: 'bold' }}>Signup</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    autoFocus: true,
    // flex: 1,
    marginTop: 20,
  },
  phoneNumberView: {
    // height: 70,
    width: '100%',
    backgroundColor: 'white',
    borderColor: Theme.gray,
    borderRadius: 10,
    borderWidth: 1,
    color: '#E5E5E5',
    flexShrink: 22,
    autoFocus: true,
  },
  textType1: {
    fontWeight: '500', fontSize: 24, color: Theme.Dune, fontFamily: 'Circular Std Book', lineHeight: 24,
    fontStyle: 'normal'
  },
  textType3: {
    color: Theme.Dune, fontWeight: '500', fontSize: 16,
    fontFamily: 'Circular Std Book',
    fontStyle: 'normal',
  },
});
