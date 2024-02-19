import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import messaging from '@react-native-firebase/messaging';
const Splash = ({navigation}: any) => {
  // const [tutorDetail, setTutorDetails] = useState<any>();

  const tutorDetailsCont = useContext(TutorDetailsContext);
  const {tutorDetails, setTutorDetail} = tutorDetailsCont;

  // console.log(tutorDetails, 'myDetails');
  const sendDeviceTokenToDatabase = (tutorId:any) => {
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
            console.log(token, 'token=====>');

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


  // useEffect(() => {
  //   try {
  //     let tutorData: any = AsyncStorage.getItem('tutorData');
  //     tutorData = JSON.parse(tutorData);
  //     console.log("tutorData=====>",tutorData);
      
  //     setTutorDetail(tutorData);
  //     console.log('Bottom Navigation tutor data', tutorData);
  //   } catch (error) {
      
  //     console.error('Error retrieving or parsing tutor data:', error);
  //   }
  // }, []);

  const navigateToHomeScreen = () => {
    setTimeout(async () => {
      let data = await AsyncStorage.getItem('login');
      let authData = await AsyncStorage.getItem('loginAuth');

      if (authData) {
        let tutorData:any = JSON.parse(authData);
        console.log('tutorData----->', tutorData?.tutorID);
        // sendDeviceTokenToDatabase(tutorData?.tutorID)
        axios
          .get(`${Base_Uri}getTutorDetailByID/${tutorData?.tutorID}`)
          // .get(`${Base_Uri}getTutorDetailByID/2`)
          .then((res:any) => {
            console.log('res---->',res.data.tutorDetailById);
            
            if(res.data.tutorDetailById== null){
              AsyncStorage.removeItem('loginAuth');
              navigation.replace('Login');
              setTutorDetail('')
              ToastAndroid.show('Terminated', ToastAndroid.SHORT);
              return;
            }

            let tutorData = res.data;
            setTutorDetail(tutorData?.tutorDetailById[0]);
            console.log('tutorData',tutorData);
            
            if (
                !tutorData.tutorDetailById[0]?.full_name &&
                !tutorData.tutorDetailById[0]?.email
              ) {
                AsyncStorage.removeItem('loginAuth');
                navigation.replace('Login');
                setTutorDetail('')
                return
              }

            if (tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'unverified' || tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'verified') {
              // navigation.replace('JobTicket');
              navigation.replace('Main', {
                screen: 'Home',
              });
            }
            else{
              AsyncStorage.removeItem('loginAuth');
              navigation.replace('Login');
              setTutorDetail('')
              console.log(
                tutorData?.tutorDetailById[0]?.status,
                'terminated or block',
              );
            }
            // if (tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'verified') {
            //   navigation.replace('Main', {
            //     screen: 'Home',
            //   });
            //   return;
            // }
            if (
              tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'terminated' ||
              tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'resigned' ||
              tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'inactive' || 
              tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'new' || 
              tutorDetails == undefined
            ) {
              AsyncStorage.removeItem('loginAuth');
              navigation.replace('Login');
              setTutorDetail('')
              console.log(
                tutorData?.tutorDetailById[0]?.status,
                'terminated or block',
              );
              return;
            }
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
          })
          .catch(error => {
            console.log('error', error);
            if (error.response) {
              // The request was made and the server responded with a status code
              console.log('Server responded with data:', error.response.data);
              console.log('Status code:', error.response.status);
              console.log('Headers:', error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.log('No response received:', error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error setting up the request:', error.message);
            }
            AsyncStorage.removeItem('loginAuth');
            navigation.replace('Login');
            setTutorDetail('')
            ToastAndroid.show('Session Expire', ToastAndroid.SHORT);
            // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
          });
        return;
      }

      if (data) {
        navigation.replace('Login');
        return;
      }
      navigation.replace('OnBoarding');
    }, 3000);
  };
  useEffect(() => {
    navigateToHomeScreen();
  }, []);
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        paddingHorizontal: 15,
        alignItems: 'center',
      }}>
      <Image
        source={require('../../Assets/Images/logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width / 1.1,
  },
});
