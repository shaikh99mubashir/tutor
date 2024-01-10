import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import React, {useRef, useState, useEffect, useContext} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {Theme} from '../../constant/theme';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import {convertArea} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorDetailsContext from '../../context/tutorDetailsContext';
// import defaultAvatar from '../../Assets/Images/avatar.png';
import { PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ModalImg from '../../Component/Modal/modal';
const Signup = ({navigation, route}: any) => {
  let data = route.params;

  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [openPhotoModal, setOpenPhotoModal] = useState(false)
  const [uri, setUri] = useState("")
  const [type, setType] = useState("")
  const [name, setName] = useState("")
  const context = useContext(TutorDetailsContext);
  const phoneInput = useRef(null);
  let imageUrl;
  const [image, setImage] = useState('');

  let tutorDetail = context?.tutorDetails

  let tutorDetails = context?.tutorDetails
  console.log('tutorDetail',tutorDetail);
  const handleLoginPress = () => {
    if (!fullName) {
      ToastAndroid.show('Kindly Enter Full Name', ToastAndroid.SHORT);
      return;
    }
    if (!email) {
      ToastAndroid.show('Kindly Enter Email Address', ToastAndroid.SHORT);
      return;
    }

    // if (!phoneNumber) {
    //   ToastAndroid.show('Kindly Enter Phonenumber', ToastAndroid.SHORT);
    //   return;
    // }

    let emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    let testEmail = emailReg.test(email);

    if (!testEmail) {
      ToastAndroid.show('Invalid Email Address', ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();

    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('tutorId', data.tutorDetailById[0]?.id);
    // formData.append('tutorId', 70);
    formData.append('phoneNumber', data.tutorDetailById[0]?.phoneNumber);

    setLoading(true);
    console.log(formData,'formData');
    
    axios
      .post(`${Base_Uri}api/appTutorRegister`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        console.log('data signup===>',data);
        
        if (data.status == 200) {
          ToastAndroid.show(
            'You have been successfully registered as tutor Login to continue',
            ToastAndroid.SHORT,
          );
          // navigation.navigate('Login', data);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main', // Change 'Login' to 'Main'
                params: {
                  screen: 'Home',
                },
              },
            ],
          });
          // navigation.replace('Main', {
          //   screen: 'Home',
          // });
          ToastAndroid.show('Register Successfully Successfully', ToastAndroid.SHORT);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };


  
  const openPhoto = async () => {

    setOpenPhotoModal(false)

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
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5,
      };

      const result: any = await launchCamera(options);
      if (result.didCancel) {
        // ('Cancelled image selection');
      } else if (result.errorCode == 'permission') {
        // setToastMsg('Permission Not Satisfied');
      } else if (result.errorCode == 'others') {
        // setToastMsg(result.errorMessage);
      } else {

        let uri = result.assets[0].uri;
        let type = result.assets[0].type;
        let name = result.assets[0].fileName;


        setUri(uri)
        setType(type)
        setName(name)

      }

    }

  }




  const uploadProfilePicture = async () => {


    setOpenPhotoModal(false)

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
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5,
      };
      const result: any = await launchImageLibrary(options);
      if (result.didCancel) {
        // ('Cancelled image selection');
      } else if (result.errorCode == 'permission') {
        // setToastMsg('Permission Not Satisfied');
      } else if (result.errorCode == 'others') {
        // setToastMsg(result.errorMessage);
      } else {

        let uri = result.assets[0].uri;
        let type = result.assets[0].type;
        let name = result.assets[0].fileName;
        setUri(uri)
        setType(type)
        setName(name)
      }
    }
  };

  if (image) {
    imageUrl = image;
  } else if (!tutorDetail.tutorImage) {
    imageUrl = require('../../Assets/Images/avatar.png');
  } else if (tutorDetail.tutorImage.includes('https')) {
    imageUrl = tutorDetail.tutorImage;
  } else {
    imageUrl = `${Base_Uri}public/tutorImage/${tutorDetail.tutorImage}`;
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
        <ScrollView showsHorizontalScrollIndicator={false} style={{height: '100%',}}>
      <Text style={[styles.textType1, {fontSize: 25, color: 'black', marginTop:100}]}>
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
      <View style={{ paddingVertical: 15, }}>
          {imageUrl == 1 ? <Image source={require('../../Assets/Images/avatar.png')} style={{ width: 80, height: 80, borderRadius: 50 }}/>
          :
            <Image
              source={{ uri: name ? `file://${uri}` : `${imageUrl}` }}
              style={{ width: 80, height: 80, borderRadius: 50 }}
              resizeMode="contain"
            />}
            <TouchableOpacity
              onPress={() => setOpenPhotoModal(true)}
              activeOpacity={0.8}>
              <Image
                source={require('../../Assets/Images/plus.png')}
                style={{ width: 20, height: 20, top: -20, left: 55 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
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

        {/* <PhoneInput
          ref={phoneInput}
          placeholder="Enter Your Number"
          defaultValue={phoneNumber}
          defaultCode="PK"
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
        />  */}
      </View>
      {/* Submit Button */}
      {
        openPhotoModal &&
        <ModalImg closeModal={() =>
          setOpenPhotoModal(false)}
          modalVisible={openPhotoModal}
          openCamera={openPhoto}
          openGallery={uploadProfilePicture} />
      }

      <View
        style={{
          borderWidth: 1,
          borderColor: Theme.white,
          marginVertical: 20,
          width: '100%',
          alignSelf:'center'
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
              Register
            </Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
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
