import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,

  ScrollView,
  Touchable,
  Linking,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import { useIsFocused } from "@react-navigation/native"
import CustomButton from '../../Component/CustomButton';
const StudentsDetails = ({ navigation, route }: any) => {
  const data = route.params;

  const [refresh, setRefresh] = useState(false)

  const focus = useIsFocused()


  React.useEffect(() => {

    setRefresh(!refresh)

  }, [focus])

  console.log("data", data);


  const makeCall = () => {

    const url = `tel:${data.studentPhone}`;
    Linking.openURL(url);
  }

  const makeWhatappCall = () => {

    const url = Platform.OS === 'ios'
      ? `whatsapp://send?phone=${data.studentWhatsapp}`
      : `whatsapp://send?text=Hello&phone=${"+601234567890"}`;

    Linking.openURL(url);
  }

  const GoToStudentDirection = () => {

    let url = '';
    // let latitude = 40.712776
    // let longitude = -74.005974

    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?ll=${data?.studentLatitude},${data?.studentLongitude}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${data?.studentLatitude},${data?.studentLongitude}`;
    }

    Linking.openURL(url);


  }

  return (
    <View style={{ backgroundColor: Theme.GhostWhite, height: '100%' }}>
      <Header title="Student Details" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{margin:10}}></View>
        <Text style={styles.textType1}>Profile</Text>
          <View style={{ backgroundColor: Theme.white,
                paddingHorizontal: 15,
                paddingVertical: 10,
                marginTop: 10,
                borderRadius: 20,}}>
            {/* Student Name */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Student Name
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                  textTransform: 'capitalize',
                }}>
                {data.studentName}
              </Text>
            </View>
            {/* Student Id */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Student ID
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                }}>
                {data.studentID}
              </Text>
            </View>
            {/* Gender */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Gender
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                  textTransform: 'capitalize',
                }}>
                {data.studentGender ? data.studentGender : "not provided"}
              </Text>
            </View>
            {/* Age */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Age
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                }}>
                {data.studentAge ? `${data.studentAge} y/o` : "not provided"}
              </Text>
            </View>
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Status
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                  textTransform: 'capitalize',
                }}>
                {data.studentStatus ? data.studentStatus : "Newly Active"}
              </Text>
            </View>
            {/* Registration Date */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Redistration Date
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                }}>
                {data.studentRegisterDate ? data.studentRegisterDate : "not provided"}
              </Text>
            </View>
          </View>
          <View style={{margin:10}}></View>
          <Text
            style={styles.textType1}>
            Contact Person
          </Text>
          <View style={{backgroundColor: Theme.white,
                paddingHorizontal: 20,
                paddingVertical: 15,
                marginTop: 10,
                borderRadius: 20,
                 marginBottom: 20 }}>
            {/*  Name */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Name
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                  textTransform: 'capitalize',
                }}>
                {data.studentName}
              </Text>
            </View>
            {/* Email */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Email
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                }}>
                {data.studentEmail ? data.studentEmail : "Not provided"}
              </Text>
            </View>
            {/* Contact */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Contact No
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  marginTop: 5,
                }}>
                {data?.studentPhone ? data.studentPhone : "not provided"}
              </Text>
            </View>
            {/* Adress */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 16,
                  fontFamily: 'Circular Std Medium'
                }}>
                Address
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 18,
                  fontFamily: 'Circular Std Medium',
                  lineHeight: 22,
                  marginTop: 5,
                  textTransform: 'capitalize',
                }}>
                {data.studentAddress1 ?? data.studentAddress2}
              </Text>
            </View>
            {/* Images */}
            <View
              style={{
                flexDirection: 'row',
                gap: 15,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => makeCall()}
                style={{
                  backgroundColor: Theme.lightGray,
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/call.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={makeWhatappCall}
                style={{
                  backgroundColor: 'lightgreen',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/whatsapp.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={GoToStudentDirection}
                style={{
                  backgroundColor: 'pink',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/direction.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <CustomButton btnTitle='Edit Status' onPress={() => navigation.navigate('Status', data)} />
          <View style={{ marginBottom: 20 }}></View>
        </View>
      </ScrollView>
      {/* Submit Button */}
      {/* <View
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
            onPress={() => navigation.navigate('Status', data)}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.Black,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Edit Status
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

export default StudentsDetails;

const styles = StyleSheet.create({
  
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Medium',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.Dune,
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
  },
});
