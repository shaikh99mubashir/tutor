import {Image, ScrollView, StyleSheet, Text, View,FlatList,TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';

const Notifications = ({navigation}: any) => {
  const [notification, setNotification] = useState([
    {
      id:1,
      status:'Update class status'
    },
    {
      id:2,
      status:'Update class status'
    },
    {
      id:3,
      status:'Update class status'
    },
  ])
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Notifications" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
      {notification && notification.length>0 ?
      <FlatList
        data={notification}
        nestedScrollEnabled={true}
        renderItem={({item, index}: any) => {
          return (
        <TouchableOpacity activeOpacity={0.8} key={index} style={{paddingHorizontal: 15}}>
          <View
            style={{
              backgroundColor: Theme.white,
              paddingHorizontal: 10,
              paddingVertical: 12,
              borderRadius: 10,
              marginVertical: 5,
              borderWidth: 1,
              borderColor: '#eee',
              flexDirection: 'row',
            }}>
            <View style={{width: '95%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: Theme.gray,
                    fontSize: 16,
                    fontWeight: '600',
                    marginTop: 5,
                    width: '75%',
                  }}>
                  {item.status}
                </Text>
                <Text
                  style={{
                    color: Theme.darkGray,
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginTop: 0,
                    backgroundColor: 'lightyellow',
                    padding: 3,
                    width: '25%',
                    height: 30,
                    textAlign: 'center',
                    borderRadius: 10,
                    opacity: 0.6,
                  }}>
                  Pending
                </Text>
              </View>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginTop: 10,
                }}>
                Please makjfs d fsd fds fkds fsdk fkds f df sdf
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 12,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                10 may 20022
              </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={require('../../Assets/Images/right.png')}
                resizeMode="contain"
                style={{height: 18, width: 18}}
              />
            </View>
          </View>
        </TouchableOpacity>
        );
      }}
    /> : <View
    style={{
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    {/* <AntDesign name="copy1" size={20} color={Theme.gray} /> */}
    <Text style={{color: Theme.gray, }}>
      There are no Notifications
    </Text>
  </View>}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
