import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {Theme} from '../../constant/theme';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import {convertArea} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Signup = ({navigation}: any) => {
  let [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  const phoneInput = useRef(null);

  const handleLoginPress = () => {
    if (!fullName) {
      ToastAndroid.show('Kindly Enter Full Name', ToastAndroid.SHORT);
      return;
    }
    if (!email) {
      ToastAndroid.show('Kindly Enter Email Address', ToastAndroid.SHORT);
      return;
    }

    if (!phoneNumber) {
      ToastAndroid.show('Kindly Enter Phonenumber', ToastAndroid.SHORT);
      return;
    }

    let emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    let testEmail = emailReg.test(email);

    if (!testEmail) {
      ToastAndroid.show('Invalid Email Address', ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();

    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);

    setLoading(true);

    axios
      .post(`${Base_Uri}api/appTutorRegister`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        if (data.status == 200) {
          ToastAndroid.show(
            'You have been successfully registered as tutor Login to continue',
            ToastAndroid.SHORT,
          );
          navigation.navigate('Login', data);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  console.log(phoneNumber);

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
      <Text style={[styles.textType1, {fontSize: 25, color: 'black'}]}>
        Get Yourself Registered
      </Text>
      <Text
        style={[
          styles.textType1,
          {fontSize: 14, color: 'black', marginTop: 14, paddingRight: 15},
        ]}>
        Fill out Full Name Phone Number and Email field to get yourself
        registered with sifuTutor.
      </Text>
      <View style={styles.container}>
        <TextInput
          placeholder="Enter Full Name"
          placeholderTextColor={Theme.gray}
          style={{
            height: 60,
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 16,
            borderColor: Theme.black,
            marginBottom: 10,
            borderWidth: 1,
            padding: 10,
            color: Theme.black,
            fontFamily: 'Circular Std Book',
          }}
          onChangeText={text => {
            setFullName(text);
          }}
        />
        <TextInput
          placeholder="Enter Your Email"
          placeholderTextColor={Theme.gray}
          style={{
            height: 60,
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 16,
            borderColor: Theme.black,
            marginBottom: 10,
            borderWidth: 1,
            padding: 10,
            color: Theme.black,
            fontFamily: 'Circular Std Book',
          }}
          onChangeText={text => {
            setEmail(text);
          }}
        />

        {/* <View
          style={[
            styles.phoneNumberView,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              paddingHorizontal: 15,
              paddingVertical: 5,
            },
          ]}>
          <Image
            source={require('../../Assets/Images/malalogo.png')}
            style={{width: 30, height: 30}}
            resizeMode="contain"
          />
          <Text style={styles.textType3}>+60</Text>
          <TextInput
            placeholder="Enter Your Mobile Number"
            placeholderTextColor={Theme.black}
            keyboardType="number-pad"
            style={[styles.textType3, {color: 'black'}]}
            onChangeText={text => {
              setPhoneNumber(text);
            }}
          />
        </View> */}

        <PhoneInput
          ref={phoneInput}
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
      </View>
      <View
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
            fontFamily: 'Circular Std Book',
          }}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text
            style={{
              color: Theme.black,
              fontWeight: 'bold',
              fontFamily: 'Circular Std Book',
            }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

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
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Book',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std Book',
    fontStyle: 'normal',
  },
});
