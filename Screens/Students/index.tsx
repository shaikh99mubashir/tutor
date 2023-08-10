import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentContext from '../../context/studentContext';

const Students = ({ navigation }: any) => {

  const context = useContext(StudentContext)

  let student = context.students




  const [students, setstudents] = useState([]);
  const [loading, setLoading] = useState(false)
  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');



  useEffect(() => {

    setstudents(student)

  }, [])


  // const getStudentData = async () => {
  //   setLoading(true)
  //   let data: any = await AsyncStorage.getItem('loginAuth');
  //   data = JSON.parse(data);

  //   let { tutorID } = data;

  //   axios
  //     .get(`${Base_Uri}getTutorStudents/${tutorID}`)
  //     .then(({ data }) => {
  //       setLoading(false)
  //       let { tutorStudents } = data;

  //       setstudents(tutorStudents);
  //     })
  //     .catch(error => {
  //       setLoading(false)
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   getStudentData();
  // }, []);

  console.log(students, "studnets")

  const searchStudent = (e: any) => {

    setSearchText(e);
    let filteredItems: any = students.filter((x: any) => {
      console.log(x, "xxxx")
      return (
        x?.studentName?.toLowerCase()?.includes(e?.toLowerCase()) ||
        x?.studentID?.toString().toLowerCase().includes(e?.toLowerCase())
      )
    });
    setFoundName(filteredItems);
  };



  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size="large" color={Theme.black} />
    </View> : <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Student" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          {/* Search */}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                backgroundColor: Theme.lightGray,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginVertical: 15,
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor="black"
                onChangeText={e => searchStudent(e)}
                style={{ width: '90%', padding: 8, color: 'black' }}
              />
              <TouchableOpacity onPress={() => navigation}>
                <Image
                  source={require('../../Assets/Images/search.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {students && students.length > 0 ? (
            <FlatList
              data={searchText && foundName.length > 0 ? foundName : students}
              nestedScrollEnabled
              renderItem={({ item, index }: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('StudentsDetails', item)}
                    key={index}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 15,
                      marginTop: 10,
                      paddingVertical: 15,
                      borderRadius: 10,
                      gap: 10,
                      marginRight: 10,
                      borderColor: '#eee',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 15,
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
                      <View>
                        <Text style={{ color: Theme.gray, fontSize: 16 }}>
                          {item.studentID}
                        </Text>
                        <Text style={{ color: Theme.black, fontSize: 14 }}>
                          {item.studentName}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={{ marginTop: 35 }}>
              <Text
                style={{ color: Theme.black, fontSize: 14, textAlign: 'center' }}>
                No Student Found...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Students;

const styles = StyleSheet.create({});
