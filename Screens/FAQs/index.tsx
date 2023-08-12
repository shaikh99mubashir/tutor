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
    Dimensions
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
  const FAQs = ({navigation}: any) => {
  
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
        .then(({data}) => {
          console.log('res', data.bannerAds);
        })
        .catch(error => {
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
    };
  
    useEffect(() => {
      displayBanner();
    }, []);

    return (
        <View style={{backgroundColor: Theme.white, height: '100%'}}>
        <Header title="FAQs" backBtn navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <View style={{paddingHorizontal: 15, marginVertical:15}}>
  
          <FlatList
            data={faqsData ?? []}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            renderItem={({item, index}: any) => {
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
                      marginBottom: item.open? 0 :15,
                    }}>
                    <View style={{width: '93%'}}>
                      <Text
                        style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                        {item.question}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleQuestionPress(index)}>
                      {item.open ? (
                        <Image
                          source={require('../../Assets/Images/minus.png')}
                          style={{width: 20, height: 20}}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={require('../../Assets/Images/plus.png')}
                          style={{width: 20, height: 20}}
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
                        marginBottom:15,
                        
                      }}>
                      <Text style={{color: 'black'}}>
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

        <View style={{flex: 1}}>
          <Modal
            visible={openPPModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setOpenPPModal(false)}>
            <View
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
                  <View style={{alignItems: 'flex-end',paddingVertical: 10, paddingRight:15}}>
                    <AntDesign
                      name="closecircleo"
                      size={20}
                      color={'black'}
                    />
                  </View>
                </TouchableOpacity>
                {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                <Image source={require('../../Assets/Images/Returnoninstallment.png')} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/>
              
              </View>

            </View>
          </Modal>
        </View>

      </View>
    );
  };
  
  export default FAQs;
  
  const styles = StyleSheet.create({});
  