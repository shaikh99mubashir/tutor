import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  ToastAndroid,
} from 'react-native';
import { Theme } from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import Header from '../../Component/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [selectedStudent, setSelectedStudent] = useState<any>("")
  const [selectedSubject, setSelectedSubject] = useState<any>("")



  const [classes, setClasses] = useState<any>([
    {
      tutorID: tutorId,
      studentID: selectedStudent?.studentID,
      subjectID: selectedSubject?.id,
      startTime: '-',
      endTime: '-',
      date: new Date(),
    },
  ]);

  console.log(classes, "classed")



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

        setSubject(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };



  const getStudents = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    setTutorId(tutorID)

    axios
      .get(`${Base_Uri}getTutorStudents/${tutorID}`)
      .then(({ data }) => {
        let { tutorStudents } = data;

        let myStudents =
          tutorStudents &&
          tutorStudents.length > 0 &&
          tutorStudents.map((e: any, i: Number) => {
            if (e.studentName) {
              return {
                ...e,
                subject: e.studentName
              };
            }
          });
        setStudent(myStudents);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSubject();
    getStudents();
  }, []);

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
    const currentDate = selectedDate;
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
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Class {index + 1}
          </Text>
          <TouchableOpacity onPress={() => deleteClass(index)}>
            <Text
              style={{
                color: Theme.red,
                fontSize: 18,
                fontWeight: '600',
                marginTop: 20,
                marginRight: 5,
              }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: Theme.lightGray,
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
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
              Date
            </Text>
            <TouchableOpacity onPress={() => setClassDate('date', index)}>
              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {item.date.toString().slice(0, 15)}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              width: '100%',
            }}>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
              Start Time
            </Text>

            <TouchableOpacity
              onPress={() => setClassDate('time', index, true)}
              style={{ minWidth: 50, alignItems: 'flex-end' }}>
              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {item?.startTime !== '-'
                  ? item?.startTime.toLocaleString().slice(10)
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
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
              End Time
            </Text>

            <TouchableOpacity
              onPress={() => setClassDate('time', index)}
              style={{ minWidth: 50, alignItems: 'flex-end' }}>
              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {item?.endTime !== '-'
                  ? item?.endTime.toLocaleString().slice(10)
                  : '-'}
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
      startTime: '-',
      endTime: '-',
      date: new Date(),
    };

    setClasses([...classes, newClass]);
  };





  const confirmClass = () => {


    let classesToAdd: any = [...classes]

    console.log(classesToAdd, 'calssesToAddd')

    classesToAdd = classesToAdd && classesToAdd.length > 0 && classesToAdd.map((e: any, i: number) => {

      const year = e.date.getFullYear();
      const month = (e.date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since month is zero-based
      const day = e.date.getDate().toString().padStart(2, '0');

      return {
        tutorID: tutorId,
        studentID: selectedStudent?.studentID,
        subjectID: selectedSubject?.id,
        startTime: e.startTime.toLocaleString().length > 21 ? e.startTime.toLocaleString().slice(11, 19) : e.startTime.toLocaleString().slice(11, 18),
        endTime: e.endTime.toLocaleString().length > 21 ? e.endTime.toLocaleString().slice(11, 19) : e.endTime.toLocaleString().slice(11, 18),
        date: year + '/' + month + '/' + day
      }
    })

    console.log(classesToAdd, 'toadd')

    let classesss = {
      classes: classesToAdd
    }

    console.log(classesss, 'classssseeeesss')



    axios.post(`${Base_Uri}api/addMultipleClasses`, classesss).then((res) => {
      navigation.navigate('BackToDashboard');
      ToastAndroid.show(res?.data?.message, ToastAndroid.SHORT)
    }).catch((error) => {
      console.log(error, "error")
      ToastAndroid.show("Internal Server Error", ToastAndroid.SHORT)
    })
  };
  return (
    <View style={{ flex: 1, backgroundColor: Theme.white }}>
      <View>
        <Header title={'Add Class'} backBtn navigation={navigation} />
      </View>
      <View style={{ padding: 20, flex: 1 }}>
        <ScrollView>
          <View>
            <CustomDropDown
              ddTitle={'Student'}
              setSelectedSubject={setSelectedStudent}
              selectedSubject={selectedStudent}
              dropdownContainerStyle={{
                backgroundColor: Theme.lightGray,
                paddingVertical: 17,
                borderColor: '',
                borderWidth: 0,
                borderBottomWidth: 0,
              }}
              dropdownPlace={'Select Student'}
              subject={student}
              headingStyle={{
                color: Theme.black,
                fontSize: 18,
                fontWeight: '700',
              }}
            />
            <CustomDropDown
              ddTitle={'Subject'}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              dropdownContainerStyle={{
                backgroundColor: Theme.lightGray,
                paddingVertical: 17,
                borderColor: '',
                borderWidth: 0,
                borderBottomWidth: 0,
              }}
              dropdownPlace={'Select Subject '}
              subject={subject}
              headingStyle={{
                color: Theme.black,
                fontSize: 18,
                fontWeight: '700',
              }}
            />
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
                style={{ textAlign: 'center', fontSize: 16, color: Theme.white }}>
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
          <Text style={{ textAlign: 'center', fontSize: 16, color: Theme.white }}>
            Confirm Class
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AddClass;
