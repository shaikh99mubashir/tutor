import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
const height = Dimensions.get('screen').height;
const Notifications = ({ navigation }: any) => {
  const [notification, setNotification] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);
  const getNotificationMessage = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);
    let { tutorID } = loginData;

    setLoading(true);

    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorID}`)
      .then(({ data }) => {
        let { tutorDetailById } = data;
        let tutorUid = tutorDetailById[0]?.uid;
        axios
          .get(`${Base_Uri}api/notifications/${tutorID}`)
          .then(async ({ data }) => {
            let { notifications } = data;
            let tutorNotification =
              notifications.length > 0 &&
              notifications.filter((e: any, i: number) => {
                return e.tutorID == tutorUid;
              });

            setLoading(false);
            setNotification(tutorNotification);
          })
          .catch(error => {
            setLoading(false);
            ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
          });
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    getNotificationMessage();
  }, [refresh]);

  const navigateToOtherScreen = (item:any) => {

    console.log(item,"items")

      if(item.notificationType == "Submit Evaluation Report" || item.notificationType == "Submit Progress Report"){
        navigation.replace("ReportSubmission",item)
      }

  }

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Notifications" backBtn navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {notification && notification.length > 0 ? (
          <FlatList
            
            data={notification}
            nestedScrollEnabled={true}
            renderItem={({ item, index }: any) => {
              return (
                <TouchableOpacity
                onPress={()=>navigateToOtherScreen(item)}
                  activeOpacity={0.8}
                  key={index}
                  style={{ paddingHorizontal: 15 }}>
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
                    <View style={{ width: '95%' }}>
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
                          {item.notificationType}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 16,
                          fontWeight: '600',
                          marginTop: 10,
                        }}>
                        {item.notificationMessage}
                      </Text>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontSize: 12,
                          fontWeight: '600',
                          marginTop: 5,
                        }}>
                        {item.notificationProgressReportMonth}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Image
                        source={require('../../Assets/Images/right.png')}
                        resizeMode="contain"
                        style={{ height: 18, width: 18 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'center',
              alignItems: 'center',
              height: height / 1.5,
            }}>
            <AntDesign name="copy1" size={20} color={Theme.gray} />
            <Text style={{ color: Theme.gray }}>There are no Notifications</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
