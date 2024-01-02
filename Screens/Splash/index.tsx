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
const Splash = ({navigation}: any) => {
  // const [tutorDetail, setTutorDetails] = useState<any>();

  const tutorDetailsCont = useContext(TutorDetailsContext);
  const {tutorDetails, setTutorDetail} = tutorDetailsCont;

  console.log(tutorDetails, 'myDetails');

  useEffect(() => {
    try {
      let tutorData: any = AsyncStorage.getItem('tutorData');
      tutorData = JSON.parse(tutorData);
      setTutorDetail(tutorData);
      console.log('Bottom Navigation tutor data', tutorData);
    } catch (error) {
      console.error('Error retrieving or parsing tutor data:', error);
    }
  }, []);

  const navigateToHomeScreen = () => {
    setTimeout(async () => {
      let data = await AsyncStorage.getItem('login');
      let authData = await AsyncStorage.getItem('loginAuth');

      if (authData) {
        let tutorData = JSON.parse(authData);
        console.log('tutorData', tutorData);

        axios
          .get(`${Base_Uri}getTutorDetailByID/${tutorData?.tutorID}`)
          .then(res => {
            console.log('res---->');

            let tutorData = res.data;
            setTutorDetail(tutorData?.tutorDetailById[0]);
            if (tutorData?.tutorDetailById[0]?.status === 'unverified') {
              navigation.replace('JobTicket');
              console.log(tutorData?.tutorDetailById[0]?.status, 'splash');
              return;
            }
            if (tutorData?.tutorDetailById[0]?.status === 'verified') {
              navigation.replace('Main', {
                screen: 'Home',
              });
              console.log(tutorData?.tutorDetailById[0]?.status, 'splash');
              return;
            }
            if (
              tutorData?.tutorDetailById[0]?.status === 'terminated' ||
              tutorData?.tutorDetailById[0]?.status === 'block'
            ) {
              AsyncStorage.removeItem('loginAuth');
              navigation.replace('Login');
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
            ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
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
