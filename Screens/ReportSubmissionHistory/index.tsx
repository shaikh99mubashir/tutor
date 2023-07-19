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
import React, { useEffect, useState } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import { useGestureHandlerRef } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const ReportSubmissionHistory = ({ navigation }: any) => {
  const [reportSubmission, setreportSubmission] = useState([
    {
      id: 1,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing1',
      code: 'sdf544',
      title: 'Add Math (DEGREE) Online',
      time: '12:00 PM to 7:00 PM',
      gender: 'male',
      ade: '51',
      studentName: 'testing',
      email: 'dsdds@sd.com',
      address: 'dsfdssd sds',
      contactno: 'as324324324',
      date: '20 May 2023',
    },
    {
      id: 2,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing2',
      code: 'sd52442',
      gender: 'male',
      ade: '51',
      studentName: 'testing',
      email: 'dsdds@sd.com',
      address: 'dsfdssd sds',
      contactno: 'as324324324',
      date: '20 May 2023',
    },
  ]);
  const [foundName, setFoundName] = useState([]);
  const [loading, setLoading] = useState(false)

  const getReportSubmissionHistory = async () => {

    setLoading(true)

    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let { tutorID } = data;

    axios.get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`).then(({ data }) => {
      let { tutorReportListing } = data
      setreportSubmission(tutorReportListing)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log("error")
    })
  }

  useEffect(() => {

    getReportSubmissionHistory()

  }, [])


  const [searchText, setSearchText] = useState('');
  const searchStudent = (e: any) => {

    setSearchText(e);
    let filteredItems: any = reportSubmission.filter((x: any) => {
      if (x?.studentID?.toLowerCase().includes(e?.toLowerCase())) {
        return e
      }
    }

    );
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

          {reportSubmission && reportSubmission.length > 0 ? (
            <FlatList
              data={
                searchText && foundName.length > 0
                  ? foundName
                  : reportSubmission
              }
              nestedScrollEnabled
              renderItem={({ item, index }: any) => {
                return (
                  <View
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
                    {/* Avaiable Subject */}
                    <View style={{}}>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 15,
                          fontWeight: '600',
                        }}>
                        {item.studentID}
                      </Text>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontSize: 15,
                          fontWeight: '600',
                          paddingVertical: 10,
                        }}>
                        {item.studentName}
                      </Text>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 15,
                          fontWeight: '600',
                        }}>
                        Subimited on {item.created_at}
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                          style={{
                            color: Theme.gray,
                            fontSize: 15,
                            fontWeight: '600',
                            paddingTop: 10,
                          }}>
                          {item?.tutorReportType}
                        </Text>
                        <TouchableOpacity style={{ alignItems: "center" }}>
                          <Image source={require('../../Assets/Images/inbox.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                          <Text style={{ fontSize: 10 }}>Download</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={{ marginTop: 35 }}>
              <Text
                style={{ color: Theme.black, fontSize: 14, textAlign: 'center' }}>
                No Record Found...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportSubmissionHistory;

const styles = StyleSheet.create({});
