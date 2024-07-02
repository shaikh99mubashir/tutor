import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Theme} from '../../constant/theme';

const ScheduleSuccessfully = ({navigation}:any) => {
  return (
    <View style={{backgroundColor: Theme.darkGray, height: '100%'}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 150,
        }}>
        <Image
          source={require('../../Assets/Images/timemanagement.png')}
          resizeMode="cover"
          style={{
            width: 350,
            height: 350,
          }}
        />
        <View style={{marginTop:20}}></View>
        <Text style={[styles.textType3,{fontSize:16}]}>
          Class schedule has been added successfully
        </Text>
      </View>
      <View
              style={{
                width: '100%',
                alignItems: 'center',
                position: 'absolute',
                bottom: 60,
              }}>
              <TouchableOpacity
               activeOpacity={0.8}
                onPress={() =>  navigation.replace("Main")}
                style={{
                  backgroundColor: Theme.white,
                  padding: 10,
                  borderRadius: 10,
                  width: '80%',
                }}>
                <Text
                  style={[styles.textType3,{color:Theme.darkGray,fontSize:16}]}>
                  Back To DashBoard
                </Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

export default ScheduleSuccessfully;

const styles = StyleSheet.create({
  textType3: {
    color: Theme.white,
    fontWeight: '500',
    fontSize: 22,
    fontFamily: 'Circular Std Medium',
    fontStyle: 'normal',
    textAlign: 'center',
  },
});
