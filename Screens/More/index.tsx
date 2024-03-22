import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import {Base_Uri} from '../../constant/BaseUri';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';

function More({navigation}: any) {
  const context = useContext(TutorDetailsContext);

  const {tutorDetails, setTutorDetail, updateTutorDetails} = context;

  const [modalVisible, setModalVisible] = useState(false);
  const handleFilterPress = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const [apply, setApply] = useState(false);
  const [cancel, setCancel] = useState(false);

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
        if(data.tutorDetailById== null){
          AsyncStorage.removeItem('loginAuth');
          navigation.replace('Login');
          setTutorDetail('')
          ToastAndroid.show('Terminated', ToastAndroid.SHORT);
          return;
        }
        let {tutorDetailById} = data;
        console.log(tutorDetailById, 'iddd');

        let tutorDetails = tutorDetailById[0];

        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          displayName: tutorDetails?.displayName,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails.phoneNumber,
          age: tutorDetails.age,
          nric: tutorDetails.nric,
          tutorImage: tutorDetails.tutorImage,
          tutorId: tutorDetails?.id,
          status: tutorDetails?.status,
        };

        console.log(details, 'details');
        setTutorDetail(details);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  const focus = useIsFocused();
  useEffect(() => {
    if (!tutorDetails) {
      getTutorDetails();
    }
  }, [focus]);

  const ApplyButton = async () => {
    try {
      handleCloseModal();
      await AsyncStorage.removeItem('loginAuth');

      console.log('Item removed successfully');
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      });
      updateTutorDetails('');
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  };
  const CancelButton = () => {
    handleCloseModal();
  };

  let imageUrl = tutorDetails?.tutorImage?.includes('https')
    ? tutorDetails.tutorImage
    : `${Base_Uri}public/tutorImage/${tutorDetails.tutorImage}`;


    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
  
    const [tutorImage , setTutorImage] = useState('')
    const getTutorDetailss = async () => {
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
        })
        .catch(error => {
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
    };
    useEffect(() => {
      getTutorDetailss();
    }, [focus,]);

  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="More" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          {/* Profile */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}>
              {/* <Image
                source={
                  tutorDetails.tutorImage
                    ? {uri: imageUrl}
                    : require('../../Assets/Images/avatar.png')
                }
                style={{height: 60, width: 60, borderRadius: 50}}
              /> */}
               <Image
                source={{uri: tutorImage }}
                style={{height: 60, width: 60, borderRadius: 50}}
              /> 
              
              <View>
                <Text
                  style={{fontSize: 16, fontWeight: '600', color: Theme.black}}>
                  {tutorDetails?.displayName ?? tutorDetails?.full_name}
                </Text>
                <Text
                  style={{fontSize: 14, fontWeight: '300', color: Theme.gray}}>
                  {tutorDetails?.email}
                </Text>
              </View>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* notification */}
          {tutorDetails?.status?.toLowerCase() == 'verified' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.8}
              style={{
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  gap: 15,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#f88222',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={require('../../Assets/Images/notification.png')}
                    style={{height: 15, width: 15}}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Theme.black,
                    fontFamily: 'Circular Std Book',
                  }}>
                  Notification
                </Text>
              </View>
              <Image
                source={require('../../Assets/Images/right.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {/* Students */}
          {tutorDetails?.status?.toLowerCase() == 'verified' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Students')}
              activeOpacity={0.8}
              style={{
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  gap: 15,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'pink',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={require('../../Assets/Images/student2.png')}
                    style={{height: 15, width: 15}}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Theme.black,
                    fontFamily: 'Circular Std Book',
                  }}>
                  Students
                </Text>
              </View>
              <Image
                source={require('../../Assets/Images/right.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {/* Payment History */}
          {tutorDetails?.status?.toLowerCase() == 'verified' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('PaymentHistory')}
              activeOpacity={0.8}
              style={{
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  gap: 15,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'lightgreen',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={require('../../Assets/Images/payment.png')}
                    style={{height: 15, width: 15}}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Theme.black,
                    fontFamily: 'Circular Std Book',
                  }}>
                  Payment
                </Text>
              </View>
              <Image
                source={require('../../Assets/Images/right.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {/*Report Submission History */}
          {tutorDetails?.status?.toLowerCase() == 'verified' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ReportSubmissionHistory')}
              activeOpacity={0.8}
              style={{
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  gap: 15,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'aqua',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={require('../../Assets/Images/report.png')}
                    style={{height: 15, width: 15}}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Theme.black,
                    fontFamily: 'Circular Std Book',
                  }}>
                  Report Submission History
                </Text>
              </View>
              <Image
                source={require('../../Assets/Images/right.png')}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {/*AttendedClassRecords */}
          {tutorDetails?.status?.toLowerCase() == 'verified' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AttendedClassRecords')}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Theme.Dune,
                  padding: 10,
                  borderRadius: 10,
                }}>
                <AntDesign name="copy1" size={15} color={'#fff'} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Theme.black,
                  fontFamily: 'Circular Std Book',
                }}>
                Attended Class Records
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          )}
          {/*Faq */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FAQs')}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'gray',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/faq.png')}
                  style={{height: 15, width: 15}}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Theme.black,
                  fontFamily: 'Circular Std Book',
                }}>
                FAQs
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
         
          {/*Logout */}
          <TouchableOpacity
            onPress={handleFilterPress}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/logout.png')}
                  style={{height: 15, width: 15}}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Theme.black,
                  fontFamily: 'Circular Std Book',
                }}>
                Log Out
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={[
              styles.modalContainer,
              {padding: 30, marginHorizontal: 40},
            ]}>
            <Text
              style={{
                color: Theme.darkGray,
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'Circular Std Book',
              }}>
              Are you sure you want to Quit ?
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginTop: 20,
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPressIn={() => setCancel(true)}
                onPressOut={() => setCancel(false)}
                onPress={CancelButton}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 50,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: cancel ? Theme.darkGray : 'white',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Circular Std Book',
                    color: cancel ? 'white' : Theme.darkGray,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => setApply(true)}
                onPressOut={() => setApply(false)}
                onPress={ApplyButton}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 50,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: apply ? 'white' : Theme.darkGray,
                }}>
                <Text
                  style={{
                    color: apply ? Theme.darkGray : 'white',

                    fontSize: 14,
                    fontFamily: 'Circular Std Book',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: Theme.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  modalText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: Theme.darkGray,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 10,
  },
});

export default More;
