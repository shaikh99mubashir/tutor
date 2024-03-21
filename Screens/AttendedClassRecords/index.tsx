import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Theme } from '../../constant/theme'
import Header from '../../Component/Header'
import { TextInput } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Base_Uri } from '../../constant/BaseUri'
import CustomLoader from '../../Component/CustomLoader'



const AttendedClassRecords = ({navigation,route}:any) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const dummyData = [
        {
          id: 1,
          offer_status: 'pending',
          jtuid: 'JTU123',
          price: 50,
          city: 'Sample City',
          mode: 'online',
          subject_name: 'Sample Subject',
          tutorPereference: 'Sample Tutor',
          categoryName: 'Sample Level',
          classDayType: 'Monday',
          classTime: '3:00 PM',
        },
        {
          id: 2,
          offer_status: 'attended',
          jtuid: 'JTU456',
          price: 75,
          city: 'Another City',
          mode: 'offline',
          subject_name: 'Another Subject',
          tutorPereference: 'Another Tutor',
          categoryName: 'Another Level',
          classDayType: 'Wednesday',
          classTime: '5:00 PM',
        },
        // Add more objects as needed
      ];
      const check = async () =>{
        try {
            let recordStatus: any = await AsyncStorage.getItem('ClassRecordsFilter');
            let status = JSON.parse(recordStatus);
            // console.log('status recordAttendedClassRecords', status);
          } catch (error) {
            // console.error('Error retrieving data from AsyncStorage:', error);
          }

      }
      useEffect(()=>{
        check()
      },[])

    const onRefresh = React.useCallback(() => {
      if (!refreshing) {
        // setRefreshing(true);
        setLoading(true);
        setTimeout(() => {
          setRefreshing(false);
          setLoading(false);
          setRefresh(refresh ? false : true);
        }, 2000);
      }
    }, [refresh]);
    const [tutorRecord, setTutorRecord] = useState([])
    const attendedClassApiCall = async () => {
      setLoading(true)
      interface LoginAuth {
        status: Number;
        tutorID: Number;
        token: string;
      }
      const login: any = await AsyncStorage.getItem('loginAuth');
      let loginData: LoginAuth = JSON.parse(login);
      let { tutorID } = loginData;
      // console.log("tutorID",tutorID);

      let recordsStatus: any = await AsyncStorage.getItem('ClassRecordsFilter');
      let status = JSON.parse(recordsStatus);
      // console.log("status",status);
      
      if (status) {
        axios
          .get(`${Base_Uri}getClassAttendedTime/${tutorID}`)
          .then(({ data }) => {
            let { classAttendedTime } = data;
            // console.log("classAttendedTime",classAttendedTime);
            
            let records =
              classAttendedTime &&
              classAttendedTime.length > 0 &&
              classAttendedTime.filter((e: any, i: number) => {
                console.log("e",e);
                return (
                  e?.status.toString().toLowerCase() ==
                  status.option.toString().toLowerCase()
                );
              });

              // console.log("records",records);
              
            setTutorRecord(records);
            setLoading(false);
          })
          .catch((error) => {
            ToastAndroid.show(
              'Internal Server Error getClassAttendedTime filter DATA',
              ToastAndroid.SHORT,
            );
            setLoading(false);
          });
        return;
      }
      
      axios
          .get(`${Base_Uri}getClassAttendedTime/${tutorID}`)
          .then(({ data }) => {
              // console.log("data",data.classAttendedTime);
              setTutorRecord(data?.classAttendedTime)
              setLoading(false)
          })
          .catch((error)=>{
            // console.log("error",error);
            ToastAndroid.show('Network Error', ToastAndroid.LONG);
            setLoading(false)
          })
    }

    useEffect(()=>{
      check()
      attendedClassApiCall()
    },[route,refresh])
    const renderRecords = ({ item }: any) => {
        return (
          <>
            <Text
              style={[
                styles.textType3,
                {
                  color: item.status === 'pending' ? '#000000' : '#FFFFFF',
                  backgroundColor: (() => {
                    switch (item.status) {
                      case 'pending':
                        return '#FEBC2A';
                      case 'attended':
                        return '#1FC07D';
                      case 'incomplete':
                        return '#FF0000';
                      case 'dispute':
                        return 'orange';
                      default:
                        return '#298CFF33'; // Default background color if the status is not recognized
                    }
                  })(),
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginLeft: 20,
                  width: 120,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                },
              ]}
            >
              {item.status}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginBottom: 10,
                padding: 20,
                borderColor: Theme.lightGray,
                backgroundColor: Theme.white,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderBottomWidth: 2,
                  paddingBottom: 20,
                  borderBottomColor: Theme.lightGray,
                }}>
                <View>
                  <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',}]}>{item?.jtid}</Text>
                  <Text
                    style={[
                      styles.textType1,
                      { lineHeight: 30, textTransform: 'capitalize' },
                    ]}>
                    RM {item?.totalPrice}
                  </Text>
                  {item?.classMode?.toLowerCase() == 'physical' &&
                  <View
                    style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Feather name="map-pin" size={18} color={'#298CFF'} />
                    <Text
                      style={[
                        styles.textType3,
                        { color: '#003E9C', textTransform: 'capitalize' },
                      ]}>
                      {item?.city}
                    </Text>
                  </View>
                }
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    style={[
                      styles.textType3,
                      {
                        color: item.mode == 'online'? '#1FC07D' : Theme.darkGray,
                    backgroundColor: item.mode == 'online'?   Theme.lightGreen :'#298CFF33',
                        paddingVertical: 5,
                        paddingHorizontal: 30,
                        borderRadius: 30,
                        textTransform: 'capitalize',
                      },
                    ]}>
                    {item?.classMode}
                  </Text>
                </View>
              </View>
    
              <View
                style={{
                  paddingVertical: 20,
                  borderBottomWidth: 2,
                  borderBottomColor: Theme.lightGray,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <AntDesign name="copy1" size={18} color={'#298CFF'} />
                    <Text style={styles.textType3}>Subject</Text>
                  </View>
                  <Text
                    style={[
                      styles.textType1,
                      { fontSize: 20, textTransform: 'capitalize' },
                    ]}>
                    {item?.subjectName}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <FontAwesome name="user-o" size={18} color={'#298CFF'} />
                    <Text style={styles.textType3}>Student</Text>
                  </View>
                  <Text
                    style={[
                      styles.textType1,
                      { fontSize: 20, textTransform: 'capitalize' },
                    ]}>
                    {item?.studentName}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 12,
                    }}>
                    <FontAwesome name="level-up" size={18} color={'#298CFF'} />
                    <Text style={styles.textType3}>Level</Text>
                  </View>
                  <Text
                    style={[
                      styles.textType1,
                      { fontSize: 20, textTransform: 'capitalize' },
                    ]}>
                    {item?.level}
                  </Text>
                </View>
              </View>
    
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                <View
                  style={{
                    backgroundColor: '#E6F2FF',
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                      paddingHorizontal: 10,
                    }}>
                    <AntDesign name="calendar" size={20} color={'#298CFF'} />
                    <Text
                      style={[
                        styles.textType3,
                        { color: '#298CFF', textTransform: 'capitalize' },
                      ]}>
                      {item?.classDate}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#E6F2FF',
                    paddingVertical: 10,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <AntDesign name="clockcircleo" size={20} color={'#298CFF'} />
                    <Text
                      style={[
                        styles.textType3,
                        { color: '#298CFF', textTransform: 'capitalize' },
                      ]}>
                      {item?.totalTime} Hrs
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </>
        );
      };
  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
    <Header
      title="Records"
      recordsFilter
      backBtn
      navigation={navigation}
    />

    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
        <CustomLoader visible={loading} />
      <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
        {/* Search */}
        {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: '100%',
              backgroundColor: Theme.lightGray,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 4,
              paddingHorizontal: 15,
              marginBottom: 15,
              gap: 10,
            }}>
            <TouchableOpacity activeOpacity={0.8}>
              <Image
                source={require('../../Assets/Images/search.png')}
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Search"
              placeholderTextColor="black"
            //   onChangeText={e => searchText(e)}
              style={{
                width: '90%',
                padding: 8,
                color: 'black',
                fontFamily: 'Circular Std Book',
                fontSize: 16,
              }}
            />
          </View>
        </View> */}

        {tutorRecord.length > 0 ? (
          <View>
          <FlatList
            data={tutorRecord}
            renderItem={renderRecords}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
          />
          </View>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../Assets/Images/rnf-01.png')}
              style={{ width: 300, height: 300 }}
            />
          </View>
        )}
      </View>
        </ScrollView>
        </View>
  )
}

export default AttendedClassRecords

const styles = StyleSheet.create({
    textType1: {
        fontWeight: '500',
        fontSize: 24,
        color: Theme.Dune,
        fontFamily: 'Circular Std Medium',
        lineHeight: 24,
        fontStyle: 'normal',
      },
      textType3: {
        color: Theme.ironsidegrey1,
        fontWeight: '500',
        fontSize: 16,
        fontFamily: 'Circular Std Medium',
        fontStyle: 'normal',
      },
})