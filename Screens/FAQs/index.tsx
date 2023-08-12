import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ToastAndroid,
  Modal,
  Linking,
  Dimensions
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
const FAQs = ({ navigation }: any) => {


  let bannerCont = useContext(bannerContext)

  let { faqBanner, setFaqBanner } = bannerCont
  const tutorDetailsContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutorDetailsContext


  const [faqsData, setFaqsData] = useState([
    {
      id: 1,
      question: 'Question 1',
      answer:
        'Hey! Remember you have to attribute Ilham Fitrotul Hayat Every time you attribute, you get +10 to your Karma Select your favorite social network and share our icons with your contacts or friends. If you don’t have these social networks, simply copy the link and paste it in the one you use. For more information read the  or download the license.',
      open: false,
    },
    {
      id: 2,
      question: 'Question 2',
      answer:
        'Hey! Remember you have to attribute Ilham Fitrotul Hayat Every time you attribute, you get +10 to your Karma Select your favorite social network and share our icons with your contacts or friends. If you don’t have these social networks, simply copy the link and paste it in the one you use. For more information read the  or download the license.',
      open: false,
    },
  ]);

  const handleQuestionPress = (index: number) => {

    setFaqsData((prevData) =>
      prevData.map((faq, i) => ({
        ...faq,
        open: i == index ? !faq.open : false,
      }))
    );
  };
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


  const linkToOtherPage = () => {

    if (faqBanner.callToActionType == "Open URL") {
      Linking.openURL(faqBanner.urlToOpen);
    }
    else if (faqBanner.callToActionType == "Open Page")

      if (faqBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }
      else if (faqBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (faqBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (faqBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (faqBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (faqBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (faqBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (faqBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (faqBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }

  console.log(faqBanner,"banner")

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="FAQs" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15, marginVertical: 15 }}>

          <FlatList
            data={faqsData ?? []}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            renderItem={({ item, index }: any) => {
              return (
                <>
                  <View
                    key={index}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      flexDirection: 'row',
                      width: '100%',
                      borderRadius: 5,
                      borderColor: 'gray',
                      borderBottomWidth: item.open ? 0 : 1,
                      borderBottomLeftRadius: item.open ? 1 : 5,
                      borderBottomRightRadius: item.open ? 1 : 5,
                      marginBottom: item.open ? 0 : 15,
                    }}>
                    <View style={{ width: '93%' }}>
                      <Text
                        style={{ fontSize: 15, fontWeight: '600', color: 'black' }}>
                        {item.question}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleQuestionPress(index)}>
                      {item.open ? (
                        <Image
                          source={require('../../Assets/Images/minus.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={require('../../Assets/Images/plus.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {item.open ? (
                    <View
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        width: '100%',
                        borderRadius: 5,
                        borderColor: 'gray',
                        borderTopWidth: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        marginBottom: 15,

                      }}>
                      <Text style={{ color: 'black' }}>
                        {item.answer}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                </>
              );
            }}
          />
        </View>
      </ScrollView>

      

      {Object.keys(faqBanner).length > 0 && (faqBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
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
              <Image source={{ uri: faqBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.1, height: '80%', }} resizeMode='contain' />
            </View>

          </TouchableOpacity>
        </Modal>
      </View>}

    </View>
  );
};

export default FAQs;

const styles = StyleSheet.create({});
