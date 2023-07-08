import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {Theme} from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';

function Home({navigation}: any) {
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
  const [notificationLenght,setNotificationLength] = useState(0)
  const [tutorId, setTutorId] = useState<Number | null>(null);

  const [tutorData, setTutorData] = useState({
    cummulativeCommission: '',
    attendedHours: '',
    activeHours: '',
    cancelledHours: '',
    scheduledHours: '',
  });
  const [tutorStudents, setTutorStudents] = useState([]);
  const getTutorId = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);
    let {tutorID} = loginData;
    setTutorId(tutorID);
  };


const getNotificationLength = async () => {

  axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({data}) => {
        let {tutorDetailById} = data;
        let tutorUid = tutorDetailById[0]?.uid;

        axios
          .get(`${Base_Uri}api/notifications`)
          .then(async({data}) => {
            let {notifications} = data;
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

  useEffect(() => {
    getTutorId();

  }, []);


useEffect(()=>{
  tutorId && getNotificationLength()
},[tutorId])

  const getCummulativeCommission = () => {
    axios
      .get(`${Base_Uri}getCommulativeCommission/${tutorId}`)
      .then(({data}) => {
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
      .then(({data}) => {
        setTutorData({...tutorData, attendedHours: data.attendedHours});
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduledHours = () => {
    axios
      .get(`${Base_Uri}getScheduledHours/${tutorId}`)
      .then(({data}) => {
        setTutorData({...tutorData, scheduledHours: data.scheduledHours});
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getCancelledHours = () => {
    axios
      .get(`${Base_Uri}getCancelledHours/${tutorId}`)
      .then(({data}) => {
        setTutorData({...tutorData, cancelledHours: data.cancelledHours});
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorStudents = () => {
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorId}`)
      .then(({data}) => {
        const {tutorStudents} = data;
        setTutorStudents(tutorStudents);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getUpcomingClasses = () => {
    axios
      .get(`${Base_Uri}getUpcomingClassesByTutorID/${tutorId}`)
      .then(({data}) => {
        const {classSchedules} = data;
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
  }, [tutorId]);

  useEffect(() => {
    if (tutorId) {
      getUpcomingClasses();
    }
  }, [tutorId]);

  useEffect(() => {
    if (tutorId && tutorData.cummulativeCommission) {
      getAttendedHours();
    }
  }, [tutorData.cummulativeCommission]);
  useEffect(() => {
    if (tutorId && tutorData.cummulativeCommission && tutorData.attendedHours) {
      getScheduledHours();
    }
  }, [tutorData.attendedHours]);
  useEffect(() => {
    if (
      tutorId &&
      tutorData.cummulativeCommission &&
      tutorData.attendedHours &&
      tutorData.scheduledHours
    ) {
      getCancelledHours();
    }
  }, [tutorData.scheduledHours]);
  useEffect(() => {
    if (tutorId) {
      getTutorStudents();
    }
  }, [tutorData.cancelledHours]);

  return !tutorData.cancelledHours ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={Theme.black} />
    </View>
  ) : (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.text}>Hello,</Text>
          <Text style={styles.heading}>Muhammad</Text>
        </View>

        <View style={styles.firstBox}>
          <Text style={[styles.text, {color: Theme.white, fontSize: 14}]}>
            {currentDate}
          </Text>
          <Text
            style={[styles.heading, {color: Theme.white, fontWeight: '400'}]}>
            RM {tutorData?.cummulativeCommission}
          </Text>
          <Text style={[styles.text, {color: Theme.white, fontSize: 14}]}>
            CUMMULATIVE COMMISSION
          </Text>
        </View>
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
          <Text style={[styles.text, {color: Theme.black, fontSize: 14}]}>
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
            <Text style={[styles.text, {fontSize: 12, color: Theme.white}]}>
              {notificationLenght}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{marginTop: 20}}>
          <Text style={[styles.heading, {fontSize: 16}]}>Monthly Summary</Text>
          <Text style={[styles.text, {fontSize: 14, color: Theme.gray}]}>
            {currentMonth}
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View
            style={{flexDirection: 'row', width: '50%', alignItems: 'center'}}>
            <View
              style={{backgroundColor: 'pink', padding: 5, borderRadius: 10}}>
              <Image
                source={require('../../Assets/Images/timer-or-chronometer-tool.png')}
                style={{width: 30, height: 30}}
              />
            </View>
            <View style={{justifyContent: 'center', marginLeft: 10}}>
              <Text style={[styles.text, {fontSize: 13}]}>Attended hours</Text>
              <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
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
                style={{width: 30, height: 30}}
              />
            </View>
            <View style={{justifyContent: 'center', marginLeft: 10}}>
              <Text style={[styles.text, {fontSize: 12}]}>Active Student</Text>
              <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
                {tutorStudents.length}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <View
            style={{flexDirection: 'row', width: '50%', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#e9ccb1',
                padding: 5,
                borderRadius: 10,
              }}>
              <Image
                source={require('../../Assets/Images/scheduled.png')}
                style={{width: 25, height: 25}}
              />
            </View>
            <View style={{justifyContent: 'center', marginLeft: 10}}>
              <Text style={[styles.text, {fontSize: 12}]}>Schedule hours</Text>
              <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
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
                style={{width: 26, height: 26}}
              />
            </View>
            <View style={{justifyContent: 'center', marginLeft: 10}}>
              <Text style={[styles.text, {fontSize: 12}]}>Cancelled hours</Text>
              <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
                {tutorData?.cancelledHours}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.text, {marginTop: 25, fontWeight: '500'}]}>
          Upcoming Classes
        </Text>
        {upCommingClasses && upCommingClasses.length > 0 ? (
          <FlatList
            data={upCommingClasses}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}: any) => {
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
                    <Text style={{color: Theme.black, fontSize: 14}}>
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
                    <Text style={{color: Theme.gray, fontSize: 12}}>
                      {item?.startTime} to {item?.endTime}{' '}
                    </Text>
                    <Text style={{color: Theme.gray, fontSize: 12}}>
                      {item?.date?.slice(0, 11)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={{marginTop: 35}}>
            <Text
              style={{color: Theme.black, fontSize: 14, textAlign: 'center'}}>
              No UpComming Classes...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
