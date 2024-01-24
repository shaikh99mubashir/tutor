import React, { useState, useEffect, useContext } from 'react';
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
import { Theme } from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import Header from '../../Component/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentContext from '../../context/studentContext';
import scheduleContext from '../../context/scheduleContext';
import { useIsFocused } from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import CustomLoader from '../../Component/CustomLoader';

function AddClass({ navigation }: any) {
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
  const { students, subjects } = context;
  const { updateStudent } = studentAndSubjectContext;
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
  const { tutorDetails } = tutorDetailCont;

  // console.log(tutorDetails, 'tutorDetails');

  const [tutorStudents, setTutorStudents] = useState([]);
  var focus = useIsFocused();
  const getTutorStudents = async () => {
    // console.log('runnning');
    setLoading(true);
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let { tutorID } = loginData;
    // console.log("tutorID",tutorID);
    // console.log("tutorDetails?.tutorId",tutorDetails?.tutorId);

    axios
      .get(`${Base_Uri}getTutorStudents/${tutorID}`)
      .then(({ data }) => {
        const { tutorStudents } = data;
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
    // console.log('====================================selectedStudent?.studentID',selectedStudent?.studentID);
    axios
      .get(`${Base_Uri}api/getStudentSubjects/${selectedStudent?.studentID}`)
      .then(({ data }) => {
        let { studentSubjects } = data;
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

    let { tutorID } = data;

    setTutorId(tutorID);
  };

  // const getStudents = async () => {
  //   let myStudents =
  //     students &&
  //     students.length > 0 &&
  //     students.map((e: any, i: Number) => {
  //       if (e.studentName) {
  //         return {
  //           ...e,
  //           subject: e.studentName,
  //         };
  //       }
  //     });
  //   setStudent(myStudents);
  // };

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
    if (startTime) {
      setClickedStartTime(true);
    }
    setMode(mode);
    setIndexClicked(index);
    setShow(true);
  };
  const [hideMoreClassesButton, setHideMoreClassesButton] = useState(true);
  const [noOfClasses, setNoOFClasses] = useState(0);
  // const MAX_CLASSES = selectedSubject?.remaining_classes || undefined;
  const MAX_CLASSES = selectedSubject?.remaining_classes;
  console.log("classes.length", classes.length, "selectedSubject?.remaining_classes", selectedSubject?.remaining_classes);
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
  const renderClasses = ({ item, index }: any) => {
    if (MAX_CLASSES <= 0 || MAX_CLASSES <= index ) {
      return null; // Don't render the class
    }
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: Theme.black,
              fontSize: 14,
              fontWeight: '700',
              marginTop: 20,
            }}>
            Class {index + 1}
          </Text>
          <TouchableOpacity onPress={() => deleteClass(index)}>
            <Text
              style={{
                color: Theme.red,
                fontSize: 14,
                fontWeight: '700',
                marginTop: 20,
                marginRight: 5,
              }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            // backgroundColor: Theme.lightGray,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            borderWidth: 1,
            borderColor: Theme.gray,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ paddingVertical: 5 }}
            onPress={() => setClassDate('date', index)}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
                Date
              </Text>
              <Text
                style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
                {item?.date !== '-' ? item?.date?.toString().slice(0, 15) : '-'}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              width: '100%',
            }}>
            <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
              Start Time
            </Text>

            <TouchableOpacity
              onPress={() => setClassDate('time', index, true)}
              style={{ minWidth: 50, alignItems: 'flex-end' }}>
              <Text
                style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
                {item?.startTime !== '-'
                  ? new Date(item?.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  : '-'}
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
            <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
              End Time
            </Text>

            <TouchableOpacity
              onPress={() => setClassDate('time', index)}
              style={{ minWidth: 50, alignItems: 'flex-end' }}>
              <Text
                style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
                {item?.endTime !== '-'
                  ? new Date(item?.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  : '-'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const deleteClass = (index: Number) => {
    let data: any =
      classes &&
      classes.length > 0 &&
      classes.filter((e: any, i: Number) => {
        return i !== index;
      });

    setClasses(data);
  };

  const addClass = () => {
    let newClass = {
      tutorID: tutorId,
      studentID: selectedStudent?.studentID,
      subjectID: selectedSubject?.id,
      startTime: '-',
      endTime: '-',
      // date: new Date(),
      date: new Date(),
    };

    setClasses([...classes, newClass]);
  };

  const confirmClass = () => {
    setLoading(true);

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
        ToastAndroid.show(
          'Sorry classes added unsuccessfull',
          ToastAndroid.SHORT,
        );
      });
  };
  const showToast = (message: any) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  const handleSubjectDropdownOpen = () => {
    if (selectedStudent) {
      // Open the subject dropdown or perform any action
      // showToast('Subject dropdown opened.');
    } else {
      // Show an error message
      showToast('Please select the student before you select the subject.');
    }
  };

  // console.log(student, 'student');

  return (
    //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //     <ActivityIndicator size="large" color={Theme.black} />
    //   </View>
    // ) : (
    <View style={{ flex: 1, backgroundColor: Theme.white }}>
      <View>
        <Header title={'Add Class'} backBtn navigation={navigation} />
      </View>

      {student && student.length !== 0 ? (
        <>
          <View style={{ padding: 20, flex: 1 }}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
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
                    // setSelectedSubject={handleSubjectDropdownOpen}
                    dropdownContainerStyle={{
                      // backgroundColor: Theme.lightGray,
                      paddingVertical: 17,
                      borderColor: Theme.gray,
                      borderWidth: 1,
                      // borderBottomWidth: 0,
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
                      {selectedSubject?.subject} Total classes are{' '}
                      <Text style={{ fontWeight: '600' }}>{selectedSubject?.classFrequency}</Text>. You can schedule
                      <Text style={{ fontWeight: '600' }}> {classes.length} / {MAX_CLASSES}  </Text>
                    </Text>

                  </View>
                </View>
              )}


          
                <View style={{ marginBottom: 100 }}>
                  <FlatList data={classes} renderItem={renderClasses} />
                </View>
        
            </ScrollView>
            {MAX_CLASSES > 0 && MAX_CLASSES > classes.length && (
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
            )}

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
          {MAX_CLASSES > 0 && MAX_CLASSES > classes.length && (
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
              disabled={classes.length === 0}
              >
              <Text
                style={{ textAlign: 'center', fontSize: 14, color: Theme.white }}>
                Confirm Class
              </Text>
            </TouchableOpacity>
          </View>
          )}
        </>
      ) : (
        // <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        //   <Text style={{color: 'black'}}> You have No Students</Text>
        // </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Image
            source={require('../../Assets/Images/nsa.png')}
            style={{ width: 300, height: 300 }}
          />
        </View>
      )}

      <CustomLoader visible={loading} />
      {/* <Modal visible={loading} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <ActivityIndicator size={'large'} color={Theme.darkGray} />
        </View>
      </Modal> */}
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
});