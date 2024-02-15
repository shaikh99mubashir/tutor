import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import {Theme} from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import Header from '../../Component/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Base_Uri} from '../../constant/BaseUri';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentContext from '../../context/studentContext';
import scheduleContext from '../../context/scheduleContext';
import {useIsFocused} from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import CustomLoader from '../../Component/CustomLoader';
import AntDesign from 'react-native-vector-icons/AntDesign';

function AddClass({navigation}: any) {
  const [student, setStudent] = useState([]);
  const [subject, setSubject] = useState([]);

  const [tutorId, setTutorId] = useState(null);
  const [mode, setMode] = useState<any>('date');
  const [confirm, setConfirm] = useState(false);
  const [clickedStartTime, setClickedStartTime] = useState(false);
  const [show, setShow] = useState(false);
  const [indexClicked, setIndexClicked] = useState<null | Number>(null);
  const [value, setValue] = useState(new Date());
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const studentAndSubjectContext = useContext(StudentContext);
  const context = useContext(StudentContext);
  const {students, subjects} = context;
  const {updateStudent} = studentAndSubjectContext;
  console.log('subject ?????', subject);

  const [classes, setClasses] = useState<any>([
    {
      tutorID: tutorId,
      studentID: selectedStudent?.studentID,
      subjectID: selectedSubject?.id,
      startTime: '-',
      endTime: '-',
      // date: new Date(),
      date: new Date(),
    },
  ]);
  useEffect(() => {
    setClasses([]); // Reset classes to an empty array
  }, [selectedSubject]);
  const tutorDetailCont = useContext(TutorDetailsContext);
  const {tutorDetails} = tutorDetailCont;

  var focus = useIsFocused();
  const getTutorStudents = async () => {
    setLoading(true);
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let {tutorID} = loginData;
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorID}`)
      .then(({data}) => {
        const {tutorStudents} = data;
        // console.log(tutorStudents, 'tutorsStudents');
        let myStudents =
          tutorStudents &&
          tutorStudents.length > 0 &&
          tutorStudents.map((e: any, i: Number) => {
            if (e.studentName) {
              return {
                ...e,
                subject: e.studentName,
              };
            }
          });

        // console.log(myStudents, 'staudents');

        setStudent(myStudents);
        setLoading(false);
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    getTutorStudents();
  }, [focus, tutorId]);

  const getSubject = () => {
    setSelectedSubject('');
    setSubject([]);
    axios
      .get(`${Base_Uri}api/getStudentSubjects/${selectedStudent?.studentID}`)
      .then(({data}) => {
        let {studentSubjects} = data;
        // console.log('studentSubjects', studentSubjects);
        let mySubject =
          studentSubjects &&
          studentSubjects.length > 0 &&
          studentSubjects
            .filter((e: any) => tutorId === e.tutor_id && e.subject)
            .map((e: any) => ({
              subject: e.name,
              id: e.id,
              remaining_classes: e.remaining_classes,
              classFrequency: e.classFrequency,
              total_hours: e.total_hours,
              reamining_hours: e.reamining_hours
            }));
        setSubject(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };
  // console.log("setSubject",subject);

  const getTutorID = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let {tutorID} = data;

    setTutorId(tutorID);
  };

  useEffect(() => {
    getTutorID();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      getSubject();
    }
  }, [selectedStudent]);

  const onChange = (event: any, selectedDate: any) => {
    setShow(false);
    const currentDate = selectedDate;
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let data;
    console.log('data', data);

    if (mode == 'date') {
      data = classes.map((e: any, i: Number) => {
        if (i == indexClicked) {
          return {
            ...e,
            date: currentDate,
          };
        } else {
          return e;
        }
      });
    } else if (mode == 'time' && clickedStartTime) {
      data = classes.map((e: any, i: Number) => {
        if (i == indexClicked) {
          return {
            ...e,
            startTime: currentDate,
          };
        } else {
          return e;
        }
      });
    } else {
      data = classes.map((e: any, i: Number) => {
        if (i == indexClicked) {
          return {
            ...e,
            endTime: currentDate,
          };
        } else {
          return e;
        }
      });
    }

    setValue(currentDate);
    setClasses(data);
    setShow(false);
    setClickedStartTime(false);
  };

  const setClassDate = (mode: any, index: Number, startTime?: Boolean) => {
    console.log('startTime==>', startTime);
    if (startTime) {
      setClickedStartTime(true);
    }
    setMode(mode);
    setIndexClicked(index);
    setShow(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [apply, setApply] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [classDeleteIndex, setClassDeleteIndex] = useState();
  const handleFilterPress = (index: any) => {
    setModalVisible(true);
    setClassDeleteIndex(index);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const [hideMoreClassesButton, setHideMoreClassesButton] = useState(true);
  const [noOfClasses, setNoOFClasses] = useState(0);
  // const MAX_CLASSES = selectedSubject?.remaining_classes || undefined;
  const MAX_CLASSES = selectedSubject?.reamining_hours;
  // console.log("classes.length", classes.length, "selectedSubject?.remaining_classes", selectedSubject?.remaining_classes);
  // useEffect(()=>{
  //   if (MAX_CLASSES == 0) {
  //     console.log("classes.length <= MAX_CLASSES - 1",classes.length <= MAX_CLASSES - 1);

  //     setHideMoreClassesButton(classes.length <= MAX_CLASSES - 1);
  //   }
  //   else if(classes.length == MAX_CLASSES ){
  //     setHideMoreClassesButton(classes.length <= MAX_CLASSES - 1);
  //   }
  //   else{
  //     setHideMoreClassesButton(true)
  //   }
  // },[])
  // if (MAX_CLASSES <= 0 || MAX_CLASSES <= index ) {
  //   return null; // Don't render the class
  // }
  const renderClasses = ({item, index}: any) => {
    // if (MAX_CLASSES <= 0 || MAX_CLASSES <= index ) {
  //   return null; // Don't render the class
  // }
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            borderTopWidth: 1,
            borderTopColor: 'lightGray',
            paddingTop: 15,
          }}>
          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '700',
            }}>
            Class {index + 1}
          </Text>
          <TouchableOpacity onPress={() => handleFilterPress(index)}>
            <Image
              source={require('../../Assets/Images/delicon.png')}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              color: Theme.black,
              fontSize: 14,
              fontWeight: '700',
              marginTop: 10,
            }}>
            Date
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#E6F2FF',
              padding: 10,
              marginTop: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: Theme.black, fontSize: 16, fontWeight: '500'}}>
              {item?.date !== '-' ? item?.date?.toString().slice(0, 15) : '-'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setClassDate('date', index)}>
              <Image
                source={require('../../Assets/Images/ScheduleIcon.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '49%'}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 14,
                fontWeight: '700',
                marginTop: 10,
              }}>
              Start Time
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#E6F2FF',
                padding: 10,
                marginTop: 5,
                borderRadius: 5,
              }}>
              <Text
                style={{color: Theme.black, fontSize: 16, fontWeight: '500'}}>
                {item?.startTime !== '-'
                  ? new Date(item?.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '00:00 AM'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setClassDate('time', index, true)}>
                <Image
                  source={require('../../Assets/Images/ClockiconCopy.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{width: '49%'}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 14,
                fontWeight: '700',
                marginTop: 10,
              }}>
              End Time
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#E6F2FF',
                padding: 10,
                marginTop: 5,
                borderRadius: 5,
              }}>
              <Text
                style={{color: Theme.black, fontSize: 16, fontWeight: '500'}}>
                {item?.endTime !== '-'
                  ? new Date(item?.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '00:00 AM'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setClassDate('time', index)}>
                <Image
                  source={require('../../Assets/Images/ClockiconCopy.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const deleteClass = (index: any) => {
    let data: any =
      classes &&
      classes.length > 0 &&
      classes.filter((e: any, i: Number) => {
        return i !== index;
      });

    setClasses(data);
  };

  const ApplyButton = async () => {
    if (apply) {
      deleteClass(classDeleteIndex);
      handleCloseModal();
    }
  };
  const CancelButton = () => {
    handleCloseModal();
  };

  // classes.map((classesObject:any, classesIndex:number) => {

  //   console.log(`Start Time: ${classesObject.startTime}, End Time: ${classesObject.endTime}`);
  // });

  // if (classesObject.startTime.getTime() < currentTime.getTime()) {
  //   console.log("classesObject.startTime",classesObject.startTime.getTime());
  //   console.log("currentTime",currentTime.getTime());

  //     console.log(`Class at index ${classesIndex} cannot be added as its start time is in the past.`);
  //     ToastAndroid.show(`Class at index ${classesIndex + 1} cannot be added as its start time is in the past.`, ToastAndroid.SHORT);
  // } else
  const addClass = () => {
    console.log('====================================running');
    console.log('classes', classes);
    let newClass = {
      tutorID: tutorId,
      studentID: selectedStudent?.studentID,
      subjectID: selectedSubject?.id,
      startTime: '-',
      endTime: '-',
      // date: new Date(),
      date: new Date(),
    };
    console.log('selected Subject', selectedSubject);
    if (classes.length > 0) {
      classes.map((classesObject: any, classesIndex: number) => {
        const currentTime = new Date();
        const timeDifference =
        classesObject.endTime.getTime() - classesObject.startTime.getTime();
        if (timeDifference < 30 * 60000) {
          console.log(
            `Class No ${classesIndex} cannot be added as its start time is less than 30 minutes from now.`,
          );
          ToastAndroid.show(
            `Class No ${
              classesIndex + 1
            } cannot be added as its start time is less than 30 minutes from now.`,
            ToastAndroid.SHORT,
          );
          return;
        }
        setClasses([...classes, newClass]);
      });
    } else {
      console.log('class add hoo gai');
      setClasses([...classes, newClass]);
    }
  };

  const confirmClass = () => {
    setLoading(true);

    if (classes.length > 0) {
      classes.map((classesObject: any, classesIndex: number) => {
        const currentTime = new Date();
        const timeDifference =
        classesObject.endTime.getTime() - classesObject.startTime.getTime();
        if (timeDifference < 30 * 60000) {
          console.log(
            `Class No ${classesIndex} cannot be added as its start time is less than 30 minutes from now.`,
          );
          ToastAndroid.show(
            `Class No ${
              classesIndex + 1
            } cannot be added as its start time is less than 30 minutes from now.`,
            ToastAndroid.SHORT,
          );
          return;
        }
      });
    }

    let classesToAdd: any = [...classes];

    for (let i = 0; i < classesToAdd.length; i++) {
      for (let j = i + 1; j < classesToAdd.length; j++) {
        const classA = classesToAdd[i];
        const classB = classesToAdd[j];

        const dateA = classA.date;
        const dateB = classB.date;

        if (
          dateA.getDate() === dateB.getDate() &&
          dateA.getMonth() === dateB.getMonth() &&
          dateA.getFullYear() === dateB.getFullYear() &&
          ((classA.startTime <= classB.endTime &&
            classB.startTime <= classA.endTime) ||
            (classB.startTime <= classA.endTime &&
              classA.startTime <= classB.endTime))
        ) {
          ToastAndroid.show(
            'Classes have overlapping time slots',
            ToastAndroid.SHORT,
          );
          setLoading(false);
          return;
        }
      }
    }

    classesToAdd =
      classesToAdd &&
      classesToAdd.length > 0 &&
      classesToAdd.map((e: any, i: number) => {
        if (e?.startTime == '-') {
          return 'false';
        }
        if (e?.endTime == '-') {
          return 'false';
        }
        if (!selectedStudent) {
          return 'false';
        }
        if (!selectedSubject) {
          return 'false';
        }

        const year = e?.date?.getFullYear();
        const month = (e?.date?.getMonth() + 1)?.toString()?.padStart(2, '0'); // Adding 1 since month is zero-based
        const day = e?.date?.getDate()?.toString()?.padStart(2, '0');

        let hours = e?.startTime?.getHours();
        let minutes = e?.startTime?.getMinutes();
        let seconds = e?.startTime?.getSeconds();

        let endHour = e?.endTime?.getHours();
        let endMinutes = e?.endTime?.getMinutes();
        let endSeconds = e?.endTime?.getSeconds();

        return {
          tutorID: tutorId,
          studentID: selectedStudent?.studentID,
          subjectID: selectedSubject?.id,
          startTime:
            hours +
            ':' +
            (minutes.toString().length < 2 ? `0${minutes}` : minutes) +
            ':' +
            (seconds.toString().length < 2 ? `0${seconds}` : seconds),
          endTime:
            endHour +
            ':' +
            (endMinutes.toString().length < 2 ? `0${endMinutes}` : endMinutes) +
            ':' +
            (endSeconds.toString().length < 2 ? `0${endSeconds}` : endSeconds),
          date:
            year +
            '-' +
            month +
            '-' +
            day +
            ' ' +
            '00' +
            ':' +
            '00' +
            ':' +
            '00',
        };
      });

    let flag = classesToAdd.some((e: any, i: number) => e == 'false');

    if (flag) {
      ToastAndroid.show('Required Field are missing', ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    let classesss = {
      classes: classesToAdd,
    };

    axios
      .post(`${Base_Uri}api/addMultipleClasses`, classesss)
      .then(res => {
        setLoading(false);
        if (res?.data?.message?.includes('slot')) {
          // console.log("res.data.message",res.data.message);

          ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
          return;
        }
        navigation.navigate('Schedule', classesss?.classes[0]?.startTime);
        ToastAndroid.show(res?.data?.message, ToastAndroid.SHORT);
      })
      .catch(error => {
        setLoading(false);
        console.log(error, 'error');
        if (error.response) {
          console.error('Server Response:', error.response.data);
          console.error('Status Code:', error.response.status);
          console.error('Headers:', error.response.headers);
        }
        ToastAndroid.show(
          `Sorry classes added unsuccessfull ${error}`,
          ToastAndroid.SHORT,
        );
      });
  };

  return (
    //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //     <ActivityIndicator size="large" color={Theme.black} />
    //   </View>
    // ) : (
    <View style={{flex: 1, backgroundColor: Theme.white}}>
      <View>
        <Header title={'Add Class'} backBtn navigation={navigation} />
      </View>

      {student && student.length !== 0 ? (
        <>
          <View style={{padding: 20, flex: 1}}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              <View>
                <CustomDropDown
                  ddTitle={'Student'}
                  setSelectedSubject={setSelectedStudent}
                  selectedSubject={selectedStudent}
                  dropdownContainerStyle={{
                    // backgroundColor: Theme.lightGray,
                    paddingVertical: 17,
                    borderColor: Theme.gray,
                    borderWidth: 1,
                  }}
                  dropdownPlace={'Select Student'}
                  subject={student}
                  headingStyle={{
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '700',
                  }}
                />

                {selectedStudent && (
                  <CustomDropDown
                    ddTitle={'Subject'}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                    dropdownContainerStyle={{
                      paddingVertical: 17,
                      borderColor: Theme.gray,
                      borderWidth: 1,
                    }}
                    dropdownPlace={'Select Subject '}
                    subject={subject}
                    headingStyle={{
                      color: Theme.black,
                      fontSize: 14,
                      fontWeight: '700',
                    }}
                  />
                )}
              </View>

              {selectedSubject?.subject && (
                <View style={{ marginVertical: 10 }}>
                  <Text
                    style={[styles.textType1, { fontSize: 16 }]}>
                    Class Details
                  </Text>
                  <View
                    style={{
                      backgroundColor: Theme.lightGray,
                      elevation: 2,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginVertical: 5,
                    }}>
                    <Text style={styles.textType3}>
                      {selectedSubject?.subject} Total Hours are{' '}
                      <Text style={{ fontWeight: '600' }}>{selectedSubject?.total_hours}</Text>. You can schedule
                      Your reamining Hours <Text style={{ fontWeight: '600' }}> {selectedSubject?.reamining_hours}</Text>
                      {/* <Text style={{ fontWeight: '600' }}> {classes.length} / {MAX_CLASSES}  </Text> */}
                    </Text>

                  </View>
                </View>
              )}

              <View style={{marginBottom: 100}}>
                <FlatList data={classes} renderItem={renderClasses} />
              </View>
            </ScrollView>
            {/* {MAX_CLASSES > 0 && MAX_CLASSES > classes.length && ( */}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 60,
              }}>
              <TouchableOpacity
                onPress={() => addClass()}
                style={{
                  backgroundColor: Theme.gray,
                  padding: 15,
                  borderRadius: 10,
                  width: '100%',
                }}>
                {/* {selectedSubject?.remaining_classes
                  } */}

                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: Theme.white,
                  }}>
                  {/* {classes.length > 0  ? 'Add More Classes' : 'Add Classes'} */}
                  {classes.length > 0 ? 'Add More Classes' : 'Add Classes'}
                </Text>
              </TouchableOpacity>
            </View>
            {/* )} */}

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={value}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
              />
            )}
          </View>
          {/* {MAX_CLASSES > 0 && MAX_CLASSES >= classes.length && ( */}
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              position: 'absolute',
              bottom: 20,
            }}>
            <TouchableOpacity
              onPress={() => confirmClass()}
              style={{
                backgroundColor: Theme.darkGray,
                padding: 15,
                borderRadius: 10,
                width: '90%',
                opacity: classes.length > 0 ? 1 : 0.7,
              }}
              disabled={classes.length === 0}>
              <Text
                style={{textAlign: 'center', fontSize: 14, color: Theme.white}}>
                Confirm Class
              </Text>
            </TouchableOpacity>
          </View>
          {/* )} */}
        </>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Image
            source={require('../../Assets/Images/nsa.png')}
            style={{width: 300, height: 300}}
          />
        </View>
      )}

      <CustomLoader visible={loading} />
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
              Remove this Class ?
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

export default AddClass;
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
    fontFamily: 'Circular Std',
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

// <View>
//   <View
//     style={{
//       flexDirection: 'row',
//       width: '100%',
//       justifyContent: 'space-between',
//     }}>
//     <Text
//       style={{
//         color: Theme.black,
//         fontSize: 14,
//         fontWeight: '700',
//         marginTop: 20,
//       }}>
//       Class {index + 1}
//     </Text>
//     <TouchableOpacity onPress={() => deleteClass(index)}>
//       <Text
//         style={{
//           color: Theme.red,
//           fontSize: 14,
//           fontWeight: '700',
//           marginTop: 20,
//           marginRight: 5,
//         }}>
//         Delete
//       </Text>
//     </TouchableOpacity>
//   </View>
//   <View
//     style={{
//       // backgroundColor: Theme.lightGray,
//       padding: 10,
//       borderRadius: 10,
//       marginTop: 10,
//       borderWidth: 1,
//       borderColor: Theme.gray,
//     }}>
//     <TouchableOpacity
//       activeOpacity={0.8}
//       style={{ paddingVertical: 5 }}
//       onPress={() => setClassDate('date', index)}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}>
//         <Text
//           style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
//           Date
//         </Text>
//         <Text
//           style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
//           {item?.date !== '-' ? item?.date?.toString().slice(0, 15) : '-'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//     <View
//       style={{
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 10,
//         width: '100%',
//       }}>
//       <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
//         Start Time
//       </Text>

//       <TouchableOpacity
//         onPress={() => setClassDate('time', index, true)}
//         style={{ minWidth: 50, alignItems: 'flex-end' }}>
//         <Text
//           style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
//           {item?.startTime !== '-'
//             ? new Date(item?.startTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })
//             : '-'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//     <View
//       style={{
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 10,
//       }}>
//       <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
//         End Time
//       </Text>

//       <TouchableOpacity
//         onPress={() => setClassDate('time', index)}
//         style={{ minWidth: 50, alignItems: 'flex-end' }}>
//         <Text
//           style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
//           {item?.endTime !== '-'
//             ? new Date(item?.endTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })
//             : '-'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </View>
