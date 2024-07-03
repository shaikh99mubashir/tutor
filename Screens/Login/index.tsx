import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const Login = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    if (!phoneNumber) {
      ToastAndroid.show('Kindly Enter Phone Number', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);

    const phoneNumberWithCountryCode = phoneNumber;
    console.log("phoneNumberWithCountryCode", phoneNumberWithCountryCode);

    try {
      await apiRequestWithTimeout(`${Base_Uri}loginAPI/${phoneNumberWithCountryCode}`, 60000);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      ToastAndroid.show('Request timeout: Please check your internet connection', ToastAndroid.LONG);
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
        ToastAndroid.show(data.msg, ToastAndroid.SHORT);
      } else if (data?.status === 200) {
        ToastAndroid.show('Enter verification code to continue.', ToastAndroid.SHORT);
        navigation.navigate('Verification', data);
      }
    })
    .catch(error => {
      throw error;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enter your{'\n'}mobile number</Text>
      <Text style={styles.subHeaderText}>
        A verification code will be sent to{'\n'}this mobile Number
      </Text>
      <PhoneInput
        placeholder="Enter Your Number"
        defaultValue={phoneNumber}
        defaultCode="MY"
        layout="first"
        autoFocus={true}
        textInputStyle={{ color: Theme.black, height: 50 }}
        textInputProps={{ placeholderTextColor: Theme.gray }}
        codeTextStyle={{ marginLeft: -15, paddingLeft: -55, color: 'black' }}
        containerStyle={styles.phoneNumberView}
        textContainerStyle={{
          height: 60,
          backgroundColor: 'white',
          borderRadius: 10,
          borderColor: 'transparent',
        }}
        onChangeFormattedText={text => setPhoneNumber(text)}
      />
      <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
        {loading ? (
          <ActivityIndicator color={Theme.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 26,
    color: 'black',
    fontFamily: 'Circular Std Book',
  },
  subHeaderText: {
    fontSize: 14,
    color: 'black',
    marginTop: 14,
    fontFamily: 'Circular Std Book',
  },
  phoneNumberView: {
    marginTop: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: Theme.gray,
    borderRadius: 10,
    borderWidth: 1,
    color: '#E5E5E5',
    flexShrink: 22,
  },
  button: {
    borderWidth: 1,
    borderColor: Theme.white,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Theme.darkGray,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default Login;

