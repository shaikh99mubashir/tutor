import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const OpenDetails = ({ route, navigation }: any) => {
  const data = route.params;

  const [openDetailItem, setopenDetailItem] = useState({
    comment: '',
  });
  const [loading, setLoading] = useState(false)




  const sendOpenDetailData = async () => {

    let tutorData: any = await AsyncStorage.getItem("loginAuth")

    tutorData = await JSON.parse(tutorData)

    let subjectId = data?.subject_id
    let ticket_id = data?.ticket_id
    let tutor_id = tutorData?.tutorID

    setLoading(true)

    axios.get(`${Base_Uri}offerSendByTutor/${subjectId}/${tutor_id}/${ticket_id}`).then(({ data }) => {

      console.log(data.result,"result")

      if (data?.result?.status == "Applied") {
        setLoading(false)
        ToastAndroid.show("You have successfully applied for this ticket", ToastAndroid.SHORT)
        navigation.navigate("Job Ticket")
      } else {
        ToastAndroid.show("Failed to Apply for ticket", ToastAndroid.SHORT)
        setLoading(false)
      }


    }).catch((error) => {
      setLoading(false)
      ToastAndroid.show("Internal Server Error", ToastAndroid.SHORT)
    })





  };

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title={data.code} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          <Text
            style={{
              color: 'green',
              fontSize: 15,
              fontWeight: '500',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: '#eee',
            }}>
            {data?.subject_name}
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
              Student: {data.studentName}
            </Text>
            <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
              Student City: {data.studentCity}
            </Text>
            <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
              Student Address 1: {data.studentAddress1}
            </Text>
            <Text style={{ color: Theme.gray, fontSize: 14, fontWeight: '600' }}>
              Student Address 2: {data.studentAddress2}
            </Text>
          </View>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 14,
              fontWeight: '600',
              marginTop: 10,
            }}>
            Day: {data.day}
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 14,
              fontWeight: '600',
              marginTop: 10,
            }}>
            Time: {data.time}
          </Text>
          <View style={{ marginVertical: 15 }}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Estimated Commission
            </Text>
            <Text
              style={{
                color: 'green',
                fontSize: 17,
                fontWeight: '600',
                marginTop: 5,
              }}>
              RM {data.receiving_account}/subject
            </Text>
          </View>
          {/* Avaiable Subject */}
          <View style={{ marginVertical: 15 }}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Available Subjects
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 10,
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.subject_name}
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 12,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {/* {data.subject_id} */}
              </Text>
            </View>
          </View>
          {/* Comment */}
          <View style={{ marginBottom: 100 }}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Comment
            </Text>
            <View
              style={[
                styles.textAreaContainer,
                {
                  // borderWidth: 1,
                  marginTop: 5,
                  borderRadius: 10,
                  marginHorizontal: 2,
                },
              ]}>
              <TextInput
                placeholder="Enter Your Comment For The First Time, Let us Know your Teaching Experience"
                multiline={true}
                maxLength={300}
                onChangeText={e =>
                  setopenDetailItem({ ...openDetailItem, comment: e })
                }
                style={[
                  styles.textArea,
                  {
                    backgroundColor: Theme.lightGray,
                    padding: 12,
                    color: Theme.black
                  },
                ]}
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Submit Button */}
      <View
        style={{
          backgroundColor: Theme.white,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,

            marginVertical: 20,
            width: '94%',
          }}>
          <TouchableOpacity
            onPress={sendOpenDetailData}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            {loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Send
            </Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OpenDetails;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    // borderWidth: 1,
    // padding: 5,
    borderRadius: 10,
  },
  textArea: {
    borderRadius: 10,
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
