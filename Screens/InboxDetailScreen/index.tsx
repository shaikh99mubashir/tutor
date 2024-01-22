import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import CustomHeader from '../../Component/Header';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import HTML from 'react-native-render-html';
import { Base_Uri } from '../../constant/BaseUri';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import CustomLoader from '../../Component/CustomLoader';

function InboxDetail({ navigation, route }: any) {
  let data = route.params;

  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState<any>({});

  // const handleLinkPress = (url: any) => {
  //     // Replace with your desired URL
  //     Linking.openURL(`https://${url}`);
  // };

  const getDetailedNews = () => {
    setLoading(true);
    axios
      .get(`${Base_Uri}api/detailedNews/${data?.id}`)
      .then(({ data }) => {
        let { detailedNEWS } = data;
        setNewsData(detailedNEWS);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);

        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    getDetailedNews();
  }, []);

  // console.log('data', data);
  const [loading1, setLoading1] = useState(true);
  const imageUrl = data?.headerimage; // Replace with your image URL

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false when image is loaded
  };
  // loading ? (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <ActivityIndicator size="large" color={'black'} />
  //   </View>
  // ) : 
  return (
    <View style={{ flex: 1, backgroundColor: Theme.white }}>
      
      <View>
        <CustomHeader
          backBtn
          title="Inbox Detail"
          navigation={navigation}
          containerStyle={{ height: 60 }}
        />
      </View>

      <ScrollView style={{ height: '100%', padding: 15 }}>
        {newsData.subject && (
          <Text style={{ fontSize: 18, color: Theme.black, fontWeight: '500',textTransform:'capitalize' }}>
            {newsData.subject}
          </Text>
        )}


        {data?.headerimage && (
          <Image
            source={{ uri: imageUrl }}
            style={{
              // width: '95%',
              width: Dimensions.get('screen').width / 1.1,
              // height: Dimensions.get('screen').height ,
              height: 400,
              // backgroundColor:'red',
              // marginVertical: 15,
              display: loading ? 'none' : 'flex', // Show the image when loading is false
            }}
            resizeMode="contain"
            onLoad={handleImageLoad}
          />
        )}
    
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ fontSize: 14, color: Theme.black, fontWeight: '500', fontFamily: 'Circular Std Black' }}>
            {newsData?.created_at?.slice(0, 10)}
          </Text>
          <Text style={{ fontSize: 14, color: Theme.black, fontWeight: '500', fontFamily: 'Circular Std Black' }}>
            {' '}
            -{' '}
          </Text>
          <Text style={{ fontSize: 14, color: Theme.black, fontWeight: '500', fontFamily: 'Circular Std Black' }}>
            {newsData?.created_at?.slice(11, 19)}
          </Text>
        </View>

        {newsData.preheader && (
          <Text
            style={{
              fontSize: 14,
              color: Theme.black,
              fontWeight: '500',
              marginTop: 10,
              fontFamily: 'Circular Std Black'
            }}>
            {newsData.preheader}
          </Text>
        )}

        <HTML
          source={{ html: newsData.content }}
          ignoredDomTags={['o:p']}
          contentWidth={300} // Set the content width as per your design
          baseStyle={{
            // textAlign: 'justify',
            // fontSize: 14,
            // color: Color.textColor,
            marginTop: 10,
            fontFamily: 'Circular Std Medium',
            color: 'black',
          }}
        />
         <CustomLoader visible={loading} />

      </ScrollView>
    </View>
  );
}

export default InboxDetail;
