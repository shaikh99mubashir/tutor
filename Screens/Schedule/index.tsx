import React, { useState, useCallback, useEffect } from 'react';
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
// import { ScrollView } from "react-native-gesture-handler"

function Schedule({ navigation }: any) {
  // type ISchedule = {
  //   imageUrl: any;
  //   name: String;
  //   Subject: String;
  //   date: any;
  //   startTime: any;
  //   endTime: any;
  //   status: String;
  //   selected?: Boolean;
  // }[];
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<any>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState({});

  const [mode, setMode] = useState<any>('date');
  const [confirm, setConfirm] = useState(false);
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);



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
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(({ data }) => {
        let { classSchedulesTime } = data;
        classSchedulesTime =
          classSchedulesTime &&
            classSchedulesTime.length > 0 ?
            classSchedulesTime.map((e: any, i: number) => {
              return {
                ...e,
                imageUrl: require('../../Assets/Images/student.png'),
              };
            }) : []

        axios.get(`${Base_Uri}getClassAttendedTime/${tutorID}`).then(({ data }) => {

          let { classAttendedTime } = data

          classAttendedTime =
            classAttendedTime &&
              classAttendedTime.length > 0 ?
              classAttendedTime.map((e: any, i: number) => {
                return {
                  ...e,
                  imageUrl: require('../../Assets/Images/student.png'),
                };
              }) : [];

          setLoading(false);

          let dataToSend = [...classSchedulesTime, ...classAttendedTime]
          console.log(dataToSend,"DATA")
          setScheduleData(dataToSend);


        })


      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };




  useEffect(() => {
    getScheduledData();
  }, [refresh]);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setSelectedDate(currentDate);
    setShow(false);
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

  const handleSelectPress = (index: Number) => {
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

  const confirmModal = useCallback(() => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirm}
          onRequestClose={() => {
            setConfirm(false);
          }}>
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
                    fontSize: 18,
                    textAlign: 'left',
                    fontWeight: '600',
                  },
                ]}>
                Select Status
              </Text>
              <TouchableOpacity
                onPress={() => navigateToEditScreen('schedule')}
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
                  Schedule
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => navigateToEditScreen('attended')}
                style={{ width: '100%' }}>
                <Text
                  style={[
                    styles.text,
                    { color: Theme.black, paddingTop: 20, width: '100%' },
                  ]}>
                  Attended
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }, [confirm, selectedData]);

  const handleEditPress = (item: any): any => {
    setConfirm(true);
    setSelectedData(item);
  };

  const routeToClockIn = async (item: any) => {


    let data: any = await AsyncStorage.getItem("classInProcess")
    data = JSON.parse(data)

    if (data && Object.keys(data).length > 0) {
      ToastAndroid.show("Cannot attend another class your class is already in process", ToastAndroid.SHORT)
    } else {
      navigation.navigate('ClockIn', item)
    }
  }

  const renderScheduleData = ({ item, index }: any): any => {

    console.log(item, "mYitems")

    return (
      <TouchableOpacity
        onPress={() => handleSelectPress(index)}
        style={{
          borderWidth: 1,
          borderColor: item.selected ? Theme.darkGray : Theme.lightGray,
          padding: 20,
          backgroundColor: Theme.lightGray,
          marginTop: 20,
          borderRadius: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Theme.lightGray,
              borderRadius: 100,
              width: 70,
              height: 70,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Theme.darkGray,
            }}>
            <Image source={item.imageUrl} style={{ width: 55, height: 55 }} />
          </View>
          <Text style={{ fontSize: 14, color: Theme.gray, marginLeft: 10 }}>
            {item?.studentName}
          </Text>
        </View>

        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 16,
              color: Theme.black,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
            {item.subjectName}
          </Text>
        </View>

        <Text style={{ color: Theme.gray, marginTop: 10 }}>{item.date}</Text>
        <Text style={{ color: Theme.gray }}>
          {item.startTime} to {item.endTime}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
          <Text style={{ color: Theme.gray, marginTop: 10 }}>{item.status}</Text>
          {item.status == 'Attended' ? <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('AttendedDetails')}><Text style={{ color: Theme.gray, marginTop: 10 }}>View Details</Text></TouchableOpacity> : ''}
        </View>
        {item.selected && item.status == "schedule" && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => handleEditPress(item)}
              style={{
                backgroundColor: Theme.gray,
                width: '48%',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => routeToClockIn(item)}
              style={{
                backgroundColor: Theme.darkGray,
                width: '48%',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Attend</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.selected && item.status == "attended" && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
              marginTop: 10,
            }}>

            <TouchableOpacity
              onPress={() => navigation.navigate('AttendedDetails', item)}
              style={{
                backgroundColor: Theme.darkGray,
                width: '48%',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={Theme.black} />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Schedule" plus navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        nestedScrollEnabled={true}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 18, color: Theme.black, fontWeight: '700' }}>
              {selectedDate.toString().slice(4, 15)}
            </Text>
            <AntDesign name="chevron-down" color={Theme.black} size={30} />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          {scheduleData.length == 0 ? (
            <View
              style={{
                height: Dimensions.get('window').height - 180,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', color: Theme.black }}>
                No Schedule Data...
              </Text>
            </View>
          ) : (
            <FlatList
              nestedScrollEnabled={true}
              data={scheduleData}
              renderItem={renderScheduleData}
            />
          )}
        </View>

        {confirm && confirmModal()}
      </ScrollView>
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
});
