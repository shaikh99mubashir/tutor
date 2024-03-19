import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
  ErrorUtils ,
} from 'react-native';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from '../../Component/CustomLoader';

function ClockIn({navigation, route}: any) {
  let item = route.params;
  const [loading, setLoading] = useState(false);
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

  const handleClockInPress = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const options: any = {
          title: 'Select Picture',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          maxWidth: 600,
          maxHeight: 200,
          quality: 1.0,
        };
        launchCamera(options, async (res: any) => {
          if (res?.didCancel) {
            console.log('User cancelled image picker');
            ToastAndroid.show('User cancelled image picker', ToastAndroid.LONG);
          } else if (res?.error) {
            console.log('ImagePicker Error:', res.error);
            ToastAndroid.show(`ImagePicker Error: ${res.error}`, ToastAndroid.LONG);
          } else {
            try {
              let { assets } = res;
              let startMinutes = new Date().getHours();
              let startSeconds = new Date().getMinutes();
  
              let data: any = {
                id: item?.id || '',
                class_schedule_id: item?.class_schedule_id || '',
                startMinutes: startMinutes,
                startSeconds: startSeconds,
                hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0,
              };
  
              if (!data.id || !data.class_schedule_id) {
                console.log('Invalid item data');
                ToastAndroid.show('Invalid item data', ToastAndroid.LONG);
                return;
              }
  
              let formData = new FormData();
              formData.append('id', data?.id);
              formData.append('class_schedule_id', data?.class_schedule_id);
              formData.append('startMinutes', data?.startMinutes);
              formData.append('startSeconds', data?.startSeconds);
              formData.append('hasIncentive', data?.hasIncentive);
  
              if (assets && assets?.length > 0) {
                formData.append('startTimeProofImage', {
                  uri: assets[0].uri,
                  type: assets[0].type,
                  name: assets[0].fileName,
                });
              } else {
                console.log('No image selected');
                ToastAndroid.show('No image selected', ToastAndroid.LONG);
                return;
              }
  
              setLoading(true);
  
              const response = await axios.post(`${Base_Uri}api/attendedClassClockInTwo`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
  
              setLoading(false);
  
              data.data = response?.data;
              data.item = item;
              let storageData: any = { ...data };
              
              storageData = JSON.stringify(storageData);
              AsyncStorage.setItem('classInProcess', storageData);
              navigation.replace('ClassTimerCount', data);
            } catch (error:any) {
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
              console.log('Error in Axios request:', error);
              console.log('Error in capturing image:', error);
              ToastAndroid.show(`Error in Axios request: ${error.message}`, ToastAndroid.LONG);
            }
          }
        });
      } else {
        console.log('Camera permission denied');
        ToastAndroid.show('Camera permission denied', ToastAndroid.LONG);
      }
    } catch (permissionError:any) {
      console.log('Error requesting camera permission:', permissionError);
      ToastAndroid.show(`Error requesting camera permission: ${permissionError.message}`, ToastAndroid.LONG);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Header backBtn navigation={navigation} title={'Clock In'} />
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Theme.lightGray,
              borderRadius: 100,
              width: 70,
              height: 70,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Theme.darkGray,
            }}>
            <Image source={item.imageUrl} style={{width: 45, height: 45}} />
          </View>
          <Text style={{fontSize: 14, color: Theme.gray, marginLeft: 10,fontFamily: 'Circular Std Black'}}>
            {item.studentName}
          </Text>
        </View>

        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 16,
              color: Theme.black,
              fontWeight: '600',
              textTransform: 'uppercase',
              fontFamily: 'Circular Std Black'
            }}>
            {item.subjectName}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{color: Theme.gray,fontFamily: 'Circular Std Black'}}>
            {item.startTime.toString()} - {item.endTime.toString()} |{' '}
          </Text>

          <Text style={{color: Theme.gray,fontFamily: 'Circular Std Black'}}>
            {item.date.slice(0, 10).toString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleClockInPress()}
          activeOpacity={0.8}
          style={{
            backgroundColor: Theme.darkGray,
            width: '100%',
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <Text style={{textAlign: 'center', fontSize: 16, color: 'white',fontFamily: 'Circular Std Black'}}>
            Clock In
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <CustomLoader visible={loading} />
    </View>
  );
}

export default ClockIn;
