import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  TextInput,
  RefreshControl,
  Image,
  Linking,
  Dimensions,
  Modal,
  StyleSheet,
} from 'react-native';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import CustomTabView from '../../Component/CustomTabView';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import Status from '../Status';

function JobTicket({ navigation, route }: any) {
  const focus = useIsFocused();

  let data = route.params;

  const bannerCont = useContext(bannerContext);

  let { jobTicketBanner, setJobTicketBanner } = bannerCont;

  const [isSearchItems, setIsSearchItems] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const tutor = useContext(TutorDetailsContext);
  const [modalVisible, setModalVisible] = useState(false);
  let { tutorDetails } = tutor;

  const [currentTab, setCurrentTab]: any = useState([
    {
      index: 0,
      name: 'Open',
      selected: true,
    },
    {
      index: 1,
      name: 'Applied',
      selected: false,
    },
    {
      index: 2,
      name: 'Assigned',
      selected: false,
    },
  ]);

  const activateTab = (index: any) => {
    setCurrentTab(
      currentTab &&
      currentTab.length > 0 &&
      currentTab.map((e: any, i: any) => {
        if (e.index == index) {
          return {
            ...e,
            selected: true,
          };
        } else {
          return {
            ...e,
            selected: false,
          };
        }
      }),
    );
  };
  const [openData, setOpenData] = useState<any>([
    // {
    //   id: 59,
    //   days: 1,
    //   student_id: 99,
    //   ticket_id: 59,
    //   tutor_id: null,
    //   subject: 16,
    //   day: 'Monday',
    //   time: '22:00',
    //   status: 'scheduled',
    //   subscription: 'LongTerm',
    //   created_at: '2023-06-16 16:17:43',
    //   updated_at: '2023-06-14 14:17:43',
    //   uid: 'JT-144743',
    //   slug: null,
    //   register_date: '2023-06-14',
    //   admin_charge: null,
    //   students: null,
    //   student_address: null,
    //   payment_attachment: '4.jpg',
    //   fee_payment_date: '2023-06-27',
    //   tutor_status: 'pending',
    //   receiving_account: '76',
    //   subscription_duration: null,
    //   subjects: null,
    //   remarks: null,
    //   application_status: 'incomplete',
    //   estimate_commission: 0,
    //   subject_name: 'Chemistry (SPM) - PHYSICAL',
    //   jtuid: 'JT-144743',
    //   subject_id: 16,
    //   tutorID: 16,
    //   ssid: 102,
    //   studentName: 'student17',
    //   studentAddress1: 'address lne 1',
    //   studentAddress2: 'address  line 2',
    //   studentCity: 'city',
    //   ticket_status: 'Accepted',
    // },
  ]);
  const [closeData, setCloseData] = useState<any>([
    // {
    //   id: 1,
    //   code: 'SS545455',
    //   code2: 'Approved',
    //   title: 'Mathematics (UPSR) - PHYSICAL - Weekday',
    //   details: 'Weekday at 90:00Am for 1.5 hour(S) of each class',
    //   details5: 'Testing',
    //   RS: '180',
    // },
    // {
    //   id: 2,
    //   code: 'SS545455',
    //   code2: 'Approved',
    //   title: 'Algebra (UPSR) - PHYSICAL - Weekday',
    //   details: 'Weekday at 90:00Am for 1.5 hour(S) of each class',
    //   details5: 'Testing',
    //   RS: '180',
    // },
  ]);

  const [appliedData, setAppliedData] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    if (!refreshing) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        setOpenPPModal(true);
        setRefresh(refresh ? false : true);
      }, 2000);
    }
  }, [refresh]);

  // const [tutorDetail, setTutorDetail] = useState<any>();

  // const tutorDetailsCont = useContext(TutorDetailsContext);
  // const {tutorPersonalDetails} = tutorDetailsCont;

  // console.log(tutorPersonalDetails, 'myDetails');

  // useEffect(() => {
  //   try {
  //     let tutorData: any = AsyncStorage.getItem('tutorData');
  //     tutorData = JSON.parse(tutorData);
  //     setTutorDetail(tutorData);
  //     console.log('Bottom Navigation tutor data', tutorData);
  //   } catch (error) {
  //     console.error('Error retrieving or parsing tutor data:', error);
  //   }
  // }, []);


  const getTicketsData = async () => {
    setLoading(true);
    // setModalVisible(true);
    axios
    .get(`${Base_Uri}getTutorDetailByID/${tutorDetails?.tutorId}`)
    .then(res => {
      let tutorData = res.data;
      // console.log("tutorData",tutorData);
      
      setLoading(false);
      console.log(tutorData?.tutorDetailById[0]?.status, 'check before if condition Job ticket');
      if (tutorData?.tutorDetailById[0]?.status === 'verified') {
        // setModalVisible(true);
        console.log(tutorData?.tutorDetailById[0]?.status, 'fdgfdgfd verified check on job ticket');
        return
      }
    });
    let filter: any = await AsyncStorage.getItem('filter');

    if (filter) {
      filter = JSON.parse(filter);

      let { Category, subject, mode, state, city } = filter;
      let categoryID = Category.id ?? 'noFilter';
      let subjectID = subject.id ?? 'noFilter';
      let myMode = mode.subject ?? 'noFilter';
      let myState = state.id ?? 'noFilter';
      let myCity = city.id ?? 'noFilter';
      // console.log("myCitymyCity",myCity);
      // console.log("myCitymyCity",city);

      axios
        .get(`${Base_Uri}ticketsAPI/${tutorDetails?.tutorId}`)
        .then(({ data }) => {
          let { tickets } = data;
          axios
            .get(`${Base_Uri}getTutorOffers/${tutorDetails?.tutorId}`)
            .then(({ data }) => {
              let { getTutorOffers } = data;
              const filteredTickets = tickets.filter(
                (ticket: any) =>
                  !getTutorOffers.some((offer: any) => offer.id === ticket.id),
              );
              setOpenData(
                filteredTickets.length > 0 &&
                filteredTickets.filter((e: any, i: number) => {
                  // console.log("e?.cityID",e);

                  return (
                    (myMode == 'noFilter' ||
                      e?.mode?.toString()?.toLowerCase() ==
                      myMode?.toString()?.toLowerCase()) &&
                    (subjectID == 'noFilter' || e?.subject_id == subjectID) &&
                    (categoryID == 'noFilter' ||
                      e?.categoryID == categoryID) &&
                    (myCity == 'noFilter' || e?.cityID == myCity) &&
                    (myState == 'noFilter' || e?.stateID == myState)
                  );
                }),
              );
              setLoading(false);
            })
            .catch(error => {
              ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
              setLoading(false);
            });
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });

      return;
    } else {
      let tutorData: any = await AsyncStorage.getItem('loginAuth');
      tutorData = JSON.parse(tutorData);
      let tutor_id = tutorData?.tutorID;
      axios
        .get(`${Base_Uri}ticketsAPI/${tutor_id}`)
        .then(async ({ data }) => {
          let { tickets } = data;
          axios
            .get(`${Base_Uri}getTutorOffers/${tutor_id}`)
            .then(({ data }) => {
              let { getTutorOffers } = data;
              // console.log(tickets, 'tickets');

              const filteredTickets = tickets.filter(
                (ticket: any) =>
                  !getTutorOffers.some(
                    (offer: any) => offer.tutor_id !== ticket.tutorOfferTutorID,
                  ),
              );
              setOpenData(filteredTickets);
              setLoading(false);
            })
            .catch(error => {
              ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
              setLoading(false);
            });
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
    }
  };

  const getAppliedData = async () => {
    setLoading(true);

    let tutorData: any = await AsyncStorage.getItem('loginAuth');

    tutorData = JSON.parse(tutorData);

    let tutor_id = tutorData?.tutorID;

    let appliedStatus: any = await AsyncStorage.getItem('statusFilter');

    let status = JSON.parse(appliedStatus);

    if (status) {
      axios
        .get(`${Base_Uri}getTutorOffers/${tutor_id}`)
        .then(({ data }) => {
          let { getTutorOffers } = data;

          let tutorOffer =
            getTutorOffers &&
            getTutorOffers.length > 0 &&
            getTutorOffers.filter((e: any, i: number) => {
              return (
                e?.status.toString().toLowerCase() ==
                status.option.toString().toLowerCase()
              );
            });

          setAppliedData(tutorOffer);
          setLoading(false);
        })
        .catch(error => {
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
          setLoading(false);
        });
      return;
    }

    axios
      .get(`${Base_Uri}getTutorOffers/${tutor_id}`)
      .then(({ data }) => {
        let { getTutorOffers } = data;
        setAppliedData(getTutorOffers);
        setLoading(false);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        setLoading(false);
      });
  };

  const getAssignedData = async () => {
    setLoading(true);
    let tutorData: any = await AsyncStorage.getItem('loginAuth');
    tutorData = JSON.parse(tutorData);
    let tutor_id = tutorData?.tutorID;
    axios
      .get(`${Base_Uri}assignedTicketsAPI/${tutor_id}`)
      .then(({ data }) => {
        let { tickets } = data;
        setAssignedData(tickets);
        // console.log('tickets===>', tickets);

        setLoading(false);
      })
      .catch(error => {
        ToastAndroid.show(
          'Internal Server Error assignedTicketsAPI',
          ToastAndroid.SHORT,
        );
        setLoading(false);
      });
  };



  useEffect(() => {
    getTicketsData();
    getAppliedData();
    getAssignedData();
  }, [refresh, route]);

  const HandelGoToDashboard = () => {
    setModalVisible(false)
    navigation.replace('Splash')
  }
  const checkSearchItems = () => {
    searchText && foundName.length == 0 && setIsSearchItems(true);
  };

  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchOpen = (e: any) => {
    // console.log("rinnimg");

    if (e == '') {
      setFoundName([]);
      setSearchText(e);
      return;
    }

    setSearchText(e);
    // console.log("e === search ",searchText);

    let filteredItems: any = openData.filter(
      (x: any) =>
        x?.subject_name?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.studentName?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.mode?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.classDay?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.jtuid?.toString().toLowerCase().includes(e?.toLowerCase()),
    );
    setFoundName(filteredItems);
  };
  const searchApplied = (e: any) => {
    if (e == '') {
      setFoundName([]);
      setSearchText(e);
      return;
    }

    setSearchText(e);
    let filteredItems: any = appliedData.filter((x: any) => {
      return (
        x?.subjectName?.toLowerCase().includes(e.toLowerCase()) ||
        x?.studentName?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.mode?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.classDay?.toLowerCase().includes(e?.toLowerCase()) ||
        x?.jtuid?.toString().toLowerCase().includes(e?.toLowerCase())
      );
    });
    setFoundName(filteredItems);
  };

  function convertTo12HourFormat(time24: any): any {
    // console.log('time24',time24);
    if (time24 === null) {
      return 'Invalid time';
    }
    const [hourStr, minuteStr] = time24?.split(':');
    const hour = parseInt(hourStr);
    let period = 'AM';
    let twelveHour = hour;

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
        twelveHour = hour - 12;
      }
    }

    if (twelveHour === 0) {
      twelveHour = 12;
    }

    return `${twelveHour}:${minuteStr} ${period}`;
  }

  const renderOpenData: any = ({ item }: any) => {
    // console.log('====================================renderOpenData', item);
    return (
      <>
        <TouchableOpacity
          onPress={() => navigation.navigate('OpenDetails', item)}
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
              <Text style={styles.textType3}>{item?.jtuid}</Text>
              <Text style={[styles.textType1, { lineHeight: 30 }]}>
                RM {item?.price}
              </Text>
              <View
                style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Image source={require('../../Assets/Images/mapicon.png')} />
                <Text style={[styles.textType3, { color: '#003E9C' }]}>
                  {item?.city}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={[
                  styles.textType3,
                  {
                    color: '#003E9C',
                    backgroundColor: '#298CFF33',
                    paddingVertical: 5,
                    paddingHorizontal: 30,
                    borderRadius: 30,
                  },
                ]}>
                {item?.mode}
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
                <Image source={require('../../Assets/Images/subIcon.png')} />
                <Text style={styles.textType3}>Subject</Text>
              </View>
              <Text style={[styles.textType1, { fontSize: 18 }]}>
                {item?.subject_name}
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
                <Image source={require('../../Assets/Images/preftutor.png')} />
                <Text style={styles.textType3}>Pref. Tutor</Text>
              </View>
              <Text style={[styles.textType1, { fontSize: 18 }]}>
                {item?.tutorPereference}
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
                <Image source={require('../../Assets/Images/level.png')} />
                <Text style={styles.textType3}>Level</Text>
              </View>
              <Text style={[styles.textType1, { fontSize: 18 }]}>
                {item?.categoryName}
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
                <Image
                  source={require('../../Assets/Images/scheduleicccon.png')}
                />
                <Text style={[styles.textType3, { color: '#298CFF' }]}>
                  {item?.classDayType}
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
                <Image source={require('../../Assets/Images/timeee.png')} />
                <Text style={[styles.textType3, { color: '#298CFF' }]}>
                  {item?.classTime}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
        onPress={() => navigation.navigate('OpenDetails', item)}
        activeOpacity={0.8}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 10,
          padding: 10,
          borderColor: Theme.lightGray,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Text style={{color: 'green', fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            {item?.jtuid}
          </Text>
          <Text style={{color: 'green', fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            {item?.city}
          </Text>
        </View>
        <Text
          style={{
            color: Theme.black,
            fontSize: 16,
            fontWeight: '600',
            marginTop: 10,
            fontFamily: 'Circular Std Black'
          }}>
          {item.subject_name}
        </Text>
        <View>
          <Text
            style={{
              color: Theme.black,
              fontSize: 16,
              fontWeight: '600',
              marginTop: 10,
              fontFamily: 'Circular Std Black'
            }}>
            Details
          </Text>
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            {item?.classDay} at {convertTo12HourFormat(item?.classTime)} for{' '}
            {item?.quantity} hour(s) of each class.
          </Text>
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            {item?.studentGender} Student {item?.student_age} y/o
          </Text>
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            {item?.subject_name} - {item?.session} sessions {item?.quantity}{' '}
            hour(s)
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black' }}>
            - Tutor Preference: {item?.tutorPereference}
          </Text>
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            - Class Frequency: {item?.classFrequency}
          </Text>
          {item?.specialRequest ?
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            - Special Request: {item?.specialRequest}
          </Text>
          :''}
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            - PreferredDay/Time: {item?.classDay}
          </Text>
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            - Mode: {item?.mode}
          </Text>
          <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
            - Level: {item?.categoryName}
          </Text>
          {item?.remarks && (
            <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
              - Remarks: {item?.remarks}
            </Text>
          )}
          {item?.first8Hour && (
            <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
              {item?.first8Hour}
            </Text>
          )}
          {item?.above9Hour && (
            <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
              {item?.above9Hour}
            </Text>
          )}
        </View>
        <Text
          style={{
            color: Theme.black,
            fontSize: 18,
            fontWeight: '600',
            marginTop: 10,
            fontFamily: 'Circular Std Black'
          }}>
          RM {item?.price}/subject
        </Text>
      </TouchableOpacity> */}
      </>
    );
  };
  const renderCloseData = ({ item }: any) => {
    // console.log('item', item);

    return (
      <>
        <Text
          style={[
            styles.textType3,
            {
              color: '#003E9C',
              backgroundColor: '#298CFF33',
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              marginLeft: 20,
              width: 100,
              textAlign: 'center',
            },
          ]}>
          {item.tutor_status}
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
              <Text style={styles.textType3}>{item?.jtuid}</Text>
              <Text style={[styles.textType1, { lineHeight: 30 }]}>
                RM {item?.price}
              </Text>
              <View
                style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Image source={require('../../Assets/Images/mapicon.png')} />
                <Text style={[styles.textType3, { color: '#003E9C' }]}>
                  {item?.city}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={[
                  styles.textType3,
                  {
                    color: '#003E9C',
                    backgroundColor: '#298CFF33',
                    paddingVertical: 5,
                    paddingHorizontal: 30,
                    borderRadius: 30,
                  },
                ]}>
                {item?.mode}
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
                <Image source={require('../../Assets/Images/subIcon.png')} />
                <Text style={styles.textType3}>Subject</Text>
              </View>
              <Text style={[styles.textType1, { fontSize: 18 }]}>
                {item?.subject_name}
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
                <Image source={require('../../Assets/Images/preftutor.png')} />
                <Text style={styles.textType3}>Pref. Tutor</Text>
              </View>
              <Text style={[styles.textType1, { fontSize: 18 }]}>
                {item?.tutorPereference}
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
                <Image source={require('../../Assets/Images/level.png')} />
                <Text style={styles.textType3}>Level</Text>
              </View>
              <Text style={[styles.textType1, { fontSize: 18 }]}>
                {item?.categoryName}
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
                <Image
                  source={require('../../Assets/Images/scheduleicccon.png')}
                />
                <Text style={[styles.textType3, { color: '#298CFF' }]}>
                  {item?.classDayType}
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
                <Image source={require('../../Assets/Images/timeee.png')} />
                <Text style={[styles.textType3, { color: '#298CFF' }]}>
                  {item?.classTime}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
      // <TouchableOpacity
      //   activeOpacity={0.8}
      //   style={{
      //     borderWidth: 1,
      //     borderRadius: 5,
      //     marginBottom: 10,
      //     padding: 10,
      //     borderColor: Theme.lightGray,
      //   }}>
      //   <View
      //     style={{
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       width: '100%',
      //     }}>
      //     <Text style={{color: 'green', fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item.jtuid}
      //     </Text>
      //     <Text style={{color: 'green', fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item.status}
      //     </Text>
      //   </View>
      //   <Text
      //     style={{
      //       color: Theme.black,
      //       fontSize: 15,
      //       fontWeight: '600',
      //       marginTop: 10,
      //       fontFamily: 'Circular Std Black'
      //     }}>
      //     {item.subject_name}
      //   </Text>
      //   <View>
      //     <Text
      //       style={{
      //         color: Theme.black,
      //         fontSize: 16,
      //         fontWeight: '600',
      //         marginTop: 10,
      //         fontFamily: 'Circular Std Black'
      //       }}>
      //       Details
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item?.classDay} at {convertTo12HourFormat(item?.classTime)} for{' '}
      //       {item?.quantity} hour(s) of each class.
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item?.studentGender} Student ({item?.studentAge}y/o)
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item?.subject_name} - {item?.session} sessions {item?.quantity}
      //       hour(s)
      //     </Text>
      //     <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black' }}>
      //       - Tutor Pereference: {item?.tutorPereference}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - Class Frequency: {item?.classFrequency}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - Special Request: {item?.specialRequest}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - classDay/Time: {item?.classDay}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - Mode: {item?.mode}
      //     </Text>
      //     {item?.remarks && (
      //       <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //         - Remarks: {item?.remarks}
      //       </Text>
      //     )}
      //     {item?.first8Hour && (
      //       <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //         {item?.first8Hour}
      //       </Text>
      //     )}
      //     {item?.above9Hour && (
      //       <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //         {item?.above9Hour}
      //       </Text>
      //     )}
      //   </View>

      //   <Text
      //     style={{
      //       color: Theme.black,
      //       fontSize: 18,
      //       fontWeight: '600',
      //       marginTop: 10,
      //       fontFamily: 'Circular Std Black'
      //     }}>
      //     RM {item?.price}/subject
      //   </Text>
      // </TouchableOpacity>
    );
  };

  const renderAssignData = ({ item }: any) => {
    // console.log('====================================item',item);
    return (
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
            <Text style={styles.textType3}>{item?.jtuid}</Text>
            <Text style={[styles.textType1, { lineHeight: 30 }]}>
              RM {item?.price}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={require('../../Assets/Images/mapicon.png')} />
              <Text style={[styles.textType3, { color: '#003E9C' }]}>
                {item?.city}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={[
                styles.textType3,
                {
                  color: '#003E9C',
                  backgroundColor: '#298CFF33',
                  paddingVertical: 5,
                  paddingHorizontal: 30,
                  borderRadius: 30,
                },
              ]}>
              {item?.mode}
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
              <Image source={require('../../Assets/Images/subIcon.png')} />
              <Text style={styles.textType3}>Subject</Text>
            </View>
            <Text style={[styles.textType1, { fontSize: 18 }]}>
              {item?.subject_name}
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
              <Image source={require('../../Assets/Images/preftutor.png')} />
              <Text style={styles.textType3}>Pref. Tutor</Text>
            </View>
            <Text style={[styles.textType1, { fontSize: 18 }]}>
              {item?.tutorPereference}
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
              <Image source={require('../../Assets/Images/level.png')} />
              <Text style={styles.textType3}>Level</Text>
            </View>
            <Text style={[styles.textType1, { fontSize: 18 }]}>
              {item?.categoryName}
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
              <Image
                source={require('../../Assets/Images/scheduleicccon.png')}
              />
              <Text style={[styles.textType3, { color: '#298CFF' }]}>
                {item?.classDayType}
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
              <Image source={require('../../Assets/Images/timeee.png')} />
              <Text style={[styles.textType3, { color: '#298CFF' }]}>
                {item?.classTime}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      // <TouchableOpacity
      //   activeOpacity={0.8}
      //   style={{
      //     borderWidth: 1,
      //     borderRadius: 5,
      //     marginBottom: 10,
      //     padding: 10,
      //     borderColor: Theme.lightGray,
      //   }}>
      //   <View
      //     style={{
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       width: '100%',
      //     }}>
      //     <Text style={{color: 'green', fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item.jtuid}
      //     </Text>
      //     <Text style={{color: 'green', fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item.status}
      //     </Text>
      //   </View>
      //   <Text
      //     style={{
      //       color: Theme.black,
      //       fontSize: 15,
      //       fontWeight: '600',
      //       marginTop: 10,
      //       fontFamily: 'Circular Std Black'
      //     }}>
      //     {item.subject_name}
      //   </Text>
      //   <View>
      //     <Text
      //       style={{
      //         color: Theme.black,
      //         fontSize: 16,
      //         fontWeight: '600',
      //         marginTop: 10,
      //         fontFamily: 'Circular Std Black'
      //       }}>
      //       Details
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item?.classDay} at {convertTo12HourFormat(item?.classTime)} for{' '}
      //       {item?.quantity} hour(s) of each class.
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item?.studentGender} Student ({item?.studentAge}y/o)
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       {item?.subject_name} - {item?.session} sessions {item?.quantity}
      //       hour(s)
      //     </Text>
      //     <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black' }}>
      //       - Tutor Pereference: {item?.tutorPereference}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - Class Frequency: {item?.classFrequency}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - Special Request: {item?.specialRequest}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - classDay/Time: {item?.classDay}
      //     </Text>
      //     <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //       - Mode: {item?.mode}
      //     </Text>
      //     {item?.remarks && (
      //       <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //         - Remarks: {item?.remarks}
      //       </Text>
      //     )}
      //     {item?.first8Hour && (
      //       <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //         {item?.first8Hour}
      //       </Text>
      //     )}
      //     {item?.above9Hour && (
      //       <Text style={{color: Theme.gray, fontSize: 16, fontWeight: '600',fontFamily: 'Circular Std Black'}}>
      //         {item?.above9Hour}
      //       </Text>
      //     )}
      //   </View>

      //   <Text
      //     style={{
      //       color: Theme.black,
      //       fontSize: 18,
      //       fontWeight: '600',
      //       marginTop: 10,
      //       fontFamily: 'Circular Std Black'
      //     }}>
      //     RM {item?.price}/subject
      //   </Text>
      // </TouchableOpacity>
    );
  };
  const firstRoute = useCallback(() => {
    return (
      <View style={{ marginVertical: 20, marginBottom: 10 }}>
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
              marginBottom: 15,
            }}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="black"
              onChangeText={e => searchOpen(e)}
              style={{
                width: '90%',
                padding: 8,
                color: 'black',
                fontFamily: 'Circular Std Black',
              }}
            />
            <TouchableOpacity onPress={() => navigation}>
              <Image
                source={require('../../Assets/Images/search.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {openData.length > 0 ? (
          <FlatList
            data={searchText && foundName.length > 0 ? foundName : openData}
            renderItem={renderOpenData}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
          />
        ) : (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: Theme.black,
              textAlign: 'center',
              fontFamily: 'Circular Std Black',
            }}>
            No Data Found
          </Text>
        )}
      </View>
    );
  }, [openData, searchText, foundName]);

  const secondRoute = useCallback(() => {
    return (
      <View style={{ marginVertical: 20, marginBottom: 10 }}>
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
              marginBottom: 15,
            }}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="black"
              onChangeText={e => searchApplied(e)}
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
        {appliedData && appliedData.length > 0 ? (
          <FlatList
            data={searchText && foundName.length > 0 ? foundName : appliedData}
            renderItem={renderCloseData}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
          />
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: Theme.black,
                textAlign: 'center',
              }}>
              No Data Found
            </Text>
          </View>
        )}
      </View>
    );
  }, [appliedData, searchText, foundName]);

  const thirdRoute = useCallback(() => {
    return (
      <View style={{ marginVertical: 20, marginBottom: 10 }}>
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
              marginBottom: 15,
            }}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="black"
              onChangeText={e => searchApplied(e)}
              style={{
                width: '90%',
                padding: 8,
                color: 'black',
                fontFamily: 'Circular Std Black',
              }}
            />
            <TouchableOpacity onPress={() => navigation}>
              <Image
                source={require('../../Assets/Images/search.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {assignedData && assignedData.length > 0 ? (
          <FlatList
            data={searchText && foundName.length > 0 ? foundName : assignedData}
            renderItem={renderAssignData}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
          />
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: Theme.black,
                textAlign: 'center',
                fontFamily: 'Circular Std Black',
              }}>
              No Data Found
            </Text>
          </View>
        )}
      </View>
    );
  }, [assignedData, searchText, foundName]);

  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => { })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const linkToOtherPage = () => {
    if (jobTicketBanner.callToActionType == 'Open URL') {
      Linking.openURL(jobTicketBanner.urlToOpen);
    } else if (jobTicketBanner.callToActionType == 'Open Page')
      if (jobTicketBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (jobTicketBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (jobTicketBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (jobTicketBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (jobTicketBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (jobTicketBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (jobTicketBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (jobTicketBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (jobTicketBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  const closeBannerModal = async () => {
    if (jobTicketBanner.displayOnce == 'on') {
      let bannerData = { ...jobTicketBanner };

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('ticketBanner', stringData);
      setJobTicketBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={'black'} />
    </View>
  ) : (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header
        tab={currentTab}
        title="Job Ticket"
        filter
        navigation={navigation}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
          <CustomTabView
            currentTab={currentTab}
            firstRoute={firstRoute}
            secondRoute={secondRoute}
            thirdRoute={thirdRoute}
            activateTab={activateTab}
            firstRouteTitle="Open"
            secondRouteTitle="Applied"
            thirdRouteTitle="Assigned"
          />
        </View>
      </ScrollView>
      {Object.keys(jobTicketBanner).length > 0 &&
        (jobTicketBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{ flex: 1 }}>
            <Modal
              visible={openPPModal}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={linkToOtherPage}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    // padding: 15,
                    borderRadius: 5,
                    marginHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesign
                        name="closecircleo"
                        size={20}
                        color={'black'}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{ uri: jobTicketBanner.bannerImages }}
                    style={{
                      width: Dimensions.get('screen').width / 1.05,
                      height: '90%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
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
              { padding: 30, marginHorizontal: 40 },
            ]}>
            <Text
              style={{
                color: Theme.darkGray,
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Circular Std Black',
                lineHeight:30
              }}>
              You have been Verified!
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
              onPress={()=> HandelGoToDashboard()}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor:Theme.darkGray,
                }}>
                <Text
                  style={{
                    color:'white',
                    fontSize: 14,
                    fontFamily: 'Circular Std Book',
                  }}>
                  Go To Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default JobTicket;

const styles = StyleSheet.create({
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Black',
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
});
