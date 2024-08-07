import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  RefreshControl,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import { Theme } from '../../constant/theme';
import AntDesign from 'react-native-vector-icons/EvilIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';
import CustomHeader from '../../Component/Header';
import { Base_Uri } from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import upcomingClassContext from '../../context/upcomingClassContext';
import moment from 'moment';
import scheduleContext from '../../context/scheduleContext';
import AntDesig from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StudentContext from '../../context/studentContext';
import CustomLoader from '../../Component/CustomLoader';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ScheduleIcon from '../../SVGs/ScheduleIcon';
import CustomButton from '../../Component/CustomButton';
import SubjectIcon from '../../SVGs/SubjectIcon';
import Toast from 'react-native-toast-message';

// import { ScrollView } from "react-native-gesture-handler"

function Schedule({ navigation, route }: any) {
  let data = route?.params;

  let focus = useIsFocused();

  let context = useContext(scheduleContext);
  let bannerCont = useContext(bannerContext);
  const tutorDetailsContext = useContext(TutorDetailsContext);

  let { tutorDetails } = tutorDetailsContext;

  let { schedulePageBannner, setSchedulePageBanner } = bannerCont;

  let { scheduleData, setScheduleData } = context;
  let { upcomingClass, setUpcomingClass } = context;
  const studentAndSubjectContext = useContext(StudentContext);
  const [loading, setLoading] = useState(false);
  // const [scheduleData, setScheduleData] = useState<any>([]);
  const [tutorId, setTutorId] = useState<Number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState({});

  const [mode, setMode] = useState<any>('date');
  const [confirm, setConfirm] = useState(false);
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const { students, subjects, updateStudent, updateSubject } =
    studentAndSubjectContext;
  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setOpenPPModal(true);
      setRefresh(!refresh);
      getTutorId();
    }, 2000);
  }, [refresh]);

  // console.log(data, 'routeeee');

  useEffect(() => {
    if (!focus) {
      setUpcomingClass([]);
    }

    if (focus) {
      let now = new Date();

      let date = now.getDate();
      let month = now.getMonth();
      let year = now.getFullYear();

      let selectday = selectedDate.getDate();
      let selectMonth = selectedDate.getMonth();
      let selectYear = selectedDate.getFullYear();

      if (date !== selectday || selectMonth !== month || selectYear !== year) {
        setSelectedDate(new Date());
      }
    }
  }, [focus]);

  useEffect(() => {
    let now = new Date();

    let date = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();

    let selectday = selectedDate.getDate();
    let selectMonth = selectedDate.getMonth();
    let selectYear = selectedDate.getFullYear();

    if (date !== selectday || selectMonth !== month || selectYear !== year) {
      setUpcomingClass([]);
    }
  }, [selectedDate]);

  // console.log(upcomingClass, "upcomingClass")
  // console.log(scheduleData, "scheduleData")

  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => {
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const getScheduledData = async () => {
    setLoading(true);
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let { tutorID } = loginData;

    if (upcomingClass && Object.keys(upcomingClass).length > 0) {
      axios
        .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
        .then(res => {
          let scheduledClasses = res.data;

          let { classSchedulesTime } = scheduledClasses;
          let checkRouteClass =
            classSchedulesTime &&
            classSchedulesTime.length > 0 &&
            classSchedulesTime.filter((e: any, i: number) => {
              return e?.id == data?.id;
            });
          checkRouteClass =
            checkRouteClass &&
            checkRouteClass.length > 0 &&
            checkRouteClass.map((e: any, i: number) => {
              return {
                ...e,
                imageUrl: require('../../Assets/Images/student.png'),
              };
            });
          setUpcomingClass(
            checkRouteClass && checkRouteClass.length > 0
              ? checkRouteClass
              : [],
          );
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
      return;
    }
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(({ data }) => {
        let { classSchedulesTime } = data;
        let Date = selectedDate.getDate();
        let month = selectedDate.getMonth();
        let year = selectedDate.getFullYear();

        classSchedulesTime =
          classSchedulesTime && classSchedulesTime.length > 0
            ? classSchedulesTime
              .map((e: any, i: number) => {
                let getDate: any = moment(e.date);

                let convertDate = getDate.toDate();
                let scheduleDate = convertDate.getDate();
                let scheduleMonth = convertDate.getMonth();
                let scheduleYear = convertDate.getFullYear();

                if (
                  Date == scheduleDate &&
                  month == scheduleMonth &&
                  year == scheduleYear
                ) {
                  return {
                    ...e,
                    imageUrl: require('../../Assets/Images/student.png'),
                  };
                } else {
                  return false;
                }
              })
              .filter(Boolean)
            : [];
        // classSchedulesTime =
        // classSchedulesTime && classSchedulesTime.length > 0
        //   ? classSchedulesTime.map((e:any) => ({
        //       ...e,
        //       imageUrl: require("../../Assets/Images/student.png"),
        //     }))
        //   : [];
        setLoading(false);
        let dataToSend = [...classSchedulesTime];
        setScheduleData(dataToSend);
      })
      .catch(error => {
        setLoading(false);
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    if (refresh || selectedDate || data || scheduleData.length == 0) {
      getScheduledData();
    }
  }, [refresh, data, selectedDate, focus]);

  const onChange = (event: any, selectedDate: any) => {
    setShow(false);
    const currentDate: any = selectedDate;
    setSelectedDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const handleSelectPress = (index: Number, item: any) => {
    console.log("item schedule", item);
    if (classInProcess && Object.keys(classInProcess).length > 0 && item.status == 'On going') {
      navigation.navigate('ClassTimerCount', classInProcess)
    }

    if (upcomingClass && upcomingClass.length > 0) {
      let myData = upcomingClass.map((e: any, i: Number) => {
        if (i == index) {
          return {
            ...e,
            selected: e?.selected ? false : true,
          };
        } else {
          return {
            ...e,
            selected: false,
          };
        }
      });
      setUpcomingClass(myData);
    }

    let data = scheduleData.map((e: any, i: Number) => {
      if (i == index) {
        return {
          ...e,
          selected: e?.selected ? false : true,
        };
      } else {
        return {
          ...e,
          selected: false,
        };
      }
    });

    setScheduleData(data);
  };

  const navigateToEditScreen = (status: any) => {
    if (status == 'schedule') {
      navigation.navigate('EditScheduleClass', {
        data: selectedData,
        schedule: true,
      });
      setConfirm(false);
    } else if (status == 'postponed') {
      navigation.navigate('EditPostpondClass', {
        data: selectedData,
        postpond: true,
      });
      setConfirm(false);
    } else if (status == 'cancelled') {
      navigation.navigate('EditCancelledClass', {
        data: selectedData,
        cancelled: true,
      });
      setConfirm(false);
    } else {
      navigation.navigate('EditAttendedClass', {
        data: selectedData,
        attended: true,
      });
      setConfirm(false);
    }
  };

  const closeBannerModal = async () => {
    if (schedulePageBannner.displayOnce == 'on') {
      let bannerData = { ...schedulePageBannner };

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('scheduleBanners', stringData);
      setSchedulePageBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  const confirmModal = useCallback(() => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirm}
          // style={{backgroundColor:'rgb(0,0,0,0.5)'}}
          onRequestClose={() => {
            setConfirm(false);
          }}>
          <TouchableWithoutFeedback onPress={() => setConfirm(false)}>
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  {
                    backgroundColor: Theme.white,
                    alignItems: 'flex-start',
                    padding: 25,
                    paddingVertical: 10,
                  },
                ]}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      marginTop: 20,
                      fontSize: 16,
                      textAlign: 'left',
                      fontWeight: '600',
                    },
                  ]}>
                  Select Status
                </Text>
                {/* <TouchableOpacity
                onPress={() => navigateToEditScreen('schedule')}
                style={{width: '100%'}}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: Theme.black,
                      paddingVertical: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: Theme.lightGray,
                      width: '100%',
                    },
                  ]}>
                  Schedule
                </Text>
              </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => navigateToEditScreen('postponed')}
                  style={{ width: '100%' }}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: Theme.black,
                        paddingVertical: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: Theme.lightGray,
                        width: '100%',
                      },
                    ]}>
                    Postponed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigateToEditScreen('cancelled')}
                  style={{ width: '100%' }}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: Theme.black,
                        paddingVertical: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: Theme.lightGray,
                        width: '100%',
                      },
                    ]}>
                    Cancelled
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => navigateToEditScreen('attended')}
                  style={{width: '100%'}}>
                  <Text
                    style={[
                      styles.text,
                      {color: Theme.black, paddingTop: 20, width: '100%'},
                    ]}>
                    Attended
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }, [confirm, selectedData]);

  const handleEditPress = (item: any): any => {
    setConfirm(true);
    setSelectedData(item);
  };

  const routeToClockIn = async (item: any) => {
    // console.log('item', item);

    const currentTime: any = new Date();

    const startTimeStr = item.startTime;
    const startTimeParts = startTimeStr.split(':');
    const startTime: any = new Date();
    startTime.setHours(parseInt(startTimeParts[0], 10));
    startTime.setMinutes(parseInt(startTimeParts[1], 10));
    startTime.setSeconds(parseInt(startTimeParts[2], 10));

    const timeDifferenceMs = startTime - currentTime;
    const hours = Math.floor(
      (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    // if (hours > 1) {
    //   ToastAndroid.show(
    //     `There is ${hours} hours remaining in class`,
    //     ToastAndroid.SHORT,
    //   );
    //   return;
    // }

    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    if (data && Object.keys(data).length > 0) {
      // ToastAndroid.show(
      //   'Cannot attend another class your class is already in process',
      //   ToastAndroid.SHORT,
      // );
      Toast.show({
        type: 'info',
        // text1: 'Request timeout:',
        text2:  `Cannot attend another class your class is already in process`,
        position:'bottom'
      });
    } else {
      navigation.navigate('ClockIn', item);
    }
  };

  const linkToOtherPage = () => {
    if (schedulePageBannner.callToActionType == 'Open URL') {
      Linking.openURL(schedulePageBannner.urlToOpen);
    } else if (schedulePageBannner.callToActionType == 'Open Page')
      if (schedulePageBannner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (schedulePageBannner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (schedulePageBannner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (schedulePageBannner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (schedulePageBannner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (schedulePageBannner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (schedulePageBannner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (schedulePageBannner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (schedulePageBannner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  function convertTo12HourFormat(time24: string | null): string {
    if (!time24) {
      return ''; // Return an empty string or some default value when time24 is null
    }
    const [hourStr, minuteStr] = time24.split(':');
    const hour = parseInt(hourStr);
    let period = 'AM';
    let twelveHour = hour;

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
        twelveHour = hour - 12;
      }
    }

    if (twelveHour === 0) {
      twelveHour = 12;
    }

    return `${twelveHour}:${minuteStr} ${period}`;
  }
  const [classInProcess, setClassInProcess]: any = useState({});
  const getClassInProcess = async () => {
    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    setClassInProcess(data);
  };
  useEffect(() => {
    getClassInProcess();
  }, [focus, refreshing]);

  const renderScheduleData = ({ item, index }: any): any => {
    let nowDate: Date = new Date();
    let date = nowDate.getDate();
    let month = nowDate.getMonth();
    let year = nowDate.getFullYear();

    let getDate: any = moment(item?.date);
    let classDate = getDate.toDate();

    let schdeuledDate = classDate.getDate();
    let scheduledMonth = classDate.getMonth();
    let scheduledYear = classDate.getFullYear();

    let flag =
      date == schdeuledDate && month == scheduledMonth && year == scheduledYear;

    const startTime12Hour = convertTo12HourFormat(item.startTime);
    const endTime12Hour = convertTo12HourFormat(item.endTime);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelectPress(index, item)}
        style={{
          borderWidth: 1,
          borderColor: item.selected ? Theme.darkGray : Theme.lightGray,
          // borderColor:  'silver',
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: Theme.white,
          marginTop: 20,
          borderRadius: 20,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              borderBottomWidth: 1,
              paddingVertical: 10,
              paddingBottom:15,
              borderBottomColor: Theme.lightGray,
              paddingTop:10
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Theme.lightGray,
                  borderRadius: 100,
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Theme.darkGray,

                }}>
                {item?.studentGender?.toLowerCase() == 'male' ?
                  <Image source={require('../../Assets/Images/StudentMale.png')} />
                  :
                  <Image source={require('../../Assets/Images/StudentFemale.png')} />

                }
              </View>
              <View>
                <Text
                  style={[
                    styles.textType3,
                    { fontFamily: 'Circular Std Medium', color: '#1FC07D' },
                  ]}>
                  {item?.jtuid}
                </Text>
                <Text
                  style={[
                    styles.textType1,
                    {
                      lineHeight: 30,
                      textTransform: 'capitalize',
                      fontFamily: 'Circular Std Medium',
                      width: 100,
                      fontSize: 18,
                    },
                  ]}>
                  {/* {item?.studentName} */}
                </Text>
                {item?.mode.toLowerCase() == 'physical' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                    }}>
                    <Feather name="map-pin" size={16} color={'#003E9C'} />
                    <Text
                      style={[
                        styles.textType3,
                        {
                          color: '#003E9C',
                          fontFamily: 'Circular Std Medium',
                          fontSize: 16,
                        },
                      ]}>
                      {item?.city}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
              <Text
                style={[
                  styles.textType3,
                  {
                    color: item.mode == 'online' ? Theme.darkGray : '#1FC07D',
                    backgroundColor:
                      item.mode == 'online' ? '#298CFF33' : Theme.lightGreen,
                    textTransform: 'capitalize',
                    width: 90,
                    height: 25,
                    textAlign: 'center',
                    paddingVertical: 2,
                    borderRadius: 30,
                  },
                ]}>
                {item?.mode}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingVertical: 20 }}>
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
              {/* <AntDesig name="copy1" size={20} color={Theme.darkGray} /> */}
              <SubjectIcon/>
              <Text style={[styles.textType3, { color: Theme.ironsidegrey1 }]}>
                Subject
              </Text>
            </View>
            <Text style={[styles.textType1, { fontSize: 16 }]}>
              {' '}
              {item.subjectName ?? item?.subject_name}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
              }}>
              <AntDesig name="carryout" size={20} color={Theme.darkGray} />
              <Text style={[styles.textType3, { color: Theme.ironsidegrey1 }]}>
                Day
              </Text>
            </View>
            <Text style={[styles.textType1, { fontSize: 16 }]}>
              {convertDateDayFormat(item.date)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
              }}>
              <AntDesig name="clockcircleo" size={20} color={Theme.darkGray} />
              <Text style={[styles.textType3, { color: Theme.ironsidegrey1 }]}>
                Time
              </Text>
            </View>
            <Text style={[styles.textType1, { fontSize: 16 }]}>
              {startTime12Hour} - {endTime12Hour}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
              }}>
              {/* <Image source={require('../../Assets/Images/level.png')} /> */}
              <MaterialIcons name="schedule-send" size={20} color={Theme.darkGray} />
              <Text style={[styles.textType3, { color: Theme.ironsidegrey1 }]}>
                Status
              </Text>
            </View>
            <Text
              style={[
                styles.textType1,
                { fontSize: 16, textTransform: 'capitalize' },
              ]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {item.status == 'Attended' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AttendedDetails')}>
              <Text style={{ color: Theme.gray, marginTop: 10 }}>
                View Details
              </Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>

        <>
          {item.selected && item?.status?.toLowerCase() == 'scheduled' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: !flag ? 'center' : 'space-between',
                width: '100%',
                alignItems: 'center',
                marginTop: 10,
              }}>
              {/* {classInProcess && Object.keys(classInProcess).length > 0 ? 
              (
                <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', width:'100%', gap:10}}>
                  <Text style={{textAlign: 'center',color:Theme.Dune}}>Class In Progress</Text>
                  <Text
                    style={[styles.text, { fontSize: 10, color: Theme.black }]}>
                    <ActivityIndicator color={'black'} size="small" />
                  </Text>
                </View>
              )
              : 
              ( */}
              <>
                <View style={{ width: '48%' }}>

                  <CustomButton btnTitle='Edit' backgroundColor={Theme.WhiteSmoke}
                    color={Theme.Black} onPress={() => handleEditPress(item)} />
                </View>
                {/* <TouchableOpacity
                  onPress={() => handleEditPress(item)}
                  style={{
                    backgroundColor: Theme.gray,
                    width: '48%',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: 'white',
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity> */}
                {flag && (
                  <View style={{ width: '48%' }}>

                    <CustomButton btnTitle='Attend' onPress={() => routeToClockIn(item)} />
                  </View>
                  // <TouchableOpacity
                  //   onPress={() => routeToClockIn(item)}
                  //   style={{
                  //     backgroundColor: Theme.darkGray,
                  //     width: '48%',
                  //     padding: 10,
                  //     borderRadius: 10,
                  //   }}>
                  //   <Text
                  //     style={{
                  //       textAlign: 'center',
                  //       fontSize: 14,
                  //       color: 'white',
                  //     }}>
                  //     Attend
                  //   </Text>
                  // </TouchableOpacity>
                )}
              </>
            </View>
          )}
        </>
      </TouchableOpacity>
    );
  };

  function convertDateFormat(date: any): any {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  function convertDateDayFormat(date: string): string {
    const dateObj = new Date(date);
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayName = daysOfWeek[dateObj.getDay()];
    const day = dateObj.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'August',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${dayName}, ${day} ${monthNames[monthIndex]} ${year}`;
  }

  const getTutorId = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);

    let { tutorID } = loginData;
    setTutorId(tutorID);
  };

  const getTutorStudents = () => {
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorId}`)
      .then(({ data }) => {
        const { tutorStudents } = data;
        updateStudent(tutorStudents);
      })
      .catch(error => {
        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorSubjects = () => {
    axios
      .get(`${Base_Uri}getTutorSubjects/${tutorId}`)
      .then(({ data }) => {
        let { tutorSubjects } = data;

        let mySubject =
          tutorSubjects &&
          tutorSubjects.length > 0 &&
          tutorSubjects.map((e: any, i: Number) => {
            if (e?.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        updateSubject(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (tutorId) {
      getTutorStudents();
      getTutorSubjects();
    }
  }, [tutorId, refreshing]);
  // console.log("upcomingClass",upcomingClass);
  // console.log("scheduleData",scheduleData);

  return (
    <View style={{ flex: 1, backgroundColor: Theme.GhostWhite, paddingHorizontal:10 }}>
      <CustomHeader
        title="Schedule"
        plus={scheduleData.length !== 0}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        nestedScrollEnabled={true}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={() => setShow(true)}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 10,
            }}>
            <View
              style={{
                backgroundColor: Theme.white,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderColor: Theme.lineColor,
                flexDirection: 'row',
                gap: 20,
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Text
                style={styles.textType3}>
                {selectedDate.toLocaleDateString([], {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Text>
              <ScheduleIcon />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: Theme.black,
                fontWeight: '700',
                fontFamily: 'Circular Std Black',
              }}>
              {convertDateFormat(selectedDate)}
            </Text>
            <AntDesig name="caretdown" color={Theme.black} size={12} />
          </TouchableOpacity> */}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          {scheduleData.length == 0 &&
            Object.keys(upcomingClass).length == 0 ? (
            <View
              style={{
                height: Dimensions.get('window').height - 250,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={require('../../Assets/Images/noclassyet.png')} />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: Theme.black,
                  fontFamily: 'Circular Std Black',
                  marginTop: 20,
                }}>
                No Class, Yet
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Theme.gray,
                  textAlign: 'center',
                  marginTop: 10,
                  fontFamily: 'Circular Std Black',
                }}>
                Look like you haven't added any class.
              </Text>
              <View style={{ width: '100%', marginTop: 40 }}>
                <CustomButton btnTitle='Add Class' onPress={() => navigation.navigate('AddClass')} />
              </View>
              {/* <View
                style={{
                  borderWidth: 1,
                  borderColor: Theme.white,
                  marginVertical: 20,
                  width: '94%',
                  marginTop: 40,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  
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
                      fontFamily: 'Circular Std Black',
                    }}>
                    Add Class
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
          ) : (
            <View>
              <FlatList
                nestedScrollEnabled={true}
                data={upcomingClass.length > 0 ? upcomingClass : scheduleData}
                renderItem={renderScheduleData}
              />
            </View>
          )}
        </View>

        {confirm && confirmModal()}
        {/* {confirmModal()} */}
      </ScrollView>
      {Object.keys(schedulePageBannner).length > 0 &&
        (schedulePageBannner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{ flex: 1 }}>
            <Modal
              visible={openPPModal}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={() => linkToOtherPage()}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
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
                      <AntDesig name="closecircleo" size={20} color={'black'} />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{ uri: schedulePageBannner.bannerImage }}
                    style={{
                      width: Dimensions.get('screen').width / 1.1,
                      height: '80%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
      <CustomLoader visible={loading} />

    </View>
  );
}

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerText: {
    color: '#959595',
    fontSize: 14,
    backgroundColor: Theme.white,
    borderRadius: 20,
    borderColor: Theme.secondary,
    padding: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  innerContainer: {
    width: '85%',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 26,
    color: Theme.black,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: Theme.black,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: 320,
    bottom: 0,
  },
  modalView: {
    backgroundColor: '#151c15',
    borderRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: Theme.black,
  },
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Medium',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'Circular Std Medium',
    fontStyle: 'normal',
  },
});
