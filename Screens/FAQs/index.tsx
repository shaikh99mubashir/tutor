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
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';
import CustomLoader from '../../Component/CustomLoader';
const FAQs = ({ navigation }: any) => {


  let bannerCont = useContext(bannerContext)

  let { faqBanner, setFaqBanner } = bannerCont
  const tutorDetailsContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutorDetailsContext


  const [faqsData, setFaqsData]: any = useState<any>([]);
  const [loading, setLoading] = useState(false)
  
  const getFaqs = () => {
    setLoading(true)
    axios
      .get(`${Base_Uri}api/faqs`)
      .then(async ({ data }) => {
        let { faqs } = data;
        faqs = faqs.map((faq:any) => ({ ...faq, open: false }));
        setFaqsData(faqs)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  }
 
  const handleQuestionPress = (index: number) => {
    setFaqsData((prevData: any) =>
      prevData.map((faq: any, i: number) => ({
        ...faq,
        open: i == index ? !faq.open : false,
      }))
    );
  };
  useEffect(() => {
    getFaqs()
  }, [])
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true)
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => {
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


  const closeBannerModal = async () => {

    if (faqBanner.displayOnce == "on") {

      let bannerData = { ...faqBanner }

      let stringData = JSON.stringify(bannerData)

      let data = await AsyncStorage.setItem("faqBanner", stringData)
      setFaqBanner([])
      setOpenPPModal(false)
    } else {
      setOpenPPModal(false)
    }
  }

  

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
                      <HTML
                        source={{ html: item?.question }}
                        ignoredDomTags={['o:p']}
                        contentWidth={300}
                        baseStyle={{
                          fontFamily: 'Circular Std Medium',
                          color: 'black',
                          fontWeight: '600',
                          fontSize: 14,
                          justifyContent:'flex-start'
                        }}
                      />
                    </View>
                    <TouchableOpacity onPress={() => handleQuestionPress(index)}>
                      {item?.open ? (
                        <Image
                          source={require('../../Assets/Images/minus.png')}
                          style={{ width: 20, height: 20 ,marginTop:10}}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={require('../../Assets/Images/plus.png')}
                          style={{ width: 20, height: 20,marginTop:10 }}
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
                         <HTML
                        source={{ html: item.answer }}
                        ignoredDomTags={['o:p']}
                        contentWidth={300}
                        baseStyle={{
                          fontFamily: 'Circular Std Medium',
                          color: 'black',
                          fontWeight: '600',
                          fontSize: 14,
                        }}/>
                    </View>
                  ) : (
                    ''
                  )}
                </>
              );
            }}
          />
           <CustomLoader visible={loading} />
        </View>
      </ScrollView>



      {Object.keys(faqBanner).length > 0 && (faqBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
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
                <View style={{ alignItems: 'flex-end', paddingVertical: 10, paddingRight: 15 }}>
                  <AntDesign
                    name="closecircleo"
                    size={20}
                    color={'black'}
                  />
                </View>
              </TouchableOpacity>
              {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
              <Image source={{ uri: faqBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.05, height: '90%', }} resizeMode='contain' />
            </View>

          </TouchableOpacity>
        </Modal>
      </View>}

    </View>
  );
};

export default FAQs;

const styles = StyleSheet.create({});
