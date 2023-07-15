import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import { Base_Uri } from '../../constant/BaseUri';

const AttendedDetails = ({ navigation, route }: any) => {

  let data = route?.params

  const clockinImage = `${Base_Uri}public/signInProof/${data?.startTimeProofImage}`
  const clockOutImage = `${Base_Uri}public/signOutProof/${data?.endTimeProofImage}`


  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Attended Detail" navigation={navigation} backBtn />
      {/* <ScrollView style={{height:'100%'}}>  */}
      <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
        {/* name */}
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Text style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
            Name :
          </Text>
          <Text
            style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
            {data?.studentName}
          </Text>
        </View>
        {/* Subject */}
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
          <Text style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
            Subject :
          </Text>
          <Text
            style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
            {data?.subjectName}
          </Text>
        </View>
        {/* Start Time End Time */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
            <Text
              style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
              Start Time :
            </Text>
            <Text
              style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
              {data?.startTime}
            </Text>
          </View>
          <Text
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 25,
            }}>
            |
          </Text>
          <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
            <Text
              style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
              End Time :
            </Text>
            <Text
              style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
              {data?.endT}
            </Text>
          </View>
        </View>
        {/* Clock IN Image */}
        <Text
          style={{
            color: Theme.gray,
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Clock In
        </Text>
        <Image
          source={{ uri: clockinImage }}
          style={{ width: '100%', height: '30%', borderWidth: 1, borderColor: "pink" }}
          resizeMode="contain"
        />
        {/* Clock Out Image */}
        <Text
          style={{
            color: Theme.gray,
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Clock Out
        </Text>
        <Image
          source={{ uri: clockOutImage }}
          style={{ width: '100%', height: '30%' }}
          resizeMode="contain"
        />
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default AttendedDetails;

const styles = StyleSheet.create({});
