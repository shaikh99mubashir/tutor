import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import ConfirmationCodeField from '../../Component/ConfirmationCodeField';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import CustomLoader from '../../Component/CustomLoader';
import CustomButton from '../../Component/CustomButton';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Verification = ({ navigation, route }: any) => {
  let data = route.params;
  const CELL_COUNT = 5;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [countdown, setCountdown] = useState(59);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
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
  const handleCodeCompleted = async (enteredCode: any) => {
    if (enteredCode.length === CELL_COUNT) {
      try {
        setLoading(true);
        let formData = new FormData();
        formData.append("code", enteredCode);
        formData.append("id", data?.tutorDetail?.id);
        console.log("form DAtat", formData);
        axios.post(`${Base_Uri}api/verificationCode`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(({ data }: any) => {
            console.log('data.tutorID', data);

            if (data?.status !== 200) {
              console.log('Running');
              setLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${data?.errorMessage}`,
                position: 'bottom'
              });
              return;
            }
            if (data?.status == 200) {
              console.log('data.tutorID Running', data.tutorID);

              setLoading(false);

              let mydata = JSON.stringify(data);
              AsyncStorage.setItem('loginAuth', mydata);
              console.log('mydata', mydata);

              sendDeviceTokenToDatabase(data.tutorID)
              console.log('data.tutorID', data.tutorID);

              axios
                .get(`${Base_Uri}getTutorDetailByID/${data?.tutorID}`)
                .then((res) => {
                  if (res.data.tutorDetailById == null) {
                    AsyncStorage.removeItem('loginAuth');
                    navigation.replace('Login');
                    Toast.show({
                      type: 'info',
                      text1: 'Error',
                      text2: 'Terminated',
                      position: 'bottom'
                    });


                    return
                  }
                  let tutorData = res.data;

                  if (
                    tutorData?.tutorDetailById[0]?.full_name == null && tutorData?.tutorDetailById[0]?.email == null
                  ) {
                    navigation.replace('Signup', tutorData)
                  }
                  else if (tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'unverified' || tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'verified') {
                    // navigation.replace('Main', {
                    //   screen: 'Home',
                    // });
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Main' }],
                    });
                    Toast.show({
                      type: 'success',
                      text1: 'Success',
                      text2: 'Login Successfully',
                      position: 'bottom'
                    });
                  }
                });
            }
          })
          .catch(error => {
            console.log('reeoe', error.errorMessage);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Invalid Code',
              position: 'bottom'
            });
            setLoading(false);
          });
      }
      catch (error) {
        console.log('error', error);
      }
    }
    };

    const handleResendPress = () => {
      let { UserDetail } = data;
      setLoading(true);

      axios
        .get(`${Base_Uri}loginAPI/${data?.tutorDetail?.phoneNumber}`)
        .then(({ data }) => {
          if (data?.status == 200) {
            setLoading(false);
            setCountdown(59);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Verification Code Resend Successfully',
              position: 'bottom'
            });

            return;
          }
          if (data?.status !== 200) {
            setResendLoading(false);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: `${data.errorMessage}`,
              position: 'bottom'
            });
          }
        })
        .catch(error => {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Network Error',
            position: 'bottom'
          });

        });
    };

    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown === 1) {
            clearInterval(timer);
            return prevCountdown;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [countdown]);


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Theme.GhostWhite }}>
          <Header navigation={navigation} BackBtn />
        <View style={{ paddingHorizontal: 25 }}>
          <Text style={[styles.textType2]}>Verify Code</Text>
          <View style={{ margin: 10 }}></View>
          <Text
            style={[
              styles.textType1,
              { lineHeight: 20, color: Theme.IronsideGrey },
            ]}>
            A Verification OTP has been sent {'\n'}to{' '}
            <Text style={[styles.textType1, { lineHeight: 20 }]}>
              {data?.tutorDetail?.phoneNumber}
            </Text>
          </Text>
          <View style={{ margin: 25 }}></View>
          {/* <View style={{ paddingHorizontal: 15, marginTop: 0 }}>
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
        </View> */}
          <ConfirmationCodeField onCodeChange={handleCodeCompleted} />
        </View>
        <View style={{ margin: 15 }}></View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
            flexDirection: 'row',
            marginTop: 25,
          }}>
          <Text
            style={{
              color: Theme.IronsideGrey,
              alignSelf: 'center',
              fontWeight: '500',
              fontSize: 16,
              fontFamily: 'Circular Std Medium',
            }}>
            Didn’t Receive a Code?{' '}
          </Text>
          <TouchableOpacity onPress={handleResendPress} activeOpacity={0.8}>
            <Text
              style={{
                color: Theme.Dune,
                fontWeight: '500',
                fontSize: 16,
                fontFamily: 'Circular Std Bold',
                borderBottomWidth: 2,
                borderBottomColor: Theme.darkGray,
              }}>
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>
        {countdown !== 1 ?
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
              flexDirection: 'row',
              marginTop: 0,
            }}>
            <Text
              style={{
                color: Theme.IronsideGrey,
                alignSelf: 'center',
                fontWeight: '500',
                fontSize: 16,
                fontFamily: 'Circular Std Medium',
              }}>
              End in{' '}
            </Text>

            <View>
              <Text
                style={{
                  color: Theme.Dune,
                  fontWeight: '500',
                  fontSize: 16,
                  fontFamily: 'Circular Std Bold',
                  borderBottomWidth: 2,
                  borderBottomColor: Theme.darkGray,
                }}>
                {countdown} Seconds
              </Text>
            </View>


          </View>
          : ''}
           <CustomLoader visible={loading} />
      </SafeAreaView>
    );
  };

  export default Verification;

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
      fontFamily: 'Circular Std Bold',
          fontSize: 33,
      marginHorizontal: 4,
      // borderWidth: 1,
      borderRadius: 12,
      // backgroundColor: '#e6e9fa',
      backgroundColor: Theme.liteBlue,
      // borderColor: Theme.darkGray,
      textAlign: 'center',
    },
    focusCell: {
      borderColor: Theme.darkGray,
    },

    //   phoneNumberView: {
    //     // height: 70,
    //     width: '100%',
    //     // backgroundColor: 'white',
    //     borderColor: Theme.GhostWhite,
    //     borderRadius: 10,
    //     borderWidth: 1,
    //     color: '#E5E5E5',
    //     flexShrink: 22,
    //     fontFamily: 'Circular Std Medium',
    //   },
  });