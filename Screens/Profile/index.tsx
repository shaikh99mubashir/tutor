import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {isAxiosError} from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {touch} from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDownModalView from '../../Component/DropDownModalView';
import bannerContext from '../../context/bannerContext';
import ModalImg from '../../Component/Modal/modal';
import CustomLoader from '../../Component/CustomLoader';
import { useIsFocused } from '@react-navigation/native';

const Profile = ({navigation}: any) => {
  interface ITutorDetails {
    full_name: string | undefined;
    email: string | undefined;
    gender: string | undefined;
    phoneNumber: string | undefined;
    age: any;
    nric: string | undefined;
  }

  // const [tutorDetail, setTutorDetail] = useState<ITutorDetails>({
  //   full_name: '',
  //   email: '',
  //   gender: '',
  //   phoneNumber: '',
  //   age: null,
  //   nric: '',
  // });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [email, setEmail] = React.useState('');
  const [dispalyName, setDispalyName] = React.useState('');
  const [nric, setNric] = React.useState('');
  const [age, setAge] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [uri, setUri] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const context = useContext(TutorDetailsContext);
  const focus = useIsFocused();

  let tutorDetail = context?.tutorDetails;
  let tutorDetails = context?.tutorDetails;
  console.log('tutorDetails', tutorDetails);
  console.log('tutorDetail', tutorDetail);
  let bannerCont = useContext(bannerContext);

  let {profileBanner, setProfileBanner}: any = bannerCont;

  let {updateTutorDetails, setTutorDetail} = context;

  const openPhoto = async () => {
    setOpenPhotoModal(false);

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

        setUri(uri);
        setType(type);
        setName(name);
      }
    }
  };

  const uploadProfilePicture = async () => {
    setOpenPhotoModal(false);

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

        setUri(uri);
        setType(type);
        setName(name);
      }
    }
  };

  const genderOption = [
    {
      option: 'Male',
    },
    {
      option: 'Female',
    },
  ];

  let imageUrl;
  const updateTutorDetail = async () => {
    // const expression: RegExp = /^[A -Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // const userEmail: any = tutorDetail.email;
    // const result: boolean = expression.test(userEmail); // true
    // if (!result) {
    //   ToastAndroid.show('Enter correct email', ToastAndroid.SHORT);
    //   return;
    // }
    let authData: any = await AsyncStorage.getItem('loginAuth');
    let tutorData: any = JSON.parse(authData);
    console.log('tutorData.tutorID', tutorData.tutorID);
    if (uri && name && type) {
      console.log('uri', uri);
      console.log('type', type);
      console.log('name', uri);
      console.log('If running', tutorDetail?.tutorId);

      setLoading(true);

      tutorDetail.displayName = dispalyName
        ? dispalyName
        : tutorDetail.displayName;
      tutorDetail.email = email ? email : tutorDetail.email;
      tutorDetail.age = age ? age : tutorDetail.age;
      tutorDetail.nric = nric ? nric : tutorDetail.nric;

      let formData = new FormData();
      formData.append('tutorImage', {
        uri: uri,
        type: type,
        name: name,
      });
      formData.append('id', tutorData.tutorID);
      formData.append('full_name', tutorDetail?.full_name);
      formData.append('email', tutorDetail?.email);
      formData.append('displayName', tutorDetail?.displayName);
      formData.append('gender', tutorDetail?.gender);
      formData.append('nric', tutorDetail?.nric);
      formData.append('phone', tutorDetail?.phoneNumber);
      formData.append('age', tutorDetail?.age);
      console.log('formData', formData);

      axios
        .post(`${Base_Uri}api/editTutorProfile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({data}) => {
          setLoading(false);
          let {response} = data;
          let {tutorImage} = response;
          console.log('response', response);

          setImage(tutorImage);
          tutorDetail.tutorImage = tutorImage;
          setTutorDetail({...tutorDetail, tutorImage: tutorImage});
          setUri('');
          setType('');
          setName('');

          console.log('image', image);

          if (image) {
            imageUrl = image;
          } else if (tutorDetail?.tutorImage?.includes('https')) {
            imageUrl = tutorDetail?.tutorImage;
          } else {
            imageUrl = `${Base_Uri}public/tutorImage/${tutorDetail?.tutorImage}`;
          }
          console.log('imageUrl', imageUrl);
          getTutorDetails()
          ToastAndroid.show(
            'Successfully Update Tutor Details',
            ToastAndroid.SHORT,
          );
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          ToastAndroid.show(
            'Tutor Details update unsuccessfull',
            ToastAndroid.SHORT,
          );
        });
    } else {
      console.log('Else running profile');
      setLoading(true);
      tutorDetail.displayName = dispalyName
        ? dispalyName
        : tutorDetail.displayName;
      tutorDetail.email = email ? email : tutorDetail.email;
      tutorDetail.age = age ? age : tutorDetail.age;
      tutorDetail.nric = nric ? nric : tutorDetail.nric;
      console.log('tutorDetail?.tutorId', tutorDetail?.tutorId);

      let formData = new FormData();
      // formData.append('tutorID', tutorDetail?.tutorId);
      formData.append('id', tutorData.tutorID);
      formData.append('name', tutorDetail?.full_name);
      formData.append('email', tutorDetail?.email);
      formData.append('displayName', tutorDetail?.displayName);
      formData.append('gender', tutorDetail?.gender);
      formData.append('nric', tutorDetail?.nric);
      formData.append('phone', tutorDetail?.phoneNumber);
      formData.append('age', tutorDetail?.age);
      axios
        .post(`${Base_Uri}api/editTutorProfile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({data}) => {
          setLoading(false);
          let {response} = data;
          setTutorDetail({
            ...tutorDetail,
            displayName: tutorDetail.displayName,
            email: tutorDetail.email,
            nric: tutorDetail.nric,
            age: tutorDetail.age,
          });
          ToastAndroid.show(
            'Successfully Update Tutor Details',
            ToastAndroid.SHORT,
          );
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          ToastAndroid.show(
            `Tutor Details update unsuccessfull ${error}`,
            ToastAndroid.SHORT,
          );
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
        });
    }
  };

  // console.log(`file://${name}`)

  // let imageUrl = image
  //   ? image
  //   : !tutorDetail.tutorImage
  //     ? defaultAvatar
  //     : tutorDetail.tutorImage.includes('https')
  //       ? tutorDetail.tutorImage
  //       : `${Base_Uri}public/tutorImage/${tutorDetail.tutorImage}`;

  // console.log(imageUrl, "image")
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({data}) => {
        // console.log('res', data.bannerAds);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const linkToOtherPage = () => {
    if (profileBanner.callToActionType == 'Open URL') {
      Linking.openURL(profileBanner.urlToOpen);
    } else if (profileBanner.callToActionType == 'Open Page')
      if (profileBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (profileBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (profileBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (profileBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (profileBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (profileBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (profileBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (profileBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (profileBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  const closeBannerModal = async () => {
    if (profileBanner.displayOnce == 'on') {
      let bannerData = {...profileBanner};

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('profileBanner', stringData);
      setProfileBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  // if (image) {
  //   imageUrl = image;
  // } else if (tutorDetail?.tutorImage?.includes('https')) {
  //   imageUrl = tutorDetail?.tutorImage;
  // } else {
  //   imageUrl = `${Base_Uri}public/tutorImage/${tutorDetail?.tutorImage}`;
  // }

  if (image) {
    imageUrl = image;
  } else if (!tutorDetail?.tutorImage) {
    imageUrl = tutorDetails?.tutorDetailById?.tutorImage;
    // imageUrl =  tutorDetails?.tutorDetailById[0]?.tutorImage
  } else if (tutorDetail?.tutorImage?.includes('https')) {
    imageUrl = tutorDetail?.tutorImage;
  } else {
    imageUrl = `${Base_Uri}public/tutorImage/${tutorDetail?.tutorImage}`;
  }

  // console.log("tutorDetails?.tutorDetailById[0]?.tutorImage",tutorDetails?.tutorDetailById[0]?.tutorImage);

  console.log('name', name);
  console.log('uri', uri);
  console.log('imageUrl', imageUrl);

  const [tutorId, setTutorId] = useState<Number | null>(null);
  
  interface LoginAuth {
    status: Number;
    tutorID: Number;
    token: string;
  }

  const [tutorImage , setTutorImage] = useState('')
  const getTutorDetails = async () => {
    setLoading(true)
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);

    let {tutorID} = loginData;
    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
      .then(({data}) => {
        let {tutorDetailById} = data;
        let tutorDetails = tutorDetailById[0];
        console.log('tutorDetails', tutorDetails);
        setTutorImage(tutorDetails.tutorImage)
        setLoading(false)
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        setLoading(false)
      });
  };
  useEffect(() => {
    getTutorDetails();
  }, [focus,]);


  const handleNricChange = (text: string) => {
    // Remove non-numeric characters and limit the length to 12 characters
    const formattedInput = text.replace(/\D/g, '').slice(0, 12);

    // Check if the length is greater than 6 to insert "-" after the first six digits
    if (formattedInput.length >= 6) {
        const firstPart = formattedInput.slice(0, 6);
        let secondPart = '';
        let thirdPart = '';

        // Check if the length is greater than 8 to insert "-" after the next two digits
        if (formattedInput.length >= 8) {
            secondPart = formattedInput.slice(6, 8);
            // If there are more than 8 characters, add the remaining characters to the third part
            if (formattedInput.length > 8) {
                thirdPart = formattedInput.slice(8);
            }
        } else {
            secondPart = formattedInput.slice(6);
        }
        
        // Combine the parts with hyphens
        setNric(`${firstPart}${formattedInput.length > 6 ? '-' : ''}${secondPart}${thirdPart ? '-' + thirdPart : ''}`);
    } else {
        setNric(formattedInput);
    }
};




  return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <ActivityIndicator size="large" color={Theme.black} />
    //   </View>
    // ) : (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Profile" navigation={navigation} backBtn />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom: 20}}>
        {/* <Image
              source={{uri: tutorImage}}
              style={{width: 90, height: 90, borderRadius: 50}}
              resizeMode="contain"
            /> */}

          <View style={{paddingVertical: 15, alignItems: 'center'}}>
            {/* {imageUrl == 1 ? <Image source={require('../../Assets/Images/avatar.png')} style={{ width: 80, height: 80, borderRadius: 50 }}/>
          : */}
            {/* <Image
              source={{uri: name ? `file://${uri}` : `${imageUrl}`}}
              style={{width: 90, height: 90, borderRadius: 50}}
              resizeMode="contain"
            /> */}
            <Image
              source={{uri: name ? `file://${uri}` : `${tutorImage}` ? `${tutorImage}` : `${imageUrl}`}}
              style={{width: 90, height: 90, borderRadius: 50}}
              resizeMode="contain"
            />

            <TouchableOpacity
              onPress={() => setOpenPhotoModal(true)}
              activeOpacity={0.8}>
              <Image
                source={require('../../Assets/Images/plus.png')}
                style={{width: 20, height: 20, top: -20, left: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{fontSize: 18,    fontFamily: 'Circular Std Book',
                 fontWeight: '600', color: Theme.black, textTransform:'capitalize'}}>
                {tutorDetail?.displayName
                  ? tutorDetail?.displayName
                  : tutorDetail?.full_name}
              </Text>
              <Text
                style={{fontSize: 16, fontWeight: '300', color: Theme.gray}}>
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
                backgroundColor: Theme.liteBlue,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  // fontWeight: '600',
                  marginTop: 5,
                  textTransform:'capitalize'
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
                backgroundColor: Theme.liteBlue,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              {/* <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.email}
              </Text> */}
              <TextInput
                editable
                onChangeText={text => setEmail(text)}
                placeholder={tutorDetail?.email}
                style={{color: 'black',fontFamily: 'Circular Std Book', fontSize: 16,textTransform:'capitalize'}}
                placeholderTextColor={Theme.black}
              />
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
                backgroundColor: Theme.liteBlue,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              {/* <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  // fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.full_name}
              </Text> */}
              <TextInput
                editable
                onChangeText={text => setDispalyName(text)}
                placeholder={tutorDetail?.displayName}
                style={{color: 'black', fontFamily: 'Circular Std Book',
                fontSize: 16,textTransform:'capitalize'}}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>
          {/* MObile number*/}
          <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                // fontWeight: '600',
              }}>
              Mobile Number
            </Text>
            <View
              style={{
                backgroundColor: Theme.liteBlue,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontFamily: 'Circular Std Book',
                  fontSize: 16,
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
                backgroundColor: Theme.liteBlue,
                // paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              {/* <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {tutorDetail?.gender ? tutorDetail?.gender : 'not provided'}
              </Text> */}
              <DropDownModalView
                // title="Gender"
                selectedValue={(e: any) =>
                  setTutorDetail({...tutorDetail, gender: e.option})
                }
                // subTitle="Rate the student's performance in the quizes"
                placeHolder="Select Answer"
                option={genderOption}
                value={tutorDetail.gender}
                modalHeading="Select Gender"
                style={{
                  borderWidth: 0,
                  marginTop: 0,
                  fontSize: 18,
                  color: 'black',
                }}
              />
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
                backgroundColor: Theme.liteBlue,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black', textTransform: 'capitalize',    fontFamily: 'Circular Std Book',
                fontSize: 16,}}
                keyboardType="numeric"
                onChangeText={text => setAge(text)}
                placeholder={
                  tutorDetail?.age
                    ? tutorDetail?.age.toString()
                    : 'Not Provided'
                }
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>
          {/* Nric*/}
          <View style={{marginBottom: 10}}>
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
                backgroundColor: Theme.liteBlue,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black',    fontFamily: 'Circular Std Book',
                fontSize: 16,}}
                onChangeText={(text) => handleNricChange(text)}
                keyboardType="numeric"
                value={nric}
                maxLength={14}
                placeholder={
                  tutorDetail?.nric == null ? 'Not Provided' :tutorDetail?.nric 
                }
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {Object.keys(profileBanner).length > 0 &&
        (profileBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{flex: 1}}>
            <Modal
              visible={openPPModal}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={linkToOtherPage}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    // padding: 15,
                    borderRadius: 5,
                    marginHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesign
                        name="closecircleo"
                        size={20}
                        color={'black'}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{uri: profileBanner.bannerImage}}
                    style={{
                      width: Dimensions.get('screen').width / 1.05,
                      height: '90%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}

      {openPhotoModal && (
        <ModalImg
          closeModal={() => setOpenPhotoModal(false)}
          modalVisible={openPhotoModal}
          openCamera={openPhoto}
          openGallery={uploadProfilePicture}
        />
      )}

      {/* Submit Button */}
      <View
        style={{
          backgroundColor: Theme.white,
          // position: 'absolute',
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
            onPress={() => updateTutorDetail()}
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
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <Modal visible={loading} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <ActivityIndicator size={'large'} color={Theme.darkGray} />
        </View>
      </Modal> */}

      <CustomLoader visible={loading} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
