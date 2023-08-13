import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  ToastAndroid,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import { Theme } from '../../constant/theme';
import CustomHeader from '../../Component/Header';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';

function Index({ navigation }: any) {


  let bannerCont = useContext(bannerContext)

  let { inboxBanner, setInboxBanner } = bannerCont

  const tutorDetailsContext = useContext(TutorDetailsContext)

  let { tutorDetails } = tutorDetailsContext


  const [inboxData, setInboxData] = useState([
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
    // {
    //   title:
    //     '28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor',
    //   messageDate: 'May,27,2023',
    //   messageTime: '8:00:20 PM',
    //   description: 'WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT',
    //   name: 'ahad',
    //   classDate: '28 May',
    //   startTime: '10:30am',
    //   endTime: '12:00pm',
    //   message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
    //   topic1: 'Tenses and active voice and passive voice',
    //   topic2: "Do's and Don't",
    //   link1: {
    //     message: 'Pauton Live',
    //     url: 'www.google.com',
    //   },
    //   link2: {
    //     message: 'App Tutorial',
    //     url: 'www.google.com',
    //   },
    //   link3: {
    //     message: 'Payment Structure',
    //     url: 'www.google.com',
    //   },
    //   link4: {
    //     message: 'FAQ',
    //     url: 'www.google.com',
    //   },
    // },
  ]);

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setOpenPPModal(true)
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);


  const getNews = () => {

    setLoading(true)

    axios
      .get(`${Base_Uri}api/news`)
      .then(({ data }) => {
        setLoading(false)
        let { news } = data;
        setInboxData(news);
      })
      .catch(error => {
        setLoading(false)
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    getNews();
  }, [refresh]);
  // console.log('inboxData',inboxData);

  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true)
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => {
        console.log('res', data.bannerAds);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const renderInboxData = ({ item, index }: any): any => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('InboxDetail', item)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: Theme.lightGray,
          width: '100%',
        }}>
        <View style={{ flexDirection: 'row', width: '70%' }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Theme.lightGray,
              borderRadius: 100,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                height: 8,
                width: 8,
                backgroundColor: Theme.lightGray,
                borderRadius: 100,
                left: 4,
                top: 0,
              }}></View>

            <Icon
              name="chatbubble-ellipses-outline"
              size={25}
              color={Theme.gray}
            />
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text
              style={{ fontSize: 16, fontWeight: '700', color: Theme.black }}
              numberOfLines={1}>
              {item?.subject}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: '500', color: Theme.black }}
              numberOfLines={1}>
              {item.status}
            </Text>
            <Text
              style={{ fontSize: 12, fontWeight: '500', color: Theme.gray }}
              numberOfLines={1}>
              {item.created_at}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <AntDesign name="right" color={Theme.gray} size={15} />
        </View>
      </TouchableOpacity>
    );
  };

  const linkToOtherPage = () => {

    if (inboxBanner.callToActionType == "Open URL") {
      Linking.openURL(inboxBanner.urlToOpen);
    }
    else if (inboxBanner.callToActionType == "Open Page")

      if (inboxBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }
      else if (inboxBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (inboxBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (inboxBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (inboxBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (inboxBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (inboxBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (inboxBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (inboxBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }

  console.log(inboxBanner, "inboxBanner")



  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size="large" color="black" />
    </View>
      :
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } style={{ flex: 1, backgroundColor: Theme.white }}>
        <View>
          <CustomHeader title="Inbox" />
        </View>

        <FlatList data={inboxData} renderItem={renderInboxData} />
        {Object.keys(inboxBanner).length > 0 && (inboxBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
          <Modal
            visible={openPPModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setOpenPPModal(false)}>
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
                <TouchableOpacity onPress={() => setOpenPPModal(false)}>
                  <View style={{ alignItems: 'flex-end', paddingVertical: 10, paddingRight: 15 }}>
                    <AntDesign
                      name="closecircleo"
                      size={20}
                      color={'black'}
                    />
                  </View>
                </TouchableOpacity>
                {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                <Image source={{ uri: inboxBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.1, height: '80%', }} resizeMode='contain' />

              </View>

            </TouchableOpacity>
          </Modal>
        </View>}
      </ScrollView>


  );
}

export default Index;
