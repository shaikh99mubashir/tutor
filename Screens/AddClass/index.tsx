import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import {Theme} from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import Header from '../../Component/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Base_Uri} from '../../constant/BaseUri';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddClass({navigation}: any) {
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

  const [classes, setClasses] = useState([
    {
      id: 1,
      classDate: new Date(),
      startTime: '-',
      endTime: '-',
    },
  ]);

  const getSubject = () => {
    axios
      .get(`${Base_Uri}getSubjects`)
      .then(({data}) => {
        let {subjects} = data;

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

    let {tutorID} = data;

    axios
      .get(`${Base_Uri}getTutorStudents/${tutorID}`)
      .then(({data}) => {
        let {tutorStudents} = data;

        let myStudents =
          tutorStudents &&
          tutorStudents.length > 0 &&
          tutorStudents.map((e: any, i: Number) => {
            if (e.studentName) {
              return {
                subject: e.studentName,
                studentAddress1: e.studentAddress1,
                studentAddress2: e.studentAddress2,
                studentCity: e.studentCity,
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
      classes.filter((e, i) => {
        return i !== index;
      });

    setClasses(data);
  };

  const [mode, setMode] = useState<any>('date');
  const [confirm, setConfirm] = useState(false);
  const [clickedStartTime, setClickedStartTime] = useState(false);
  const [show, setShow] = useState(false);
  const [indexClicked, setIndexClicked] = useState<null | Number>(null);
  const [value, setValue] = useState(new Date());

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;

    let data;

    if (mode == 'date') {
      data = classes.map((e: any, i: Number) => {
        if (i == indexClicked) {
          return {
            ...e,
            classDate: currentDate,
          };
        } else {
          return e;
        }
      });
    } else if (mode == 'time' && clickedStartTime) {
      console.log('hello');

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
    console.log('hello');

    if (startTime) {
      setClickedStartTime(true);
    }
    setMode(mode);
    setIndexClicked(index);
    setShow(true);
  };

  const renderClasses = ({item, index}: any) => {
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
            <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
              Date
            </Text>
            <TouchableOpacity onPress={() => setClassDate('date', index)}>
              <Text
                style={{color: Theme.black, fontSize: 14, fontWeight: '500'}}>
                {item.classDate.toString().slice(0, 15)}
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
            <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
              Start Time
            </Text>

            <TouchableOpacity
              onPress={() => setClassDate('time', index, true)}
              style={{minWidth: 50, alignItems: 'flex-end'}}>
              <Text
                style={{color: Theme.black, fontSize: 14, fontWeight: '500'}}>
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
            <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '500'}}>
              End Time
            </Text>

            <TouchableOpacity
              onPress={() => setClassDate('time', index)}
              style={{minWidth: 50, alignItems: 'flex-end'}}>
              <Text
                style={{color: Theme.black, fontSize: 14, fontWeight: '500'}}>
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
      id: classes.length + 1,
      classDate: new Date(),
      startTime: '-',
      endTime: '-',
    };

    setClasses([...classes, newClass]);
  };
  const confirmClass = () => {
    navigation.navigate('BackToDashboard');
  };
  return (
    <View style={{flex: 1, backgroundColor: Theme.white}}>
      <View>
        <Header title={'Add Class'} backBtn navigation={navigation} />
      </View>

      <View style={{padding: 20, flex: 1}}>
        <ScrollView>
          <View>
            <CustomDropDown
              ddTitle={'Student'}
              dropdownContainerStyle={{
                backgroundColor: Theme.lightGray,
                paddingVertical: 17,
                borderColor: '',
                borderWidth: 0,
                borderBottomWidth: 0,
              }}
              dropdownPlace={'Select Student '}
              subject={student}
              headingStyle={{
                color: Theme.black,
                fontSize: 18,
                fontWeight: '700',
              }}
            />
            <CustomDropDown
              ddTitle={'Subject'}
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
                style={{textAlign: 'center', fontSize: 16, color: Theme.white}}>
                {classes.length > 0 ? 'Add More Classes' : 'Add Classes'}
              </Text>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={value}
              mode={mode}
              is24Hour={false}
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
          <Text style={{textAlign: 'center', fontSize: 16, color: Theme.white}}>
            Confirm Class
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AddClass;
