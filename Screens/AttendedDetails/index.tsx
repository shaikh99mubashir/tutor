import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';

const AttendedDetails = ({navigation}: any) => {
  return (
      <View style={{backgroundColor: Theme.white, height: '100%'}}>
        <Header title="Attended Detail" navigation={navigation} backBtn />
        {/* <ScrollView style={{height:'100%'}}>  */}
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          {/* name */}
          <View style={{flexDirection: 'row', gap: 5}}>
            <Text style={{color: Theme.gray, fontSize: 15, fontWeight: 'bold'}}>
              Name :
            </Text>
            <Text
              style={{color: Theme.black, fontSize: 15, fontWeight: 'bold'}}>
              Hello World
            </Text>
          </View>
          {/* Subject */}
          <View style={{flexDirection: 'row', gap: 5, marginTop: 10}}>
            <Text style={{color: Theme.gray, fontSize: 15, fontWeight: 'bold'}}>
              Subject :
            </Text>
            <Text
              style={{color: Theme.black, fontSize: 15, fontWeight: 'bold'}}>
              Hello World
            </Text>
          </View>
          {/* Start Time End Time */}
          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={{flexDirection: 'row', gap: 5, marginTop: 10}}>
              <Text
                style={{color: Theme.gray, fontSize: 15, fontWeight: 'bold'}}>
                Start Time :
              </Text>
              <Text
                style={{color: Theme.black, fontSize: 15, fontWeight: 'bold'}}>
                19:20
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
            <View style={{flexDirection: 'row', gap: 5, marginTop: 10}}>
              <Text
                style={{color: Theme.gray, fontSize: 15, fontWeight: 'bold'}}>
                End Time :
              </Text>
              <Text
                style={{color: Theme.black, fontSize: 15, fontWeight: 'bold'}}>
                19:20
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
            source={require('../../Assets/Images/2.png')}
            style={{width: '100%', height: '30%'}}
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
            Clock In
          </Text>
          <Image
            source={require('../../Assets/Images/2.png')}
            style={{width: '100%', height: '30%'}}
            resizeMode="contain"
          />
        </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default AttendedDetails;

const styles = StyleSheet.create({});
