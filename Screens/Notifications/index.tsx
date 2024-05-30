import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationContext from '../../context/notificationContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import scheduleContext from '../../context/scheduleContext';
import scheduleNotificationContext from '../../context/scheduleNotificationContext';
import CustomLoader from '../../Component/CustomLoader';
const height = Dimensions.get('screen').height;
const Notifications = ({ navigation }: any) => {
  // const [notification, setNotification] = useState<any>([]);



  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const context = useContext(notificationContext);
  const scheduleNotCont = useContext(scheduleNotificationContext)
  
  let tutotContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutotContext
  let { scheduleNotification = [] , setScheduleNotification } = scheduleNotCont
  let { notification = [] , setNotification } = context
  const notificationArray = Array.isArray(notification) ? notification : [];
  const scheduleNotificationArray = Array.isArray(scheduleNotification) ? scheduleNotification : [];
  
  
  let totalNotifications = [...notificationArray, ...scheduleNotificationArray]
  // let totalNotifications = [...notification, ...scheduleNotification]

  // console.log(tutorDetails, "DETAUL")


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true)
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false)
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);
  const getNotificationMessage = () => {
    if (refresh) {



      // interface LoginAuth {
      //   status: Number;
      //   tutorID: Number;
      //   token: string;
      // }

      // const data: any = await AsyncStorage.getItem('loginAuth');
      // let loginData: LoginAuth = JSON.parse(data);
      // let { tutorID } = loginData;

      setLoading(true);
      axios
        .get(`${Base_Uri}api/notifications/${tutorDetails.tutorId}`)
        .then(async ({ data }) => {
          let { notifications } = data;
          let tutorNotification =
            notifications?.length > 0 &&
            notifications.filter((e: any, i: number) => {
              return e.status == "new";
            });
          setLoading(false);
          setNotification(tutorNotification);
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
    }
  };

  const getScheduleNotification = () => {

    if (refresh) {
      axios.get(`${Base_Uri}api/classScheduleStatusNotifications/${tutorDetails.tutorId}`).then((res) => {
        let { data } = res
        setScheduleNotification(data.record)
      }).catch((error) => {

        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      })
    }


  }

  useEffect(() => {
    getNotificationMessage();
    getScheduleNotification()
  }, [refresh]);


  const navigateToOtherScreen = (item: any) => {
    
    if (item?.notificationType == "Submit Evaluation Report" || item?.notificationType == "Submit Progress Report") {
      navigation.navigate("ReportSubmission", item)
      axios.get(`${Base_Uri}api/updateNotificationStatus/${item.notificationID}/old`).then((res) => {

        let updateNotifications = notification.filter((e: any, i: number) => {
          return e.notificationID !== item?.notificationID
        })

        setNotification(updateNotifications)

        // axios
        //   .get(`${Base_Uri}api/notifications/${tutorDetails?.tutorId}`)
        //   .then(({ data }) => {
        //     let { notifications } = data;

        //     let tutorNotification =
        //       notifications.length > 0 &&
        //       notifications.filter((e: any, i: number) => {
        //         return e.status == 'new';
        //       });
        //     setNotification(tutorNotification);
        //   })
        //   .catch(error => {
        //     ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        //   });
      }).catch((error) => {
        ToastAndroid.show("Nework Error", ToastAndroid.SHORT)
      })
    }
    else if(item?.notificationType == "Schedule Class"){
      navigation.navigate('AddClass')
      axios.get(`${Base_Uri}api/updateNotificationStatus/${item.notificationID}/old`).then((res) => {

        let updateNotifications = notification.filter((e: any, i: number) => {
          return e.notificationID !== item?.notificationID
        })

        setNotification(updateNotifications)
      }).catch((error) => {
        ToastAndroid.show("Nework Error", ToastAndroid.SHORT)
      })
    } 
    else {
      item.status = "attended"
      item.id = item?.class_schedule_id
      // navigation.navigate("EditAttendedClass", { data: item })
      axios.get(`${Base_Uri}api/updateNotificationStatus/${item.notificationID}/old`).then((res) => {
        let updateNotifications = notification.filter((e: any, i: number) => {
          return e.notificationID !== item?.notificationID
        })
        setNotification(updateNotifications)
      }).catch((error) => {
        ToastAndroid.show("Nework Error", ToastAndroid.SHORT)
      })
    }
  }



  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Notifications" backBtn navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {notification && scheduleNotification && totalNotifications?.length > 0 ? (
          <View>
          <FlatList
            data={totalNotifications || []}
            nestedScrollEnabled={true}
            renderItem={({ item, index }: any) => {
              console.log("item=======>",item);
              
              return (
                <TouchableOpacity
                  onPress={() => navigateToOtherScreen(item)}
                  activeOpacity={0.8}
                  key={index}
                  style={{ paddingHorizontal: 15 }}>
                  <View
                    style={{
                      backgroundColor: Theme.white,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginVertical: 5,
                      borderWidth: 1,
                      borderColor: '#eee',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '95%' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: Theme.gray,
                            fontSize: 14,
                            fontWeight: '600',
                            marginTop: 5,
                            width: '75%',
                            fontFamily: 'Circular Std Medium'
                          }}>
                          {item.notificationType ?? "Update Schedule Classs"}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 14,
                          fontWeight: '600',
                          marginTop: 10,
                          fontFamily: 'Circular Std Medium'
                        }}>
                        {`Student Name: ${item?.studentName} `}
                      </Text>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 14,
                          fontWeight: '600',
                          fontFamily: 'Circular Std Medium'
                        }}>
                        {`Subject Name: ${item?.subjectName} `}
                      </Text>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontSize: 12,
                          fontWeight: '600',
                          marginTop: 5,
                          fontFamily: 'Circular Std Medium'
                        }}>
                        {item.notificationProgressReportMonth}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Image
                        source={require('../../Assets/Images/right.png')}
                        resizeMode="contain"
                        style={{ height: 18, width: 18 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'center',
              alignItems: 'center',
              height: height / 1.5,
            }}>
            <AntDesign name="copy1" size={20} color={Theme.gray} />
            <Text style={{ color: Theme.gray,fontFamily: 'Circular Std Medium' }}>There are no Notifications</Text>
          </View>
        )}
      </ScrollView>
      <CustomLoader visible={loading} />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
