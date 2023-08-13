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
} from 'react-native';
import { Theme } from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import Header from '../../Component/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentContext from '../../context/studentContext';

function AddClass({ navigation }: any) {
  const [student, setStudent] = useState([
    {
      id: 1,
      subject: 'zain',
    },
    {
      id: 2,
      subject: 'bilal',
    },
    {
      id: 3,
      subject: 'mubashir',
    },
    {
      id: 3,
      subject: 'khurram',
    },
  ]);

  const [subject, setSubject] = useState([
    {
      id: 1,
      subject: 'math',
    },
    {
      id: 2,
      subject: 'physic',
    },
    {
      id: 3,
      subject: 'science',
    },
    {
      id: 3,
      subject: 'history',
    },
  ]);

  const [tutorId, setTutorId] = useState(null)
  const [mode, setMode] = useState<any>('date');
  const [confirm, setConfirm] = useState(false);
  const [clickedStartTime, setClickedStartTime] = useState(false);
  const [show, setShow] = useState(false);
  const [indexClicked, setIndexClicked] = useState<null | Number>(null);
  const [value, setValue] = useState(new Date());
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [loading, setLoading] = useState(false)


  const context = useContext(StudentContext)
  const { students, subjects } = context
  const [classes, setClasses] = useState<any>([
    {
      tutorID: tutorId,
      studentID: selectedStudent?.studentID,
      subjectID: selectedSubject?.id,
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      // date: new Date(),
      date: '-',
    },
  ]);


  const getSubject = () => {
    // axios
    //   .get(`${Base_Uri}getTutorSubjects/${tutorId}`)
    //   .then(({ data }) => {
    //     let { tutorSubjects } = data;

    let mySubject =
      subjects &&
      subjects.length > 0 &&
      subjects.map((e: any, i: Number) => {
        if (e.subject) {
          return {
            subject: e.subject,
            id: e.id,
          };
        }
      });

    setSubject(mySubject);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  };

  const getTutorID = async () => {

    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    setTutorId(tutorID)

  }


  const getStudents = async () => {


    let myStudents =
      students &&
      students.length > 0 &&
      students.map((e: any, i: Number) => {
        if (e.studentName) {
          return {
            ...e,
            subject: e.studentName
          };
        }
      });
    setStudent(myStudents);

  };


  useEffect(() => {
    getTutorID()
  }, [])

  useEffect(() => {
    if (tutorId) {
      getSubject();
      getStudents();
    }
  }, [tutorId]);

  const deleteClass = (index: Number) => {
    let data: any =
      classes &&
      classes.length > 0 &&
      classes.filter((e: any, i: Number) => {
        return i !== index;
      });

    setClasses(data);
  };



  const onChange = (event: any, selectedDate: any) => {
    setShow(false);
    const currentDate = selectedDate;
    let hours = currentDate.getHours()
    let minutes = currentDate.getMinutes()
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

  const renderClasses = ({ item, index }: any) => {
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
            borderColor: Theme.gray
          }}>
            <TouchableOpacity activeOpacity={0.8} style={{paddingVertical:5}} onPress={() => setClassDate('date', index)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '500' }}>
              Date
            </Text>
              <Text
                style={{ color: Theme.black, fontSize: 12, fontWeight: '500' }}>
                
                {item?.date !== '-'
                  ? item.date.toString().slice(0, 15)
                  : '-'}
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
                {item?.startTime !== '12:00 PM'
                  ? item?.startTime.toLocaleString().slice(10)
                  : '12:00 PM'}
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
                {item?.endTime !== '02:00 PM'
                  ? item?.endTime.toLocaleString().slice(10)
                  : '02:00 PM'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };



  const addClass = () => {
    let newClass = {
      tutorID: tutorId,
      studentID: selectedStudent?.studentID,
      subjectID: selectedSubject?.id,
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      // date: new Date(),
      date: '-',
    };

    setClasses([...classes, newClass]);
  };





  const confirmClass = () => {

    setLoading(true)

    let classesToAdd: any = [...classes]

    classesToAdd = classesToAdd && classesToAdd.length > 0 && classesToAdd.map((e: any, i: number) => {

      if (e?.startTime == "-") {
        return "false"
      }
      if (e?.endTime == "-") {
        return "false"
      }
      if (!selectedStudent) {
        return "false"
      }
      if (!selectedSubject) {
        return "false"
      }

      const year = e.date.getFullYear();
      const month = (e.date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since month is zero-based
      const day = e.date.getDate().toString().padStart(2, '0');

      let hours = e.startTime.getHours()
      let minutes = e.startTime.getMinutes()
      let seconds = e.startTime.getSeconds()

      let endHour = e.endTime.getHours()
      let endMinutes = e.endTime.getMinutes()
      let endSeconds = e.endTime.getSeconds()
      return {
        tutorID: tutorId,
        studentID: selectedStudent?.studentID,
        subjectID: selectedSubject?.id,
        startTime: hours + ":" + minutes + ":" + seconds,
        endTime: endHour + ":" + endMinutes + ":" + endSeconds,
        date: year + '/' + month + '/' + day
      }
    })


    let flag = classesToAdd.some((e: any, i: number) => e == "false")

    if (flag) {
      ToastAndroid.show("Required Field are missing", ToastAndroid.SHORT)
      setLoading(false)
      return
    }
    let classesss = {
      classes: classesToAdd
    }

    axios.post(`${Base_Uri}api/addMultipleClasses`, classesss).then((res) => {
      setLoading(false)
      navigation.navigate('Schedule',classesss.classes[0].startTime);
      ToastAndroid.show(res?.data?.message, ToastAndroid.SHORT)
    }).catch((error) => {
      setLoading(false)
      console.log(error, "error")
      ToastAndroid.show("Sorry classes added unsuccessfull", ToastAndroid.SHORT)
    })
  };
  const showToast = (message:any) => {
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
  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size="large" color={Theme.black} />
    </View> : <View style={{ flex: 1, backgroundColor: Theme.white }}>
      <View>
        <Header title={'Add Class'} backBtn navigation={navigation} />
      </View>
      <View style={{ padding: 20, flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
            />)}
          </View>

          <FlatList data={classes} renderItem={renderClasses} />

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
              <Text
                style={{ textAlign: 'center', fontSize: 14, color: Theme.white }}>
                {classes.length > 0 ? 'Add More Classes' : 'Add Classes'}
              </Text>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={value}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </ScrollView>
      </View>

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
            width: '95%',
          }}>
          <Text style={{ textAlign: 'center', fontSize: 14, color: Theme.white }}>
            Confirm Class
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AddClass;
