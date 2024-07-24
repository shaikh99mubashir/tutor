import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  View,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Dimensions
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentContext from '../../context/studentContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import CustomLoader from '../../Component/CustomLoader';
import SubjectIcon from '../../SVGs/SubjectIcon';
const Students = ({ navigation }: any) => {

  const context = useContext(StudentContext)

  let student = context.students
  let bannerCont = useContext(bannerContext)

  let { studentBanner, setStudentBanner } = bannerCont
  const tutorDetailsContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutorDetailsContext


  console.log("student student", student);



  const [students, setstudents] = useState([]);
  const [loading, setLoading] = useState(false)
  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');



  useEffect(() => {

    setstudents(student)

  }, [])


  const linkToOtherPage = () => {

    if (studentBanner.callToActionType == "Open URL") {
      Linking.openURL(studentBanner.urlToOpen);
    }
    else if (studentBanner.callToActionType == "Open Page")

      if (studentBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }
      else if (studentBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (studentBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (studentBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (studentBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (studentBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (studentBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (studentBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (studentBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }

  const searchStudent = (e: any) => {
    setSearchText(e);
    let filteredItems: any = students.filter((x: any) => {
      return (
        x?.studentName?.toLowerCase()?.includes(e?.toLowerCase()) ||
        x?.studentID?.toString().toLowerCase().includes(e?.toLowerCase())
      )
    });
    setFoundName(filteredItems);
  };
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true)
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => {
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const closeBannerModal = async () => {

    if (studentBanner.displayOnce == "on") {

      let bannerData = { ...studentBanner }

      let stringData = JSON.stringify(bannerData)

      let data = await AsyncStorage.setItem("studentBanner", stringData)
      setStudentBanner([])
      setOpenPPModal(false)
    } else {
      setOpenPPModal(false)
    }
  }


  return (
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
      <CustomLoader visible={loading} />
      <Header title="Student" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          {/* Search */}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                backgroundColor: Theme.white,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginVertical: 15,
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor="black"
                onChangeText={e => searchStudent(e)}
                style={{ width: '90%', padding: 8, fontFamily: 'Circular Std' }}
              />
              <TouchableOpacity onPress={() => navigation}>
                <Image
                  source={require('../../Assets/Images/search.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {students && students.length > 0 ? (
            <View>
              <FlatList
                data={searchText && foundName.length > 0 ? foundName : students}
                nestedScrollEnabled
                renderItem={({ item, index }: any) => {
                  console.log("item", item);

                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('StudentsDetails', item)}
                        activeOpacity={0.8}
                        style={{
                          borderWidth: 1,
                          borderRadius: 20,
                          marginBottom: 10,
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderColor: Theme.shinyGrey,
                          borderBottomColor: Theme.shinyGrey,
                          backgroundColor: Theme.white,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            borderColor: Theme.shinyGrey,
                          }}>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                            <View>
                              {item.studentGender.toLowerCase() == 'male' ?
                                <Image source={require('../../Assets/Images/StudentMale.png')} />
                                :
                                <Image source={require('../../Assets/Images/StudentFemale.png')} />

                              }
                            </View>
                            <View>
                              <Text style={[styles.textType3, { color: Theme.Primary }]}>
                                {item.uid}
                              </Text>
                              <Text
                                style={[
                                  styles.textType1,
                                  { lineHeight: 30, fontSize: 22 },
                                ]}>
                                {item.studentName}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            borderWidth: 0.4,
                            borderColor: Theme.lineColor,
                            marginTop: 15,
                          }}></View>
                        <View
                          style={{
                            paddingVertical: 10,
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                gap: 10,
                              }}>
                              {/* <AntDesign name="copy1" size={20} color={Theme.darkGray} /> */}
                              <SubjectIcon/>
                              <Text
                                style={[styles.textType3, { color: Theme.IronsideGrey }]}>
                                Subject Subscribed
                              </Text>
                            </View>
                            <View style={{
                              backgroundColor: Theme.lightBlue, borderRadius: 50, paddingVertical: 2,
                              width: 30,
                              height: 30,
                            }}>

                              <Text
                                style={[
                                  styles.textType1,
                                  {
                                    color: Theme.DarkBlue,
                                    textAlign: 'center',
                                    fontSize: 18,
                                  },
                                ]}>
                                {item?.subjectCount}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        onPress={() => navigation.navigate('StudentsDetails', item)}
                        activeOpacity={0.8}
                        key={index}
                        style={{
                          borderWidth: 1,
                          paddingHorizontal: 15,
                          marginTop: 10,
                          paddingVertical: 15,
                          borderRadius: 10,
                          gap: 10,
                          marginRight: 10,
                          borderColor: '#eee',
                          width: '100%',
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 15,
                            alignItems: 'center',
                          }}>
                          <Image
                            source={require('../../Assets/Images/woman.png')}
                            style={{
                              width: 45,
                              height: 45,
                              borderRadius: 50,
                            }}
                          />
                          <View>
                            <Text style={{ color: Theme.gray, fontSize: 16, fontFamily: 'Circular Std Medium', }}>
                              {item.uid}
                            </Text>
                            <Text style={{ color: Theme.black, fontSize: 18, fontFamily: 'Circular Std Medium', }}>
                              {item.studentName}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity> */}
                    </>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{ marginTop: 35 }}>
              <Text
                style={{ color: Theme.black, fontSize: 14, textAlign: 'center', fontFamily: 'Circular Std Black' }}>
                No Student Found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {Object.keys(studentBanner).length > 0 && (studentBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
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
                <View style={{ alignItems: 'flex-end', paddingVertical: 10, paddingRight: 15 }}>
                  <AntDesign
                    name="closecircleo"
                    size={20}
                    color={'black'}
                  />
                </View>
              </TouchableOpacity>
              {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
              <Image source={{ uri: studentBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.1, height: '80%', }} resizeMode='contain' />

            </View>

          </TouchableOpacity>
        </Modal>
      </View>}
    </View>
  );
};

export default Students;

const styles = StyleSheet.create({
  textType3: {
    color: Theme.Dune,
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
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
