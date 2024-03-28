import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TutorDetailsContext from '../../context/tutorDetailsContext';

const AppliedDetails = ({ route, navigation }: any) => {
  const data = route.params;
  console.log('data', data);

  const [openDetailItem, setopenDetailItem] = useState({
    comment: '',
  });

  const tutor = useContext(TutorDetailsContext);
  let { tutorDetails, updateTutorDetails } = tutor;
  console.log("tutorDetails",tutorDetails);
  
  const [loading, setLoading] = useState(false);

  // console.log(openDetailItem.comment, "comment")

  // console.log(data, "dataaa")
  // console.log('idddddddddddddd',data)
  const sendOpenDetailData = async () => {
    let tutorData: any = await AsyncStorage.getItem('loginAuth');

    tutorData = await JSON.parse(tutorData);

    let subjectId = data?.subject_id;
    // let ticket_id = data?.ticket_id
    let ticketID = data?.ticketID;
    // let id = data?.id
    let tutor_id = tutorData?.tutorID;
    let comment = openDetailItem.comment ? openDetailItem?.comment : null;
    // console.log('idddddddddddddd',data.id)
    console.log(subjectId, "subjectId")
    console.log(ticketID, "ticketID")
    console.log(tutor_id, "tutor_id")
    console.log(comment, "comment")

    setLoading(true);
    axios
      .get(
        `${Base_Uri}offerSendByTutor/${subjectId}/${tutor_id}/${ticketID}/${comment}`,
      )
      .then(({ data }) => {



        if (data?.result?.status == 'pending') {
          setLoading(false);
          ToastAndroid.show(
            'You have successfully applied for this ticket',
            ToastAndroid.SHORT,
          );
          navigation.navigate('Job Ticket', ticketID);
        } else {
          console.log(data, 'dataaa');
          ToastAndroid.show(data?.result, ToastAndroid.SHORT);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error, 'error');
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };
  // console.log('data=============>', data);

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title={data?.jtuid} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          {/* <Text
            style={{
              color: 'green',
              fontSize: 15,
              fontWeight: '500',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: '#eee',
            }}>
            {data?.studentAddress1} {data?.studentAddress2}
          </Text> */}
          <View
            style={{
              backgroundColor: Theme.darkGray,
              padding: 15,
              marginTop: 10,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={[styles.textType3, { color: 'white' }]}>
                {data?.jtuid}
              </Text>
              <Text
                style={[styles.textType1, { lineHeight: 30, color: 'white' }]}>
                RM {data?.price}
              </Text>
              <View
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <Feather
                  name="map-pin"
                  size={18}
                  color={'#fff'}
                />
                <Text style={[styles.textType3, { color: 'white' }]}>
                  {data?.city}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={[
                  styles.textType3,
                  {
                    color: '#fff',
                    backgroundColor: '#000',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 30,
                    textTransform:'capitalize'
                  },
                ]}>
                {data?.offer_status}
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={styles.textType1}>Details</Text>

            <View
              style={{
                backgroundColor: Theme.liteBlue,
                padding: 15,
                marginTop: 10,
                borderRadius: 12,
              }}>
                <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom:15,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 10,
                
                  }}>
                  <FontAwesome
                    name="user-o"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Student Name</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18,textTransform:'capitalize' }]}>
                  {data?.studentName}
                </Text>
              </View>
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
                    gap: 8,
                  }}>
                  <FontAwesome
                    name="graduation-cap"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Student Detail</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  {data?.studentGender},({data?.student_age} y/o)
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
                  <Feather
                    name="hash"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>No. of Sessions</Text>
                </View>
             
                <Text
                  style={[
                    styles.textType1,
                    {
                      color: '#003E9C',
                      backgroundColor: '#298CFF33',
                      paddingVertical: 2,
                      // paddingHorizontal: 10,
                      borderRadius: 50,
                      textAlign:'center',
                      width:30,
                      height:30,
                      fontSize: 18,
                    },
                  ]}>
                  {data?.classFrequency}
                </Text>
               
              </View>
            </View>

            <View
              style={{
                backgroundColor: Theme.liteBlue,
                padding: 15,
                marginTop: 10,
                borderRadius: 12,
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
                    gap: 12,
                    paddingBottom:15,
                  }}>
                  <FontAwesome
                    name="level-up"
                    size={22}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Level</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                {data?.categoryName}
                </Text>
              </View>
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
                  <AntDesign
                    name="copy1"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Subject</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 }]}>
                  {data?.subject_name}
                </Text>
              </View>
             
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  paddingBottom:15
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <FontAwesome
                    name="user-o"
                    size={18}
                    color={'#298CFF'}
                  />
                  <Text style={styles.textType3}>Pref. Tutor</Text>
                </View>
                <Text style={[styles.textType1, { fontSize: 18 ,textTransform:'capitalize'}]}>
                  {data?.tutorPereference}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' }}>
                <View style={{ backgroundColor: "#E6F2FF", paddingVertical: 10, borderRadius: 10 }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 10 }}>
                    <AntDesign
                      name="calendar"
                      size={20}
                      color={'#298CFF'}
                    />
                    <Text style={[styles.textType3, { color: '#298CFF' }]}>{data?.classDay}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: "#E6F2FF", paddingVertical: 10, borderRadius: 10, paddingHorizontal: 10 }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
                    <AntDesign
                      name="clockcircleo"
                      size={20}
                      color={'#298CFF'}
                    />
                    <Text style={[styles.textType3, { color: '#298CFF' }]}>{data?.classTime}</Text>
                  </View>
                </View>

              </View>


            </View>

           
            {/*Adress */}

            {data.specialRequest &&
              <View style={{ marginVertical: 20 }}>
                <Text
                  style={styles.textType1}>
                  Special Need
                </Text>
                <View
                  style={{
                    backgroundColor: Theme.liteBlue,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={[styles.textType3,{ fontFamily: 'Circular Std Book',}]}>
                    {data.specialRequest}
                  </Text>
                </View>
              </View>
            }
            {/* Special Need */}

            {tutorDetails?.status?.toLowerCase() == 'verified' && data?.mode?.toLowerCase() == 'physical' && data?.studentAddress &&
              <View style={{ marginVertical: 5,}}>
                <Text
                  style={styles.textType1}>
                  Student Address
                </Text>
                <View
                  style={{
                    backgroundColor: Theme.liteBlue,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={[styles.textType3,{ fontFamily: 'Circular Std Book',}]}>
                    {data.studentAddress}
                  </Text>
                </View>
              </View>
            }
            {/* Avaiable student */}
            {data?.jobTicketExtraStudents && data?.jobTicketExtraStudents.length > 0 &&
              <View style={{ marginVertical: 15 }}>
                <Text
                  style={styles.textType1}>
                  Extra Students
                </Text>

                {data?.jobTicketExtraStudents?.map((e: any, i: number) => (
                  <View
                  key={i}
                    style={{
                      backgroundColor: Theme.liteBlue,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginVertical: 5,
                    }}>
                    <Text
                       style={styles.textType3}>
                      Student Name : {e?.student_name}
                    </Text>
                    <Text
                      // style={{
                      //   color: Theme.black,
                      //   fontSize: 14,
                      //   fontWeight: '400',
                      //   marginTop: 5,
                      //   fontFamily: 'Circular Std Book',
                      // }}
                      style={styles.textType3}
                      >
                      Age : {e?.student_age}
                    </Text>
                    <Text
                      // style={{
                      //   color: Theme.black,
                      //   fontSize: 14,
                      //   fontWeight: '400',
                      //   marginTop: 5,
                      //   fontFamily: 'Circular Std Book',
                      // }}
                      style={styles.textType3}
                      >
                      Gender : {e?.student_gender}
                    </Text>
                    <Text
                      // style={{
                      //   color: Theme.black,
                      //   fontSize: 14,
                      //   fontWeight: '400',
                      //   marginTop: 5,
                      //   fontFamily: 'Circular Std Book',
                      // }}
                      style={styles.textType3}
                      >
                      Birth Year : {e?.year_of_birth}
                    </Text>
                    <Text
                      // style={{
                      //   color: Theme.black,
                      //   fontSize: 14,
                      //   fontWeight: '400',
                      //   marginTop: 5,
                      //   fontFamily: 'Circular Std Book',
                      // }}
                      style={styles.textType3}
                      >
                      Special Need : {e?.special_need}
                    </Text>
                  </View>
                ))}
              </View>
            }
           
          </View>
        </View>
      </ScrollView>
    
    </View>
  );
};

export default AppliedDetails;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    // borderWidth: 1,
    // padding: 5,
    borderRadius: 10,
    fontFamily: 'Circular Std Medium',
  },
  textArea: {
    borderRadius: 10,
    height: 100,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontFamily: 'Circular Std Medium',
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
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
  },
});
