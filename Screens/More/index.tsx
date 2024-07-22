import React, { useState, useContext, useEffect } from 'react';
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
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import TutorProfileIcon from '../../SVGs/TutorProfileIcon';
import PaymentIcon from '../../SVGs/PaymentIcon/PaymentIcon';
import NotificationIcon from '../../SVGs/NotificationIcon';
import StudentListIcon from '../../SVGs/StudentListIcon';
import StudentReportIcon from '../../SVGs/StudentReportIcon';
import LogoutIcon from '../../SVGs/LogoutIcon';
import CustomButton from '../../Component/CustomButton';
import StudentOverviewIcon from '../../SVGs/StudentOverviewIcon';

function More({ navigation }: any) {
  const context = useContext(TutorDetailsContext);

  const { tutorDetails, setTutorDetail, updateTutorDetails } = context;

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

    let { tutorID } = loginData;

    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
      .then(({ data }) => {
        if (data.tutorDetailById == null) {
          AsyncStorage.removeItem('loginAuth');
          navigation.replace('Login');
          setTutorDetail('')
          ToastAndroid.show('Terminated', ToastAndroid.SHORT);
          return;
        }
        let { tutorDetailById } = data;
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

  const [tutorImage, setTutorImage] = useState('')
  const getTutorDetailss = async () => {
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);

    let { tutorID } = loginData;
    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;
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
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
      <Header title="Profile" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          {/* Profile */}
          <View style={{ margin: 10 }}></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View>
              <Image
                source={{ uri: tutorImage }}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: Theme.darkGray,
                }}
              />
            </View>
            <View>
              {tutorDetails?.status?.toLowerCase() == 'verified' &&
                <View
                  style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                  <Text style={[styles.textType3,]}>Verified Tutor</Text>
                  <Image source={require('../../Assets/Images/verified.png')} />
                </View>
              }
              <Text style={[styles.textType1, { lineHeight: 35, fontSize: 24 }]}>
                {tutorDetails?.displayName ?? tutorDetails?.full_name}
              </Text>
              <Text style={[styles.textType3, { fontFamily: 'Circular Std Book' }]}>{tutorDetails?.email}</Text>
            </View>
          </View>

          <View style={{ margin: 20 }}></View>
          {/* dashboard */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={[
                styles.textType3,
                { paddingBottom: 10, fontFamily: 'Circular Std Book', color: Theme.IronsideGrey },
              ]}>
              Dashboard
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profile')}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              {/* <Image source={require('../../Images/tutorProfile.png')} /> */}
              <TutorProfileIcon />
              <Text style={[styles.textType3, { color: Theme.darkGray }]}>Tutor Profile</Text>
            </TouchableOpacity>
            {tutorDetails?.status?.toLowerCase() == 'verified' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}>
                <NotificationIcon />
                <Text style={[styles.textType3]}>Notification</Text>
              </TouchableOpacity>
            )}
            {tutorDetails?.status?.toLowerCase() == 'verified' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('PaymentHistory')}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}>
                <PaymentIcon />
                <Text style={[styles.textType3]}>Payment History</Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Theme.lineColor,
                paddingBottom: 20,
              }}></View>
          </View>
          {tutorDetails?.status?.toLowerCase() == 'verified' && (
          <View style={{ marginBottom: 30 }}>
            <Text
              style={[
                styles.textType3,
                { paddingBottom: 10, fontFamily: 'Circular Std Book', color: Theme.IronsideGrey },
              ]}>
              Students
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Students')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <StudentListIcon />
              <Text style={[styles.textType3]}>Students List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ReportSubmissionHistory')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <StudentReportIcon />
              <Text style={[styles.textType3]}>Students Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AttendedClassRecords')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <StudentOverviewIcon />
              <Text style={[styles.textType3]}>Students Class Records</Text>
            </TouchableOpacity>
            
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Theme.lineColor,
                paddingBottom: 20,
              }}></View>
          </View>
          )}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={[
                styles.textType3,
                { paddingBottom: 10, fontFamily: 'Circular Std Book', color: Theme.IronsideGrey },
              ]}>
              Support
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('FAQs')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <StudentListIcon />
              <Text style={[styles.textType3]}>FAQ’s</Text>
            </TouchableOpacity>

          
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Theme.lineColor,
                paddingBottom: 20,
              }}></View>
          </View>
           {/* Logout */}
        <View style={{paddingHorizontal: 0, marginBottom: 30}}>
          <TouchableOpacity
           onPress={handleFilterPress}
            style={{
              flexDirection: 'row',
              gap: 10,
              paddingVertical: 0,
              alignItems: 'center',
            }}>
            <LogoutIcon />
            <Text style={[styles.textType3]}>Logout</Text>
          </TouchableOpacity>
          <View
            style={{
              paddingBottom: 20,
            }}></View>
        </View>
         
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.9)',
          }}>
          <View
            style={[
              styles.modalContainer,
              {padding: 30, marginHorizontal: 20,},
            ]}>
            <Text style={styles.textType1}>Logout?</Text>
            <View style={{margin: 5}}></View>
            <Text style={styles.textType3}>
              Are you sure you want to Logout?
            </Text>
            <View style={{margin: 15}}></View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 8,
              }}>
              <View style={{width: '48%'}}>
                <CustomButton
                  btnTitle="Cancel"
                  backgroundColor={Theme.WhiteSmoke}
                  color={Theme.Black}
                  onPressIn={() => setCancel(true)}
                  onPressOut={() => setCancel(false)}
                  onPress={CancelButton}
                />
              </View>
              <View style={{width: '48%'}}>
                <CustomButton btnTitle="Ok"   onPressIn={() => setApply(true)}
                onPressOut={() => setApply(false)}
                onPress={ApplyButton} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={[
              styles.modalContainer,
              { padding: 30, marginHorizontal: 40 },
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
      </Modal> */}
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
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
    fontStyle: 'normal',
  },
  textType1: {
    fontWeight: '500',
    fontSize: 26,
    color: Theme.Black,
    fontFamily: 'Circular Std Medium',
    lineHeight: 24,
    fontStyle: 'normal',
  },
});

export default More;
