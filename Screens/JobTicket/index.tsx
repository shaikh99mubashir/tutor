import React, { useState, useCallback, useEffect } from 'react';
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
} from 'react-native';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import CustomTabView from '../../Component/CustomTabView';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native"
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';

function JobTicket({ navigation }: any) {

  const focus = useIsFocused()

  const [isSearchItems, setIsSearchItems] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false)

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
    //   created_at: '2023-06-14 14:17:43',
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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {

    if (!refreshing) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        setRefresh(refresh ? false : true)

      }, 2000);
    }
  }, [refresh]);


  const getTicketsData = async () => {
    setLoading(true);

    let filter: any = await AsyncStorage.getItem("filter")

    if (filter) {

      filter = JSON.parse(filter)

      let { Category, subject, mode, state, city } = filter

      let categoryID = Category.id
      let subjectID = subject.id
      let myMode = mode.id

      axios.get(`${Base_Uri}api/searchJobTickets/${categoryID}/${subjectID}/${myMode}`).then(({ data }) => {

        let { JobTicketsResult } = data

        setOpenData(JobTicketsResult);
        setLoading(false);

      }).catch((error) => {

        setLoading(false);
        console.log(error);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);

      })

      return
    } else {

      axios
        .get('https://sifututor.odits.co/new/ticketsAPI')
        .then(async ({ data }) => {
          let { tickets } = data;



          setOpenData(
            tickets.length > 0 &&
            tickets.filter((e: any, i: number) => {
              return e.status == 'pending'
            }),
          );
          setLoading(false);
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




  useEffect(() => {
    getTicketsData();
    getAppliedData();
  }, [focus, refresh]);

  const checkSearchItems = () => {
    searchText && foundName.length == 0 && setIsSearchItems(true);
  };

  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchOpen = (e: any) => {
    setSearchText(e);
    let filteredItems: any = openData.filter((x: any) =>
      x?.subject_name.toLowerCase().includes(e.toLowerCase()) || x?.studentName?.toLowerCase().includes(e?.toLowerCase()) || x?.mode?.toLowerCase().includes(e?.toLowerCase()),

    );
    setFoundName(filteredItems);
  };
  const searchApplied = (e: any) => {

    setSearchText(e);
    let filteredItems: any = closeData.filter((x: any) =>
      x?.subjectName?.toLowerCase().includes(e.toLowerCase()) || x?.studentName?.toLowerCase().includes(e?.toLowerCase()) || x?.mode?.toLowerCase().includes(e?.toLowerCase()),
    );



    setFoundName(filteredItems);
  };

  const renderOpenData: any = ({ item }: any) => {
    return (
      <TouchableOpacity
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
          <Text style={{ color: 'green', fontSize: 14, fontWeight: '600' }}>
            {item.uid}
          </Text>
          <Text style={{ color: 'green', fontSize: 14, fontWeight: '600' }}>
            {item.status}
          </Text>
        </View>
        <Text
          style={{
            color: Theme.black,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {item.subject_name}
        </Text>
        <View>
          <Text
            style={{
              color: Theme.black,
              fontSize: 14,
              fontWeight: '600',
              marginTop: 10,
            }}>
            Details
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            Name: {item.studentName}
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            City: {item.studentCity}
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            Address 1: {item.studentAddress1 ?? "not provided"}
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            Address 2: {item.studentAddress2 ?? "not provided"}
          </Text>
        </View>
        <Text
          style={{
            color: Theme.gray,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          Day: {item.day}
        </Text>
        <Text
          style={{
            color: Theme.gray,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          Time: {item.time}
        </Text>
        <Text
          style={{
            color: Theme.gray,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          Mode: {item.mode}
        </Text>
        {/* <Text
          style={{
            color: Theme.gray,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {item.details3}
        </Text>
        <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
          {item.details4}
        </Text>
        <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
          {item.details5}
        </Text> */}
        <Text
          style={{
            color: Theme.black,
            fontSize: 18,
            fontWeight: '600',
            marginTop: 10,
          }}>
          RM {item.receiving_account}/subject
        </Text>
      </TouchableOpacity>
    );
  };
  const renderCloseData = ({ item }: any) => {

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AppliedDetails', item)}
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
          <Text style={{ color: 'green', fontSize: 14, fontWeight: '600' }}>
            {item.jtuid}
          </Text>
          <Text style={{ color: 'green', fontSize: 14, fontWeight: '600' }}>
            {item.ticketStatus}
          </Text>
        </View>
        <Text
          style={{
            color: Theme.black,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {item.subjectName}
        </Text>
        <View>
          <Text
            style={{
              color: Theme.black,
              fontSize: 14,
              fontWeight: '600',
              marginTop: 10,
            }}>
            Details
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            Name: {item.studentName}
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            ID: {item.studentID}
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            City: {item.studentCity}
          </Text>
          <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
            Address: {item.studentAddress}
          </Text>

        </View>
        <Text
          style={{
            color: Theme.gray,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 10,
          }}>
          Day: {item.classDay}
        </Text>
        <Text
          style={{
            color: Theme.gray,
            fontSize: 14,
            fontWeight: '600',
          }}>
          Time: {item.classTime}
        </Text>
        <Text
          style={{
            color: Theme.black,
            fontSize: 18,
            fontWeight: '600',
            marginTop: 10,
          }}>
          RM {item.subjectPrice}/subject
        </Text>
      </TouchableOpacity>
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

        {openData.length > 0 ? (
          <FlatList
            data={searchText && foundName.length > 0 ? foundName : openData}
            renderItem={renderOpenData}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyExtractor={(items: any, index: number): any => index}
          />
        ) : (
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: Theme.black, textAlign: "center" }}>no data found</Text>
        )}
      </View>
    );
  }, [openData, searchText, foundName]);

  console.log(appliedData, "applied")

  const secondRoute = useCallback(() => {

    console.log("hello world")

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
          <View style={{ justifyContent: "center", alignItems: "center" }} >
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: Theme.black, textAlign: "center" }}>no data found</Text>
          </View>
        )}
      </View>
    );
  }, [appliedData, searchText, foundName]);
  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={'black'} />
    </View>
  ) : (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Job Ticket" filter navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
          <CustomTabView
            currentTab={currentTab}
            firstRoute={firstRoute}
            secondRoute={secondRoute}
            activateTab={activateTab}
            firstRouteTitle="Open"
            secondRouteTitle="Applied"
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default JobTicket;
