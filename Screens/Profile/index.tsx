import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React,{useEffect,useState} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import {PermissionsAndroid} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const Profile = ({navigation}: any) => {

  const [tutorDetail,setTutorDetail] = useState({})



  const getTutorDetails = async () => {



    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);
    let {tutorID} = loginData;
    
    axios
    .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
    .then(({data}) => {
      
      let {tutorDetailById} = data

        setTutorDetail(tutorDetailById[0])

    })
    .catch(error => {
      ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
    });

  }

console.log(tutorDetail,"tutorDetauks")

  useEffect(()=>{
    getTutorDetails()
  },[])

  const uploadProfilePicture = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    console.log(granted, 'granted');

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let options: any = {
        saveToPhotos: true,
        mediaType: 'photo',
      };
      const result: any = await launchImageLibrary(options);
      if (result.didCancel) {
        // ('Cancelled image selection');
      } else if (result.errorCode == 'permission') {
        // setToastMsg('Permission Not Satisfied');
      } else if (result.errorCode == 'others') {
        // setToastMsg(result.errorMessage);
      } else {
        let imageUri = result.assets[0].uri;

        console.log(result.assets[0].uri);
      }
    }
  };
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Profile" navigation={navigation} backBtn />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom:100}}>
          <View style={{paddingVertical: 15, alignItems: 'center'}}>
            <Image
              source={require('../../Assets/Images/avatar.png')}
              style={{width: 80, height: 80}}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => uploadProfilePicture()}
              activeOpacity={0.8}>
              <Image
                source={require('../../Assets/Images/plus.png')}
                style={{width: 20, height: 20, top: -20, left: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={{alignItems:'center'}}>
                <Text
                  style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                  {tutorDetail?.full_name}
                </Text>
                <Text
                  style={{fontSize: 14, fontWeight: '300', color: Theme.gray}}>
                  {tutorDetail?.email}
                </Text>
              </View>
          </View>
        {/* Full Name */}
        <View style={{marginVertical: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Full Name
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.full_name}
              </Text>
              
            </View>
          </View>
          {/* Email */}
        <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Email
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.email}
              </Text>
              
            </View>
          </View>
          {/* Displlay name */}
        <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Display Name
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.full_name}
              </Text>
              
            </View>
          </View>
          {/* MObile number*/}
        <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Mobile Number
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.phoneNumber}
              </Text>
            </View>
          </View>
          {/* Gender*/}
        <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Gender
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.gender ? tutorDetail?.gender : "not provided"}
              </Text>
            </View>
          </View>
          {/* Age*/}
        <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Age
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.age}
              </Text>
            </View>
          </View>
          {/* Nric*/}
        <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              NRIC
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.nric ? tutorDetail?.nric : "not Provided"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
        {/* Submit Button */}
        <View
        style={{
          backgroundColor: Theme.white,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,
            marginVertical: 20,
            width: '94%',
          }}>
          <TouchableOpacity
            // onPress={}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
