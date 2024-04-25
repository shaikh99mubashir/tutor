import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { Theme } from '../../constant/theme';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import CustomLoader from '../../Component/CustomLoader';
const Verification = ({ navigation, route }: any) => {
  let data = route.params;
  const [user, setUser] = useState(false);
  const CELL_COUNT = 6;
  const [code, setCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const Verify = () => {

    const sendDeviceTokenToDatabase = (tutorId: any) => {
      messaging()
        .requestPermission()
        .then(() => {
          // Retrieve the FCM token
          return messaging().getToken();
        })
        .then(token => {
          messaging()
            .subscribeToTopic('all_devices')
            .then(() => {

              let formData = new FormData();

              formData.append('tutor_id', tutorId);
              formData.append('device_token', token);

              axios
                .post(`${Base_Uri}api/getTutorDeviceToken`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then(res => {
                  let data = res.data;
                  // console.log(data, 'tokenResponse');
                })
                .catch(error => {
                  console.log(error, 'error');
                });
            })
            .catch(error => {
              console.error('Failed to subscribe to topic: all_devices', error);
            });
        })
        .catch(error => {
          console.error(
            'Error requesting permission or retrieving token:',
            error,
          );
        });
    };

    if (!value) {
      ToastAndroid.show('Kindly Enter 6 Digut OTP Code', ToastAndroid.SHORT);
      return;
    }

    if (value.length < 6) {
      ToastAndroid.show('Invalid Code', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append("code", value);
    formData.append("id",  data?.tutorDetail?.id);
    console.log("form DAtat", formData);
    axios.post(`${Base_Uri}api/verificationCode`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data }: any) => {
        console.log('data.tutorID',data);
        
        if (data?.status !== 200) {
          console.log('Running');
          setLoading(false);
          ToastAndroid.show(data?.errorMessage, ToastAndroid.SHORT);
          return;
        }
        if (data?.status == 200) {
          console.log('data.tutorID Running', data.tutorID);

          setLoading(false);
         
          let mydata = JSON.stringify(data);
          AsyncStorage.setItem('loginAuth', mydata);
          console.log('mydata',mydata);
          
          sendDeviceTokenToDatabase(data.tutorID)
          console.log('data.tutorID',data.tutorID);
          
          axios
            .get(`${Base_Uri}getTutorDetailByID/${data?.tutorID}`)
            .then((res) => {
              if (res.data.tutorDetailById == null) {
                AsyncStorage.removeItem('loginAuth');
                navigation.replace('Login');
                ToastAndroid.show('Terminated', ToastAndroid.SHORT);
                console.log('no tutor id Found');
                
                return
              }
              let tutorData = res.data;

              if (
                tutorData?.tutorDetailById[0]?.full_name == null && tutorData?.tutorDetailById[0]?.email == null
              ) {
                navigation.replace('Signup', tutorData)
              }
              else if(tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'unverified' || tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'verified'){
                // navigation.replace('Main', {
                //   screen: 'Home',
                // });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                ToastAndroid.show(`Login Successfully`, ToastAndroid.SHORT);
              }
              // else (tutorData?.tutorDetailById[0]?.status === 'unverified' || tutorData?.tutorDetailById[0]?.status === 'verified') 
              // {
              //   // navigation.replace('Main')
              //   navigation.replace('Main', {
              //     screen: 'Home',
              //   });
              //   console.log(tutorData?.tutorDetailById[0]?.status, 'unverified or verified verification');
              // }
              // else if (tutorData?.tutorDetailById[0]?.status === 'terminated' || tutorData?.tutorDetailById[0]?.status === 'resigned') {
              //   AsyncStorage.removeItem('loginAuth');
              //   navigation.replace('Login')
              //   console.log(tutorData?.tutorDetailById[0]?.status,'terminated or block');
              // }
              // else {
              //   // navigation.replace('JobTicket')
              // }
              // if (
              //   !tutorData.tutorDetailById[0]?.full_name &&
              //   !tutorData.tutorDetailById[0]?.displayName
              // ) {
              //   navigation.reset({
              //     index: 0,
              //     routes: [
              //       {
              //         name: 'TutorDetails',
              //         params: {
              //           tutorData,
              //         },
              //       },
              //     ],
              //   });
              // } else {
              //   navigation.reset({
              //     index: 0,
              //     routes: [
              //       {
              //         name: 'Main',
              //         params: {
              //           data,
              //         },
              //       },
              //     ],
              //   });
              // }
            });
        }
      })
      .catch(error => {
        console.log('reeoe', error.errorMessage);

        ToastAndroid.show('Invalid Code', ToastAndroid.SHORT);
        setLoading(false);
      });
  };

  const handleResendPress = () => {
    let { UserDetail } = data;
    setResendLoading(true);

    axios
      .get(`${Base_Uri}loginAPI/${data?.tutorDetail?.phoneNumber}`)
      .then(({ data }) => {
        if (data?.status == 200) {
          setResendLoading(false);
          ToastAndroid.show(
            'Verification Code Resend Successfully',
            ToastAndroid.SHORT,
          );
          return;
        }
        if (data?.status !== 200) {
          setResendLoading(false);
          ToastAndroid.show(data.errorMessage, ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        setResendLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  return (
    <View
      style={{
        backgroundColor: Theme.white,
        height: '100%',
      }}>
      <Header
        navigation={navigation}
        user={user}
        backBtn
        noSignUp
        title="Verification"
      />
      <View style={{ marginVertical: 10, paddingHorizontal: 15,marginTop:30 }}>
        <Text
          style={{
            fontFamily: 'Circular Std Medium',
            color: Theme.gray,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Enter Verification Code
        </Text>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleResendPress()}>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 15,
              fontFamily: 'Circular Std Medium',
            }}>
            If you didn,t receive a code!
            {/* {resendLoading ? (
              <View style={{margin:10}}>
              <ActivityIndicator color={Theme.black} size="small" />
              </View>
            ) : ( */}
              <Text
                style={{
                  color: Theme.darkGray,
                  fontSize: 15,
                  fontFamily: 'Circular Std Medium',
                }}>
                {' '}
                Resend{' '}
              </Text>
            {/* )} */}
          </Text>
        </TouchableOpacity>
      </View>
      <CustomLoader visible={resendLoading} />   
      {/* Verify Button */}
      <View
        style={{
          // width: Dimensions.get('window').width / 1.1,
          // borderWidth: 1,
          borderRadius: 5,
          marginHorizontal: 15,
          marginVertical: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => !resendLoading && Verify()}
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
                fontFamily: 'Circular Std Medium',
              }}>
              Verify
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  digitbtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 4,
    backgroundColor: Theme.darkGray,
    // borderWidth: 1,
    borderColor: Theme.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Circular Std Medium',
  },
  codeFieldRoot: {
    marginTop: 20,
    justifyContent: 'center',
  },
  cell: {
    width: Dimensions.get('window').width / 7.5,
    height: 60,
    color: Theme.black,
    padding: 10,
    alignItems: 'center',
    lineHeight: 38,
    fontSize: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#e6e9fa',
    borderColor: Theme.darkGray,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: Theme.darkGray,
  },
});
