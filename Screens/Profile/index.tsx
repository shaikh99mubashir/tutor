import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import {PermissionsAndroid} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {isAxiosError} from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {touch} from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDownModalView from '../../Component/DropDownModalView';

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
  const context = useContext(TutorDetailsContext);

  let tutorDetail = context?.tutorDetails;

  let {updateTutorDetails} = context;

  // const getTutorDetails = async () => {

  //   setLoading(true)
  //   interface LoginAuth {
  //     status: Number;
  //     tutorID: Number;
  //     token: string;
  //   }
  //   const data: any = await AsyncStorage.getItem('loginAuth');
  //   let loginData: LoginAuth = JSON.parse(data);
  //   let { tutorID } = loginData;

  //   axios
  //     .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
  //     .then(({ data }) => {
  //       let { tutorDetailById } = data;

  //       let tutorDetails = tutorDetailById[0];

  //       let details: ITutorDetails = {
  //         full_name: tutorDetails?.full_name,
  //         email: tutorDetails?.email,
  //         gender: tutorDetails?.gender,
  //         phoneNumber: tutorDetails.phoneNumber,
  //         age: tutorDetails.age,
  //         nric: tutorDetails.nric,
  //       };
  //       setTutorDetail(details);
  //       setLoading(false)
  //     })
  //     .catch(error => {
  //       ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
  //       setLoading(false)
  //     });
  // };

  // useEffect(() => {
  //   getTutorDetails();
  // }, []);

  const generateAndDownalodPdf = async (
    item: any,
  ): Promise<string | undefined> => {
    try {
      const options = {
        html: `<html><body>
        <div>
        <h1>Tutor Name</h1>
        <h2>${item.full_name}</h3>
        </div>
        <div>
        <h1>Tutor Email</h1>
        <h3>${item.email}</h3>
        </div>
        <div>
        <div>
        <h1>Tutor Age</h1>
        <h3>${item.age}</h3>
        </div>
        <div>
        <h1>Tutor Gender</h1>
        <h3>${item.gender ?? 'Not Provided'}</h3>
        </div>
        <div>
        <h1>Tutor NRIC</h1>
        <h3>${item.nric}</h3>
        </div>
        <div>
        <div>
        <h1>Tutor PhoneNumber</h1>
        <h3>${item.phoneNumber}</h3>
        </div>
        
        </body></html>`,
        fileName: `tutor${Math.random()}`,
        directory: 'Downloads',
        base64: false,
      };
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return;
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const {filePath}: any = pdfFile;
      return filePath;
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error;
    }
  };

  console.log(tutorDetail, 'tutorDetail');

  const uploadProfilePicture = async () => {
    const expression: RegExp = /^[A -Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const userEmail: any = email;
    const result: boolean = expression.test(userEmail); // true
    if (!result) {
      ToastAndroid.show('Enter correct email', ToastAndroid.SHORT);
      return;
    }
    console.log('dispalyName',dispalyName);
    
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

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
        setLoading(true);

        let uri = result.assets[0].uri;
        let type = result.assets[0].type;
        let name = result.assets[0].fileName;


        let formData = new FormData();
        formData.append('tutorImage', {
          uri: uri,
          type: type,
          name: name,
        });
        formData.append('tutorID', tutorDetail.tutorId);
        formData.append('name', tutorDetail.full_name);
        formData.append('email', email);
        formData.append('dispalyName', dispalyName);
        formData.append('gender', gender);
        formData.append('nric', nric);
        formData.append('phone', tutorDetail.phoneNumber);
        formData.append('age', age);
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

            setImage(tutorImage);
            tutorDetail.tutorImage = tutorImage;
            updateTutorDetails(tutorDetail);
            ToastAndroid.show(
              'Successfully Update Profile Picture',
              ToastAndroid.SHORT,
            );
          })
          .catch(error => {
            setLoading(false);
            console.log(error);
            ToastAndroid.show(
              'Profile picture update unsuccessfull',
              ToastAndroid.SHORT,
            );
          });
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
  const sendTutorDetails = async () => {
    // try {
    //   const pdfUri: any = await generateAndDownalodPdf(tutorDetail);
    //   await Share.open({
    //     url: `file://${pdfUri}`,
    //     type: 'application/pdf',
    //   });
    // } catch (error) {
    //   console.log('Error generating and downloading the PDF:', error);
    // }
  };

  let imageUrl = image
    ? image
    : !tutorDetail.tutorImage
    ? '../../Assets/Images/plus.png'
    : tutorDetail.tutorImage.includes('https')
    ? tutorDetail.tutorImage
    : `${Base_Uri}public/tutorImage/${tutorDetail.tutorImage}`;

  // console.log(imageUrl, "image")
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    // setOpenPPModal(true)
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({data}) => {
        console.log('res', data.bannerAds);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={Theme.black} />
    </View>
  ) : (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Profile" navigation={navigation} backBtn />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom: 100}}>
          <View style={{paddingVertical: 15, alignItems: 'center'}}>
            <Image
              source={{uri: imageUrl}}
              style={{width: 80, height: 80, borderRadius: 50}}
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
            <View style={{alignItems: 'center'}}>
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
                  // fontWeight: '600',
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
                backgroundColor: Theme.lightGray,
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
                placeholder={tutorDetail?.full_name}
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
                selectedValue={setGender}
                // subTitle="Rate the student's performance in the quizes"
                placeHolder="Select Answer"
                option={genderOption}
                modalHeading="Select Gender"
                style={{borderWidth: 0,marginTop: 0,}}
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
                backgroundColor: Theme.lightGray,
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
                {tutorDetail.age}
              </Text> */}
              {/* <TextInput
                editable
                onChangeText={text => setAge(text)}
                placeholder={tutorDetail.age}
                placeholderTextColor={Theme.black}
              /> */}
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
                {tutorDetail?.nric ? tutorDetail?.nric : 'not Provided'}
              </Text> */}
              {/* <TextInput
                editable
                onChangeText={text => setNric(text)}
                placeholder={tutorDetail?.nric ? tutorDetail?.nric : 'not Provided'}
                placeholderTextColor={Theme.black}
              /> */}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{flex: 1}}>
        <Modal
          visible={openPPModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setOpenPPModal(false)}>
          <View
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
              <TouchableOpacity onPress={() => setOpenPPModal(false)}>
                <View
                  style={{
                    alignItems: 'flex-end',
                    paddingVertical: 10,
                    paddingRight: 15,
                  }}>
                  <AntDesign name="closecircleo" size={20} color={'black'} />
                </View>
              </TouchableOpacity>
              {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
              <Image
                source={require('../../Assets/Images/Returnoninstallment.png')}
                style={{
                  width: Dimensions.get('screen').width / 1.1,
                  height: '80%',
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      </View>
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
            onPress={uploadProfilePicture}
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
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
