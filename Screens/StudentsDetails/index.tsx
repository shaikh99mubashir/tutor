import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';

const StudentsDetails = ({navigation, route}: any) => {
  const data = route.params;
  console.log('data', data);

  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Student Details" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 18,
              fontWeight: '700',
              color: Theme.darkGray,
            }}>
            Profile
          </Text>
          <View style={{borderWidth: 1, borderRadius: 5, borderColor: '#eee'}}>
            {/* Student Name */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Student Name
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.name}
              </Text>
            </View>
            {/* Student Id */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Student ID
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.code}
              </Text>
            </View>
            {/* Gender */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Gender
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.gender}
              </Text>
            </View>
            {/* Age */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Age
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.ade}
              </Text>
            </View>
            {/* Registration Date */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Redistration Date
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.date}
              </Text>
            </View>
          </View>
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 18,
              fontWeight: '700',
              color: Theme.darkGray,
              marginTop: 10,
            }}>
            Contact Person
          </Text>
          <View style={{borderWidth: 1, borderRadius: 5, borderColor: '#eee',marginBottom:100}}>
            {/*  Name */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Name
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.name}
              </Text>
            </View>
            {/* Email */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Email
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                sdfds@sakdm.com
              </Text>
            </View>
            {/* Contact */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Contact No
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                656116161
              </Text>
            </View>
            {/* Adress */}
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Address
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                sdfkdsfsdflk sdkjfksd fk sdv ks vk svk sk f kf f gkf g fg fgg kf
                gk
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
              <View
                style={{
                  backgroundColor: Theme.lightGray,
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/call.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  backgroundColor: 'lightgreen',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/whatsapp.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  backgroundColor: 'pink',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/direction.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
              </View>
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
            onPress={()=> navigation.navigate('Status')}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
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
      </View>
    </View>
  );
};

export default StudentsDetails;

const styles = StyleSheet.create({});
