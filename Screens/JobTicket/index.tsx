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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import bannerContext from '../../context/bannerContext';
import Status from '../Status';
import filterContext from '../../context/filterContext';
import CustomLoader from '../../Component/CustomLoader';
import BackToDashboard from '../../Component/BackToDashboard';
interface LoginAuth {
  status: Number;
  tutorID: Number;
  token: string;
}
function JobTicket({ navigation, route }: any) {
  const focus = useIsFocused();
  const filter = useContext(filterContext);
  const { setCategory, setSubjects, setState, setCity } = filter;
  let data = route.params;

  const bannerCont = useContext(bannerContext);

  let { jobTicketBanner, setJobTicketBanner } = bannerCont;
  let loginData: LoginAuth;
  const [isSearchItems, setIsSearchItems] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const tutor = useContext(TutorDetailsContext);
  const [modalVisible, setModalVisible] = useState(false);
  let { tutorDetails, updateTutorDetails, setTutorDetail } = tutor;
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
  ]);

  const activateTab = (index: any) => {
    const newTabs = currentTab.map((e: any) => ({
      ...e,
      selected: e.index === index,
    }));

    // Check if the user is switching between the first and second route
    const switchingFirstToSecond =
      currentTab[0]?.selected && newTabs[1]?.selected;
    const switchingSecondToFirst =
      newTabs[0]?.selected && currentTab[1]?.selected;

    setCurrentTab(newTabs);

    // Trigger the refresh when switching between the first and second route
    // if (switchingFirstToSecond || switchingSecondToFirst) {
    //   onRefresh();
    // }
  };

  const [openData, setOpenData] = useState<any>([]);
  const [closeData, setCloseData] = useState<any>([]);

  const [appliedData, setAppliedData] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    if (!refreshing) {
      // setRefreshing(true);
      setLoading(true);
      setTimeout(() => {
        setRefreshing(false);
        setOpenPPModal(true);
        setLoading(false);
        setRefresh(refresh ? false : true);
      }, 2000);
    }
  }, [refresh]);

  const [tutorId, setTutorId] = useState<Number | null>(null)

  const getTutorId = async () => {
    const data: any = await AsyncStorage.getItem('loginAuth');
    loginData = JSON.parse(data);

    let { tutorID } = loginData;
    setTutorId(tutorID);
  };

  const getCategory = () => {
    axios
      .get(`${Base_Uri}getCategories`)
      .then(({ data }) => {
        let { categories } = data;

        let myCategories =
          categories &&
          categories.length > 0 &&
          categories.map((e: any, i: Number) => {
            if (e.category_name) {
              return {
                subject: e.category_name,
                id: e.id,
              };
            }
          });
        setCategory(myCategories);
      })
      .catch(error => {
        console.log(error);
      });
  };

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

        setSubjects(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getStates = () => {
    axios
      .get(`${Base_Uri}getStates`)
      .then(({ data }) => {
        let { states } = data;

        let myStates =
          states &&
          states.length > 0 &&
          states.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        setState(myStates);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCities = () => {
    axios
      .get(`${Base_Uri}getCities`)
      .then(({ data }) => {
        let { cities } = data;
        let myCities =
          cities &&
          cities.length > 0 &&
          cities.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        setCity(myCities);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategory();
    getSubject();
    getStates();
    getCities();
  }, [refreshing]);
  let isVerified = false;
  const checkTutorStatus = async () => {
    // isVerified = true
    // if(isVerified){
    //   setModalVisible(true)
    // }

    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;
        let tutorDetails = tutorDetailById[0];
        if (data.tutorDetailById == null) {
          AsyncStorage.removeItem('loginAuth');
          navigation.replace('Login');
          setTutorDetail('')
          ToastAndroid.show('Terminated', ToastAndroid.SHORT);
          return;
        }
        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          displayName: tutorDetails?.displayName,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails?.phoneNumber,
          age: tutorDetails?.age,
          nric: tutorDetails?.nric,
          tutorImage: tutorDetails?.tutorImage,
          tutorId: tutorDetails?.id,
          status: tutorDetails?.status,
        };
        updateTutorDetails(details);
        if (tutorDetailById[0].status.toLowerCase() == 'verified' && tutorDetailById[0]?.open_dashboard != 'yes') {
          axios
            .get(`${Base_Uri}api/update_dashboard_status/${tutorId}`)
            .then(({ data }) => {
              setModalVisible(true)
            })
            .catch((error: any) => {
              console.log('errror========>', error);
            });
          return;
        }
      })
      .catch(error => {
        ToastAndroid.show(
          'Internal Server Error getTutorDetailByID ',
          ToastAndroid.SHORT,
        );
      });
  };

  const getTicketsData = async () => {
    // setLoading(true);
    let filter: any = await AsyncStorage.getItem('filter');
    if (filter) {
      filter = JSON.parse(filter);
      console.log(filter, 'filter');

      let { Category, subject, mode, state, city } = filter;
      let categoryID = Category.id ?? 'noFilter';
      let subjectID = subject.id ?? 'noFilter';
      let myMode = mode.subject ?? 'noFilter';
      let myState = state.id ?? 'noFilter';
      let myCity = city.id ?? 'noFilter';

      axios
        .get(`${Base_Uri}ticketsAPI/${tutorDetails?.tutorId}`)
        .then(({ data }) => {
          let { tickets } = data;
          setOpenData(
            tickets?.filter((e: any, i: number) => {
              return (
                (myMode == 'noFilter' ||
                  e?.mode?.toString()?.toLowerCase() ==
                  myMode?.toString()?.toLowerCase()) &&
                (subjectID == 'noFilter' || e?.subject_id == subjectID) &&
                (categoryID == 'noFilter' || e?.categoryID == categoryID) &&
                (myCity == 'noFilter' || e?.cityID == myCity) &&
                (myState == 'noFilter' || e?.stateID == myState)
              );
            }),
          );
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show(
            'Internal Server Error ticketsAPI1',
            ToastAndroid.SHORT,
          );
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
          setOpenData(tickets);
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show(
            'Internal Server Error ticketsAPI',
            ToastAndroid.SHORT,
          );
        });
    }
  };

  const getAppliedData = async () => {
    // setLoading(true)
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
                e?.offer_status.toString().toLowerCase() ==
                status.option.toString().toLowerCase()
              );
            });
          setAppliedData(tutorOffer);
          setLoading(false);
        })
        .catch((error) => {
          ToastAndroid.show(
            'Internal Server Error getTutorOffers filter DATA',
            ToastAndroid.SHORT,
          );
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
        ToastAndroid.show(
          'Internal Server Error getTutorOffers3',
          ToastAndroid.SHORT,
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getTutorId();
  }, [focus]);

  useEffect(() => {
    if (tutorId) {
      setLoading(true)
      checkTutorStatus();
      getTicketsData();
      getAppliedData();

      const intervalId = setInterval(() => {
        checkTutorStatus();
        getTicketsData();
        getAppliedData();
      }, 30000); // 60000 milliseconds = 1 minute

      // Clean up the interval when the component unmounts or dependencies change
      return () => clearInterval(intervalId);
    }
  }, [route, refresh, tutorId]);

  const HandelGoToDashboard = () => {
    setModalVisible(false);
    navigation.navigate('Home')
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main', // Change 'Login' to 'Main'
          screen: 'Home',
        },
      ],
    });
  };
  const checkSearchItems = () => {
    searchText && foundName.length == 0 && setIsSearchItems(true);
  };

  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchOpen = (e: any) => {
    if (e == '') {
      setFoundName([]);
      setSearchText(e);
      return;
    }
    setSearchText(e);
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

  const renderOpenData: any = ({ item }: any) => {
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
            borderBottomColor: Theme.lightGray,
            backgroundColor: Theme.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              borderColor: Theme.lightGray,
            }}>
            <View>
              <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium'}]}>{item?.jtuid}</Text>
              <Text style={[styles.textType1, { lineHeight: 30,fontFamily: 'Circular Std Medium' }]}>
                RM {item?.price}
              </Text>

            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={[
                  styles.textType3,
                  {
                    // color: '#003E9C',
                    // backgroundColor: '#298CFF33',
                    color: item.mode == 'online'? Theme.darkGray : '#1FC07D',
                    backgroundColor: item.mode == 'online'? '#298CFF33' : Theme.lightGreen,
                    fontFamily: 'Circular Std Medium',
                    paddingVertical: 5,
                    paddingHorizontal: 30,
                    borderRadius: 30,
                    textTransform: 'capitalize',
                  },
                ]}>
                {item?.mode}
              </Text>
            </View>
          </View>
          {item?.mode.toLowerCase() == 'physical' &&
          <View
            style={{
              flexDirection: 'row', gap: 5, alignItems: 'center',
            }}>
            <Feather name="map-pin" size={18} color={'#003E9C'} />
            <Text style={[styles.textType3, { color: '#003E9C',fontFamily: 'Circular Std Medium' }]}>
              {item?.city}
            </Text>
          </View>
          } 
          <View style={{ borderBottomWidth: 2,
              paddingBottom: 20, borderColor: Theme.lightGray,}}></View>
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
                  gap: 8,
                }}>
                <AntDesign name="copy1" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Subject</Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Bold' },
                ]}>
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
                {/* <Image source={require('../../Assets/Images/preftutor.png')} /> */}
                <FontAwesome name="user-o" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Pref. Tutor</Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Bold' },
                ]}>
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
                  gap: 14,
                }}>
                <FontAwesome name="level-up" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Level</Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Bold' },
                ]}>
                {item?.categoryName}
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
                  gap: 6,
                }}>
                <Ionicons name="recording-sharp" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Subscription </Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Bold' },
                ]}>
                {item?.subscription }
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
                    { color: '#298CFF', textTransform: 'capitalize',fontFamily: 'Circular Std Medium' },
                  ]}>
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
                <AntDesign name="clockcircleo" size={20} color={'#298CFF'} />
                <Text style={[styles.textType3, { color: '#298CFF',fontFamily: 'Circular Std Medium' }]}>
                  {item?.classTime}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  const renderCloseData = ({ item }: any) => {
    return (
      <>
        <Text
          style={[
            styles.textType3,
            {
              color: item.offer_status === 'pending' ? '#000000' : '#FFFFFF',
              backgroundColor: (() => {
                switch (item.offer_status) {
                  case 'pending':
                    return '#FEBC2A';
                  case 'approved':
                    return '#1FC07D';
                  case 'rejected':
                    return '#FF0000';
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
              fontFamily: 'Circular Std Medium'
            },
          ]}
        >
          {item.offer_status}
        </Text>
        <TouchableOpacity
        onPress={() => navigation.navigate('AppliedDetails', item)}
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


            }}>
            <View>
              <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium'}]}>{item?.jtuid}</Text>
              <Text
                style={[
                  styles.textType1,
                  { lineHeight: 30, },
                ]}>
                RM {item?.price}
              </Text>

            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={[
                  styles.textType3,
                  {
                    color: item.mode == 'online'? Theme.darkGray : '#1FC07D',
                    backgroundColor: item.mode == 'online'? '#298CFF33' : Theme.lightGreen,
                    fontFamily: 'Circular Std Medium',
                    paddingVertical: 5,
                    paddingHorizontal: 30,
                    borderRadius: 30,
                    textTransform: 'capitalize',
                  },
                ]}>
                {item?.mode}
              </Text>
            </View>
          </View>
          {item?.mode.toLowerCase() == 'physical' &&
          <View
            style={{
              flexDirection: 'row', gap: 10, alignItems: 'center', 
            }}>
            <Feather name="map-pin" size={18} color={'#298CFF'} />
            <Text
              style={[
                styles.textType3,
                { color: '#003E9C', textTransform: 'capitalize',fontFamily: 'Circular Std Medium' },
              ]}>
              {item?.city}
            </Text>
          </View>
           }
          <View style={{ borderBottomWidth: 2,
              paddingBottom: 20, borderColor: Theme.lightGray,}}></View>
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
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Subject</Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Bold' },
                ]}>
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
                <FontAwesome name="user-o" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Pref. Tutor</Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Medium' },
                ]}>
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
                  gap: 14,
                }}>
                <FontAwesome name="level-up" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Level</Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Medium' },
                ]}>
                {item?.categoryName}
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
                  gap: 6,
                }}>
                <Ionicons name="recording-sharp" size={18} color={'#298CFF'} />
                <Text style={[styles.textType3,{fontFamily: 'Circular Std Medium',color:Theme.ironsidegrey1}]}>Subscription </Text>
              </View>
              <Text
                style={[
                  styles.textType1,
                  { fontSize: 20, textTransform: 'capitalize',fontFamily: 'Circular Std Bold' },
                ]}>
                {item?.subscription }
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
                    { color: '#298CFF', textTransform: 'capitalize',fontFamily: 'Circular Std Medium' },
                  ]}>
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
                <AntDesign name="clockcircleo" size={20} color={'#298CFF'} />
                <Text
                  style={[
                    styles.textType3,
                    { color: '#298CFF', textTransform: 'capitalize',fontFamily: 'Circular Std Medium' },
                  ]}>
                  {item?.classTime}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
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
              paddingHorizontal: 15,
              marginBottom: 15,
              gap: 10,
            }}>
            <TouchableOpacity onPress={() => navigation}>
              <Image
                source={require('../../Assets/Images/search.png')}
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Search"
              placeholderTextColor="black"
              onChangeText={e => searchOpen(e)}
              style={{
                width: '90%',
                padding: 8,
                color: 'black',
                fontFamily: 'Circular Std Book',
                fontSize: 16,
              }}
            />
          </View>
        </View>

        {openData.length > 0 ? (
          <View>

          <FlatList
            data={searchText && foundName.length > 0 ? foundName : openData}
            renderItem={renderOpenData}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
            />
            </View>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../Assets/Images/nojobticketavailable.png')}
              style={{ width: 300, height: 300 }}
            />
          </View>
        )}
      </View>
    );
  }, [openData, searchText, foundName, refreshing]);

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
          <View>

          <FlatList
            data={searchText && foundName.length > 0 ? foundName : appliedData}
            renderItem={renderCloseData}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
            />
            </View>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: Theme.black,
                textAlign: 'center',
              }}>
              No Data Found
            </Text> */}

            <Image
              source={require('../../Assets/Images/nojobavailable.png')}
              style={{ width: 300, height: 300 }}
            />
          </View>
        )}
      </View>
    );
  }, [appliedData, searchText, foundName, refreshing]);

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

  return (
    // <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:"transparent" }}>
    //   {/* <ActivityIndicator size={'large'} color={'black'}  /> */}
    //   <Image source={require('../../Assets/Images/loader.gif')}/>
    // </View>

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
            activateTab={activateTab}
            firstRouteTitle="Latest"
            secondRouteTitle={`Applied (${appliedData.length ? appliedData.length : 0})`}
          />
        </View>
      </ScrollView>
      {Object.keys(jobTicketBanner).length > 0 &&
        (jobTicketBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status.toLowerCase() == 'verified') && (
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
      {/* <Modal visible={modalVisible} animationType="fade" transparent={true}>
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
                fontFamily: 'Circular Std Medium',
                lineHeight: 30,
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
                onPress={() => HandelGoToDashboard()}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: Theme.darkGray,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Circular Std Medium',
                  }}>
                  Go To Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <BackToDashboard
        modalVisible={modalVisible}
        handleGoToDashboard={() => HandelGoToDashboard()}
      />
      <CustomLoader visible={loading} />
      {/* <Modal visible={loading} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <Image
            source={require('../../Assets/Images/SIFU.gif')}
            style={{ width: 150, height: 150 }}
          />
        </View>
      </Modal> */}
    </View>
  );
}

export default JobTicket;

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
