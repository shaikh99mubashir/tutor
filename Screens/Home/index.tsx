import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  Modal,
  Linking,
} from 'react-native';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import { useIsFocused } from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import StudentContext from '../../context/studentContext';
import filterContext from '../../context/filterContext';
import UpcomingClassState from '../../context/upcomingClassState';
import upcomingClassContext from '../../context/upcomingClassContext';
import paymentContext from '../../context/paymentHistoryContext';
import scheduleContext from '../../context/scheduleContext';
import reportSubmissionContext from '../../context/reportSubmissionContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import notificationContext from '../../context/notificationContext';
import bannerContext from '../../context/bannerContext';
function Home({ navigation, route }: any) {

  let key = route.key

  const context = useContext(TutorDetailsContext);
  const filter = useContext(filterContext);
  const studentAndSubjectContext = useContext(StudentContext);
  const notContext = useContext(notificationContext)
  let { notification, setNotification } = notContext
  const { setCategory, setSubjects, setState, setCity } = filter;
  const [refreshing, setRefreshing] = useState(false);
  const upcomingClassCont = useContext(upcomingClassContext);
  const paymentHistory = useContext(paymentContext);
  const bannerCon = useContext(bannerContext)

  let { homePageBanner, setHomePageBanner, schedulePageBannner, setSchedulePageBanner, jobTicketBanner, setJobTicketBanner,
    profileBanner, setProfileBanner, paymentHistoryBanner, setPaymentHistoryBanner, reportSubmissionBanner, setReportSubmissionBanner
    , inboxBanner, setInboxBanner, faqBanner, setFaqBanner, studentBanner, setStudentBanner } = bannerCon

  const upcomingContext = useContext(scheduleContext);

  let { commissionData, setCommissionData } = paymentHistory;
  let { upcomingClass, setUpcomingClass, scheduleData, setScheduleData } =
    upcomingContext;

  const { tutorDetails, updateTutorDetails } = context;
  const { students, subjects, updateStudent, updateSubject } =
    studentAndSubjectContext;
  let reportContext = useContext(reportSubmissionContext);

  let {
    reportSubmission,
    setreportSubmission,
    progressReport,
    setProgressReport,
  } = reportContext;

  const focus = useIsFocused();

  const date: Date = new Date();
  const currentDate: string = date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const currentMonth: string = date.toLocaleDateString('en-US', {
    month: 'short',
  });

  const [upCommingClasses, setUpCommingClasses] = useState([
    // {
    //   id: 1,
    //   image: require('../../Assets/Images/woman.png'),
    //   name: 'testing1',
    //   title: 'Add Math (DEGREE) Online',
    //   time: '12:00 PM to 7:00 PM',
    //   date: '20 May 2023',
    // },
    // {
    //   id: 2,
    //   image: require('../../Assets/Images/woman.png'),
    //   name: 'testing2',
    //   title: 'Add History (DEGREE) Online',
    //   time: '12:00 PM to 7:00 PM',
    //   date: '20 May 2023',
    // },
  ]);
  const [notificationLenght, setNotificationLength] = useState(0);
  const [tutorId, setTutorId] = useState<Number | null>(null);
  const [classInProcess, setClassInProcess] = useState({});

  const [tutorData, setTutorData] = useState({
    cummulativeCommission: '',
    attendedHours: '',
    activeHours: '',
    cancelledHours: '',
    scheduledHours: '',
  });

  const [cummulativeCommission, setCumulativeCommission] = useState('');
  const [attendedHours, setAttendedHours] = useState('');
  const [activeHours, setActiveHours] = useState('');
  const [cancelledHours, setCancelledHours] = useState('');
  const [schedulesHours, setScheduledHours] = useState('');
  const [tutorStudents, setTutorStudents] = useState([]);
  const [bannerData, setBannerData] = useState([])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getTutorId();
    }, 2000);
  }, [refreshing]);

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

  const getPaymentHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');
    data = JSON.parse(data);
    let { tutorID } = data;

    axios
      .get(`${Base_Uri}tutorPayments/${tutorID}`)
      .then(({ data }) => {
        let { response } = data;

        setCommissionData(response);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getNotificationLength = async () => {
    axios
      .get(`${Base_Uri}api/notifications/${tutorId}`)
      .then(({ data }) => {
        let length = 0;
        let { notifications } = data;
        let tutorNotification =
          notifications.length > 0 &&
          notifications.filter((e: any, i: number) => {
            return e.status == 'new';
          });
        setNotification(tutorNotification)
        // // setNotificationLength(tutorNotification.length > 0 ? tutorNotification.length : 0);
        // length =
        //   length + tutorNotification.length > 0 ? tutorNotification.length : 0;

        // setNotificationLength(length);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getClassInProcess = async () => {
    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    setClassInProcess(data);
  };

  useEffect(() => {
    getTutorId();
    getClassInProcess();
  }, [focus, refreshing]);

  const getCategory = () => {
    axios
      .get(`${Base_Uri}getCategories`)
      .then(({ data }) => {
        let { categories } = data;

        let myCategories =
          categories &&
          categories.length > 0 &&
          categories.map((e: any, i: Number) => {
            if (e.category_name) {
              return {
                subject: e.category_name,
                id: e.id,
              };
            }
          });
        setCategory(myCategories);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getSubject = () => {
    axios
      .get(`${Base_Uri}getSubjects`)
      .then(({ data }) => {
        let { subjects } = data;

        let mySubject =
          subjects &&
          subjects.length > 0 &&
          subjects.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });

        setSubjects(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getStates = () => {
    axios
      .get(`${Base_Uri}getStates`)
      .then(({ data }) => {
        let { states } = data;

        let myStates =
          states &&
          states.length > 0 &&
          states.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });

        setState(myStates);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCities = () => {
    axios
      .get(`${Base_Uri}getCities`)
      .then(({ data }) => {
        let { cities } = data;
        let myCities =
          cities &&
          cities.length > 0 &&
          cities.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        setCity(myCities);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getReportSubmissionHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios
      .get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`)
      .then(({ data }) => {
        let { tutorReportListing } = data;
        setreportSubmission(tutorReportListing);
      })
      .catch(error => {
        console.log('error');
      });
  };

  const getProgressReportHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios
      .get(`${Base_Uri}api/progressReportListing`)
      .then(({ data }) => {
        let { progressReportListing } = data;

        let tutorReport =
          progressReportListing &&
          progressReportListing.length > 0 &&
          progressReportListing.filter((e: any, i: number) => {
            return e.tutorID == tutorID;
          });

        // console.log(tutorReport, "reoirt")
        setProgressReport(
          tutorReport && tutorReport.length > 0 ? tutorReport : [],
        );
      })
      .catch(error => {
        console.log('error');
      });
  };

  useEffect(() => {
    getCategory();
    getSubject();
    getStates();
    getCities();
    getPaymentHistory();
    getReportSubmissionHistory();
    getProgressReportHistory();
  }, [refreshing]);

  const getTutorDetails = async () => {
    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;

        let tutorDetails = tutorDetailById[0];

        console.log(tutorDetails, "detaillllssssss")

        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails.phoneNumber,
          age: tutorDetails.age,
          nric: tutorDetails.nric,
          tutorImage: tutorDetails.tutorImage,
          tutorId: tutorDetails?.id,
          status: tutorDetails?.status
        };

        updateTutorDetails(details);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  useEffect(() => {
    tutorId && getNotificationLength();
    tutorId && getTutorDetails();
  }, [tutorId, refreshing]);

  const getCummulativeCommission = () => {
    axios
      .get(`${Base_Uri}getCommulativeCommission/${tutorId}`)
      .then(({ data }) => {
        setCumulativeCommission(data.commulativeCommission);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getAttendedHours = () => {
    axios
      .get(`${Base_Uri}getAttendedHours/${tutorId}`)
      .then(({ data }) => {
        // setTutorData({ ...tutorData, attendedHours: data.attendedHours });
        setAttendedHours(data.attendedHours);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduledHours = () => {
    axios
      .get(`${Base_Uri}getScheduledHours/${tutorId}`)
      .then(({ data }) => {
        setScheduledHours(data.scheduledHours);
        // setTutorData({ ...tutorData, scheduledHours: data.scheduledHours });
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getCancelledHours = () => {
    axios
      .get(`${Base_Uri}getCancelledHours/${tutorId}`)
      .then(({ data }) => {
        setCancelledHours(data.cancelledHours);
        // setTutorData({ ...tutorData, cancelledHours: data.cancelledHours });
      })
      .catch(error => {
        // console.log(error,"errror")
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorStudents = () => {
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorId}`)
      .then(({ data }) => {
        const { tutorStudents } = data;
        setTutorStudents(tutorStudents);
        updateStudent(tutorStudents);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
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
            if (e.name) {
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

  const getUpcomingClasses = () => {
    axios
      .get(`${Base_Uri}getUpcomingClassesByTutorID/${tutorId}`)
      .then(({ data }) => {
        const { classSchedules } = data;
        setUpCommingClasses(classSchedules);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    if (tutorId) {
      getCummulativeCommission();
    }
  }, [tutorId, refreshing]);

  useEffect(() => {
    if (tutorId) {
      getUpcomingClasses();
    }
  }, [tutorId, refreshing]);

  useEffect(() => {
    if (tutorId && cummulativeCommission) {
      getAttendedHours();
      getScheduledHours();
      getTutorStudents();
      getTutorSubjects();
      getCancelledHours();
    }
  }, [cummulativeCommission, refreshing]);
  // useEffect(() => {
  //   if (tutorId && tutorData.cummulativeCommission && tutorData.attendedHours) {
  //     getScheduledHours();
  //   }
  // }, [attendedHours, refreshing]);
  // useEffect(() => {
  //   if (
  //     tutorId &&
  //     tutorData.cummulativeCommission &&
  //     tutorData.attendedHours &&
  //     tutorData.scheduledHours
  //   ) {
  //     getCancelledHours();
  //   }
  // }, [schedulesHours, refreshing]);
  // useEffect(() => {
  //   if (tutorId) {
  //     getTutorStudents();
  //     getTutorSubjects()
  //   }
  // }, [cancelledHours, refreshing]);

  const routeToScheduleScreen = async (item: any) => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let { tutorID } = loginData;
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(res => {
        let scheduledClasses = res.data;

        let { classSchedulesTime } = scheduledClasses;
        let checkRouteClass =
          classSchedulesTime &&
          classSchedulesTime.length > 0 &&
          classSchedulesTime.filter((e: any, i: number) => {
            return e?.id == item?.id;
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
          checkRouteClass && checkRouteClass.length > 0 ? checkRouteClass : [],
        );
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
    navigation.navigate('Schedule');
  };
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true)
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => {

        console.log(data, "dataaa")

        let banners = data.bannerAds

        let homePageBanner = banners && banners.length > 0 && banners.map((e: any, i: any) => {

          if (e.displayOnPage == "Dashboard") {
            setHomePageBanner(e)
          }
          else if (e.displayOnPage == "Faq") {
            setFaqBanner(e)
          }
          else if (e.displayOnPage == ("Class Schedule List")) {
            setSchedulePageBanner(e)
          }

          else if (e.displayOnPage == "Student List") {
            setStudentBanner(e)
          }
          else if (e.displayOnPage == "Inbox") {
            setInboxBanner(e)
          }
          else if (e.displayOnPage == "Profile") {
            setProfileBanner(e)
          }
          else if (e.displayOnPage == ("Payment History")) {
            setPaymentHistoryBanner(e)
          }
          else if (e.displayOnPage == ("Job Ticket List")) {
            setJobTicketBanner(e)
          }
          else if (e.displayOnPage == ("Submission History")) {
            setReportSubmissionBanner(e)
          }

        })


      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);



  const linkToOtherPage = () => {

    if (homePageBanner.callToActionType == "Open URL") {
      Linking.openURL(homePageBanner.urlToOpen);
    }
    else if (homePageBanner.callToActionType == "Open Page")

      if (homePageBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }

      else if (homePageBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (homePageBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (homePageBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (homePageBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (homePageBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (homePageBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (homePageBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (homePageBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }


  return !cancelledHours ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={Theme.black} />
    </View>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.text}>Hello,</Text>
          <Text style={[styles.heading, { fontSize: 16 }]}>
            {tutorDetails?.full_name}
          </Text>
        </View>

        <View style={styles.firstBox}>
          <Text style={[styles.text, { color: Theme.white, fontSize: 11 }]}>
            {currentDate}
          </Text>
          <Text
            style={[styles.heading, { color: Theme.white, fontWeight: '400' }]}>
            RM {cummulativeCommission}
          </Text>
          <Text style={[styles.text, { color: Theme.white, fontSize: 11 }]}>
            CUMMULATIVE COMMISSION
          </Text>
        </View>
        {classInProcess && Object.keys(classInProcess).length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ClassTimerCount', classInProcess)
            }
            style={[
              styles.firstBox,
              {
                backgroundColor: Theme.lightGray,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                flexDirection: 'row',
                marginTop: 10,
              },
            ]}>
            <Text style={[styles.text, { color: Theme.black, fontSize: 12 }]}>
              You have ongoing class
            </Text>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: 'white',
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[styles.text, { fontSize: 10, color: Theme.white }]}>
                <ActivityIndicator color={'blue'} size="small" />
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Notifications')}
            style={[
              styles.firstBox,
              {
                backgroundColor: Theme.lightGray,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                flexDirection: 'row',
                marginTop: 10,
              },
            ]}>
            <Text style={[styles.text, { color: Theme.black, fontSize: 12 }]}>
              Notifications
            </Text>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: Theme.red,
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[styles.text, { fontSize: 10, color: Theme.white }]}>
                {notification.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.heading, { fontSize: 14 }]}>Monthly Summary</Text>
          <Text style={[styles.text, { fontSize: 12, color: Theme.gray }]}>
            {currentMonth}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View
            style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
            <View
              style={{ backgroundColor: 'pink', padding: 5, borderRadius: 10 }}>
              <Image
                source={require('../../Assets/Images/timer-or-chronometer-tool.png')}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 9 }]}>Attended hours</Text>
              <Text style={[styles.text, { fontSize: 12, fontWeight: '700' }]}>
                {attendedHours}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '50%',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#c1a7b0',
                padding: 5,
                borderRadius: 10,
              }}>
              <Image
                source={require('../../Assets/Images/student.png')}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 10 }]}>Active Student</Text>
              <Text style={[styles.text, { fontSize: 14, fontWeight: '700' }]}>
                {students?.length}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View
            style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#e9ccb1',
                padding: 5,
                borderRadius: 10,
              }}>
              <Image
                source={require('../../Assets/Images/scheduled.png')}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 10 }]}>Schedule hours</Text>
              <Text style={[styles.text, { fontSize: 12, fontWeight: '700' }]}>
                {schedulesHours}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '50%',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#e8e6b9',
                padding: 5,
                borderRadius: 10,
              }}>
              <Image
                source={require('../../Assets/Images/clock.png')}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 10 }]}>Cancelled hours</Text>
              <Text style={[styles.text, { fontSize: 12, fontWeight: '700' }]}>
                {cancelledHours}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.text, { marginTop: 20, fontWeight: '500' }]}>
          Upcoming Classes
        </Text>
        {upCommingClasses && upCommingClasses.length > 0 ? (
          <FlatList
            data={upCommingClasses}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }: any) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    borderWidth: 1,
                    paddingHorizontal: 15,
                    width: 250,
                    height: 150,
                    marginTop: 10,
                    paddingVertical: 15,
                    borderRadius: 10,
                    gap: 10,
                    marginRight: 10,
                    borderColor: '#eee',
                  }}
                  onPress={() => routeToScheduleScreen(item)}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 12,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../Assets/Images/woman.png')}
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 50,
                      }}
                    />
                    <Text style={{ color: Theme.black, fontSize: 15 }}>
                      {item?.studentName}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    {item?.subject_name}
                  </Text>
                  <View>
                    <Text style={{ color: Theme.gray, fontSize: 12 }}>
                      {item?.startTime} to {item?.endTime}{' '}
                    </Text>
                    <Text
                      style={{ color: Theme.gray, fontSize: 12, marginTop: 10 }}>
                      {item?.date?.slice(0, 11)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={{ marginTop: 35 }}>
            <Text
              style={{ color: Theme.black, fontSize: 12, textAlign: 'center' }}>
              No UpComming Classes...
            </Text>
          </View>
        )}
      </ScrollView>
      {Object.keys(homePageBanner).length > 0 && (homePageBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
        <Modal
          visible={openPPModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setOpenPPModal(false)}>
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
                // padding: 15,
                borderRadius: 5,
                marginHorizontal: 20,
              }}>
              <TouchableOpacity onPress={() => setOpenPPModal(false)}>
                <View style={{ alignItems: 'flex-end', paddingVertical: 10, paddingRight: 15 }}>
                  <AntDesign
                    name="closecircleo"
                    size={20}
                    color={'black'}
                  />
                </View>
              </TouchableOpacity>
              {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
              <Image source={{ uri: homePageBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.1, height: '80%', }} resizeMode='contain' />

            </View>

          </TouchableOpacity>
        </Modal>
      </View>}
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
    padding: 15,
  },
  text: {
    color: Theme.black,
    fontSize: 14,
  },
  heading: {
    color: Theme.black,
    fontSize: 22,
    fontWeight: '600',
  },
  firstBox: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: Theme.darkGray,
    borderRadius: 6,
    marginTop: 10,
  },
});