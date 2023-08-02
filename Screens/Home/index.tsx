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
} from 'react-native';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import { useIsFocused } from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import StudentContext from '../../context/studentContext';
import filterContext from '../../context/filterContext';

function Home({ navigation }: any) {

  const context = useContext(TutorDetailsContext)
  const filter = useContext(filterContext)
  const studentAndSubjectContext = useContext(StudentContext)
  const { setCategory, setSubjects, setState, setCity } = filter
  const [refreshing, setRefreshing] = useState(false);
  const { tutorDetails, updateTutorDetails } = context
  const { students, subjects, updateStudent, updateSubject } = studentAndSubjectContext

  const focus = useIsFocused()

  const date: Date = new Date();
  const currentDate: string = date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const currentMonth: string = date.toLocaleDateString('en-US', {
    month: 'short',
  });

  const [upCommingClasses, setUpCommingClasses] = useState([
    {
      id: 1,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing1',
      title: 'Add Math (DEGREE) Online',
      time: '12:00 PM to 7:00 PM',
      date: '20 May 2023',
    },
    {
      id: 2,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing2',
      title: 'Add History (DEGREE) Online',
      time: '12:00 PM to 7:00 PM',
      date: '20 May 2023',
    },
  ]);
  const [notificationLenght, setNotificationLength] = useState(0)
  const [tutorId, setTutorId] = useState<Number | null>(null);
  const [classInProcess, setClassInProcess] = useState({})

  const [tutorData, setTutorData] = useState({
    cummulativeCommission: '',
    attendedHours: '',
    activeHours: '',
    cancelledHours: '',
    scheduledHours: '',
  });
  const [tutorStudents, setTutorStudents] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getTutorId()
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


  const getNotificationLength = async () => {

    

    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;
        let tutorUid = tutorDetailById[0]?.uid;

        axios
          .get(`${Base_Uri}api/notifications`)
          .then(async ({ data }) => {
            let { notifications } = data;
            let tutorNotification =
              notifications.length > 0 &&
              notifications.filter((e: any, i: number) => {
                return e.tutorID == tutorUid;
              });
            setNotificationLength(tutorNotification.length);
          })
          .catch(error => {

            ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
          });
      })
      .catch(error => {

        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });

  }

  const getClassInProcess = async () => {

    let data: any = await AsyncStorage.getItem("classInProcess")
    data = JSON.parse(data)

    setClassInProcess(data)


  }

  useEffect(() => {
    getTutorId();
    getClassInProcess()
  }, [focus, refreshing]);


  const getCategory = () => {
    axios.get(`${Base_Uri}getCategories`).then(({ data }) => {


      let { categories } = data

      let myCategories = categories && categories.length > 0 && categories.map((e: any, i: Number) => {
        if (e.category_name) {
          return {
            subject: e.category_name,
            id: e.id
          }
        }
      })
      setCategory(myCategories)

    }).catch((error) => {
      console.log(error)
    })
  }

  const getSubject = () => {

    axios.get(`${Base_Uri}getSubjects`).then(({ data }) => {



      let { subjects } = data

      let mySubject = subjects && subjects.length > 0 && subjects.map((e: any, i: Number) => {
        if (e.name) {
          return {
            subject: e.name,
            id: e.id
          }
        }
      })

      setSubjects(mySubject)


    }).catch((error) => {

      console.log(error)

    })
  }


  const getStates = () => {

    axios.get(`${Base_Uri}getStates`).then(({ data }) => {



      let { states } = data

      let myStates = states && states.length > 0 && states.map((e: any, i: Number) => {
        if (e.name) {
          return {
            subject: e.name,
            id: e.id
          }
        }
      })

      setState(myStates)


    }).catch((error) => {

      console.log(error)

    })


  }


  const getCities = () => {


    axios.get(`${Base_Uri}getCities`).then(({ data }) => {



      let { cities } = data
      let myCities = cities && cities.length > 0 && cities.map((e: any, i: Number) => {
        if (e.name) {
          return {
            subject: e.name,
            id: e.id
          }
        }
      })
      setCity(myCities)

    }).catch((error) => {

      console.log(error)

    })



  }


  useEffect(() => {
    getCategory()
    getSubject()
    getStates()
    getCities()
  }, [refreshing])



  const getTutorDetails = async () => {

    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;

        let tutorDetails = tutorDetailById[0];

        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails.phoneNumber,
          age: tutorDetails.age,
          nric: tutorDetails.nric,
          tutorImage: tutorDetails.tutorImage,
          tutorId: tutorDetails?.id
        };

        updateTutorDetails(details)

      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });


  }
  useEffect(() => {
    tutorId && getNotificationLength()
    tutorId && getTutorDetails()

  }, [tutorId, refreshing])

  const getCummulativeCommission = () => {
    axios
      .get(`${Base_Uri}getCommulativeCommission/${tutorId}`)
      .then(({ data }) => {
        setTutorData({
          ...tutorData,
          cummulativeCommission: data.commulativeCommission,
        });
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getAttendedHours = () => {
    axios
      .get(`${Base_Uri}getAttendedHours/${tutorId}`)
      .then(({ data }) => {
        setTutorData({ ...tutorData, attendedHours: data.attendedHours });
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduledHours = () => {
    axios
      .get(`${Base_Uri}getScheduledHours/${tutorId}`)
      .then(({ data }) => {
        setTutorData({ ...tutorData, scheduledHours: data.scheduledHours });
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getCancelledHours = () => {
    axios
      .get(`${Base_Uri}getCancelledHours/${tutorId}`)
      .then(({ data }) => {
        setTutorData({ ...tutorData, cancelledHours: data.cancelledHours });
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorStudents = () => {
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorId}`)
      .then(({ data }) => {
        const { tutorStudents } = data;
        setTutorStudents(tutorStudents);
        updateStudent(tutorStudents)
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

        

        updateSubject(mySubject)
      })
      .catch(error => {
        console.log(error);
      });


  }

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
    if (tutorId && tutorData.cummulativeCommission) {
      getAttendedHours();
    }
  }, [tutorData.cummulativeCommission, refreshing]);
  useEffect(() => {
    if (tutorId && tutorData.cummulativeCommission && tutorData.attendedHours) {
      getScheduledHours();
    }
  }, [tutorData.attendedHours, refreshing]);
  useEffect(() => {
    if (
      tutorId &&
      tutorData.cummulativeCommission &&
      tutorData.attendedHours &&
      tutorData.scheduledHours
    ) {
      getCancelledHours();
    }
  }, [tutorData.scheduledHours, refreshing]);
  useEffect(() => {
    if (tutorId) {
      getTutorStudents();
      getTutorSubjects()
    }
  }, [tutorData.cancelledHours, refreshing]);


  return !tutorData.cancelledHours ? (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          <Text style={styles.heading}>{tutorDetails?.full_name}</Text>
        </View>

        <View style={styles.firstBox}>
          <Text style={[styles.text, { color: Theme.white, fontSize: 14 }]}>
            {currentDate}
          </Text>
          <Text
            style={[styles.heading, { color: Theme.white, fontWeight: '400' }]}>
            RM {tutorData?.cummulativeCommission}
          </Text>
          <Text style={[styles.text, { color: Theme.white, fontSize: 14 }]}>
            CUMMULATIVE COMMISSION
          </Text>
        </View>
        {classInProcess && Object.keys(classInProcess).length > 0 ? <TouchableOpacity
          onPress={() => navigation.navigate('ClassTimerCount', classInProcess)}
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
          <Text style={[styles.text, { color: Theme.black, fontSize: 14 }]}>
            You have ongoing class
          </Text>
          <View
            style={{
              borderRadius: 100,
              backgroundColor: "white",
              width: 25,
              height: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.text, { fontSize: 12, color: Theme.white }]}>
              <ActivityIndicator color={"blue"} size="small" />
            </Text>
          </View>
        </TouchableOpacity> :
          <TouchableOpacity
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
            <Text style={[styles.text, { color: Theme.black, fontSize: 14 }]}>
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
              <Text style={[styles.text, { fontSize: 12, color: Theme.white }]}>
                {notificationLenght}
              </Text>
            </View>
          </TouchableOpacity>}

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.heading, { fontSize: 16 }]}>Monthly Summary</Text>
          <Text style={[styles.text, { fontSize: 14, color: Theme.gray }]}>
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
                style={{ width: 30, height: 30 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 13 }]}>Attended hours</Text>
              <Text style={[styles.text, { fontSize: 16, fontWeight: '700' }]}>
                {tutorData?.attendedHours}
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
                style={{ width: 30, height: 30 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 12 }]}>Active Student</Text>
              <Text style={[styles.text, { fontSize: 16, fontWeight: '700' }]}>
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
                style={{ width: 25, height: 25 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 12 }]}>Schedule hours</Text>
              <Text style={[styles.text, { fontSize: 16, fontWeight: '700' }]}>
                {tutorData?.scheduledHours}
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
                style={{ width: 26, height: 26 }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={[styles.text, { fontSize: 12 }]}>Cancelled hours</Text>
              <Text style={[styles.text, { fontSize: 16, fontWeight: '700' }]}>
                {tutorData?.cancelledHours}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.text, { marginTop: 25, fontWeight: '500' }]}>
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
                <View
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
                  }}>
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
                        width: 45,
                        height: 45,
                        borderRadius: 50,
                      }}
                    />
                    <Text style={{ color: Theme.black, fontSize: 14 }}>
                      {item?.studentName}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 16,
                      fontWeight: '600',
                    }}>
                    {item?.subject_name}
                  </Text>
                  <View>
                    <Text style={{ color: Theme.gray, fontSize: 12 }}>
                      {item?.startTime} to {item?.endTime}{' '}
                    </Text>
                    <Text style={{ color: Theme.gray, fontSize: 12 }}>
                      {item?.date?.slice(0, 11)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={{ marginTop: 35 }}>
            <Text
              style={{ color: Theme.black, fontSize: 14, textAlign: 'center' }}>
              No UpComming Classes...
            </Text>
          </View>
        )}
      </ScrollView>
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
    fontSize: 16,
  },
  heading: {
    color: Theme.black,
    fontSize: 20,
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
