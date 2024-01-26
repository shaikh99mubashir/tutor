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
  // console.log('item setUpcomingClass',item);
  
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

  // const handleClockInPress = async () => {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.CAMERA,
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     const options: any = {
  //       title: 'Select Picture',
  //       storageOptions: {
  //         skipBackup: true,
  //         path: 'images',
  //       },
  //       maxWidth: 600,
  //       maxHeight: 200,
  //       quality: 1.0,
  //     };

  //     launchCamera(options, (res: any) => {
  //       if (res.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (res.error) {
  //         console.log('ImagePicker Error:', res.error);
  //       } else {
  //         let {assets} = res;

  //         let startMinutes = new Date().getHours();
  //         let startSeconds = new Date().getMinutes();
  //         console.log("startMinutes",startMinutes);
  //         console.log("startSeconds",startSeconds);
          
  //         let data: any = {
  //           id: item?.id,
  //           class_schedule_id: item?.class_schedule_id,
  //           startMinutes: startMinutes,
  //           startSeconds: startSeconds,
  //           hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0,
  //         };
  //         let formData = new FormData();

  //         formData.append('id', data.id);
  //         formData.append('class_schedule_id', data.class_schedule_id);
  //         formData.append('startMinutes', data.startMinutes);
  //         formData.append('startSeconds', data.startSeconds);
  //         formData.append('hasIncentive', data.hasIncentive);
  //         formData.append('startTimeProofImage', {
  //           uri: assets[0].uri,
  //           type: assets[0].type,
  //           name: assets[0].fileName,
  //         });
          
  //         setLoading(true);
  //         axios
  //           .post(`${Base_Uri}api/attendedClassClockInTwo`, formData, {
  //             headers: {
  //               'Content-Type': 'multipart/form-data',
  //             },
  //           })
  //           .then(res => {
  //             setLoading(false);
  //             data.data = res?.data;
  //             data.item = item;
  //             let storageData: any = {...data};
  //             storageData = JSON.stringify(storageData);
  //             AsyncStorage.setItem('classInProcess', storageData);
  //             navigation.replace('ClassTimerCount', data);
  //           })
  //           .catch(error => {
  //             setLoading(false);
  //             console.log(error, 'error');
  //           });
  //       }
  //     });
  //   }
  // };

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
          if (res.didCancel) {
            console.log('User cancelled image picker');
            ToastAndroid.show('User cancelled image picker', ToastAndroid.LONG);
          } else if (res.error) {
            console.log('ImagePicker Error:', res.error);
            ToastAndroid.show(`ImagePicker Error: ${res.error}`, ToastAndroid.LONG);
          } else {
            try {
              let { assets } = res;
  
              let startMinutes = new Date().getHours();
              let startSeconds = new Date().getMinutes();
              console.log("startMinutes", startMinutes);
              console.log("startSeconds", startSeconds);
  
              let data: any = {
                id: item?.id,
                class_schedule_id: item?.class_schedule_id,
                startMinutes: startMinutes,
                startSeconds: startSeconds,
                hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0,
              };
  
              let formData = new FormData();
  
              formData.append('id', data.id);
              formData.append('class_schedule_id', data.class_schedule_id);
              formData.append('startMinutes', data.startMinutes);
              formData.append('startSeconds', data.startSeconds);
              formData.append('hasIncentive', data.hasIncentive);
  
              // Ensure assets array is not empty before accessing its properties
              if (assets && assets.length > 0) {
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
            } catch (error) {
              setLoading(false);
              console.log('Error in Axios request:', error);
              ToastAndroid.show(`Error in handleClockOut: ${error}`, ToastAndroid.LONG);
            }
          }
        });
      } else {
        console.log('Camera permission denied');
        ToastAndroid.show('Camera permission denied', ToastAndroid.LONG);
      }
    } catch (permissionError) {
      console.log('Error requesting camera permission:', permissionError);
      ToastAndroid.show(`Error in handleClockOut: ${permissionError}`, ToastAndroid.LONG);
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
