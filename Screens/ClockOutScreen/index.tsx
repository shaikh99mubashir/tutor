import React, {useEffect, useState, useContext} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import noteContext from '../../context/noteContext';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import TutorDetailForm from '../TutorDetailForm';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import CustomLoader from '../../Component/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ClockOut({navigation, route}: any) {
  const [loading, setLoading] = useState(false);
  const contexts = useContext(noteContext);
  const [tutorId, setTutorId] = useState(null);
  const tutorDetails = useContext(TutorDetailsContext);

  let tutorID = tutorDetails?.tutorDetails?.tutorId;

  const data = route?.params;
  const items = route?.params;

  const focus = useIsFocused();

  const [currentLocation, setCurrentLocation] = useState<any>({
    latitude: null,
    longitude: null,
  });

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(e =>
      setCurrentLocation({
        ...currentLocation,
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
      }),
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

    const getTutorID = async () => {
      let data: any = await AsyncStorage.getItem('loginAuth');
  
      data = JSON.parse(data);
  
      let {tutorID} = data;
  
      setTutorId(tutorID);
    };
  
    useEffect(() => {
      getTutorID();
    }, []);

  const handleClockOutPress = async () => {
    try {
      setLoading(true);

      if (!data) {
        console.log('Data is undefined or null');
        ToastAndroid.show('Data is undefined or null', ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      let formData = new FormData();
      formData.append('id', data?.classAttendedID);
      formData.append('class_schedule_id', data?.class_schedule_id);
      formData.append('endMinutes', data?.endHour);
      formData.append('endSeconds', data?.endMinutes);
      formData.append('hasIncentive', data?.hasIncentive);

      if (data?.uri && data?.type && data?.filename) {
        formData.append('endTimeProofImage', {
          uri: data?.uri,
          type: data?.type,
          name: data?.filename,
        });
      } else {
        console.log('Missing image properties');
        ToastAndroid.show('Missing image properties', ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const clockOutResponse = await axios.post(
        `${Base_Uri}api/attendedClassClockOutTwo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      ToastAndroid.show(clockOutResponse?.data?.result, ToastAndroid.SHORT);

      if (clockOutResponse?.data?.errorMsg) {
        navigation.navigate('Schedule');
        return;
      }
      const tutorReportResponse = await axios.get(
        `${Base_Uri}api/tutorFirstReportListing/${tutorId}`,
      );

      const {data: tutorReportData} = tutorReportResponse;
      let {tutorReportListing} = tutorReportData;
      
      let thisClass =
        tutorReportListing &&
        tutorReportListing?.length > 0 &&
        tutorReportListing.filter((e: any, i: number) => {
          console.log('e', e);
          return items.class_schedule_id == e.scheduleID;
        });

      if (thisClass && thisClass.length > 0) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BackToDashboard'}],
          }),
        );
      } else {
        navigation.replace('ReportSubmission', items);
      }
      setLoading(false);
    } catch (error: any) {
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
      setLoading(false);
      ToastAndroid.show(
        `Error in handleClockOutPress: ${error}`,
        ToastAndroid.LONG,
      );
      console.log('Error in handleClockOutPress:', error);
    }
  };

  let totalHours;
  let totalMinutes;

  if ((data.endHour - data.startHour)?.toString()?.includes('-')) {
    let endHour = 24 - data.startHour;
    let totalEndMinutes = endHour * 60 + data.endMinutes;
    let totalStartMinutes = data.startHour * 60 + data.startMinutes;
    let total = totalEndMinutes + totalStartMinutes;
    let myHours = total / 60;
    let minutes = myHours.toString().split('.')[1];
    let totalHours = myHours.toString().split('.')[0];
    let totalMinutes = (Number(minutes) / 100) * 60;
  } else {
    let totalEndMinutes = Number(data.endHour * 60) + Number(data.endMinutes);
    let totalStartMinutes =
      Number(data.startHour * 60) + Number(data.startMinutes);

    let total = totalEndMinutes - totalStartMinutes;

    let myHours = Number(total / 60).toFixed(2);

    let minutes: any = myHours.toString().split('.')[1];

    totalHours = myHours.toString().split('.')[0];
    totalMinutes = Math.round((Number(minutes) / 100) * 60);
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Header backBtn navigation={navigation} title={'Clock Out'} />
      {currentLocation.latitude && currentLocation.longitude && (
        <MapView
          style={{height: '100%', width: '100%'}}
          region={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          />
        </MapView>
      )}

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: Theme.lightGray,
          padding: 20,
          backgroundColor: Theme.white,
          bottom: 20,
          borderRadius: 10,
          position: 'absolute',
          width: '90%',
        }}>
        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <Text
            style={{
              color: Theme.gray,
              textTransform: 'uppercase',
              fontFamily: 'Circular Std Black',
            }}>
            Time:
          </Text>
          <Text
            style={{
              color: Theme.black,
              fontWeight: '600',
              textTransform: 'uppercase',
              fontFamily: 'Circular Std Black',
            }}>
            {' '}
            {data.startHour.toString().length == 1
              ? `0${data.startHour}`
              : data.startHour}
            :
            {data.startMinutes.toString().length == 1
              ? `0${data?.startMinutes}`
              : data.startMinutes}
            :00 -{' '}
            {data.endHour.toString().length == 1
              ? `0${data.endHour}`
              : data.endHour}
            :
            {data.endMinutes.toString().length == 1
              ? `0${data.endMinutes}`
              : data.endMinutes}
            :00
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{color: Theme.gray, fontFamily: 'Circular Std Black'}}>
            {' '}
            Duration:
          </Text>
          <Text
            style={{
              color: Theme.black,
              fontWeight: '600',
              fontFamily: 'Circular Std Black',
            }}>
            {' '}
            {data.hour} hours {data.minutes} minutes
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleClockOutPress()}
          style={{
            backgroundColor: Theme.darkGray,
            width: '100%',
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: 'white',
              fontFamily: 'Circular Std Black',
            }}>
            Clock Out
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <CustomLoader visible={loading} />
    </View>
  );
}

export default ClockOut;
