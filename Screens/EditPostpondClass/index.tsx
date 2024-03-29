import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import {Theme} from '../../constant/theme';
import CustomHeader from '../../Component/Header';
import AntDesign from 'react-native-vector-icons/EvilIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import CustomLoader from '../../Component/CustomLoader';


function EditPostpondClass({navigation, route}: any) {
  let data = route.params?.data;
  console.log('data', data);
  let perHour = data.quantity;
  const [postponedReason, setPostponedReason] = useState<any>('');
  const [mode, setMode] = useState<any>('date');
  const [clickedStartTime, setClickedStartTime] = useState(false);
  const [show, setShow] = useState(false);
  const [indexClicked, setIndexClicked] = useState<null | Number>(null);
  const [value, setValue] = useState(new Date());

  const initialData: any = {
    date: new Date(),
    startTime: '-',
    endTime: '-',
    tutorID: data.tutorID,
    studentID: data?.studentID,
    subjectID: data?.subjectID,
  };

  const [nextClass, setNextClass] = useState(initialData);

  const [loading, setLoading] = useState(false);

  const editTutorPostPonedClass = () => {
    if (!postponedReason) {
      ToastAndroid.show('Kindly enter postponed reason', ToastAndroid.SHORT);
      return;
    }
    if (!nextClass.date) {
      ToastAndroid.show('Kindly enter next class Date', ToastAndroid.SHORT);
      return;
    }
    if (!nextClass.startTime || nextClass.startTime == '-') {
      ToastAndroid.show(
        'Kindly enter next class start time',
        ToastAndroid.SHORT,
      );
      return;
    }
    // if (!nextClass.endTime || nextClass.endTime == '-') {
    //   ToastAndroid.show('Kindly enter next class end time', ToastAndroid.SHORT);
    //   return;
    // }

    setLoading(true);

    const year = nextClass.date.getFullYear();
    const month = (nextClass.date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since month is zero-based
    const day = nextClass.date.getDate().toString().padStart(2, '0');

    let hours = nextClass?.startTime.getHours();
    let minutes = nextClass?.startTime.getMinutes();
    let seconds = nextClass?.startTime.getSeconds();

    let endHour = nextClass.endTime.getHours();
    let endMinutes = nextClass.endTime.getMinutes();
    let endSeconds = nextClass.endTime.getSeconds();

    let dataToSend = {
      tutorID: nextClass.tutorID,
      studentID: nextClass?.studentID,
      subjectID: nextClass?.subjectID,
      startTime: hours + ':' + minutes + ':' + seconds,
      endTime: endHour + ':' + endMinutes + ':' + endSeconds,
      // endTime: endTimeFormatted,
      date: year + '/' + month + '/' + day,
    };

    let classesss = {
      classes: [dataToSend],
    };

    axios
      .post(`${Base_Uri}api/addMultipleClasses`, classesss)
      .then(res => {
        axios
          .get(
            `${Base_Uri}attendedClassStatus/${data?.id}/postponed/${postponedReason}`,
          )
          .then(res => {
            setLoading(false);
            setNextClass(initialData);
            ToastAndroid.show(res?.data?.SuccessMessage, ToastAndroid.SHORT);
            navigation.navigate('Schedule', data.id);
          })
          .catch(error => {
            setLoading(false);
            ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
          });
      })
      .catch(error => {
        setLoading(false);
        console.log(error, 'error');
        ToastAndroid.show(
          'Sorry classes added unsuccessfull',
          ToastAndroid.SHORT,
        );
      });
  };

  const onChange = (event: any, selectedDate: any) => {
    setShow(false);
    const currentDate = selectedDate;

    let data = {...nextClass};

    if (mode == 'date') {
      data = {
        ...nextClass,
        date: currentDate,
      };
    } else if (mode == 'time' && clickedStartTime) {
      const start = new Date(currentDate); // Create a new Date object for the start time
          
          const end = new Date(start.getTime() + perHour * 60 * 60 * 1000); 
      data = {
        ...nextClass,
        // startTime: currentDate,
        startTime: start,
        endTime: end,
      };
    } else {
      data = {
        ...nextClass,
        endTime: currentDate,
      };
    }

    setValue(currentDate);
    setNextClass(data);
    setShow(false);
    setClickedStartTime(false);
  };

  const setClassDate = (mode: any, startTime?: Boolean) => {
    if (startTime) {
      setClickedStartTime(true);
    }
    setMode(mode);
    setShow(true);
  };

  const calculateEndTime = (startTime: string) => {
    const start = startTime !== '-' ? new Date(startTime) : new Date();
    const end = new Date(start.getTime() + perHour * 60 * 60 * 1000);
    return end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };
  const endTimeFormatted = calculateEndTime(nextClass.startTime);
  console.log('nextClass', nextClass);
  const inputRef :any = useRef(null);

  // const openKeyboard = () => {
  //   inputRef.current.focus();
  // };

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [inputRef]);
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: Theme.white}}>
      <View>
        <CustomHeader title="Edit Class" backBtn navigation={navigation} />
      </View>

      <View style={{flex: 1, padding: 20, paddingVertical: 10}}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: Theme.liteBlue,
              padding: 20,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{color: Theme.gray, fontSize: 16, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                Date
              </Text>

              <Text
                style={{color: Theme.black, fontSize: 14, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                {data?.date.toString().slice(0, 10)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{color: Theme.gray, fontSize: 16, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                Start Time
              </Text>

              <Text
                style={{color: Theme.black, fontSize: 14, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                {data?.startTime.toString().slice(0,5)}
                {/* { new Date(data?.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                   } */}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{color: Theme.gray, fontSize: 16, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                End Time
              </Text>

              <Text
                style={{color: Theme.black, fontSize: 14, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                {data?.endTime.toString().slice(0,5)}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: Theme.black,
              fontSize: 16,
              fontWeight: '600',
              marginTop: 20,
              fontFamily: 'Circular Std Medium',
            }}>
            Status
          </Text>
          <View
            style={{
              backgroundColor: Theme.liteBlue,
              padding: 20,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{color: Theme.black, fontSize: 16, fontWeight: '500', fontFamily: 'Circular Std Medium',}}>
                {route?.params?.schedule
                  ? 'Scheduled'
                  : route?.params?.postpond
                  ? 'Postponed'
                  : ''}
              </Text>

              {/* <AntDesign name="chevron-down" color={Theme.black} size={30} /> */}
            </View>
          </View>

          <View>
            <Text
              style={{
                color: Theme.black,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 8,
                fontFamily: 'Circular Std Medium',
              }}>
              Postponed Reason
            </Text>
            <TouchableWithoutFeedback >
            <View
              style={{
                height: 100,
                padding: 10,
                backgroundColor: Theme.liteBlue,
                borderRadius: 5,
                marginTop: 5,
              }}>
              <TextInput
                style={{
                  padding: 10,
                  color: Theme.black,
                  fontSize: 16,
                  paddingVertical: 3,
                }}
                onChangeText={setPostponedReason}
                multiline={true}
                placeholder="Enter Reason"
                placeholderTextColor={Theme.gray}
                autoFocus={true}
              />
            </View>
            </TouchableWithoutFeedback>
          
          </View>
          <View>
            <Text
              style={{
                color: Theme.black,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 10,
              }}>
              Next Class
            </Text>
            {/* <View
              style={{
                backgroundColor: Theme.lightGray,
                padding: 20,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
                  Date
                </Text>
                <TouchableOpacity onPress={() => setClassDate('date')}>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    {nextClass?.date.toString().slice(0, 15)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
                  Start Time
                </Text>
                <TouchableOpacity
                  onPress={() => setClassDate('time', true)}
                  style={{minWidth: 60, alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    {nextClass.startTime !== '-'
                      ? nextClass?.startTime.toLocaleString().slice(10)
                      : '-'}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
                  End Time
                </Text>
                <TouchableOpacity
                  onPress={() => setClassDate('time')}
                  style={{minWidth: 60, alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    {nextClass.endTime !== '-'
                      ? nextClass?.endTime.toLocaleString().slice(10)
                      : '-'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}

            <View>
              <View>
                <Text
                  style={[
                    styles.textType1,
                    {fontSize: 16, marginTop: 10, fontWeight: '600'},
                  ]}>
                  Date
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: Theme.liteBlue,
                    padding: 20,
                    marginTop: 5,
                    borderRadius: 15,
                  }}>
                  <Text
                    style={{
                      color: Theme.gray,
                      fontSize: 16,
                      fontWeight: '500',
                      fontFamily: 'Circular Std Medium',
                    }}>
                    {' '}
                    {nextClass?.date.toString().slice(0, 15)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setClassDate('date')}
                    activeOpacity={0.8}>
                    <Image
                      source={require('../../Assets/Images/ScheduleIcon.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View style={{width: '49%'}}>
                  <Text style={[styles.textType1, {fontSize: 16}]}>
                    Start Time
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      // backgroundColor: '#E6F2FF',
                      backgroundColor: Theme.liteBlue,
                      padding: 20,
                      marginTop: 5,
                      borderRadius: 15,
                    }}>
                    <Text
                      style={{
                        color: Theme.gray,
                        fontSize: 16,
                        fontWeight: '500',
                        fontFamily: 'Circular Std Medium',
                      }}>
                      {nextClass.startTime !== '-'
                        ? new Date(nextClass?.startTime).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )
                        : '00:00 AM'}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setClassDate('time', true)}>
                      <Image
                        source={require('../../Assets/Images/ClockiconCopy.png')}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{width: '49%'}}>
                  <Text
                    style={[
                      styles.textType1,
                      {fontSize: 16, fontWeight: '600'},
                    ]}>
                    End Time
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: Theme.liteBlue,
                      padding: 20,
                      marginTop: 5,
                      borderRadius: 15,
                    }}>
                    <Text
                      style={{
                        color: Theme.gray,
                        fontSize: 16,
                        fontWeight: '500',
                        fontFamily: 'Circular Std Medium',
                      }}>
                      {nextClass.startTime == '-'
                        ? '00:00 AM'
                        : endTimeFormatted}
                    </Text>
                    <TouchableOpacity activeOpacity={0.8}>
                      <Image
                        source={require('../../Assets/Images/ClockiconCopy.png')}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{marginBottom:10}}></View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={value}
              mode={mode}
              // is24Hour={true}
              minimumDate={new Date()}
              onChange={onChange}
            />
          )}
        </ScrollView>
      </View>
      <View
        style={{
          width: '92%',
          alignItems: 'center',
          marginBottom: 20,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={() => editTutorPostPonedClass()}
          style={{
            backgroundColor: Theme.darkGray,
            padding: 15,
            borderRadius: 10,
            width: '95%',
          }}>
          <Text style={{textAlign: 'center', fontSize: 16, color: Theme.white}}>
            Confirm Class
          </Text>
        </TouchableOpacity>
      </View>
      <CustomLoader visible={loading} />
    </KeyboardAvoidingView>
  );
}

export default EditPostpondClass;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    // borderWidth: 1,
    // padding: 5,
    borderRadius: 10,
  },
  textArea: {
    borderRadius: 10,
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontFamily: 'Circular Std',
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
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
    fontStyle: 'normal',
  },
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


{/* <View
              style={{
                backgroundColor: Theme.lightGray,
                padding: 20,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
                  Date
                </Text>
                <TouchableOpacity onPress={() => setClassDate('date')}>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    {nextClass?.date.toString().slice(0, 15)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
                  Start Time
                </Text>
                <TouchableOpacity
                  onPress={() => setClassDate('time', true)}
                  style={{minWidth: 60, alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    {nextClass.startTime !== '-'
                      ? nextClass?.startTime.toLocaleString().slice(10)
                      : '-'}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
                  End Time
                </Text>
                <TouchableOpacity
                  onPress={() => setClassDate('time')}
                  style={{minWidth: 60, alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    {nextClass.endTime !== '-'
                      ? nextClass?.endTime.toLocaleString().slice(10)
                      : '-'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}